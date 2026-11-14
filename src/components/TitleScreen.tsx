import React from 'react';
import { ENDING_CATALOG } from '../game/endings';
import { IDEOLOGIES } from '../game/ideologies';
import { UnlockedEndingRecord } from '../game/types';

interface TitleScreenProps {
  unlockedEndings: Record<string, UnlockedEndingRecord>;
  onStart: () => void;
  onOpenCodex: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  unlockedEndings,
  onStart,
  onOpenCodex,
}) => {
  const unlockedCount = ENDING_CATALOG.filter((e) => Boolean(unlockedEndings[e.id])).length;
  const totalEndings = ENDING_CATALOG.length;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#070B12] text-slate-100 flex flex-col justify-between">
      {/* Illustrated Key-Art Backdrop with calm left-third scrim */}
      <div className="pointer-events-none absolute inset-0">
        <img
          src="/src/assets/images/title_bg_1794685052392.jpg"
          alt="2028华盛顿大选广播演播室夜景"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070B12] via-[#070B12]/90 to-[#070B12]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070B12] via-transparent to-[#070B12]/70" />
      </div>

      {/* Main Content Stage */}
      <main className="relative z-10 mx-auto flex w-full max-w-[1360px] flex-1 flex-col justify-center px-6 py-8 lg:px-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Bespoke SVG Emblem, Premise & Start/Codex CTAs */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-4">
              {/* Custom Inline SVG Campaign Emblem Lockup */}
              <svg
                viewBox="0 0 540 124"
                className="w-full max-w-[520px] h-auto"
                role="img"
                aria-label="DEMOCRATIC 2028"
              >
                <defs>
                  <linearGradient id="demShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1D4ED8" />
                    <stop offset="100%" stopColor="#0F172A" />
                  </linearGradient>
                </defs>
                {/* Campaign Shield Crest */}
                <path
                  d="M12 18 H82 V64 C82 88 47 106 47 106 C47 106 12 88 12 64 Z"
                  fill="url(#demShieldGrad)"
                  stroke="#60A5FA"
                  strokeWidth="2.5"
                />
                <path d="M12 40 H82" stroke="#DC2626" strokeWidth="5" />
                <path d="M12 52 H82" stroke="#F8FAFC" strokeWidth="3" />
                {/* Three Ballot Stars */}
                <polygon points="30,29 32,34 37,34 33,37 34,42 30,39 26,42 27,37 23,34 28,34" fill="#F8FAFC" />
                <polygon points="47,25 49,31 55,31 50,34 52,40 47,36 42,40 44,34 39,31 45,31" fill="#FBBF24" />
                <polygon points="64,29 66,34 71,34 67,37 68,42 64,39 60,42 61,37 57,34 62,34" fill="#F8FAFC" />

                <text
                  x="104"
                  y="62"
                  fill="#F8FAFC"
                  fontFamily="Oswald, sans-serif"
                  fontWeight="700"
                  fontSize="54"
                  letterSpacing="2"
                >
                  DEMOCRATIC
                </text>
                <text
                  x="106"
                  y="104"
                  fill="#3B82F6"
                  fontFamily="Oswald, sans-serif"
                  fontWeight="700"
                  fontSize="44"
                  letterSpacing="4"
                >
                  2028
                </text>
                <line x1="234" y1="88" x2="528" y2="88" stroke="#DC2626" strokeWidth="3" />
                <text
                  x="236"
                  y="104"
                  fill="#CBD5E1"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                  fontWeight="600"
                  fontSize="14"
                  letterSpacing="1.5"
                >
                  夺回宾夕法尼亚大道 1600 号
                </text>
              </svg>

              <p className="max-w-xl text-base leading-relaxed text-slate-300">
                2027年，唐纳德·川普强行胁迫两院废除了宪法第22修正案，带着永远的副总统JD·万斯和预备国务卿马可·卢比奥妄图无限连任。在9月至11月的十个回合里，你在推特战场的每一句发言都将实时重塑你的党内派系与全美50州+特区选情。
              </p>
            </div>

            {/* Dynamic Faction Rule Note */}
            <div className="border border-slate-800 bg-[#0F1522]/90 p-5 rounded-lg max-w-xl space-y-3">
              <div className="flex items-baseline justify-between gap-4 border-b border-slate-800 pb-2.5">
                <h2 className="text-base font-bold text-white">
                  推文决定派系 · 选票裁决历史
                </h2>
                <span className="text-xs font-mono-num text-blue-400">
                  初始倾向：未定型 (~226 EV 逆风开局)
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-300">
                开局不预设任何标签。你的每一条预设推文或手写暴论都会在七大派系中累积声望，并把全美选民版图拉向完全不同的终局：从横扫435票的“FDR IN 2028”、令华盛顿失语的“Dixiecrat”大反转，到连芝加哥小猪都不如的历史级惨败。
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-400 pt-1">
                {IDEOLOGIES.map((item, idx) => (
                  <React.Fragment key={item.id}>
                    {idx > 0 && <span className="text-slate-700" aria-hidden="true">·</span>}
                    <span>{item.nameZh} ({item.nameEn})</span>
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                data-start="true"
                onClick={onStart}
                className="cursor-pointer rounded-md bg-blue-600 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-950/50 transition-transform duration-150 hover:bg-blue-500 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 whitespace-nowrap shrink-0"
              >
                开始 2028 选战
              </button>

              <button
                type="button"
                onClick={onOpenCodex}
                data-testid="open-codex-btn"
                className="cursor-pointer rounded-md border border-slate-700 bg-[#111827]/95 px-5 py-3.5 text-sm font-semibold text-slate-200 transition-colors hover:border-amber-400 hover:text-white whitespace-nowrap shrink-0"
              >
                结局图鉴 (<span className="font-mono-num text-amber-400">{unlockedCount}/{totalEndings}</span>)
              </button>
            </div>
          </div>

          {/* Right Column: Opponent Ticket Dossier (No pre-selected faction) */}
          <div className="lg:col-span-6">
            <div className="border border-slate-800/90 bg-[#0B101B]/90 p-5 rounded-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <h2 className="text-sm font-semibold tracking-wide text-slate-200">
                  2028 共和党无限连任轴心档案
                </h2>
                <span className="text-xs font-mono-num text-red-400">22nd Amendment Repealed</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3.5 rounded-md border border-slate-800 bg-[#111827]/90 p-3.5">
                  <img
                    src="/src/assets/images/portrait_trump_1794685052595.jpg"
                    alt="Donald J. Trump"
                    className="h-14 w-14 shrink-0 rounded object-cover border border-slate-700"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="text-sm font-bold text-white">Donald J. Trump</span>
                      <span className="text-xs font-mono-num text-red-400">@realDonaldTrump</span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                      2027年强迫两院废除第22修正案的第三任期总统，正计划把海湖庄园推杆果岭直接修进白宫玫瑰园。
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 rounded-md border border-slate-800 bg-[#111827]/90 p-3.5">
                  <img
                    src="/src/assets/images/portrait_vance_1794685052521.jpg"
                    alt="JD Vance"
                    className="h-14 w-14 shrink-0 rounded object-cover border border-slate-700"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="text-sm font-bold text-white">JD Vance</span>
                      <span className="text-xs font-mono-num text-red-400">永远的副总统 · @JDVance</span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                      在甜甜圈店与播客录音棚之间无缝切换的铁锈带传教士，随时准备用一万字文化战争推文替老板顶枪。
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 rounded-md border border-slate-800 bg-[#111827]/90 p-3.5">
                  <img
                    src="/src/assets/images/portrait_rubio_1794685053917.jpg"
                    alt="Marco Rubio"
                    className="h-14 w-14 shrink-0 rounded object-cover border border-slate-700"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="text-sm font-bold text-white">Marco Rubio</span>
                      <span className="text-xs font-mono-num text-red-400">预备国务卿 · @marcorubio</span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                      永远把矿泉水拧开一半、随时准备在电视直播里背诵冷战八股与佛罗里达拉丁裔民调的职业二把手。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom single-line control hint */}
      <footer className="relative z-10 px-6 pb-5 pt-2 text-center text-xs text-slate-500">
        1-4 快捷键选择推文 · Enter 开始选战 · 点击地图各州查看实时民调 · Esc / P 暂停 · 支持手写暴论
      </footer>
    </div>
  );
};
