import { evaluateEnding, evaluateEndings, MultiEndingResolution } from './endings';
import { EMPTY_IDEOLOGY_SCORES, getDominantIdeology, IDEOLOGIES_BY_ID } from './ideologies';
import { ROUND_SCENARIOS } from './scenarios';
import { STATES_BY_CODE, STATES_DATA } from './statesData';
import {
  CampaignState,
  CustomTweetEval,
  DemographicWeights,
  ElectoralSummary,
  EndingResult,
  IdeologyId,
  IdeologyScores,
  SpecialFlag,
  StateCode,
  TweetChoice,
} from './types';

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function round1(val: number): number {
  return Math.round(val * 10) / 10;
}

/**
 * Every run starts as an unaligned 2028 Democratic Nominee facing Trump's
 * 22nd-Amendment repeal machine from an underdog ~226 EV baseline.
 * The player's tweets dynamically forge their faction and unlockable endings.
 */
export function createInitialCampaign(): CampaignState {
  const margins = {} as Record<StateCode, number>;

  for (const state of STATES_DATA) {
    margins[state.code] = round1(clamp(state.baselineMargin, -60, 92));
  }

  const firstRound = ROUND_SCENARIOS[0];

  return {
    ideology: 'liberal',
    ideologyScores: { ...EMPTY_IDEOLOGY_SCORES },
    round: 1,
    margins,
    prevMargins: { ...margins },
    meters: { hype: 45, establishment: 55, populism: 45, chaos: 20 },
    flags: {
      yankeeRedSoxCount: 0,
      hueyLongUsed: false,
      dixiecratUsed: false,
      pigasusCount: 0,
      darkBrandonCount: 0,
      mondaleDefense: false,
      alfalfaBillUsed: false,
    },
    feed: [
      {
        id: 'init-opponent-r1',
        round: 1,
        speakerName: firstRound.opponentName,
        handle: firstRound.opponentHandle,
        avatar: firstRound.opponentSpeaker,
        isPlayer: false,
        text: firstRound.opponentTweet,
        likes: firstRound.opponentLikes,
        reposts: firstRound.opponentReposts,
        metaTag: firstRound.dateLabel,
      },
    ],
    finished: false,
    customTweetsUsed: 0,
  };
}

