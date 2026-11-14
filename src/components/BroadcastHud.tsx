import React from 'react';
import { ENDING_CATALOG } from '../game/endings';
import { IDEOLOGIES_BY_ID } from '../game/ideologies';
import { ROUND_SCENARIOS } from '../game/scenarios';
import { CampaignState, ElectoralSummary, UnlockedEndingRecord } from '../game/types';

interface BroadcastHudProps {
  campaign: CampaignState;
  summary: ElectoralSummary;
  unlockedEndings: Record<string, UnlockedEndingRecord>;
  muted: boolean;
  onToggleMute: () => void;
  onOpenCodex: () => void;
  onPause: () => void;
  onRestart: () => void;
}

export const BroadcastHud: React.FC<BroadcastHudProps> = ({
  campaign,
  summary,
  unlockedEndings,
  muted,
  onToggleMute,
  onOpenCodex,
  onPause,
  onRestart,
}) => {
  const hasFaction = Object.values(campaign.ideologyScores).some((v) => v > 0);
  const ideology = IDEOLOGIES_BY_ID[campaign.ideology];
  const scenarioIdx = Math.min(campaign.round - 1, ROUND_SCENARIOS.length - 1);
  const currentScenario = ROUND_SCENARIOS[scenarioIdx];
  const demPct = (summary.demEV / 538) * 100;
  const gopPct = (summary.gopEV / 538) * 100;
  const unlockedCount = ENDING_CATALOG.filter((e) => Boolean(unlockedEndings[e.id])).length;

  return (
    <header className="w-full border-b border-slate-800 bg-[#0D1320] px-4 py-2.5">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4">
        {/* Left: Compact Game Identity, Round Counter & Dynamic Faction */}
        <div className="flex items-center gap-4 shrink-0">
          <span className="font-display text-lg font-bold tracking-wider text-white whitespace-nowrap">
            DEMOCRATIC <span className="text-blue-400">2028</span>
          </span>
          <span className="text-slate-600" aria-hidden="true">/</span>
          <div className="flex items-center gap-2 text-xs text-slate-300 whitespace-nowrap">
            <span className="font-semibold text-amber-400 font-mono-num">
              回合 {Math.min(campaign.round, 10)}/10
            </span>
            <span className="hidden sm:inline text-slate-500" aria-hidden="true">·</span>
            <span className="hidden sm:inline text-slate-300">{currentScenario.dateLabel}</span>
            <span className="hidden md:inline text-slate-500" aria-hidden="true">·</span>
            <span className="hidden md:inline text-blue-300" data-testid="hud-faction">
              {hasFaction ? `当前倾向：${ideology.nameZh}` : '当前倾向：未定型'}
            </span>
          </div>
        </div>

        {/* Center: Live 270-to-Win Electoral Tug Bar */}
        <div className="flex min-w-[260px] flex-1 max-w-md flex-col gap-1">
          <div className="flex items-center justify-between gap-2 text-xs font-mono-num">
            <span className="font-bold text-blue-400 whitespace-nowrap" data-testid="dem-ev-count">
              DEM {summary.demEV}
              {summary.evDelta !== 0 && (
                <span className={summary.evDelta > 0 ? 'ml-1 text-emerald-400' : 'ml-1 text-rose-400'}>
                  ({summary.evDelta > 0 ? `+${summary.evDelta}` : summary.evDelta})
                </span>
              )}
            </span>
            <span className="text-[11px] text-slate-400 whitespace-nowrap" data-testid="national-swing-label">
              全美均差{' '}
              <span className={summary.nationalMargin >= 0 ? 'text-blue-300 font-semibold' : 'text-red-300 font-semibold'}>
                {summary.nationalMargin >= 0 ? `D+${summary.nationalMargin.toFixed(1)}%` : `R+${Math.abs(summary.nationalMargin).toFixed(1)}%`}
              </span>
              {summary.nationalDelta !== 0 && (
                <span className={summary.nationalDelta > 0 ? 'ml-1 text-emerald-400' : 'ml-1 text-rose-400'}>
                  ({summary.nationalDelta > 0 ? `+${summary.nationalDelta.toFixed(1)}` : summary.nationalDelta.toFixed(1)})
                </span>
              )}
              <span className="hidden sm:inline text-slate-500"> · 270 线</span>
            </span>
            <span className="font-bold text-red-400 whitespace-nowrap" data-testid="gop-ev-count">
              {summary.gopEV} GOP
            </span>
          </div>
          <div className="relative h-3 w-full overflow-hidden rounded-sm bg-slate-800">
            <div
              className="absolute left-0 top-0 h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${demPct}%` }}
            />
            <div
              className="absolute right-0 top-0 h-full bg-red-600 transition-all duration-300"
              style={{ width: `${gopPct}%` }}
            />
            <div
              className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-amber-400"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Right: 4 Integer Campaign Meters, Codex Button & Square SVG Utility Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden xl:flex items-center gap-3 text-xs font-mono-num text-slate-300">
            <span>热度 <strong className="text-white">{campaign.meters.hype}</strong></span>
            <span className="text-slate-700" aria-hidden="true">·</span>
            <span>建制 <strong className="text-white">{campaign.meters.establishment}</strong></span>
            <span className="text-slate-700" aria-hidden="true">·</span>
            <span>民粹 <strong className="text-white">{campaign.meters.populism}</strong></span>
            <span className="text-slate-700" aria-hidden="true">·</span>
            <span>混乱 <strong className="text-amber-400">{campaign.meters.chaos}</strong></span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur();
              onOpenCodex();
            }}
            data-testid="hud-codex-btn"
            className="cursor-pointer h-9 rounded border border-slate-700 bg-slate-900 px-3 text-xs font-semibold text-slate-200 hover:border-amber-400 hover:text-white whitespace-nowrap shrink-0"
          >
            图鉴 <span className="font-mono-num text-amber-400">{unlockedCount}/{ENDING_CATALOG.length}</span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              tabIndex={-1}
              aria-label={muted ? '取消静音 (M)' : '静音 (M)'}
              title={muted ? '取消静音 [M]' : '静音 [M]'}
              onClick={(e) => {
                e.currentTarget.blur();
                onToggleMute();
              }}
              className="cursor-pointer flex h-9 w-9 items-center justify-center rounded border border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500 hover:text-white"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                {muted ? (
                  <path d="M22 9l-6 6M16 9l6 6" />
                ) : (
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" />
                )}
              </svg>
            </button>

            <button
              type="button"
              tabIndex={-1}
              aria-label="暂停游戏 (P)"
              title="暂停 [P / Esc]"
              onClick={(e) => {
                e.currentTarget.blur();
                onPause();
              }}
              className="cursor-pointer flex h-9 w-9 items-center justify-center rounded border border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500 hover:text-white"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            </button>

            <button
              type="button"
              tabIndex={-1}
              aria-label="重新开始 (R)"
              title="重新开始 [R]"
              onClick={(e) => {
                e.currentTarget.blur();
                onRestart();
              }}
              className="cursor-pointer flex h-9 w-9 items-center justify-center rounded border border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500 hover:text-white"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
