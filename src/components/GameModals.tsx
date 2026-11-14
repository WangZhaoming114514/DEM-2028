import React from 'react';
import { computeElectoralSummary } from '../game/engine';
import { ENDING_CATALOG } from '../game/endings';
import { IDEOLOGIES_BY_ID } from '../game/ideologies';
import { CampaignState, EndingResult } from '../game/types';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onBackToTitle: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onBackToTitle,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="游戏已暂停"
    >
      <div className="w-full max-w-md rounded-lg border border-slate-700 bg-[#111827] p-6 space-y-5">
        <div className="space-y-1 border-b border-slate-800 pb-3">
          <h2 className="font-display text-2xl font-bold text-white">竞选暂停</h2>
          <p className="text-xs text-slate-400">先喝口水喘口气——马可·卢比奥正在隔壁狂拧瓶盖。</p>
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onResume}
            className="cursor-pointer rounded bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-500"
          >
            继续选战 (Esc / P)
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="cursor-pointer rounded border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:border-slate-500"
          >
            重开本局选战
          </button>
          <button
            type="button"
            onClick={onBackToTitle}
            className="cursor-pointer rounded border border-slate-800 bg-[#0B0F17] px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white"
          >
            返回主标题
          </button>
        </div>
      </div>
    </div>
  );
};

interface EndingModalProps {
  campaign: CampaignState;
  ending: EndingResult;
  isNewlyUnlocked: boolean;
  unlockedCount: number;
  onPlayAgain: () => void;
  onOpenCodex: () => void;
  onBackToTitle: () => void;
}

export const EndingModal: React.FC<EndingModalProps> = ({
  campaign,
  ending,
  isNewlyUnlocked,
  unlockedCount,
  onPlayAgain,
  onOpenCodex,
  onBackToTitle,
}) => {
  const summary = computeElectoralSummary(campaign.margins);
  const finalIdeology = IDEOLOGIES_BY_ID[campaign.ideology];

  const headerAccent =
    ending.theme === 'victory'
      ? 'text-blue-400'
      : ending.theme === 'chaos'
        ? 'text-amber-400'
        : ending.theme === 'cursed'
          ? 'text-rose-400'
          : 'text-red-400';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="2028大选终局裁决"
      data-testid="ending-modal"
    >
      <div className="w-full max-w-2xl rounded-lg border border-slate-700 bg-[#0F1624] p-6 sm:p-8 space-y-6 my-auto">
        <div className="space-y-2 border-b border-slate-800 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-num">
            <span className={`font-bold tracking-wider ${headerAccent}`}>
              {ending.badgeLabel}
              {isNewlyUnlocked ? ' · 首次解锁新结局' : ''}
            </span>
            <span className="text-slate-400">
              最终塑形派系：{finalIdeology.nameZh} ({finalIdeology.nameEn})
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold leading-tight text-white">
            {ending.title}
          </h2>
          <p className="text-sm font-semibold text-slate-300">{ending.subtitle}</p>
        </div>

        {/* Electoral & Key States Metrics */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded border border-slate-800 bg-[#0B101B] p-3">
            <div className="text-xs text-slate-400">民主党选举人票</div>
            <div className="mt-1 font-mono-num text-2xl font-bold text-blue-400">{summary.demEV}</div>
          </div>
          <div className="rounded border border-slate-800 bg-[#0B101B] p-3">
            <div className="text-xs text-slate-400">川普–万斯选举人票</div>
            <div className="mt-1 font-mono-num text-2xl font-bold text-red-400">{summary.gopEV}</div>
          </div>
          <div className="rounded border border-slate-800 bg-[#0B101B] p-3">
            <div className="text-xs text-slate-400">最终推特混乱度</div>
            <div className="mt-1 font-mono-num text-2xl font-bold text-amber-400">{campaign.meters.chaos}</div>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-slate-200">{ending.epilogue}</p>

        {/* Key Battleground Snapshots */}
        <div className="border-t border-slate-800 pt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono-num text-slate-400">
          {(['PA', 'MI', 'WI', 'GA', 'TX', 'LA', 'MN', 'NY'] as const).map((code) => {
            const m = campaign.margins[code];
            return (
              <span key={code}>
                {code}:{' '}
                <strong className={m >= 0 ? 'text-blue-400' : 'text-red-400'}>
                  {m >= 0 ? `D+${m.toFixed(1)}` : `R+${Math.abs(m).toFixed(1)}`}
                </strong>
              </span>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            data-start="true"
            onClick={onPlayAgain}
            className="cursor-pointer rounded bg-blue-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-500"
          >
            再来一局
          </button>
          <button
            type="button"
            onClick={onOpenCodex}
            data-testid="ending-codex-btn"
            className="cursor-pointer rounded border border-slate-700 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-amber-300 hover:border-amber-400 hover:text-white"
          >
            查看结局图鉴 (<span className="font-mono-num">{unlockedCount}/{ENDING_CATALOG.length}</span>)
          </button>
          <button
            type="button"
            onClick={onBackToTitle}
            className="cursor-pointer rounded border border-slate-800 bg-[#0B0F17] px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white"
          >
            返回主标题
          </button>
        </div>
      </div>
    </div>
  );
};