function applyDeltaMap(
  state: CampaignState,
  nationalShift: number,
  demographics: Partial<DemographicWeights>,
  stateOverrides?: Partial<Record<StateCode, number>>,
  meterDelta?: Partial<CampaignState['meters']>,
  ideologyDelta?: Partial<IdeologyScores>,
  flags?: SpecialFlag[],
  synergyMultiplier = 1
): {
  nextMargins: Record<StateCode, number>;
  nextMeters: CampaignState['meters'];
  nextFlags: CampaignState['flags'];
  nextScores: IdeologyScores;
  nextIdeology: IdeologyId;
} {
  const nextScores: IdeologyScores = { ...state.ideologyScores };
  if (ideologyDelta) {
    for (const key of Object.keys(ideologyDelta) as IdeologyId[]) {
      nextScores[key] += ideologyDelta[key] ?? 0;
    }
  }
  const nextIdeology = getDominantIdeology(nextScores);
  const profile = IDEOLOGIES_BY_ID[nextIdeology];

  const nextMargins = { ...state.margins };
  // Trump's 22nd-Amendment-repeal apparatus & X algorithm pushback creates heavy per-round GOP headwind
  const gopHeadwind = -1.04;

  for (const st of STATES_DATA) {
    const w = st.weights;
    const m = profile.multipliers;
    let delta = gopHeadwind + nationalShift * 0.38 * synergyMultiplier;

    delta += (demographics.workingClass ?? 0) * w.workingClass * m.workingClass * 0.17;
    delta += (demographics.suburban ?? 0) * w.suburban * m.suburban * 0.17;
    delta += (demographics.progressiveYouth ?? 0) * w.progressiveYouth * m.progressiveYouth * 0.17;
    delta += (demographics.sunBeltDiverse ?? 0) * w.sunBeltDiverse * m.sunBeltDiverse * 0.17;
    delta += (demographics.southernPopulist ?? 0) * w.southernPopulist * m.southernPopulist * 0.17;
    delta += (demographics.moderateHeartland ?? 0) * w.moderateHeartland * m.moderateHeartland * 0.17;

    if (stateOverrides && stateOverrides[st.code] !== undefined) {
      delta += stateOverrides[st.code]! * 1.0;
    }

    nextMargins[st.code] = round1(clamp(nextMargins[st.code] + delta, -65, 95));
  }

  const nextMeters = {
    hype: clamp(Math.round(state.meters.hype + (meterDelta?.hype ?? 0)), 0, 100),
    establishment: clamp(Math.round(state.meters.establishment + (meterDelta?.establishment ?? 0)), 0, 100),
    populism: clamp(Math.round(state.meters.populism + (meterDelta?.populism ?? 0)), 0, 100),
    chaos: clamp(Math.round(state.meters.chaos + (meterDelta?.chaos ?? 0)), 0, 100),
  };

  const nextFlags = { ...state.flags };
  for (const flag of flags ?? []) {
    if (flag === 'yankee_redsox') nextFlags.yankeeRedSoxCount += 1;
    if (flag === 'huey_long') nextFlags.hueyLongUsed = true;
    if (flag === 'dixiecrat') nextFlags.dixiecratUsed = true;
    if (flag === 'pigasus_selfown') nextFlags.pigasusCount += 1;
    if (flag === 'dark_brandon') nextFlags.darkBrandonCount += 1;
    if (flag === 'mondale_defense') nextFlags.mondaleDefense = true;
    if (flag === 'alfalfa_bill') nextFlags.alfalfaBillUsed = true;
  }

  return { nextMargins, nextMeters, nextFlags, nextScores, nextIdeology };
}

export function applyChoiceTurn(state: CampaignState, choice: TweetChoice): CampaignState {
  if (state.finished) return state;

  const isConsistent = state.round > 1 && choice.primaryIdeology === state.ideology;
  const synergyMult = isConsistent ? 1.15 : 1.0;

  const { nextMargins, nextMeters, nextFlags, nextScores, nextIdeology } = applyDeltaMap(
    state,
    choice.effects.nationalShift,
    choice.effects.demographics,
    choice.effects.stateOverrides,
    choice.effects.meterDelta,
    choice.effects.ideologyDelta,
    choice.effects.flags,
    synergyMult
  );

  const nextProfile = IDEOLOGIES_BY_ID[nextIdeology];

  const playerItem = {
    id: `r${state.round}-player-${choice.id}`,
    round: state.round,
    speakerName: `民主党候选人 · ${nextProfile.nameZh}`,
    handle: nextProfile.handle,
    avatar: 'player' as const,
    isPlayer: true,
    text: choice.tweetText,
    likes: choice.likes,
    reposts: choice.reposts,
    metaTag: isConsistent ? `人设连击 · ${nextProfile.nameZh}` : choice.label,
  };

  const speakerNames = {
    trump: { name: 'Donald J. Trump', handle: '@realDonaldTrump' },
    vance: { name: 'JD Vance', handle: '@JDVance' },
    rubio: { name: 'Marco Rubio', handle: '@marcorubio' },
  };
  const sp = speakerNames[choice.opponentSpeaker];

  const counterItem = {
    id: `r${state.round}-counter`,
    round: state.round,
    speakerName: sp.name,
    handle: sp.handle,
    avatar: choice.opponentSpeaker,
    isPlayer: false,
    text: choice.opponentReply,
    likes: '29.4万',
    reposts: '8.7万',
    metaTag: '当场回嘴',
  };

  const nextRound = state.round + 1;
  const finished = nextRound > ROUND_SCENARIOS.length;
  const nextFeed = [counterItem, playerItem, ...state.feed];

  if (!finished) {
    const nextScenario = ROUND_SCENARIOS[nextRound - 1];
    nextFeed.unshift({
      id: `init-opponent-r${nextRound}`,
      round: nextRound,
      speakerName: nextScenario.opponentName,
      handle: nextScenario.opponentHandle,
      avatar: nextScenario.opponentSpeaker,
      isPlayer: false,
      text: nextScenario.opponentTweet,
      likes: nextScenario.opponentLikes,
      reposts: nextScenario.opponentReposts,
      metaTag: nextScenario.dateLabel,
    });
  }

  return {
    ...state,
    ideology: nextIdeology,
    ideologyScores: nextScores,
    round: nextRound,
    prevMargins: { ...state.margins },
    margins: nextMargins,
    meters: nextMeters,
    flags: nextFlags,
    feed: nextFeed,
    finished,
  };
}

