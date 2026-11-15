import React, { useMemo, useState } from 'react';
import { ENDING_CATALOG } from '../game/endings';
import { EndingCategory, UnlockedEndingRecord } from '../game/types';

interface EndingCodexModalProps {
  unlockedEndings: Record<string, UnlockedEndingRecord>;
  onClose: () => void;
}

type StatusFilter = 'all' | 'unlocked' | 'locked';

const CATEGORY_LABELS: Record<EndingCategory, string> = {
  victory: '常规胜选',
  unconventional: '非常规',
  loss: '败选',
  hidden: '隐藏结局',
};

export const EndingCodexModal: React.FC<EndingCodexModalProps> = ({
  unlockedEndings,
  onClose,
}) => {
  const [filter, setFilter] = useState<StatusFilter>('all');

  const totalCount = ENDING_CATALOG.length;
  const unlockedCount = useMemo(
    () => ENDING_CATALOG.filter((e) => Boolean(unlockedEndings[e.id])).length,
    [unlockedEndings]
  );

  const visibleEntries = useMemo(() => {
    return ENDING_CATALOG.filter((entry) => {
      const unlocked = Boolean(unlockedEndings[entry.id]);
      if (filter === 'unlocked') return unlocked;
      if (filter === 'locked') return !unlocked;
      return true;
    });
  }, [filter, unlockedEndings]);

  const categorySummary = useMemo(() => {
    const categories: EndingCategory[] = ['victory', 'unconventional', 'loss', 'hidden'];
    return categories.map((cat) => {
      const entries = ENDING_CATALOG.filter((e) => e.category === cat);
      const done = entries.filter((e) => Boolean(unlockedEndings[e.id])).length;
      return { cat, label: CATEGORY_LABELS[cat], done, total: entries.length };
    });
  }, [unlockedEndings]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="2028大选结局图鉴"
      data-testid="ending-codex-modal"
    >
      <div className="flex max-h-[88vh] w-full max-w-4xl flex-col rounded-lg border border-slate-700 bg-[#0D1422] shadow-2xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 px-6 py-4">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-wide text-white">
              2028 选战结局档案库
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              已完成与未完成结局检视 · 进度自动保存至本地浏览器
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right font-mono-num">
              <div className="text-xs text-slate-400">总解锁进度</div>
              <div className="text-lg font-bold text-amber-400" data-testid="codex-progress">
                {unlockedCount} / {totalCount}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:border-slate-500 hover:text-white"
            >
              关闭 (Esc)
            </button>
          </div>
        </div>

        {/* Category Breakdown & Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-[#0A0F1A] px-6 py-3">
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono-num text-slate-300">
            {categorySummary.map((item, idx) => (
              <React.Fragment key={item.cat}>
                {idx > 0 && <span className="text-slate-700" aria-hidden="true">·</span>}
                <span>
                  {item.label}{' '}
                  <strong className={item.done === item.total ? 'text-emerald-400' : 'text-white'}>
                    {item.done}/{item.total}
                  </strong>
                </span>
              </React.Fragment>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            {(
              [
                { id: 'all', label: `全部 (${totalCount})` },
                { id: 'unlocked', label: `已完成 (${unlockedCount})` },
                { id: 'locked', label: `未完成 (${totalCount - unlockedCount})` },
              ] as const
            ).map((tab) => {
              const active = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(tab.id)}
                  className={`cursor-pointer rounded px-3 py-1.5 font-semibold transition-colors ${
                    active
                      ? 'bg-blue-600 text-white'
                      : 'border border-slate-800 bg-[#111827] text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Ending Cards Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {visibleEntries.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400">
              {filter === 'unlocked'
                ? '尚未达成任何结局——快去十回合推特战场击碎第22修正案复辟闹剧吧！'
                : `恭喜！全美${totalCount}个常规、非常规、败选与隐藏结局已全部收录完毕！`}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {visibleEntries.map((entry) => {
                const record = unlockedEndings[entry.id];
                const isUnlocked = Boolean(record);

                const statusAccent = !isUnlocked
                  ? 'text-slate-500'
                  : entry.theme === 'victory'
                    ? 'text-blue-400'
                    : entry.theme === 'chaos'
                      ? 'text-amber-400'
                      : entry.theme === 'cursed'
                        ? 'text-rose-400'
                        : 'text-red-400';

                return (
                  <article
                    key={entry.id}
                    className={`rounded-md border p-4 flex flex-col justify-between gap-2.5 ${
                      isUnlocked
                        ? 'border-slate-700 bg-[#121A2B]'
                        : 'border-slate-800/80 bg-[#0A0F1A]/80'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2 text-[11px] font-mono-num">
                        <span className={`font-bold ${statusAccent}`}>
                          {CATEGORY_LABELS[entry.category]} · {isUnlocked ? '已完成' : '未完成'}
                        </span>
                        {isUnlocked && record ? (
                          <span className="text-slate-400">
                            最佳 {record.bestDemEV} EV · 达成 {record.count} 次
                          </span>
                        ) : (
                          <span className="text-slate-500">{entry.newspaper.name}</span>
                        )}
                      </div>

                      <h3 className={`font-display text-base font-bold leading-snug ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                        {isUnlocked || !entry.isHidden ? entry.title : '???（隐藏结局未解锁）'}
                      </h3>

                      <p className="text-xs font-medium text-slate-300">
                        {isUnlocked
                          ? entry.subtitle
                          : entry.isHidden
                            ? '秘密历史分支 · 需在特定州或话术下触发'
                            : entry.subtitle}
                      </p>
                      {isUnlocked && (
                        <div className="text-[11px] font-editorial-body italic text-slate-400">
                          头版刊载：{entry.newspaper.name} ({entry.newspaper.location})
                        </div>
                      )}
                    </div>

                    <p className={`text-xs leading-relaxed ${isUnlocked ? 'text-slate-300' : 'text-slate-500'}`}>
                      {isUnlocked ? entry.epilogue : entry.hint}
                    </p>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
