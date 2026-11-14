import { useCallback, useEffect, useMemo, useState } from 'react';
import { BroadcastHud } from './components/BroadcastHud';
import { ElectoralMap } from './components/ElectoralMap';
import { EndingCodexModal } from './components/EndingCodexModal';
import { EndingModal, PauseModal } from './components/GameModals';
import { TitleScreen } from './components/TitleScreen';
import { TwitterArena } from './components/TwitterArena';
import {
  applyChoiceTurn,
  applyCustomTweetTurn,
  computeElectoralSummary,
  createInitialCampaign,
  evaluateCustomTweetLocally,
  resolveCampaignEnding,
} from './game/engine';
import {
  ENDING_CATALOG,
  loadUnlockedEndings,
  saveUnlockedEnding,
} from './game/endings';
import { ROUND_SCENARIOS } from './game/scenarios';
import {
  CampaignState,
  CustomTweetEval,
  GroundingSource,
  SpeakerId,
  StateCode,
  TweetChoice,
  UnlockedEndingRecord,
} from './game/types';
import { soundEngine } from './utils/sound';

type GamePhase = 'title' | 'playing' | 'paused' | 'gameover';

function getAutostartFlag(): boolean {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('autostart') === '1';
}

export default function App() {
  const [phase, setPhase] = useState<GamePhase>(() =>
    getAutostartFlag() ? 'playing' : 'title'
  );
  const [campaign, setCampaign] = useState<CampaignState>(() =>
    createInitialCampaign()
  );
  const [selectedState, setSelectedState] = useState<StateCode>('PA');
  const [muted, setMuted] = useState(false);

  // Ending Codex persistence
  const [unlockedEndings, setUnlockedEndings] = useState<Record<string, UnlockedEndingRecord>>(
    () => loadUnlockedEndings()
  );
  const [isNewlyUnlocked, setIsNewlyUnlocked] = useState(false);
  const [codexOpen, setCodexOpen] = useState(false);

  // Live Google Search Grounding state
  const [liveBreakingNews, setLiveBreakingNews] = useState<string | null>(null);
  const [liveGroundingSources, setLiveGroundingSources] = useState<GroundingSource[]>([]);
  const [groundingLoading, setGroundingLoading] = useState(false);
  const [groundingError, setGroundingError] = useState<string | null>(null);

  // Custom tweet evaluation state
  const [customLoading, setCustomLoading] = useState(false);
  const [customNotice, setCustomNotice] = useState<string | null>(null);

  useEffect(() => {
    document.body.dataset.state = phase;
  }, [phase]);

  const summary = useMemo(
    () => computeElectoralSummary(campaign.margins, campaign.prevMargins),
    [campaign.margins, campaign.prevMargins]
  );

  const ending = useMemo(() => {
    if (!campaign.finished) return null;
    return resolveCampaignEnding(campaign);
  }, [campaign]);

  const unlockedCount = useMemo(
    () => ENDING_CATALOG.filter((e) => Boolean(unlockedEndings[e.id])).length,
    [unlockedEndings]
  );

  const finalizeCampaign = useCallback((nextCampaign: CampaignState) => {
    const res = resolveCampaignEnding(nextCampaign);
    const finalSummary = computeElectoralSummary(nextCampaign.margins);
    const saved = saveUnlockedEnding(res.id, finalSummary.demEV);
    setUnlockedEndings(saved.records);
    setIsNewlyUnlocked(saved.isNewlyUnlocked);

    if (res.theme === 'victory' || res.theme === 'chaos') {
      soundEngine.playVictory();
    } else {
      soundEngine.playDefeat();
    }
    setPhase('gameover');
  }, []);

  const startNewCampaign = useCallback(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    soundEngine.playClick();
    setCampaign(createInitialCampaign());
    setSelectedState('PA');
    setIsNewlyUnlocked(false);
    setCodexOpen(false);
    setLiveBreakingNews(null);
    setLiveGroundingSources([]);
    setGroundingError(null);
    setCustomNotice(null);
    setPhase('playing');
  }, []);

  const handleToggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      soundEngine.setMuted(next);
      return next;
    });
  }, []);

  const handleSelectChoice = useCallback(
    (choice: TweetChoice) => {
      if (phase !== 'playing' || campaign.finished || customLoading || codexOpen) return;
      const nextCampaign = applyChoiceTurn(campaign, choice);
      setCampaign(nextCampaign);
      setLiveBreakingNews(null);
      setLiveGroundingSources([]);
      setGroundingError(null);
      setCustomNotice(null);

      if (nextCampaign.finished) {
        finalizeCampaign(nextCampaign);
      } else if (choice.effects.nationalShift >= 1.5) {
        soundEngine.playViralHit();
      } else {
        soundEngine.playTweetSend();
      }
    },
    [phase, campaign, customLoading, codexOpen, finalizeCampaign]
  );

  const handleFetchGrounding = useCallback(async () => {
    if (groundingLoading || campaign.finished) return;
    setGroundingLoading(true);
    setGroundingError(null);
    soundEngine.playBreakingNews();

    const scenario = ROUND_SCENARIOS[Math.min(campaign.round - 1, ROUND_SCENARIOS.length - 1)];

    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 8000);

    try {
      const resp = await fetch('/api/grounding-tweet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          round: campaign.round,
          topic: scenario.topic,
          dateLabel: scenario.dateLabel,
        }),
      });
      const data = (await resp.json()) as {
        error?: string;
        realEventSummary?: string;
        breakingNews?: string;
        speaker?: SpeakerId;
        tweet?: string;
        groundingSources?: GroundingSource[];
      };

      if (!resp.ok || data.error) {
        setGroundingError(data.error ?? '未能连接 Google Search 实时情报。');
        return;
      }

      if (data.breakingNews) {
        setLiveBreakingNews(data.breakingNews);
      }
      setLiveGroundingSources(data.groundingSources ?? []);

      if (data.tweet) {
        const speaker = data.speaker ?? 'trump';
        const speakerMeta = {
          trump: { name: 'Donald J. Trump', handle: '@realDonaldTrump' },
          vance: { name: 'JD Vance', handle: '@JDVance' },
          rubio: { name: 'Marco Rubio', handle: '@marcorubio' },
        }[speaker];

        setCampaign((prev) => ({
          ...prev,
          groundingUsed: prev.groundingUsed + 1,
          feed: [
            {
              id: `grounding-r${prev.round}-${Date.now()}`,
              round: prev.round,
              speakerName: speakerMeta.name,
              handle: speakerMeta.handle,
              avatar: speaker,
              isPlayer: false,
              text: data.tweet!,
              likes: '57.3万',
              reposts: '18.9万',
              metaTag: '现实热搜实时连线',
              groundingSources: data.groundingSources,
            },
            ...prev.feed,
          ],
        }));
      }
    } catch (err) {
      const msg =
        err instanceof Error && err.name === 'AbortError'
          ? '实时检索超时，可继续直接进行当前回合对战。'
          : err instanceof Error
            ? err.message
            : '网络请求异常';
      setGroundingError(msg);
    } finally {
      window.clearTimeout(timer);
      setGroundingLoading(false);
    }
  }, [groundingLoading, campaign.finished, campaign.round]);

  const handleSubmitCustomTweet = useCallback(
    async (text: string) => {
      if (phase !== 'playing' || campaign.finished || customLoading || codexOpen) return;
      setCustomLoading(true);
      setCustomNotice(null);

      const scenario = ROUND_SCENARIOS[Math.min(campaign.round - 1, ROUND_SCENARIOS.length - 1)];
      let evalResult: CustomTweetEval | null = null;

      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), 7000);

      try {
        const resp = await fetch('/api/judge-tweet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            playerTweet: text,
            ideology: campaign.ideology,
            round: campaign.round,
            opponentTweet: scenario.opponentTweet,
            topic: scenario.topic,
          }),
        });
        const data = (await resp.json()) as CustomTweetEval & { error?: string };
        if (resp.ok && !data.error && typeof data.nationalShift === 'number') {
          evalResult = data;
        } else {
          setCustomNotice(data.error ?? '使用本地暴论裁判引擎完成结算。');
        }
      } catch {
        setCustomNotice('AI 服务繁忙，已使用本地暴论裁判引擎完成即时结算。');
      } finally {
        window.clearTimeout(timer);
      }

      if (!evalResult) {
        evalResult = evaluateCustomTweetLocally(text, campaign.ideology);
      }

      const nextCampaign = applyCustomTweetTurn(campaign, text, evalResult);
      setCampaign(nextCampaign);
      setLiveBreakingNews(null);
      setLiveGroundingSources([]);
      setCustomLoading(false);

      if (nextCampaign.finished) {
        finalizeCampaign(nextCampaign);
      } else if (evalResult.nationalShift >= 1.2) {
        soundEngine.playViralHit();
      } else {
        soundEngine.playTweetSend();
      }
    },
    [phase, campaign, customLoading, codexOpen, finalizeCampaign]
  );

  // Global keyboard shortcuts matching Game Shell contract
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (codexOpen) {
        if (e.key === 'Escape') {
          e.preventDefault();
          setCodexOpen(false);
        }
        return;
      }

      const target = e.target as HTMLElement | null;
      const isTyping =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable;

      if (phase === 'title') {
        if ((e.key === 'Enter' || e.key === ' ') && !isTyping) {
          if (target?.tagName !== 'BUTTON') {
            e.preventDefault();
            startNewCampaign();
          }
        }
        return;
      }

      if (isTyping) {
        if (e.key === 'Escape') {
          target?.blur();
        }
        return;
      }

      if (e.key === 'Escape' || e.key.toLowerCase() === 'p') {
        if (phase === 'playing') {
          e.preventDefault();
          setPhase('paused');
        } else if (phase === 'paused') {
          e.preventDefault();
          setPhase('playing');
        }
        return;
      }

      if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        handleToggleMute();
        return;
      }

      if (e.key.toLowerCase() === 'r' && (phase === 'playing' || phase === 'paused')) {
        e.preventDefault();
        startNewCampaign();
        return;
      }

      if (phase === 'playing' && !campaign.finished && ['1', '2', '3', '4'].includes(e.key)) {
        const idx = Number(e.key) - 1;
        const scenario = ROUND_SCENARIOS[Math.min(campaign.round - 1, ROUND_SCENARIOS.length - 1)];
        const choice = scenario.choices[idx];
        if (choice) {
          e.preventDefault();
          handleSelectChoice(choice);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    codexOpen,
    phase,
    campaign.round,
    campaign.finished,
    startNewCampaign,
    handleToggleMute,
    handleSelectChoice,
  ]);

  if (phase === 'title') {
    return (
      <>
        <TitleScreen
          unlockedEndings={unlockedEndings}
          onStart={startNewCampaign}
          onOpenCodex={() => {
            soundEngine.playClick();
            setCodexOpen(true);
          }}
        />
        {codexOpen && (
          <EndingCodexModal
            unlockedEndings={unlockedEndings}
            onClose={() => setCodexOpen(false)}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0B0F17] text-slate-100 flex flex-col">
      <BroadcastHud
        campaign={campaign}
        summary={summary}
        unlockedEndings={unlockedEndings}
        muted={muted}
        onToggleMute={handleToggleMute}
        onOpenCodex={() => {
          soundEngine.playClick();
          setCodexOpen(true);
        }}
        onPause={() => setPhase('paused')}
        onRestart={startNewCampaign}
      />

      <main className="mx-auto w-full max-w-[1440px] flex-1 p-3 sm:p-4 lg:p-5">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-start">
          {/* Left 7 Columns: Real-time 50-State + DC Electoral Map & Swing Inspector */}
          <div className="lg:col-span-7">
            <ElectoralMap
              margins={campaign.margins}
              prevMargins={campaign.prevMargins}
              selectedState={selectedState}
              onSelectState={(code) => {
                soundEngine.playClick();
                setSelectedState(code);
              }}
              summary={summary}
            />
          </div>

          {/* Right 5 Columns: Live Twitter/X Debate Arena */}
          <div className="lg:col-span-5">
            <TwitterArena
              campaign={campaign}
              liveBreakingNews={liveBreakingNews}
              liveGroundingSources={liveGroundingSources}
              groundingLoading={groundingLoading}
              groundingError={groundingError}
              customLoading={customLoading}
              customNotice={customNotice}
              onFetchGrounding={handleFetchGrounding}
              onSelectChoice={handleSelectChoice}
              onSubmitCustomTweet={handleSubmitCustomTweet}
            />
          </div>
        </div>
      </main>

      {phase === 'paused' && !codexOpen && (
        <PauseModal
          onResume={() => setPhase('playing')}
          onRestart={startNewCampaign}
          onBackToTitle={() => {
            setPhase('title');
          }}
        />
      )}

      {phase === 'gameover' && ending && !codexOpen && (
        <EndingModal
          campaign={campaign}
          ending={ending}
          isNewlyUnlocked={isNewlyUnlocked}
          unlockedCount={unlockedCount}
          onPlayAgain={startNewCampaign}
          onOpenCodex={() => {
            soundEngine.playClick();
            setCodexOpen(true);
          }}
          onBackToTitle={() => {
            setPhase('title');
          }}
        />
      )}

      {codexOpen && (
        <EndingCodexModal
          unlockedEndings={unlockedEndings}
          onClose={() => setCodexOpen(false)}
        />
      )}
    </div>
  );
}