export function applyCustomTweetTurn(
  state: CampaignState,
  customText: string,
  evalResult: CustomTweetEval
): CampaignState {
  if (state.finished) return state;

  const { nextMargins, nextMeters, nextFlags, nextScores, nextIdeology } = applyDeltaMap(
    state,
    evalResult.nationalShift,
    evalResult.demographics,
    evalResult.stateOverrides,
    evalResult.meterDelta,
    evalResult.ideologyDelta,
    evalResult.specialFlags,
    1.05
  );

  const nextProfile = IDEOLOGIES_BY_ID[nextIdeology];

  const playerItem = {
    id: `r${state.round}-custom-${Date.now()}`,
    round: state.round,
    speakerName: `民主党候选人 · ${nextProfile.nameZh}`,
    handle: nextProfile.handle,
    avatar: 'player' as const,
    isPlayer: true,
    text: customText,
    likes: evalResult.nationalShift >= 1 ? '142万' : '28.5万',
    reposts: evalResult.nationalShift >= 1 ? '48.2万' : '7.1万',
    metaTag: `手写推文 · ${evalResult.critique}`,
  };

  const speakerNames = {
    trump: { name: 'Donald J. Trump', handle: '@realDonaldTrump' },
    vance: { name: 'JD Vance', handle: '@JDVance' },
    rubio: { name: 'Marco Rubio', handle: '@marcorubio' },
  };
  const sp = speakerNames[evalResult.opponentSpeaker];

  const counterItem = {
    id: `r${state.round}-custom-counter-${Date.now()}`,
    round: state.round,
    speakerName: sp.name,
    handle: sp.handle,
    avatar: evalResult.opponentSpeaker,
    isPlayer: false,
    text: evalResult.opponentReply,
    likes: '34.9万',
    reposts: '10.1万',
    metaTag: '即时回应',
  };

  const nextRound = state.round + 1;
  const finished = nextRound > ROUND_SCENARIOS.length;
  const nextFeed = [counterItem, playerItem, ...state.feed];

  if (!finished) {
    const nextScenario = ROUND_SCENARIOS[nextRound - 1];
    nextFeed.unshift({
      id: `init-opponent-r${nextRound}`,
      round: nextRound,
      speakerName: nextScenario.opponentName,
      handle: nextScenario.opponentHandle,
      avatar: nextScenario.opponentSpeaker,
      isPlayer: false,
      text: nextScenario.opponentTweet,
      likes: nextScenario.opponentLikes,
      reposts: nextScenario.opponentReposts,
      metaTag: nextScenario.dateLabel,
    });
  }

  return {
    ...state,
    ideology: nextIdeology,
    ideologyScores: nextScores,
    round: nextRound,
    prevMargins: { ...state.margins },
    margins: nextMargins,
    meters: nextMeters,
    flags: nextFlags,
    feed: nextFeed,
    finished,
    customTweetsUsed: state.customTweetsUsed + 1,
  };
}

