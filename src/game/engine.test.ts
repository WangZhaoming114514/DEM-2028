import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyChoiceTurn,
  computeElectoralSummary,
  createInitialCampaign,
  resolveCampaignEnding,
  resolveCampaignEndings,
} from './engine';
import { ENDING_CATALOG, evaluateEnding, evaluateEndings } from './endings';
import { ROUND_SCENARIOS } from './scenarios';
import { STATES_DATA } from './statesData';
import { StateCode } from './types';

test('all 50 states + DC sum to exactly 538 electoral votes', () => {
  assert.equal(STATES_DATA.length, 51);
  const totalEV = STATES_DATA.reduce((sum, s) => sum + s.ev, 0);
  assert.equal(totalEV, 538);
});

test('ENDING_CATALOG contains 20 unique endings with newspaper metadata covering all categories', () => {
  assert.equal(ENDING_CATALOG.length, 20);
  const ids = new Set(ENDING_CATALOG.map((e) => e.id));
  assert.equal(ids.size, 20);
  assert.equal(ENDING_CATALOG.filter((e) => e.category === 'hidden').length, 9);
  assert.equal(ENDING_CATALOG.filter((e) => e.category === 'victory').length, 3);
  assert.equal(ENDING_CATALOG.filter((e) => e.category === 'unconventional').length, 4);
  assert.equal(ENDING_CATALOG.filter((e) => e.category === 'loss').length, 4);
  for (const entry of ENDING_CATALOG) {
    assert.ok(entry.newspaper.name.length > 0, `Missing newspaper name for ${entry.id}`);
    assert.ok(entry.newspaper.location.length > 0, `Missing newspaper location for ${entry.id}`);
    assert.ok(entry.newspaper.editionTag.length > 0, `Missing editionTag for ${entry.id}`);
  }
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
  // 1. KINGFISH HUEY LONG IN LOUISIANA AGAIN? (Must strictly win LA > 0)
  const hueyFail = createInitialCampaign();
  hueyFail.ideology = 'populist';
  hueyFail.margins.LA = -0.5;
  hueyFail.meters.populism = 85;
  hueyFail.flags.hueyLongUsed = true;
  hueyFail.finished = true;
  assert.notEqual(evaluateEnding(hueyFail, 285).id, 'huey_long');

  const huey = createInitialCampaign();
  huey.ideology = 'populist';
  huey.margins.LA = 2.4;
  huey.meters.populism = 85;
  huey.flags.hueyLongUsed = true;
  huey.finished = true;
  assert.equal(resolveCampaignEnding(huey).id, 'huey_long');

  // 2. WHAT THE FUCK, DIXIECRAT?!?!?! (Win Deep South + lose CA, NY, or MA + WIN election >= 270)
  const dixie = createInitialCampaign();
  for (const k of Object.keys(dixie.margins) as StateCode[]) {
    dixie.margins[k] = 4.0;
  }
  dixie.margins.OK = -10;
  dixie.ideology = 'conservative';
  dixie.flags.dixiecratUsed = true;
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

  // 4. FDR IN 2028 (strictly >= 415 EV; blind choice-0 spam hits 406 EV and must NOT trigger FDR)
  const fdr = createInitialCampaign();
  for (const k of Object.keys(fdr.margins) as StateCode[]) {
    fdr.margins[k] = 15;
  }
  fdr.finished = true;
  assert.equal(resolveCampaignEnding(fdr).id, 'fdr_2028');
  assert.notEqual(evaluateEnding(fdr, 406).id, 'fdr_2028');

  let blindSpamRun = createInitialCampaign();
  for (let r = 0; r < 10; r++) {
    blindSpamRun = applyChoiceTurn(blindSpamRun, ROUND_SCENARIOS[r].choices[0]);
  }
  assert.equal(computeElectoralSummary(blindSpamRun.margins).demEV, 406);
  assert.notEqual(resolveCampaignEnding(blindSpamRun).id, 'fdr_2028');

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

  // 7. Yankee-Red Sox Miracle (Win NY & MA + win presidency >= 270, while LOSING PA < 0 and IL < 0)
  const yankeeNeedPenalty = createInitialCampaign();
  yankeeNeedPenalty.flags.yankeeRedSoxCount = 2;
  yankeeNeedPenalty.margins.NY = 18;
  yankeeNeedPenalty.margins.MA = 28;
  yankeeNeedPenalty.margins.PA = 3.5;
  yankeeNeedPenalty.margins.IL = 4.0;
  assert.notEqual(evaluateEnding(yankeeNeedPenalty, 285).id, 'yankee_redsox');

  const yankee = createInitialCampaign();
  yankee.flags.yankeeRedSoxCount = 2;
  yankee.margins.NY = 18;
  yankee.margins.MA = 28;
  yankee.margins.PA = -2.5;
  yankee.margins.IL = -0.8;
  yankee.finished = true;
  assert.equal(evaluateEnding(yankee, 285).id, 'yankee_redsox');

  // 8. Alfalfa Bill (Must strictly win OK > 0, verified via unit check + 10-round preset path)
  const alfalfaFail = createInitialCampaign();
  alfalfaFail.flags.alfalfaBillUsed = true;
  alfalfaFail.margins.OK = -1.5;
  alfalfaFail.finished = true;
  assert.notEqual(evaluateEnding(alfalfaFail, 280).id, 'alfalfa_bill');

  const alfalfa = createInitialCampaign();
  alfalfa.flags.alfalfaBillUsed = true;
  alfalfa.margins.OK = 1.8;
  alfalfa.finished = true;
  assert.equal(evaluateEnding(alfalfa, 280).id, 'alfalfa_bill');

  let alfalfaRun = createInitialCampaign();
  const choiceIdxPath = [1, 0, 2, 1, 0, 2, 1, 2, 0, 0]; // r1_populist + r3_huey + r6_dixie_oil + r8_southern_flip
  for (let r = 0; r < 10; r++) {
    alfalfaRun = applyChoiceTurn(alfalfaRun, ROUND_SCENARIOS[r].choices[choiceIdxPath[r]]);
  }
  assert.equal(alfalfaRun.flags.alfalfaBillUsed, true);
  assert.ok(alfalfaRun.margins.OK > 0, `Expected OK > 0 on alfalfaRun, got ${alfalfaRun.margins.OK}`);
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

  // Segregation Now! (MUST win Alabama AL > 0 and lose < 269 EV)
  const segFailNoAL = createInitialCampaign();
  for (const k of Object.keys(segFailNoAL.margins) as StateCode[]) {
    segFailNoAL.margins[k] = -12;
  }
  segFailNoAL.margins.DC = 50;
  segFailNoAL.margins.CA = 15;
  segFailNoAL.margins.LA = 4.0;
  segFailNoAL.margins.MS = 3.5;
  segFailNoAL.margins.SC = 2.5;
  segFailNoAL.margins.AL = -1.2;
  assert.notEqual(resolveCampaignEnding(segFailNoAL).id, 'segregation_now');

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
  assert.ok(computeElectoralSummary(segNow.margins).demEV < 269);
  const segRes = resolveCampaignEnding(segNow);
  assert.equal(segRes.id, 'segregation_now');
  assert.equal(segRes.isHidden, true);
  assert.equal(segRes.category, 'hidden');
  assert.equal(segRes.title, 'Segregation now, segregation tomorrow, segregation forever!');

  // Full 10-round Segregation Now! preset path MUST flip Alabama AL > 0
  let segRun = createInitialCampaign();
  const segPath = [3, 0, 3, 3, 2, 2, 0, 3, 3, 3];
  for (let r = 0; r < 10; r++) {
    segRun = applyChoiceTurn(segRun, ROUND_SCENARIOS[r].choices[segPath[r]]);
  }
  assert.ok(segRun.margins.AL > 0, `Expected AL > 0 on segRun, got ${segRun.margins.AL}`);
  assert.ok(computeElectoralSummary(segRun.margins).demEV < 269);
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

test('preset choices support multiple SpecialFlag[] entries', () => {
  // r10_baseball_chaos carries yankee_redsox + dark_brandon
  let presetMulti = createInitialCampaign();
  presetMulti = applyChoiceTurn(presetMulti, ROUND_SCENARIOS[9].choices[2]);
  assert.equal(presetMulti.flags.yankeeRedSoxCount, 1);
  assert.equal(presetMulti.flags.darkBrandonCount, 1);

  // r9_dixie_last carries dixiecrat + huey_long
  let dixieMulti = createInitialCampaign();
  dixieMulti = applyChoiceTurn(dixieMulti, ROUND_SCENARIOS[8].choices[3]);
  assert.equal(dixieMulti.flags.dixiecratUsed, true);
  assert.equal(dixieMulti.flags.hueyLongUsed, true);
});

test('multi-ending resolution unlocks concurrent endings without masking specific achievements', () => {
  // Specific Yankee-Red Sox + broad FDR 2028 (>=415) should keep Yankee-Red Sox as primary AND co-unlock fdr_2028
  const combo = createInitialCampaign();
  combo.flags.yankeeRedSoxCount = 2;
  combo.margins.NY = 18;
  combo.margins.MA = 25;
  combo.margins.PA = -1.5;
  combo.margins.IL = -0.8;
  const comboRes = evaluateEndings(combo, 420);
  assert.equal(comboRes.primary.id, 'yankee_redsox');
  assert.ok(comboRes.allTriggered.some((e) => e.id === 'yankee_redsox'));
  assert.ok(comboRes.allTriggered.some((e) => e.id === 'fdr_2028'));

  // Dual Oklahoma + Louisiana multi-flag run returns BOTH alfalfa_bill and huey_long
  const dualSouth = createInitialCampaign();
  dualSouth.flags.alfalfaBillUsed = true;
  dualSouth.flags.hueyLongUsed = true;
  dualSouth.margins.OK = 3.2;
  dualSouth.margins.LA = 2.5;
  const dualRes = resolveCampaignEndings(dualSouth);
  assert.equal(dualRes.primary.id, 'alfalfa_bill');
  assert.ok(dualRes.allTriggered.some((e) => e.id === 'alfalfa_bill'));
  assert.ok(dualRes.allTriggered.some((e) => e.id === 'huey_long'));
});

test('Pigasus never triggers on victories or 269 ties, and 269-269 tie always keeps primary priority', () => {
  // Real 10-round path picking r2_pigasus and losing IL while still winning 281 EV MUST NOT trigger Pigasus
  let pigWinRun = createInitialCampaign();
  const pigWinPath = [0, 3, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let r = 0; r < 10; r++) {
    pigWinRun = applyChoiceTurn(pigWinRun, ROUND_SCENARIOS[r].choices[pigWinPath[r]]);
  }
  const pigWinSummary = computeElectoralSummary(pigWinRun.margins);
  assert.equal(pigWinRun.flags.pigasusCount, 1);
  assert.ok(pigWinRun.margins.IL < 0, `Expected IL < 0, got ${pigWinRun.margins.IL}`);
  assert.ok(pigWinSummary.demEV >= 270, `Expected >= 270 EV, got ${pigWinSummary.demEV}`);
  const pigWinRes = resolveCampaignEndings(pigWinRun);
  assert.ok(!pigWinRes.allTriggered.some((e) => e.id === 'pigasus'));

  // Synthetic 269-269 tie even with OK/LA/TX/AL/IL conditions: tie_269 MUST remain primary, and outright-defeat endings MUST NOT fire
  const tieChaos = createInitialCampaign();
  tieChaos.flags.alfalfaBillUsed = true;
  tieChaos.flags.hueyLongUsed = true;
  tieChaos.flags.dixiecratUsed = true;
  tieChaos.flags.pigasusCount = 1;
  tieChaos.margins.OK = 4.0;
  tieChaos.margins.LA = 5.0;
  tieChaos.margins.TX = 3.0;
  tieChaos.margins.AL = 2.0;
  tieChaos.margins.IL = -4.0;
  const tieRes = evaluateEndings(tieChaos, 269);
  assert.equal(tieRes.primary.id, 'tie_269');
  assert.ok(!tieRes.allTriggered.some((e) => e.id === 'pigasus'));
  assert.ok(!tieRes.allTriggered.some((e) => e.id === 'bluxas_lost'));
  assert.ok(!tieRes.allTriggered.some((e) => e.id === 'segregation_now'));
  assert.ok(tieRes.allTriggered.some((e) => e.id === 'alfalfa_bill'));
  assert.ok(tieRes.allTriggered.some((e) => e.id === 'huey_long'));

  // Special ending priority: Dixiecrat & Segregation Now & Yankee-Red Sox outrank incidental Huey Long while co-unlocking it
  const dixieVsHuey = createInitialCampaign();
  dixieVsHuey.flags.dixiecratUsed = true;
  dixieVsHuey.flags.hueyLongUsed = true;
  dixieVsHuey.ideology = 'conservative';
  dixieVsHuey.margins.AL = 2.0;
  dixieVsHuey.margins.LA = 12.0;
  dixieVsHuey.margins.NY = -5.0;
  const dixiePriority = evaluateEndings(dixieVsHuey, 290);
  assert.equal(dixiePriority.primary.id, 'dixiecrat');
  assert.ok(dixiePriority.allTriggered.some((e) => e.id === 'huey_long'));

  const segVsHuey = createInitialCampaign();
  segVsHuey.flags.dixiecratUsed = true;
  segVsHuey.flags.hueyLongUsed = true;
  segVsHuey.margins.AL = 2.5;
  segVsHuey.margins.LA = 14.0;
  const segPriority = evaluateEndings(segVsHuey, 250);
  assert.equal(segPriority.primary.id, 'segregation_now');
  assert.ok(segPriority.allTriggered.some((e) => e.id === 'huey_long'));

  const yanksVsHuey = createInitialCampaign();
  yanksVsHuey.flags.yankeeRedSoxCount = 2;
  yanksVsHuey.flags.hueyLongUsed = true;
  yanksVsHuey.ideology = 'populist';
  yanksVsHuey.margins.NY = 20;
  yanksVsHuey.margins.MA = 28;
  yanksVsHuey.margins.PA = -2.2;
  yanksVsHuey.margins.IL = -1.4;
  yanksVsHuey.margins.LA = 12;
  const yanksPriority = evaluateEndings(yanksVsHuey, 310);
  assert.equal(yanksPriority.primary.id, 'yankee_redsox');
  assert.ok(yanksPriority.allTriggered.some((e) => e.id === 'huey_long'));
});

test('all 20 endings in ENDING_CATALOG are genuinely achievable via real 10-round preset paths', () => {
  const REAL_10_ROUND_PATHS: Record<string, number[]> = {
    huey_long: [0, 0, 0, 0, 0, 0, 0, 0, 3, 3],
    dixiecrat: [0, 0, 0, 0, 0, 2, 0, 1, 3, 0],
    mondale: [0, 0, 0, 0, 0, 3, 2, 3, 0, 3],
    fdr_2028: [3, 0, 0, 0, 0, 1, 0, 0, 3, 1],
    pigasus: [0, 3, 0, 0, 0, 0, 0, 3, 3, 0],
    bluxas_lost: [0, 0, 0, 0, 0, 0, 0, 3, 2, 3],
    yankee_redsox: [0, 0, 0, 0, 0, 0, 0, 3, 1, 2],
    alfalfa_bill: [0, 0, 2, 0, 0, 2, 1, 2, 0, 0],
    segregation_now: [3, 0, 1, 3, 3, 2, 1, 3, 3, 0],
    blue_tsunami: [0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
    blue_wall_normalcy: [0, 0, 0, 0, 0, 0, 1, 3, 1, 3],
    new_new_deal: [0, 0, 0, 0, 0, 0, 0, 3, 0, 0],
    sun_belt_realignment: [0, 0, 0, 0, 0, 0, 0, 1, 1, 3],
    blue_dog_reversal: [0, 0, 0, 0, 0, 1, 1, 2, 3, 3],
    dark_brandon_ascendant: [0, 0, 0, 0, 0, 0, 0, 0, 2, 3],
    tie_269: [0, 0, 0, 1, 0, 1, 0, 1, 3, 3],
    woke_echo_chamber: [0, 0, 0, 1, 0, 3, 1, 3, 0, 3],
    consultants_graveyard: [0, 0, 0, 0, 0, 0, 0, 3, 2, 2],
    rust_belt_betrayal: [0, 0, 0, 0, 0, 3, 0, 0, 2, 3],
    dynasty_loss: [0, 0, 0, 0, 0, 3, 2, 3, 3, 2],
  };

  assert.equal(Object.keys(REAL_10_ROUND_PATHS).length, ENDING_CATALOG.length);

  for (const entry of ENDING_CATALOG) {
    const path = REAL_10_ROUND_PATHS[entry.id];
    assert.ok(path && path.length === 10, `Missing 10-round path for ${entry.id}`);
    let run = createInitialCampaign();
    for (let r = 0; r < 10; r++) {
      run = applyChoiceTurn(run, ROUND_SCENARIOS[r].choices[path[r]]);
    }
    assert.equal(run.finished, true);
    const res = resolveCampaignEndings(run);
    assert.equal(
      res.primary.id,
      entry.id,
      `Expected path [${path.join(',')}] to resolve primary ending '${entry.id}', got '${res.primary.id}' (EV=${computeElectoralSummary(run.margins).demEV})`
    );
  }
});
