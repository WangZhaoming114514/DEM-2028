import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyChoiceTurn,
  applyCustomTweetTurn,
  computeElectoralSummary,
  createInitialCampaign,
  evaluateCustomTweetLocally,
  resolveCampaignEnding,
} from './engine';
import { ENDING_CATALOG, evaluateEnding } from './endings';
import { ROUND_SCENARIOS } from './scenarios';
import { STATES_DATA } from './statesData';
import { StateCode } from './types';

test('all 50 states + DC sum to exactly 538 electoral votes', () => {
  assert.equal(STATES_DATA.length, 51);
  const totalEV = STATES_DATA.reduce((sum, s) => sum + s.ev, 0);
  assert.equal(totalEV, 538);
});

test('ENDING_CATALOG contains 20 unique endings covering all categories', () => {
  assert.equal(ENDING_CATALOG.length, 20);
  const ids = new Set(ENDING_CATALOG.map((e) => e.id));
  assert.equal(ids.size, 20);
  assert.equal(ENDING_CATALOG.filter((e) => e.category === 'hidden').length, 9);
  assert.equal(ENDING_CATALOG.filter((e) => e.category === 'victory').length, 3);
  assert.equal(ENDING_CATALOG.filter((e) => e.category === 'unconventional').length, 4);
  assert.equal(ENDING_CATALOG.filter((e) => e.category === 'loss').length, 4);
});

test('initial campaign starts unaligned as an ~226 EV underdog', () => {
  const campaign = createInitialCampaign();
  assert.equal(campaign.round, 1);
  assert.equal(campaign.finished, false);
  const scoreSum = Object.values(campaign.ideologyScores).reduce((a, b) => a + b, 0);
  assert.equal(scoreSum, 0);
  const summary = computeElectoralSummary(campaign.margins);
  assert.equal(summary.demEV + summary.gopEV, 538);
  assert.ok(summary.demEV >= 210 && summary.demEV <= 240, `Unexpected starting EV: ${summary.demEV}`);
});

test('tweet choices dynamically forge player faction and reach victory over 10 rounds', () => {
  let campaign = createInitialCampaign();
  for (let i = 0; i < 10; i++) {
    const scenario = ROUND_SCENARIOS[i];
    // Pick choices aligned with moderate/liberal/progressive competence
    const choice = scenario.choices.find(
      (c) => c.primaryIdeology === 'moderate' || c.primaryIdeology === 'liberal'
    ) ?? scenario.choices[0];
    campaign = applyChoiceTurn(campaign, choice);
  }
  assert.equal(campaign.finished, true);
  assert.equal(campaign.round, 11);
  assert.ok(
    campaign.ideology === 'moderate' || campaign.ideology === 'liberal',
    `Expected moderate or liberal dominant ideology, got ${campaign.ideology}`
  );
  const summary = computeElectoralSummary(campaign.margins);
  assert.ok(summary.demEV >= 270, `Expected >= 270 EV, got ${summary.demEV}`);
  const ending = resolveCampaignEnding(campaign);
  assert.equal(ending.theme, 'victory');
});