/** Deterministic local analyzer for custom tweets using American political satire cues */
export function evaluateCustomTweetLocally(text: string, currentIdeology: IdeologyId): CustomTweetEval {
  const baseballNegated = /(讨厌|抵制|滚出|烂透).{0,8}(洋基|红袜|yankee|red\s*sox)/i.test(text);
  const hasYankee = !baseballNegated && (text.includes('洋基') || /\byankees?\b/i.test(text));
  const hasRedSox = !baseballNegated && (text.includes('红袜') || /\bred\s*sox\b/i.test(text));
  const hasDem = text.includes('民主党') || /\bdemocrats?\b/i.test(text);
  const has1600 = text.includes('宾夕法尼亚大道1600') || text.includes('宾夕法尼亚大道') || text.includes('1600号') || text.includes('白宫');
  const hasHuey =
    text.includes('休伊·朗') ||
    text.includes('休伊朗') ||
    text.includes('路易斯安那') ||
    text.includes('巴吞鲁日') ||
    text.includes('均分财富') ||
    /\bkingfish\b/i.test(text) ||
    /\bhuey(\s+long)?\b/i.test(text) ||
    /\bevery\s+man\s+a\s+king\b/i.test(text);
  const hasAlfalfa =
    /\balfalfa(\s+bill)?\b/i.test(text) ||
    text.includes('紫花苜蓿') ||
    text.includes('俄克拉荷马') ||
    text.includes('培根与豆子') ||
    text.includes('面包、黄油、培根') ||
    text.includes('红河油田') ||
    text.includes('红河派兵') ||
    text.includes('威廉·默里');
  const hasTexas = text.includes('得州') || text.includes('德州') || text.includes('得克萨斯') || /\btexas\b/i.test(text);
  const hasWoke =
    text.includes('多元包容') ||
    text.includes('性别认同') ||
    text.includes('父权制') ||
    text.includes('交叉性') ||
    text.includes('去殖民') ||
    text.includes('觉醒主义') ||
    /\bdei\b/i.test(text) ||
    /\bwoke\b/i.test(text);
  const hasConservative =
    text.includes('减税') ||
    text.includes('石油') ||
    text.includes('钻井') ||
    text.includes('边境') ||
    text.includes('治安') ||
    text.includes('南方州权') ||
    text.includes('地方州权');
  const hasPopulist = text.includes('寡头') || text.includes('华尔街') || text.includes('亿万富翁') || text.includes('联合工会') || text.includes('工会');
  const hasTrumpVanceRubio =
    text.includes('川普') ||
    text.includes('万斯') ||
    text.includes('卢比奥') ||
    /\btrump\b/i.test(text) ||
    /\bvance\b/i.test(text) ||
    /\brubio\b/i.test(text);
  const hasProfanityPunch =
    /他妈的|去他妈|你妈的|干死|滚蛋/.test(text) ||
    /\bfuck(ing|ed|er)?\b/i.test(text) ||
    /\bshit(ty)?\b/i.test(text);

  const hasDixie =
    (/\bdixiecrat\b/i.test(text) ||
      text.includes('深南') ||
      text.includes('瑟蒙德') ||
      text.includes('南方州权') ||
      text.includes('种族隔离')) &&
    !/(反对|批判|终结|废除|痛斥|告别).{0,10}(州权|瑟蒙德|种族隔离|dixiecrat)/i.test(text);
  const hasPigasus =
    (/\bpigasus\b/i.test(text) || /芝加哥.{0,6}小?猪|1968.{0,6}猪|提名.{0,4}猪/.test(text)) &&
    !/(川普|万斯|卢比奥).{0,8}(猪|不如)/.test(text);
  const hasMondale =
    (/\bmondale\b/i.test(text) || text.includes('蒙代尔') || text.includes('保住明尼苏达')) &&
    !/(别像|别学|不会像|不会重演|绝不重演|不重演|绝不当|绝不学|拒绝|避免|告别).{0,6}(蒙代尔|mondale)/i.test(text);

  const stateOverrides: Partial<Record<StateCode, number>> = {};
  const specialFlags: SpecialFlag[] = [];
  const addFlag = (flag: SpecialFlag) => {
    if (!specialFlags.includes(flag)) {
      specialFlags.push(flag);
    }
  };
  let nationalShift = 0.7;

  if (hasYankee && hasRedSox) {
    stateOverrides.NY = 4.5;
    stateOverrides.MA = 4.5;
    stateOverrides.NH = 2.0;
    addFlag('yankee_redsox');
    nationalShift += 0.6;
  } else if (hasYankee) {
    stateOverrides.NY = 3.5;
    stateOverrides.MA = -1.5;
  } else if (hasRedSox) {
    stateOverrides.MA = 3.5;
    stateOverrides.NY = -1.5;
  }

  if (hasHuey) {
    stateOverrides.LA = 8.0;
    addFlag('huey_long');
  }
  if (hasAlfalfa) {
    stateOverrides.OK = 16.0;
    stateOverrides.KS = 4.0;
    addFlag('alfalfa_bill');
  }
  if (hasDixie) {
    stateOverrides.AL = 8.5;
    stateOverrides.MS = 5.0;
    stateOverrides.SC = 4.5;
    addFlag('dixiecrat');
  }
  if (hasPigasus) {
    stateOverrides.IL = -5.5;
    nationalShift -= 2.8;
    addFlag('pigasus_selfown');
  }
  if (hasMondale) {
    stateOverrides.MN = 3.5;
    nationalShift -= 3.2;
    addFlag('mondale_defense');
  }
  if (hasTexas) {
    stateOverrides.TX = 5.0;
  }
  if (hasDem) nationalShift += 0.4;
  if (has1600) nationalShift += 0.5;
  if (hasTrumpVanceRubio) nationalShift += 0.5;
  if (hasProfanityPunch) {
    nationalShift += 0.4;
    addFlag('dark_brandon');
  }

  const ideologyDelta: Partial<IdeologyScores> = {};
  if (hasProfanityPunch || currentIdeology === 'dark') ideologyDelta.dark = 3;
  else if (hasWoke) ideologyDelta.woke = 3;
  else if (hasAlfalfa) {
    ideologyDelta.conservative = 2;
    ideologyDelta.populist = 2;
  } else if (hasConservative || hasDixie) ideologyDelta.conservative = 3;
  else if (hasHuey || hasPopulist) ideologyDelta.populist = 3;
  else ideologyDelta.liberal = 2;

  return {
    critique: hasYankee && hasRedSox ? '东海岸球场停火奇迹' : hasProfanityPunch ? '黑暗推特直球轰炸' : '即兴推特反击',
    opponentSpeaker: text.includes('万斯') || /\bvance\b/i.test(text) ? 'vance' : text.includes('卢比奥') || /\brubio\b/i.test(text) ? 'rubio' : 'trump',
    opponentReply: hasProfanityPunch
      ? '极其粗鲁！他把K街和福克斯新闻的主持人都骂愣了！快叫联邦通信委员会把他的账号吊销！'
      : '假新闻！他这句推文一听就是康涅狄格自由派公关公司连夜代写的！',
    nationalShift,
    demographics: {
      workingClass: hasProfanityPunch || hasPopulist ? 1.8 : 1.0,
      suburban: hasProfanityPunch ? 0.4 : 1.4,
      progressiveYouth: hasWoke ? 2.6 : 1.6,
      sunBeltDiverse: hasTexas ? 2.2 : 1.1,
      southernPopulist: hasHuey || hasConservative || hasDixie ? 3.8 : 0.4,
      moderateHeartland: hasProfanityPunch ? -0.3 : 1.2,
    },
    meterDelta: {
      hype: hasProfanityPunch ? 16 : 10,
      chaos: hasProfanityPunch ? 14 : 5,
      populism: hasHuey || hasPopulist ? 12 : 4,
    },
    ideologyDelta,
    stateOverrides,
    specialFlags,
  };
}

