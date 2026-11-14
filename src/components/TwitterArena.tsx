import React, { useState } from 'react';
import { IDEOLOGIES_BY_ID } from '../game/ideologies';
import { ROUND_SCENARIOS } from '../game/scenarios';
import { CampaignState, FeedItem, SpeakerId, TweetChoice } from '../game/types';

interface TwitterArenaProps {
  campaign: CampaignState;
  onSelectChoice: (choice: TweetChoice) => void;
  onSubmitCustomTweet: (text: string) => void;
}

const AVATAR_MAP: Record<SpeakerId, { src: string; alt: string }> = {
  trump: {
    src: '/src/assets/images/portrait_trump_1794685052595.jpg',
    alt: 'Donald Trump 头像',
  },
  vance: {
    src: '/src/assets/images/portrait_vance_1794685052521.jpg',
    alt: 'JD Vance 头像',
  },
  rubio: {
    src: '/src/assets/images/portrait_rubio_1794685053917.jpg',
    alt: 'Marco Rubio 头像',
  },
};

const AvatarBadge: React.FC<{ avatar: FeedItem['avatar'] }> = ({ avatar }) => {
  if (avatar === 'player') {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white border border-blue-400/50">
        DEM
      </div>
    );
  }
  const meta = AVATAR_MAP[avatar];
  return (
    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-slate-700 bg-slate-800">
      <img
        src={meta.src}
        alt={meta.alt}
        referrerPolicy="no-referrer"
        className="h-full w-full object-cover"
      />
    </div>
  );
};

export const TwitterArena: React.FC<TwitterArenaProps> = ({
  campaign,
  onSelectChoice,
  onSubmitCustomTweet,
}) => {
  const [customInput, setCustomInput] = useState('');
  const scenario = ROUND_SCENARIOS[Math.min(campaign.round - 1, ROUND_SCENARIOS.length - 1)];
  const ideology = IDEOLOGIES_BY_ID[campaign.ideology];

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customInput.trim();
    if (!trimmed || campaign.finished) return;
    onSubmitCustomTweet(trimmed);
    setCustomInput('');
  };

  return (
    <aside className="flex h-full flex-col gap-2.5">
      {/* Round Topic & Breaking News Banner */}
      <div className="rounded-lg border border-slate-800 bg-[#111827] p-3 space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold tracking-wide text-amber-400">
            第 {Math.min(campaign.round, 10)} 回合议题 · {scenario.topic}
          </span>
          <span className="font-mono-num text-[11px] text-slate-400 shrink-0">
            {scenario.dateLabel}
          </span>
        </div>

        <p className="text-xs leading-relaxed text-slate-300">
          {scenario.breakingNews}
        </p>
      </div>

      {/* Live X / Twitter Timeline Feed (Current Opponent Attack at Top) */}
      <div className="rounded-lg border border-slate-800 bg-[#111827] p-3 flex flex-col max-h-[235px]">
        <div className="mb-2 flex items-center justify-between border-b border-slate-800 pb-1.5 text-xs">
          <span className="font-bold text-white">X / 推特实时交锋</span>
          <span className="font-mono-num text-slate-400">{campaign.feed.length} 条动态</span>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto pr-1" data-testid="twitter-feed">
          {campaign.feed.map((item) => (
            <article
              key={item.id}
              className={`rounded-md border p-2.5 text-xs ${
                item.isPlayer
                  ? 'border-blue-800/70 bg-blue-950/25'
                  : 'border-slate-800 bg-[#0D1320]'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <AvatarBadge avatar={item.avatar} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white">{item.speakerName}</span>
                      <span className="font-mono-num text-[11px] text-slate-400">{item.handle}</span>
                    </div>
                    {item.metaTag && (
                      <span className="text-[11px] text-slate-400">{item.metaTag}</span>
                    )}
                  </div>
                  <p className="mt-1 leading-relaxed text-slate-200">{item.text}</p>
                  <div className="mt-1.5 flex items-center gap-4 text-[11px] font-mono-num text-slate-400">
                    <span>转发 {item.reposts}</span>
                    <span>点赞 {item.likes}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Response Choices */}
      <div className="rounded-lg border border-slate-800 bg-[#111827] p-3 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-white">选择你的推特反击（快捷键 1–4）</span>
          <span>
            {Object.values(campaign.ideologyScores).some((v) => v > 0)
              ? `当前塑形：${ideology.nameZh}`
              : '推文选择将塑形你的派系'}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-1.5">
          {scenario.choices.map((choice, idx) => {
            const hasFaction = Object.values(campaign.ideologyScores).some((v) => v > 0);
            const isAligned = hasFaction && choice.primaryIdeology === campaign.ideology;
            const choiceFaction = IDEOLOGIES_BY_ID[choice.primaryIdeology];
            return (
              <button
                key={choice.id}
                type="button"
                disabled={campaign.finished}
                onClick={() => onSelectChoice(choice)}
                className="cursor-pointer group rounded-md border border-slate-800 bg-[#0D1320] p-2.5 text-left transition-all duration-150 hover:border-blue-500 hover:bg-[#131C2E] disabled:opacity-50"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-xs font-bold text-white group-hover:text-blue-300">
                    [{idx + 1}] {choice.label}
                  </span>
                  <span className="text-[11px] text-slate-400 shrink-0">
                    <strong className={isAligned ? 'text-blue-400' : 'text-slate-300'}>
                      {choiceFaction.nameZh}
                    </strong>
                    {isAligned ? '连击 · ' : ' · '}
                    {choice.strategyHint}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-snug text-slate-300">
                  “{choice.tweetText}”
                </p>
              </button>
            );
          })}
        </div>

        {/* Custom Free-Text Tweet Box */}
        <form onSubmit={handleCustomSubmit} className="border-t border-slate-800 pt-2 space-y-1.5">
          <label htmlFor="custom-tweet-input" className="block text-xs font-semibold text-slate-300">
            手写暴论（本地词库即时判定全国与各州波动）
          </label>
          <div className="flex gap-2">
            <input
              id="custom-tweet-input"
              type="text"
              maxLength={220}
              value={customInput}
              disabled={campaign.finished}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="例如：民主党万岁！纽约洋基万岁！波士顿红袜万岁！"
              className="flex-1 rounded border border-slate-700 bg-[#0A0F1A] px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!customInput.trim() || campaign.finished}
              className="cursor-pointer rounded bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-500 disabled:opacity-40 whitespace-nowrap shrink-0"
            >
              发送暴论
            </button>
          </div>
        </form>
      </div>
    </aside>
  );
};
