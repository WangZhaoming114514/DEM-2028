import React, { useRef, useState } from 'react';
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
            className="cursor-pointer rounded bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-500 transition-colors duration-150"
          >
            继续选战 (Esc / P)
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="cursor-pointer rounded border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:border-slate-500 transition-colors duration-150"
          >
            重开本局选战
          </button>
          <button
            type="button"
            onClick={onBackToTitle}
            className="cursor-pointer rounded border border-slate-800 bg-[#0B0F17] px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white transition-colors duration-150"
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
  allTriggeredEndings: EndingResult[];
  newlyUnlockedIds: string[];
  unlockedCount: number;
  onPlayAgain: () => void;
  onOpenCodex: () => void;
  onBackToTitle: () => void;
}

const RETURNS_BOX_STATES = [
  'PA',
  'MI',
  'WI',
  'GA',
  'TX',
  'IL',
  'NY',
  'MA',
  'OK',
  'LA',
  'AL',
  'MN',
] as const;

export const EndingModal: React.FC<EndingModalProps> = ({
  campaign,
  ending,
  allTriggeredEndings,
  newlyUnlockedIds,
  unlockedCount,
  onPlayAgain,
  onOpenCodex,
  onBackToTitle,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const dragOriginRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const endingsList = allTriggeredEndings.length > 0 ? allTriggeredEndings : [ending];
  const activeEnding = endingsList[activeIndex] ?? ending;
  const isNewlyUnlocked = newlyUnlockedIds.includes(activeEnding.id);
  const summary = computeElectoralSummary(campaign.margins);
  const finalIdeology = IDEOLOGIES_BY_ID[campaign.ideology];
  const paper = activeEnding.newspaper;

  const kickerColor =
    activeEnding.theme === 'victory'
      ? 'text-blue-800'
      : activeEnding.theme === 'chaos'
        ? 'text-amber-800'
        : activeEnding.theme === 'cursed'
          ? 'text-rose-800'
          : 'text-red-800';

  const mastheadClass =
    paper.mastheadFont === 'blackletter'
      ? 'font-masthead-blackletter text-3xl sm:text-5xl tracking-normal'
      : paper.mastheadFont === 'serif'
        ? 'font-masthead-serif font-black text-3xl sm:text-[42px] tracking-tight'
        : 'font-display font-black uppercase text-4xl sm:text-5xl tracking-tight';

  const clampOffset = (x: number, y: number) => {
    if (typeof window === 'undefined') return { x, y };
    const maxX = Math.max(120, Math.round(window.innerWidth * 0.44));
    const maxY = Math.max(90, Math.round(window.innerHeight * 0.4));
    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragOriginRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: offset.x,
      originY: offset.y,
    };
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragOriginRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    setOffset(clampOffset(drag.originX + dx, drag.originY + dy));
  };

  const handlePointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragOriginRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    dragOriginRef.current = null;
    setIsDragging(false);
  };

  const hasMoved = offset.x !== 0 || offset.y !== 0;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-3 sm:p-5">
      <div
        role="dialog"
        aria-modal="false"
        aria-label="2028大选终局裁决"
        data-testid="ending-modal"
        style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }}
        className={`pointer-events-auto flex flex-col w-full ${
          collapsed ? 'max-w-lg' : 'max-w-2xl'
        } max-h-[88vh] border-2 border-stone-900 bg-[#F5F1E6] text-[#171614] shadow-[0_24px_64px_rgba(0,0,0,0.72)]`}
      >
        {/* Top Press Drag Bar */}
        <div
          data-testid="ending-drag-handle"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          className={`flex items-center justify-between gap-2 border-b border-stone-900 bg-[#171614] px-3.5 py-2 text-[11px] text-[#F5F1E6] select-none touch-none ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-mono-num tracking-widest text-stone-400" aria-hidden="true">
              ⋮⋮
            </span>
            <span className="truncate font-medium">
              按住拖动号外报纸 · 可随时查看/点击背后各州选情地图
            </span>
          </div>

          <div
            className="flex items-center gap-1.5 shrink-0"
            onPointerDown={(e) => e.stopPropagation()}
          >
            {hasMoved && (
              <button
                type="button"
                data-testid="ending-reset-pos-btn"
                onClick={() => setOffset({ x: 0, y: 0 })}
                className="cursor-pointer border border-stone-600 bg-stone-800 px-2 py-0.5 text-[11px] font-semibold text-stone-200 hover:bg-stone-700 hover:text-white transition-colors duration-150"
              >
                复位
              </button>
            )}
            <button
              type="button"
              data-testid="ending-collapse-btn"
              onClick={() => setCollapsed((prev) => !prev)}
              className="cursor-pointer border border-stone-600 bg-stone-800 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300 hover:bg-stone-700 hover:text-white transition-colors duration-150"
            >
              {collapsed ? '展开报纸' : '收起看地图'}
            </button>
          </div>
        </div>

        {/* Collapsed Banner Summary */}
        {collapsed ? (
          <div className="px-4 py-3 space-y-2.5 bg-[#F5F1E6]">
            <div className="flex items-baseline justify-between gap-3 border-b border-stone-300 pb-2">
              <span className={`${mastheadClass} !text-2xl leading-none text-[#171614]`}>
                {paper.name}
              </span>
              <span className="font-mono-num text-xs font-bold text-stone-700">
                DEM <span className="text-blue-800">{summary.demEV}</span> :{' '}
                <span className="text-red-800">{summary.gopEV}</span> GOP
              </span>
            </div>
            <div className="font-masthead-serif text-base font-extrabold leading-snug text-[#171614]">
              {activeEnding.title}
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <button
                type="button"
                data-start="true"
                onClick={onPlayAgain}
                className="cursor-pointer bg-[#171614] px-3.5 py-1.5 text-xs font-bold text-[#F5F1E6] hover:bg-blue-800 transition-colors duration-150"
              >
                再来一局
              </button>
              <button
                type="button"
                onClick={onOpenCodex}
                data-testid="ending-codex-btn"
                className="cursor-pointer border border-stone-800 bg-[#EAE2CF] px-3 py-1.5 text-xs font-bold text-[#171614] hover:bg-stone-300 transition-colors duration-150"
              >
                结局图鉴 ({unlockedCount}/{ENDING_CATALOG.length})
              </button>
            </div>
          </div>
        ) : (
          /* Full Scrollable Newspaper Broadsheet */
          <div className="overflow-y-auto px-5 py-4 sm:px-7 sm:py-5 space-y-4">
            {/* Multi-Ending Switcher */}
            {endingsList.length > 1 && (
              <div className="border border-stone-800 bg-[#EAE2CF] p-2.5 space-y-1.5">
                <div className="text-[11px] font-bold tracking-wide text-stone-800">
                  今日同时加印 {endingsList.length} 份特别号外（切换报纸版面，全部已解锁）：
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {endingsList.map((item, idx) => {
                    const selected = idx === activeIndex;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setActiveIndex(idx)}
                        className={`cursor-pointer px-2.5 py-1 text-[11px] font-bold transition-colors duration-150 ${
                          selected
                            ? 'bg-[#171614] text-[#F5F1E6]'
                            : 'border border-stone-500 bg-[#F5F1E6] text-stone-800 hover:bg-stone-200'
                        }`}
                      >
                        {idx + 1}. {item.newspaper.name} · {item.badgeLabel}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Newspaper Masthead */}
            <header className="text-center space-y-1.5">
              <div className="text-[10px] font-mono-num uppercase tracking-[0.2em] text-stone-600">
                “{paper.motto}”
              </div>
              <div
                data-testid="ending-newspaper-masthead"
                className={`${mastheadClass} leading-none text-[#171614] py-0.5`}
              >
                {paper.name}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-y-2 border-stone-900 py-1 px-1 text-[10px] font-mono-num font-semibold uppercase tracking-wider text-stone-800">
                <span>VOL. CLXXVIII · NO. 2028</span>
                <span>{paper.location} · NOV. 8, 2028</span>
                <span className="font-bold">{paper.editionTag}</span>
                <span>PRICE $3.00</span>
              </div>
            </header>

            {/* Frontpage Lead Headline */}
            <section className="space-y-2 border-b border-stone-400 pb-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-num">
                <span className={`font-extrabold tracking-wider uppercase ${kickerColor}`}>
                  {activeEnding.badgeLabel}
                  {isNewlyUnlocked ? ' ★ 首次解锁' : ''}
                </span>
                <span className="text-stone-700 font-medium">
                  最终主导派系：{finalIdeology.nameZh} ({finalIdeology.nameEn})
                </span>
              </div>

              <h2
                style={{ textWrap: 'balance' }}
                className="font-masthead-serif text-2xl sm:text-[32px] font-black leading-[1.12] tracking-tight text-[#171614]"
              >
                {activeEnding.title}
              </h2>

              <p className="text-sm font-bold leading-snug text-stone-800">
                {activeEnding.subtitle}
              </p>
            </section>

            {/* Electoral Scoreboard Strip */}
            <div className="grid grid-cols-3 border border-stone-900 bg-[#EFE9DA] divide-x divide-stone-900 text-center">
              <div className="p-2.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-stone-700">
                  民主党选举人票
                </div>
                <div className="mt-0.5 font-mono-num text-2xl font-extrabold text-blue-800">
                  {summary.demEV}
                </div>
              </div>
              <div className="p-2.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-stone-700">
                  川普–万斯阵营
                </div>
                <div className="mt-0.5 font-mono-num text-2xl font-extrabold text-red-800">
                  {summary.gopEV}
                </div>
              </div>
              <div className="p-2.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-stone-700">
                  推特舆论混乱度
                </div>
                <div className="mt-0.5 font-mono-num text-2xl font-extrabold text-amber-800">
                  {campaign.meters.chaos}
                </div>
              </div>
            </div>

            {/* Lead Dispatch Body */}
            <article className="font-editorial-body text-[15px] leading-[1.7] text-[#26231F] columns-1 sm:columns-2 gap-6 [column-rule:1px_solid_#c7bfb0]">
              <p className="first-letter:float-left first-letter:mr-2 first-letter:mt-0.5 first-letter:font-masthead-serif first-letter:text-4xl first-letter:font-black first-letter:leading-none first-letter:text-[#171614]">
                {activeEnding.epilogue}
              </p>
            </article>

            {/* Returns Box */}
            <section className="border-t border-stone-900 pt-2.5 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono-num font-bold uppercase tracking-wider text-stone-700">
                <span>OFFICIAL STATE RETURNS · 关键摇摆州与特别结局判定州</span>
                <span>270 TO WIN</span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-x-3 gap-y-1 text-xs font-mono-num">
                {RETURNS_BOX_STATES.map((code) => {
                  const m = campaign.margins[code];
                  return (
                    <div
                      key={code}
                      className="flex items-center justify-between border-b border-stone-300/80 py-0.5"
                    >
                      <span className="font-bold text-stone-700">{code}</span>
                      <strong className={m >= 0 ? 'text-blue-800' : 'text-red-800'}>
                        {m >= 0 ? `D+${m.toFixed(1)}` : `R+${Math.abs(m).toFixed(1)}`}
                      </strong>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Press Footer Actions */}
            <div className="flex flex-wrap items-center gap-2.5 border-t-2 border-stone-900 pt-3.5">
              <button
                type="button"
                data-start="true"
                onClick={onPlayAgain}
                className="cursor-pointer bg-[#171614] px-5 py-2.5 text-sm font-bold text-[#F5F1E6] hover:bg-blue-800 transition-colors duration-150"
              >
                再来一局
              </button>
              <button
                type="button"
                onClick={onOpenCodex}
                data-testid="ending-codex-btn"
                className="cursor-pointer border-2 border-stone-900 bg-[#EAE2CF] px-4 py-2 text-sm font-bold text-[#171614] hover:bg-stone-300 transition-colors duration-150"
              >
                查看结局图鉴 (<span className="font-mono-num">{unlockedCount}/{ENDING_CATALOG.length}</span>)
              </button>
              <button
                type="button"
                onClick={onBackToTitle}
                className="cursor-pointer border border-stone-500 bg-transparent px-4 py-2 text-sm font-semibold text-stone-800 hover:border-stone-900 hover:bg-stone-200 transition-colors duration-150"
              >
                返回主标题
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