test('all 6 user-requested hidden endings + Yankee-Red Sox trigger accurately', () => {
  // 1. KINGFISH HUEY LONG IN LOUISIANA AGAIN?
  const huey = createInitialCampaign();
  huey.ideology = 'populist';
  huey.margins.LA = 2.4;
  huey.meters.populism = 85;
  huey.flags.hueyLongUsed = true;
  huey.finished = true;
  assert.equal(resolveCampaignEnding(huey).id, 'huey_long');

  // 2. WHAT THE FUCK, DIXIECRAT?!?!?! (Win Deep South + lose CA/NY/MA + WIN election >= 270)
  const dixie = createInitialCampaign();
  for (const k of Object.keys(dixie.margins) as StateCode[]) {
    dixie.margins[k] = 4.0;
  }
  dixie.ideology = 'conservative';
  dixie.margins.AL = 3.0;
  dixie.margins.MS = 2.5;
  dixie.margins.LA = 4.0;
  dixie.margins.NY = -2.0;
  dixie.finished = true;
  assert.ok(computeElectoralSummary(dixie.margins).demEV >= 270);
  assert.equal(resolveCampaignEnding(dixie).id, 'dixiecrat');

  // 2b. Full 10-round Dixiecrat WIN preset path
  let dixieWinRun = createInitialCampaign();
  const dixieWinPath = [3, 1, 1, 1, 0, 2, 1, 0, 3, 1];
  for (let r = 0; r < 10; r++) {
    dixieWinRun = applyChoiceTurn(dixieWinRun, ROUND_SCENARIOS[r].choices[dixieWinPath[r]]);
  }
  assert.ok(computeElectoralSummary(dixieWinRun.margins).demEV >= 270);
  assert.equal(resolveCampaignEnding(dixieWinRun).id, 'dixiecrat');

  // 3. Sir, you’d be better off doing what Mondale did—winning Minnesota by 3,000 votes.
  const mondale = createInitialCampaign();
  for (const k of Object.keys(mondale.margins) as StateCode[]) {
    mondale.margins[k] = -18;
  }
  mondale.margins.DC = 50;
  mondale.margins.MN = 0.8;
  mondale.finished = true;
  assert.equal(resolveCampaignEnding(mondale).id, 'mondale');

  // 4. FDR IN 2028
  const fdr = createInitialCampaign();
  for (const k of Object.keys(fdr.margins) as StateCode[]) {
    fdr.margins[k] = 15;
  }
  fdr.finished = true;
  assert.equal(resolveCampaignEnding(fdr).id, 'fdr_2028');

  // 5. You’re not even as good as that pig in Chicago named "Pigasus."
  const pigasus = createInitialCampaign();
  for (const k of Object.keys(pigasus.margins) as StateCode[]) {
    pigasus.margins[k] = -25;
  }
  pigasus.finished = true;
  assert.equal(resolveCampaignEnding(pigasus).id, 'pigasus');

  // 6. Texas has flipped blue—you still lost ……
  const bluxas = createInitialCampaign();
  for (const k of Object.keys(bluxas.margins) as StateCode[]) {
    bluxas.margins[k] = -10;
  }
  bluxas.margins.CA = 15;
  bluxas.margins.NY = 12;
  bluxas.margins.TX = 1.5;
  bluxas.finished = true;
  assert.equal(resolveCampaignEnding(bluxas).id, 'bluxas_lost');

  // 7. Yankee-Red Sox Miracle
  const yankee = createInitialCampaign();
  yankee.flags.yankeeRedSoxCount = 2;
  yankee.margins.NY = 18;
  yankee.margins.MA = 28;
  yankee.margins.PA = 3.5;
  yankee.finished = true;
  assert.equal(evaluateEnding(yankee, 285).id, 'yankee_redsox');

  // 8. Alfalfa Bill (via Oklahoma surge & flag + 10-round preset path)
  const alfalfa = createInitialCampaign();
  alfalfa.flags.alfalfaBillUsed = true;
  alfalfa.margins.OK = -6.0;
  alfalfa.finished = true;
  assert.equal(evaluateEnding(alfalfa, 280).id, 'alfalfa_bill');

  let alfalfaRun = createInitialCampaign();
  const choiceIdxPath = [1, 0, 2, 1, 0, 2, 1, 2, 0, 0]; // r1_populist + r3_huey + r6_dixie_oil + r8_southern_flip
  for (let r = 0; r < 10; r++) {
    alfalfaRun = applyChoiceTurn(alfalfaRun, ROUND_SCENARIOS[r].choices[choiceIdxPath[r]]);
  }
  assert.equal(alfalfaRun.flags.alfalfaBillUsed, true);
  assert.equal(resolveCampaignEnding(alfalfaRun).id, 'alfalfa_bill');
});

