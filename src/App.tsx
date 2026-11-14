import { useCallback, useEffect, useMemo, useState } from 'react';
import { BroadcastHud } from './components/BroadcastHud';
import { ElectoralMap } from './components/ElectoralMap';
import { EndingCodexModal } from './components/EndingCodexModal';
import { EndingModal, PauseModal } from './components/GameModals';
import { TitleScreen } from './components/TitleScreen';
import { TwitterArena } from './components/TwitterArena';
import {
  applyChoiceTurn,
  computeElectoralSummary,
  createInitialCampaign,
  resolveCampaignEndings,
} from './game/engine';
import {
  ENDING_CATALOG,
  loadUnlockedEndings,
  saveUnlockedEndings,
} from './game/endings';
import { ROUND_SCENARIOS } from './game/scenarios';
import {
  CampaignState,
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
  const [newlyUnlockedIds, setNewlyUnlockedIds] = useState<string[]>([]);
  const [codexOpen, setCodexOpen] = useState(false);

  useEffect(() => {
    document.body.dataset.state = phase;
  }, [phase]);

  const summary = useMemo(
    () => computeElectoralSummary(campaign.margins, campaign.prevMargins),
    [campaign.margins, campaign.prevMargins]
  );

  const endingResolution = useMemo(() => {
    if (!campaign.finished) return null;
    return resolveCampaignEndings(campaign);
  }, [campaign]);

  const unlockedCount = useMemo(
    () => ENDING_CATALOG.filter((e) => Boolean(unlockedEndings[e.id])).length,
    [unlockedEndings]
  );

  const finalizeCampaign = useCallback((nextCampaign: CampaignState) => {
    const res = resolveCampaignEndings(nextCampaign);
    const finalSummary = computeElectoralSummary(nextCampaign.margins);
    const saved = saveUnlockedEndings(
      res.allTriggered.map((item) => item.id),
      finalSummary.demEV
    );
    setUnlockedEndings(saved.records);
    setNewlyUnlockedIds(saved.newlyUnlockedIds);

    if (res.primary.theme === 'victory' || res.primary.theme === 'chaos') {
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
    setNewlyUnlockedIds([]);
    setCodexOpen(false);
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
      if (phase !== 'playing' || campaign.finished || codexOpen) return;
      const nextCampaign = applyChoiceTurn(campaign, choice);
      setCampaign(nextCampaign);

      if (nextCampaign.finished) {
        finalizeCampaign(nextCampaign);
      } else if (choice.effects.nationalShift >= 1.5) {
        soundEngine.playViralHit();
      } else {
        soundEngine.playTweetSend();
      }
    },
    [phase, campaign, codexOpen, finalizeCampaign]
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
              onSelectChoice={handleSelectChoice}
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

      {phase === 'gameover' && endingResolution && !codexOpen && (
        <EndingModal
          campaign={campaign}
          ending={endingResolution.primary}
          allTriggeredEndings={endingResolution.allTriggered}
          newlyUnlockedIds={newlyUnlockedIds}
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