export function computeElectoralSummary(
  margins: Record<StateCode, number>,
  prevMargins?: Record<StateCode, number>
): ElectoralSummary {
  let demEV = 0;
  let prevDemEV = 0;
  let gopEV = 0;
  let tossupEV = 0;
  let demStates = 0;
  let gopStates = 0;
  let weightedSum = 0;
  let prevWeightedSum = 0;

  const swingCandidates: ElectoralSummary['swingWatch'] = [];

  for (const st of STATES_DATA) {
    const m = margins[st.code];
    const prev = prevMargins ? prevMargins[st.code] : m;

    weightedSum += m * st.ev;
    prevWeightedSum += prev * st.ev;
    if (prev >= 0) {
      prevDemEV += st.ev;
    }

    if (Math.abs(m) < 0.8) {
      tossupEV += st.ev;
      if (m >= 0) {
        demEV += st.ev;
        demStates += 1;
      } else {
        gopEV += st.ev;
        gopStates += 1;
      }
    } else if (m >= 0) {
      demEV += st.ev;
      demStates += 1;
    } else {
      gopEV += st.ev;
      gopStates += 1;
    }

    swingCandidates.push({
      code: st.code,
      nameZh: st.nameZh,
      ev: st.ev,
      margin: m,
      delta: round1(m - prev),
    });
  }

  const priorityCodes = new Set<StateCode>(['PA', 'MI', 'WI', 'GA', 'NC', 'AZ', 'NV', 'TX', 'FL', 'LA', 'MN']);
  swingCandidates.sort((a, b) => {
    const aPri = priorityCodes.has(a.code) ? 0 : 1;
    const bPri = priorityCodes.has(b.code) ? 0 : 1;
    if (aPri !== bPri) return aPri - bPri;
    return Math.abs(a.margin) - Math.abs(b.margin);
  });

  const nationalMargin = round1(weightedSum / 538);
  const prevNationalMargin = round1(prevWeightedSum / 538);

  return {
    demEV,
    gopEV,
    tossupEV,
    evDelta: demEV - prevDemEV,
    nationalMargin,
    nationalDelta: round1(nationalMargin - prevNationalMargin),
    demStates,
    gopStates,
    swingWatch: swingCandidates.slice(0, 8),
  };
}

