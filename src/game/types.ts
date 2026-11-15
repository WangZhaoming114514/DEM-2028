export type IdeologyId =
  | 'liberal'
  | 'progressive'
  | 'moderate'
  | 'conservative'
  | 'woke'
  | 'populist'
  | 'dark';

export type IdeologyScores = Record<IdeologyId, number>;

export type RegionId =
  | 'rustbelt'
  | 'sunbelt'
  | 'deepsouth'
  | 'northeast'
  | 'westcoast'
  | 'heartland'
  | 'mountain';

export type SpeakerId = 'trump' | 'vance' | 'rubio';

export type StateCode =
  | 'AL' | 'AK' | 'AZ' | 'AR' | 'CA' | 'CO' | 'CT' | 'DE' | 'DC' | 'FL'
  | 'GA' | 'HI' | 'ID' | 'IL' | 'IN' | 'IA' | 'KS' | 'KY' | 'LA' | 'ME'
  | 'MD' | 'MA' | 'MI' | 'MN' | 'MS' | 'MO' | 'MT' | 'NE' | 'NV' | 'NH'
  | 'NJ' | 'NM' | 'NY' | 'NC' | 'ND' | 'OH' | 'OK' | 'OR' | 'PA' | 'RI'
  | 'SC' | 'SD' | 'TN' | 'TX' | 'UT' | 'VT' | 'VA' | 'WA' | 'WV' | 'WI'
  | 'WY';

export interface DemographicWeights {
  workingClass: number;
  suburban: number;
  progressiveYouth: number;
  sunBeltDiverse: number;
  southernPopulist: number;
  moderateHeartland: number;
}

export interface StateDefinition {
  code: StateCode;
  fips: string;
  name: string;
  nameZh: string;
  ev: number;
  region: RegionId;
  /** Positive = Dem lead (%), Negative = GOP lead (%) */
  baselineMargin: number;
  weights: DemographicWeights;
  note: string;
}

export interface Meters {
  hype: number;
  establishment: number;
  populism: number;
  chaos: number;
}

export interface IdeologyProfile {
  id: IdeologyId;
  nameZh: string;
  nameEn: string;
  handle: string;
  tagline: string;
  description: string;
  multipliers: DemographicWeights;
  accentColor: string;
}

export interface TurnEffects {
  nationalShift: number;
  demographics: Partial<DemographicWeights>;
  stateOverrides?: Partial<Record<StateCode, number>>;
  meterDelta: Partial<Meters>;
  ideologyDelta: Partial<IdeologyScores>;
  flags?: SpecialFlag[];
}

export type SpecialFlag =
  | 'yankee_redsox'
  | 'huey_long'
  | 'dixiecrat'
  | 'pigasus_selfown'
  | 'dark_brandon'
  | 'mondale_defense'
  | 'alfalfa_bill';

export interface TweetChoice {
  id: string;
  label: string;
  tweetText: string;
  strategyHint: string;
  primaryIdeology: IdeologyId;
  effects: TurnEffects;
  opponentSpeaker: SpeakerId;
  opponentReply: string;
  likes: string;
  reposts: string;
}

export interface RoundScenario {
  round: number;
  dateLabel: string;
  topic: string;
  breakingNews: string;
  opponentSpeaker: SpeakerId;
  opponentName: string;
  opponentHandle: string;
  opponentTweet: string;
  opponentLikes: string;
  opponentReposts: string;
  choices: TweetChoice[];
}

export interface FeedItem {
  id: string;
  round: number;
  speakerName: string;
  handle: string;
  avatar: 'player' | SpeakerId;
  isPlayer: boolean;
  text: string;
  likes: string;
  reposts: string;
  metaTag?: string;
}

export interface CampaignFlags {
  yankeeRedSoxCount: number;
  hueyLongUsed: boolean;
  dixiecratUsed: boolean;
  pigasusCount: number;
  darkBrandonCount: number;
  mondaleDefense: boolean;
  alfalfaBillUsed: boolean;
}

export interface CampaignState {
  /** Dynamically computed dominant ideology from player's tweet choices */
  ideology: IdeologyId;
  ideologyScores: IdeologyScores;
  round: number; // 1..10 while playing, 11 when finished
  margins: Record<StateCode, number>;
  prevMargins: Record<StateCode, number>;
  meters: Meters;
  flags: CampaignFlags;
  feed: FeedItem[];
  finished: boolean;
}

export interface ElectoralSummary {
  demEV: number;
  gopEV: number;
  tossupEV: number;
  evDelta: number;
  nationalMargin: number;
  nationalDelta: number;
  demStates: number;
  gopStates: number;
  swingWatch: Array<{
    code: StateCode;
    nameZh: string;
    ev: number;
    margin: number;
    delta: number;
  }>;
}

export type EndingCategory = 'victory' | 'unconventional' | 'loss' | 'hidden';

export interface NewspaperMeta {
  name: string;
  motto: string;
  location: string;
  editionTag: string;
  mastheadFont: 'blackletter' | 'serif' | 'condensed';
}

export interface EndingResult {
  id: string;
  isHidden: boolean;
  category: EndingCategory;
  title: string;
  subtitle: string;
  epilogue: string;
  badgeLabel: string;
  theme: 'victory' | 'loss' | 'chaos' | 'cursed';
  newspaper: NewspaperMeta;
}

export interface EndingCatalogEntry extends EndingResult {
  hint: string;
}

export interface UnlockedEndingRecord {
  id: string;
  unlockedAt: string;
  bestDemEV: number;
  count: number;
}
