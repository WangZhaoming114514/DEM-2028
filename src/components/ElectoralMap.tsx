import React, { useMemo } from 'react';
import { getStateColorClass, getStateLeanLabel, getStateMeta } from '../game/engine';
import { ElectoralSummary, StateCode } from '../game/types';
import { getUsStateShapes, SMALL_EAST_COAST_CALLOUTS } from '../utils/usMapPaths';

interface ElectoralMapProps {
  margins: Record<StateCode, number>;
  prevMargins: Record<StateCode, number>;
  selectedState: StateCode;
  onSelectState: (code: StateCode) => void;
  summary: ElectoralSummary;
}

const SKIP_INLINE_LABEL = new Set<StateCode>([
  'VT', 'NH', 'MA', 'RI', 'CT', 'NJ', 'DE', 'MD', 'DC', 'HI',
]);

export const ElectoralMap: React.FC<ElectoralMapProps> = ({
  margins,
  prevMargins,
  selectedState,
  onSelectState,
  summary,
}) => {
  const shapes = useMemo(() => getUsStateShapes(), []);
  const selectedMeta = getStateMeta(selectedState);
  const selectedMargin = margins[selectedState];
  const selectedDelta = Math.round((selectedMargin - prevMargins[selectedState]) * 10) / 10;

  return (
    <section className="flex flex-col gap-3">
      {/* Main Map Card */}
      <div className="rounded-lg border border-slate-800 bg-[#111827] p-3 sm:p-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <h2 className="text-sm font-bold text-white">全美 50 州 + 特区实时选情地图</h2>
            <span className="text-slate-600" aria-hidden="true">·</span>
            <span className="font-mono-num text-slate-400">
              蓝营 {summary.demStates} 州 / 红营 {summary.gopStates} 州
            </span>
          </div>
          {/* Map Legend */}
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-xs bg-[#1D4ED8]" /> 铁蓝
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-xs bg-[#60A5FA]" /> 微蓝
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-xs bg-[#D97706]" /> 胶着
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-xs bg-[#F87171]" /> 微红
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-xs bg-[#991B1B]" /> 铁红
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:items-center">
          {/* Geographically Accurate Albers USA SVG Map */}
          <div className="lg:col-span-10 relative">
            <svg
              viewBox="0 0 975 610"
              className="w-full h-auto select-none"
              role="img"
              aria-label="美国538张选举人票实时地图"
              data-testid="electoral-map-svg"
            >
              {shapes.map((shape) => {
                const margin = margins[shape.code];
                const fill = getStateColorClass(margin);
                const isSelected = shape.code === selectedState;
                const meta = getStateMeta(shape.code);
                return (
                  <g key={shape.code}>
                    <path
                      d={shape.path}
                      fill={fill}
                      stroke={isSelected ? '#FBBF24' : '#0B0F17'}
                      strokeWidth={isSelected ? 2.4 : 0.9}
                      className="cursor-pointer transition-opacity duration-150 hover:opacity-85 focus:outline-none"
                      role="button"
                      tabIndex={0}
                      aria-label={`${meta.nameZh} ${shape.code} ${meta.ev}票 ${getStateLeanLabel(margin)}`}
                      onClick={() => onSelectState(shape.code)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelectState(shape.code);
                        }
                      }}
                    />
                    {!SKIP_INLINE_LABEL.has(shape.code) && (
                      <text
                        x={shape.labelX}
                        y={shape.labelY}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="pointer-events-none fill-white/95 font-mono text-[10px] font-bold"
                        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.85)' }}
                      >
                        {shape.code}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Right Callout Rail for Small East Coast States + DC */}
          <div className="lg:col-span-2 grid grid-cols-3 gap-1.5 lg:grid-cols-1">
            {SMALL_EAST_COAST_CALLOUTS.map((code) => {
              const meta = getStateMeta(code);
              const m = margins[code];
              const isSelected = code === selectedState;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => onSelectState(code)}
                  aria-label={`${meta.nameZh} ${code} ${meta.ev}票`}
                  className={`cursor-pointer flex items-center justify-between rounded px-2 py-1.5 text-xs font-mono-num transition-colors ${
                    isSelected ? 'ring-2 ring-amber-400' : 'hover:brightness-110'
                  }`}
                  style={{ backgroundColor: getStateColorClass(m), color: '#FFFFFF' }}
                >
                  <span className="font-bold">{code}</span>
                  <span>{meta.ev}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected State Inspector & Swing States Strip */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
        {/* Selected State Detail */}
        <div
          className="md:col-span-5 rounded-lg border border-slate-800 bg-[#111827] p-3.5"
          data-testid="selected-state-panel"
        >
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-base font-bold text-white">
              {selectedMeta.nameZh} ({selectedMeta.code})
            </h3>
            <span className="font-mono-num text-sm font-bold text-amber-400">
              {selectedMeta.ev} 选举人票
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-2 text-xs font-mono-num">
            <span className={selectedMargin >= 0 ? 'text-blue-400 font-semibold' : 'text-red-400 font-semibold'}>
              {getStateLeanLabel(selectedMargin)}
            </span>
            <span className="text-slate-600" aria-hidden="true">·</span>
            <span
              className={
                selectedDelta > 0
                  ? 'text-emerald-400'
                  : selectedDelta < 0
                    ? 'text-rose-400'
                    : 'text-slate-400'
              }
            >
              本轮变化 {selectedDelta > 0 ? `+${selectedDelta}%` : `${selectedDelta}%`}
            </span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">{selectedMeta.note}</p>
        </div>

        {/* Swing States Watch Grid */}
        <div className="md:col-span-7 rounded-lg border border-slate-800 bg-[#111827] p-3.5">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-200">核心摇摆与焦点战场</span>
            <span>点击切换详情</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {summary.swingWatch.map((st) => {
              const isSelected = st.code === selectedState;
              const isDem = st.margin >= 0;
              return (
                <button
                  key={st.code}
                  type="button"
                  onClick={() => onSelectState(st.code)}
                  className={`cursor-pointer flex flex-col items-start rounded border px-2.5 py-2 text-left transition-colors ${
                    isSelected
                      ? 'border-amber-400 bg-slate-800/90'
                      : 'border-slate-800 bg-[#0D1320] hover:border-slate-600'
                  }`}
                >
                  <div className="flex w-full items-center justify-between text-xs font-mono-num">
                    <span className="font-bold text-white">{st.code}</span>
                    <span className="text-slate-400">{st.ev}票</span>
                  </div>
                  <div className="mt-0.5 flex w-full items-center justify-between text-[11px] font-mono-num">
                    <span className={isDem ? 'text-blue-400' : 'text-red-400'}>
                      {isDem ? `D+${st.margin.toFixed(1)}` : `R+${Math.abs(st.margin).toFixed(1)}`}
                    </span>
                    {st.delta !== 0 && (
                      <span className={st.delta > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        {st.delta > 0 ? `+${st.delta}` : st.delta}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
