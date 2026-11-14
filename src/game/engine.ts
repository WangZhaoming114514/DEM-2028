import { evaluateEnding, evaluateEndings, MultiEndingResolution } from './endings';
import { EMPTY_IDEOLOGY_SCORES, getDominantIdeology, IDEOLOGIES_BY_ID } from './ideologies';
import { ROUND_SCENARIOS } from './scenarios';
import { STATES_BY_CODE, STATES_DATA } from './statesData';
import {
  CampaignState,
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