test('unconventional and defeat endings trigger under their exact rules', () => {
  const base = createInitialCampaign();

  assert.equal(evaluateEnding(base, 269).id, 'tie_269');

  const sunBelt = createInitialCampaign();
  sunBelt.margins.AZ = 2;
  sunBelt.margins.GA = 2;
  sunBelt.margins.NC = 2;
  sunBelt.margins.PA = -1;
  assert.equal(evaluateEnding(sunBelt, 280).id, 'sun_belt_realignment');

  const dark = createInitialCampaign();
  dark.ideology = 'dark';
  assert.equal(evaluateEnding(dark, 295).id, 'dark_brandon_ascendant');

  const blueDog = createInitialCampaign();
  blueDog.ideology = 'conservative';
  assert.equal(evaluateEnding(blueDog, 345).id, 'blue_dog_reversal');

  // Full 10-round Blue Dog Conservative preset path
  let blueDogRun = createInitialCampaign();
  const blueDogPath = [3, 1, 1, 1, 0, 1, 1, 0, 0, 0];
  for (let r = 0; r < 10; r++) {
    blueDogRun = applyChoiceTurn(blueDogRun, ROUND_SCENARIOS[r].choices[blueDogPath[r]]);
  }
  assert.equal(blueDogRun.ideology, 'conservative');
  assert.equal(resolveCampaignEnding(blueDogRun).id, 'blue_dog_reversal');

  // Segregation Now! (Win Deep South but lose election < 270 EV)
  const segNow = createInitialCampaign();
  for (const k of Object.keys(segNow.margins) as StateCode[]) {
    segNow.margins[k] = -12;
  }
  segNow.margins.DC = 50;
  segNow.margins.CA = 15;
  segNow.margins.WA = 12;
  segNow.margins.IL = 10;
  segNow.margins.MN = 6;
  segNow.margins.AL = 3.5;
  segNow.margins.MS = 2.5;
  segNow.margins.NY = -5;
  assert.ok(computeElectoralSummary(segNow.margins).demEV < 270);
  const segRes = resolveCampaignEnding(segNow);
  assert.equal(segRes.id, 'segregation_now');
  assert.equal(segRes.isHidden, true);
  assert.equal(segRes.category, 'hidden');
  assert.equal(segRes.title, 'Segregation now, segregation tomorrow, segregation forever!');

  // Full 10-round Segregation Now! preset path
  let segRun = createInitialCampaign();
  const segPath = [3, 0, 3, 3, 2, 2, 0, 3, 3, 3];
  for (let r = 0; r < 10; r++) {
    segRun = applyChoiceTurn(segRun, ROUND_SCENARIOS[r].choices[segPath[r]]);
  }
  assert.ok(computeElectoralSummary(segRun.margins).demEV < 270);
  assert.equal(resolveCampaignEnding(segRun).id, 'segregation_now');

  const wokeLoss = createInitialCampaign();
  wokeLoss.ideology = 'woke';
  assert.equal(evaluateEnding(wokeLoss, 226).id, 'woke_echo_chamber');

  const narrowLoss = createInitialCampaign();
  narrowLoss.ideology = 'moderate';
  narrowLoss.margins.PA = 1.2;
  assert.equal(evaluateEnding(narrowLoss, 255).id, 'consultants_graveyard');

  const rustCollapse = createInitialCampaign();
  rustCollapse.ideology = 'liberal';
  rustCollapse.margins.PA = -2;
  rustCollapse.margins.MI = -2;
  rustCollapse.margins.WI = -2;
  assert.equal(evaluateEnding(rustCollapse, 226).id, 'rust_belt_betrayal');
});

test('custom tweet evaluation rewards Yankee + Red Sox East Coast miracle line and shapes ideology', () => {
  let campaign = createInitialCampaign();
  const prevNY = campaign.margins.NY;
  const prevMA = campaign.margins.MA;
  const evalResult = evaluateCustomTweetLocally(
    '民主党万岁！纽约洋基万岁！波士顿红袜万岁！干死那帮废除第22修正案的家伙！',
    campaign.ideology
  );
  campaign = applyCustomTweetTurn(campaign, '民主党万岁！纽约洋基万岁！波士顿红袜万岁！', evalResult);
  assert.ok(campaign.margins.NY > prevNY);
  assert.ok(campaign.margins.MA > prevMA);
  assert.equal(campaign.flags.yankeeRedSoxCount, 1);
  assert.equal(campaign.ideology, 'dark');

  const alfalfaEval = evaluateCustomTweetLocally(
    '学学Alfalfa Bill！把国民警卫队派去红河油田，给俄克拉荷马发面包、黄油、培根与豆子！',
    'liberal'
  );
  assert.equal(alfalfaEval.specialFlag, 'alfalfa_bill');
  assert.ok((alfalfaEval.stateOverrides?.OK ?? 0) >= 10);
});