export function resolveCampaignEndings(state: CampaignState): MultiEndingResolution {
  const summary = computeElectoralSummary(state.margins);
  return evaluateEndings(state, summary.demEV);
}

export function resolveCampaignEnding(state: CampaignState): EndingResult {
  const summary = computeElectoralSummary(state.margins);
  return evaluateEnding(state, summary.demEV);
}

export function getStateColorClass(margin: number): string {
  if (margin >= 12) return '#1D4ED8';
  if (margin >= 5) return '#2563EB';
  if (margin >= 1) return '#60A5FA';
  if (margin > -1) return '#D97706';
  if (margin > -5) return '#F87171';
  if (margin > -12) return '#DC2626';
  return '#991B1B';
}

export function getStateLeanLabel(margin: number): string {
  const abs = Math.abs(margin).toFixed(1);
  if (margin >= 12) return `铁蓝 DEM +${abs}%`;
  if (margin >= 5) return `稳蓝 DEM +${abs}%`;
  if (margin >= 1) return `微蓝 DEM +${abs}%`;
  if (margin > -1) {
    return margin >= 0 ? `胶着 DEM +${abs}%` : `胶着 GOP +${abs}%`;
  }
  if (margin > -5) return `微红 GOP +${abs}%`;
  if (margin > -12) return `稳红 GOP +${abs}%`;
  return `铁红 GOP +${abs}%`;
}

export function getStateMeta(code: StateCode) {
  return STATES_BY_CODE[code];
}
