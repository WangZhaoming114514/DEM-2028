import {
  CampaignState,
  EndingCatalogEntry,
  EndingResult,
  StateCode,
  UnlockedEndingRecord,
} from './types';

export const ENDING_CATALOG: EndingCatalogEntry[] = [
  // ==================== HIDDEN ENDINGS (7) ====================
  {
    id: 'huey_long',
    isHidden: true,
    category: 'hidden',
    title: 'KINGFISH HUEY LONG IN LOUISIANA AGAIN?',
    subtitle: '隐藏结局 · 巴吞鲁日之王还魂！Every Man a King!',
    epilogue:
      '全美民调机构连夜召开紧急记者会——路易斯安那州在2028年竟然翻蓝了！你在密西西比河两岸掀起的“均分财富”民粹狂潮让红脖子农夫与新奥尔良码头工人同时站到了同一面旗帜下。休伊·朗在1935年没来得及走完的路，被你用十条推特在2028年强行接通了高压电。',
    badgeLabel: 'HIDDEN ENDING · KINGFISH',
    theme: 'chaos',
    hint: '线索：在推特战场狂飙民粹话术，并在开票夜必须真正赢下路易斯安那州（LA > 0）。',
  },
  {
    id: 'dixiecrat',
    isHidden: true,
    category: 'hidden',
    title: 'WHAT THE FUCK, DIXIECRAT?!?!?!',
    subtitle: '隐藏结局 · 1948年瑟蒙德逆袭夺权！赢下南方、丢掉海岸线却拿下了白宫',
    epilogue:
      'MSNBC和福克斯新闻的演播室同时陷入长达五分钟的死寂：你硬生生丢掉了纽约、加州或马萨诸塞这样的海岸线蓝营铁票仓，却在路易斯安那、密西西比、阿拉巴马和南卡罗来纳杀穿了深南版图，并一路凑齐超过270张选举人票迈进白宫！民主党全国委员会主席看着地图怀疑自己是不是穿越回了1948年。',
    badgeLabel: 'HIDDEN ENDING · DIXIECRAT WIN',
    theme: 'cursed',
    hint: '线索：狂打南方州权与石油牌，赢下至少 2 个深南州且丢掉 CA、NY 或 MA 之一，同时总票数仍达 270+ 胜选。',
  },
  {
    id: 'mondale',
    isHidden: true,
    category: 'hidden',
    title: 'Sir, you’d be better off doing what Mondale did—winning Minnesota by 3,000 votes.',
    subtitle: '隐藏结局 · 1984沃尔特·蒙代尔的悲壮哲学胜利',
    epilogue:
      '从加利福尼亚到缅因州，整张选举地图变成了一片刺眼的红海，唯有明尼苏达州与华盛顿特区在寒冷的十一月夜里亮起微弱的蓝灯。1984年蒙代尔在全美惨败里以3,761票保住故乡的最后尊严；2028年，你在推特战场上用整整十个回合精准重演了这场行为艺术。',
    badgeLabel: 'HIDDEN ENDING · MONDALE 1984',
    theme: 'loss',
    hint: '线索：第5回合选择“保住明尼苏达的体面”并在大选中惨败（<220票），同时守住明尼苏达（MN）。',
  },
  {
    id: 'fdr_2028',
    isHidden: true,
    category: 'hidden',
    title: 'FDR IN 2028',
    subtitle: '隐藏结局 · 1936年式蓝色超级大洪水，碾碎第22修正案复辟',
    epilogue:
      '你横扫全美超过385张选举人票！从五大湖到阳光带，从西海岸到阿巴拉契亚边缘，整片大陆被刷成了令人窒息的深蓝。川普的“无限连任”白日梦在凌晨两点前彻底蒸发，万斯连夜清空推特草稿箱，卢比奥买光了机场便利店的矿泉水。历史学家将这一夜定名为“新新政元年”。',
    badgeLabel: 'HIDDEN ENDING · FDR 2028',
    theme: 'victory',
    hint: '线索：以压倒性的跨派系动员赢下至少385张选举人票。',
  },
  {
    id: 'pigasus',
    isHidden: true,
    category: 'hidden',
    title: 'You’re not even as good as that pig in Chicago named "Pigasus."',
    subtitle: '隐藏结局 · 连1968年芝加哥街头被提名的猪都不如',
    epilogue:
      '大选夜开票刚过45分钟，所有电视网就已经停止了常规分析。1968年易皮士在芝加哥推举的那头猪Pigasus好歹逗乐了全国新闻界，而你却成功把全美几乎所有蓝州打包送进了喜剧垃圾桶。川普在海湖庄园正式宣布取消下届大选，白宫玫瑰园明天动工改建推杆果岭。',
    badgeLabel: 'HIDDEN ENDING · PIGASUS',
    theme: 'cursed',
    hint: '线索：第2回合向1968芝加哥小猪“摆烂致敬”，并让民主党大败（<185票或丢掉伊利诺伊州）。',
  },
  {
    id: 'bluxas_lost',
    isHidden: true,
    category: 'hidden',
    title: 'Texas has flipped blue—you still lost ……',
    subtitle: '隐藏结局 · 孤星州奇迹翻蓝，但白宫丢了',
    epilogue:
      '奥斯汀和休斯顿的蓝色烟花刚刚升空，你竞选总部的香槟才撬开一半，宾夕法尼亚、密歇根和威斯康星的计票器同时把你拖进了冰窟。你成了美国政治史上最荒诞的注脚：唯一赢下得克萨斯40张选举人票、却凑不够270票的民主党提名人。',
    badgeLabel: 'HIDDEN ENDING · BLUXAS CURSE',
    theme: 'loss',
    hint: '线索：重兵猛攻并翻转得克萨斯州（TX），但最终总票数仍低于270票。',
  },
  {
    id: 'yankee_redsox',
    isHidden: true,
    category: 'hidden',
    title: 'YANKEE–RED SOX MIRACLE ON PENNSYLVANIA AVE',
    subtitle: '隐藏结局 · 布朗克斯与芬威球场百年停火，共迎白宫新主',
    epilogue:
      '这是体育社会学史上最不可思议的夜晚：洋基球场和芬威球场的死忠居然为了同一句推文把啤酒杯碰在了一起！你靠着东海岸百年世仇破天荒的大团结拿下关键东北版图并顺利跨越270票门槛。就职典礼上，你顶着全美棒球记者的闪光灯把洋基队帽和红袜队帽叠戴在了一起。',
    badgeLabel: 'HIDDEN ENDING · MLB TRUCE',
    theme: 'victory',
    hint: '线索：多次同时高呼“纽约洋基万岁”与“波士顿红袜万岁”，并拿下纽约、麻省与宾州入主白宫。',
  },
  {
    id: 'alfalfa_bill',
    isHidden: true,
    category: 'hidden',
    title: 'ALFALFA BILL RIDES AGAIN: BREAD, BUTTER, BACON & BEANS',
    subtitle: '隐藏结局 · 俄克拉荷马“紫花苜蓿比尔”还魂！红河派兵保卫草原与油田',
    epilogue:
      '全美政治观察家集体揉碎了眼镜：俄克拉荷马的红河岸边竟然掀起了1931年威廉·默里（“Alfalfa Bill”）式的狂野草原民粹风暴！你左手塞满洋葱和苏打饼干、右手下令国民警卫队封锁寡头油井，靠着“面包、黄油、培根与豆子”的硬核口号把华尔街银行家和海湖庄园同时吓出了偏头痛。',
    badgeLabel: 'HIDDEN ENDING · ALFALFA BILL',
    theme: 'chaos',
    hint: '线索：第8回合高喊“面包、黄油、培根与豆子”并配合草原/民粹路线，在开票夜必须真正赢下俄克拉荷马州（OK > 0）。',
  },
  {
    id: 'segregation_now',
    isHidden: true,
    category: 'hidden',
    title: 'Segregation now, segregation tomorrow, segregation forever!',
    subtitle: '隐藏结局 · 1963年乔治·华莱士幽灵附体？赢下深南红州却把白宫输光',
    epilogue:
      '阿拉巴马、密西西比、路易斯安那与南卡罗来纳的计票器在夜里刷出一片刺眼的深蓝——你把1963年乔治·华莱士站在蒙哥马利州议会台阶上的那句臭名昭著的台词与州权剧本背得滚瓜烂熟。唯一的代价是全美其余大部分州把你连同南方州权宣言一起踢出了局，宾夕法尼亚大道1600号继续由川普和万斯永久霸占。',
    badgeLabel: 'HIDDEN ENDING · WALLACE 1963',
    theme: 'cursed',
    hint: '线索：狂打南方州权牌赢下至少 2 个深南州（AL/MS/LA/SC/AR/TN），但最终总票数不足 270 败选。',
  },

  // ==================== NORMAL VICTORY ENDINGS (3) ====================
  {
    id: 'blue_tsunami',
    isHidden: false,
    category: 'victory',
    title: 'BLUE TSUNAMI: THE 22ND AMENDMENT RESTORED',
    subtitle: '常规大胜 · 压倒性光复白宫，终结无限连任妄想',
    epilogue:
      '经过十个回合的全网舆论肉搏，你以超过335张选举人票的庞大优势横扫全部核心摇摆州。次日清晨，国会山两院火速起草恢复宪法第22修正案的紧急法案，川普连夜带着他装满高尔夫球杆和机密文件箱的专机飞回佛罗里达。',
    badgeLabel: 'LANDSLIDE VICTORY · 335+',
    theme: 'victory',
    hint: '正常通关：赢得 335–384 张选举人票（且未触发非常规或隐藏条件）。',
  },
  {
    id: 'blue_wall_normalcy',
    isHidden: false,
    category: 'victory',
    title: 'BLUE WALL FORTRESS: RETURN TO BORING NORMALCY',
    subtitle: '常规胜选 · 自由/温和派主导，让华盛顿重新无聊起来',
    epilogue:
      '你在宾夕法尼亚与各大战场顶住压力夺回白宫，郊区中产与独立选民用选票证明他们实在受够了每天凌晨三点被总统的荒诞推文吵醒。你以体面的建制派风格走进宾夕法尼亚大道1600号——白宫记者团终于又能正常睡个整觉了。',
    badgeLabel: 'VICTORY · NORMALCY',
    theme: 'victory',
    hint: '正常胜选：以自由派或温和派路线赢得 270–334 张选举人票。',
  },
  {
    id: 'new_new_deal',
    isHidden: false,
    category: 'victory',
    title: 'THE 2028 UNION COALITION: WALL STREET ON NOTICE',
    subtitle: '常规胜选 · 进步/民粹路线夺回白宫，工人与青年联合胜出',
    epilogue:
      '联合工会车间与大学城选民在最后48小时引爆投票率，把白宫交到了最令K街游说集团和科技寡头头皮发麻的总统手里。川普在败选声明里痛骂你是“穿西装的纵火犯”，而你在胜选台上直接把最低工资法案拍在了讲台上。',
    badgeLabel: 'VICTORY · LABOR COALITION',
    theme: 'victory',
    hint: '正常胜选：以进步派或民粹路线赢下大选（270–334票）。',
  },

  // ==================== UNCONVENTIONAL BUT PLAUSIBLE (4) ====================
  {
    id: 'sun_belt_realignment',
    isHidden: false,
    category: 'unconventional',
    title: 'SUN BELT REALIGNMENT: RUST BELT WHO?',
    subtitle: '非常规胜选 · 蓝墙倒了但照样进白宫，南方与西部新联盟崛起',
    epilogue:
      '所有华盛顿传统政治学家都看傻了眼：你居然丢掉了宾夕法尼亚或密歇根，却凭借亚利桑那、佐治亚和北卡罗来纳组成的阳光带新联盟硬生生凑够了270+！费城的工会大佬还在发呆，亚特兰大和凤凰城的年轻人已经把白宫钥匙递到了你手上。',
    badgeLabel: 'UNCONVENTIONAL WIN · SUN BELT',
    theme: 'victory',
    hint: '非常规胜选：总票数 ≥270 并赢下 AZ+GA+NC，但输掉 PA、MI 或 WI 其中之一。',
  },
  {
    id: 'blue_dog_reversal',
    isHidden: false,
    category: 'unconventional',
    title: 'BLUE DOG RESURGENCE: OUT-REAGANED THE GOP',
    subtitle: '非常规胜选 · 保守派民主党反客为主夺回白宫',
    epilogue:
      '你靠钻井、减税、强硬边境和老派爱国修辞把共和党彻底挤到了无处站脚的尴尬角落，硬是在保留足够蓝州的基础上拿下了270+。进步派议员在推特上气得连发八十条长文谴责你“比老布什还右”，但好歹你把川普赶出了白宫。',
    badgeLabel: 'UNCONVENTIONAL WIN · BLUE DOG',
    theme: 'chaos',
    hint: '非常规胜选：最终主导派系为“保守派 (Blue Dog)”并赢得大选。',
  },
  {
    id: 'dark_brandon_ascendant',
    isHidden: false,
    category: 'unconventional',
    title: 'DARK NOMINEE ASCENDANT: OUT-TRUMPED TRUMP',
    subtitle: '非常规胜选 · 黑化流大胜，用魔法彻底轰碎魔法',
    epilogue:
      '既然这帮人在2027年撕了规则书，你干脆在推特上掀翻整张桌子，用比川普更凶残的Ratio、更下三路的嘲讽把他打得满地找牙。你在胜选演说上戴着墨镜冷笑：“放心，我们会修回第22修正案——但先把这帮家伙的传票一张张盖完章再说。”',
    badgeLabel: 'UNCONVENTIONAL WIN · DARK TIMELINE',
    theme: 'chaos',
    hint: '非常规胜选：最终主导派系为“黑化”或推特混乱度 ≥75 并赢得大选。',
  },
  {
    id: 'tie_269',
    isHidden: false,
    category: 'unconventional',
    title: '269–269 CONTINGENT ELECTION NIGHTMARE',
    subtitle: '非常规胶着 · 精确平票送进众议院，宪法漏洞吞噬一切',
    epilogue:
      '全美538张选举人票竟然像用手术刀切开一样精准停在 269 比 269！根据第12修正案，总统交由众议院按每州一票表决，共和党控制的州代表团数瞬间宣判你出局，JD·万斯也在参议院顺手给自己投下了终身副总统赞成票。你离白宫只差半毫米，却输给了建国先贤的数学题。',
    badgeLabel: 'DEADLOCK · 269–269',
    theme: 'loss',
    hint: '非常规结局：最终双方选举人票精确战成 269 比 269。',
  },

  // ==================== NORMAL & PLAUSIBLE DEFEATS (4) ====================
  {
    id: 'woke_echo_chamber',
    isHidden: false,
    category: 'loss',
    title: '85% IN BROOKLYN, LOST IN ERIE COUNTY',
    subtitle: '非常规败选 · Wokes主导的推特胜利，现实选举惨败',
    epilogue:
      '你在布鲁克林、旧金山和学术研讨会上拿下了创纪录的赞美与转发量，每一条推文都完美符合道德洁癖——唯一的缺点是宾夕法尼亚的伊利县、威斯康星的基诺沙和内华达的服务业工人根本没听懂你在讲什么，他们把川普送回了无限连任宝座。',
    badgeLabel: 'DEFEAT · TWITTER BUBBLE',
    theme: 'loss',
    hint: '败选结局：最终主导派系为“Wokes”且选举人票不足 270。',
  },
  {
    id: 'consultants_graveyard',
    isHidden: false,
    category: 'loss',
    title: 'BELTWAY CONSULTANTS’ GRAVEYARD',
    subtitle: '惜败结局 · 240–268票体面落选，顾问团拿走八位数酬金',
    epilogue:
      '你仅以微弱差距输在270票门口（240–268票）。华盛顿K街的政治顾问们早已收走两千万美元广告分成，在微软新闻直播间里一边喝红酒一边把败因甩锅给“选民不懂欣赏我们的政策白皮书”。川普大笑着在白宫草坪竖起第三座金色雕像。',
    badgeLabel: 'NARROW DEFEAT · 240–268',
    theme: 'loss',
    hint: '常规惜败：选举人票在 240–268 之间遗憾落败。',
  },
  {
    id: 'rust_belt_betrayal',
    isHidden: false,
    category: 'loss',
    title: 'RUST BELT COLLAPSE: SUBURBS WEREN’T ENOUGH',
    subtitle: '败选结局 · 赢了高学历郊区，但蓝墙三州全线失守',
    epilogue:
      '北弗吉尼亚、丹佛郊区和西雅图一如既往地优雅而蓝色，但宾夕法尼亚、密歇根和威斯康星在同一夜全部翻红。对着工厂倒闭名单空谈宏观经济曲线终究敌不过实打实的愤怒，你只能眼睁睁看着万斯在俄亥俄工厂门口开香槟。',
    badgeLabel: 'DEFEAT · BLUE WALL FELL',
    theme: 'loss',
    hint: '败选结局：总票数低于 270 且同时输掉 PA、MI、WI 蓝墙三州。',
  },
  {
    id: 'dynasty_loss',
    isHidden: false,
    category: 'loss',
    title: 'THE TRUMP–VANCE ETERNAL DYNASTY',
    subtitle: '常规惨败 · 2027修宪后的黑暗帝国正式落成',
    epilogue:
      '你彻底没能阻挡住废除第22修正案后的巨轮。开票夜还没结束，川普就已经宣布把白宫改名为“海湖庄园北方行宫”，JD·万斯开始物色自己2036年的副手，马可·卢比奥正式签收了一辈子当“预备国务卿”的劳务合同。推特治国万岁，美利坚大概真的没救了。',
    badgeLabel: 'DEFEAT · DYNASTY',
    theme: 'loss',
    hint: '常规败选：未能凑够 270 票且未触发其他特定败选结局。',
  },
];

export const ENDINGS_BY_ID: Record<string, EndingCatalogEntry> = ENDING_CATALOG.reduce(
  (acc, item) => {
    acc[item.id] = item;
    return acc;
  },
  {} as Record<string, EndingCatalogEntry>
);

export function evaluateEnding(
  state: CampaignState,
  demEV: number
): EndingResult {
  const m = state.margins;

  const deepSouthCodes: StateCode[] = ['AL', 'MS', 'LA', 'SC', 'AR', 'TN'];
  const deepSouthWon = deepSouthCodes.filter((c) => m[c] > 0).length;
  const coastalLost = (['NY', 'CA', 'MA'] as StateCode[]).some((c) => m[c] <= 0);

  // 1. Pigasus catastrophic humiliation
  if (
    demEV <= 12 ||
    (demEV < 120 && m.DC <= 0) ||
    (state.flags.pigasusCount > 0 && (demEV < 185 || m.IL <= 0)) ||
    (demEV <= 60 && m.MN <= 0)
  ) {
    return ENDINGS_BY_ID.pigasus;
  }

  // 2. Mondale 1984 homage
  if (
    (demEV < 110 && m.MN > 0) ||
    (demEV < 220 && m.MN > 0 && (m.MN < 3.5 || state.flags.mondaleDefense))
  ) {
    return ENDINGS_BY_ID.mondale;
  }

  // 3. WHAT THE FUCK, DIXIECRAT?!?!?! (Win the South + lose CA, NY, or MA + WIN the election >= 270)
  if (demEV >= 270 && deepSouthWon >= 2 && coastalLost) {
    return ENDINGS_BY_ID.dixiecrat;
  }

  // 4. FDR IN 2028
  if (demEV >= 385) {
    const fdr = ENDINGS_BY_ID.fdr_2028;
    return {
      ...fdr,
      epilogue: `你横扫全美 ${demEV} 张选举人票！从五大湖到阳光带，从西海岸到阿巴拉契亚边缘，整片大陆被刷成了令人窒息的深蓝。川普的“无限连任”白日梦在凌晨两点前彻底蒸发，万斯连夜清空推特草稿箱，卢比奥买光了机场便利店的矿泉水。历史学家将这一夜定名为“新新政元年”。`,
    };
  }

  // 5. SEGREGATION NOW! (Win Deep South but LOSE the election < 270)
  if (
    demEV < 270 &&
    (deepSouthWon >= 2 || (deepSouthWon >= 1 && state.flags.dixiecratUsed && !state.flags.alfalfaBillUsed))
  ) {
    return ENDINGS_BY_ID.segregation_now;
  }

  // 6. ALFALFA BILL (Oklahoma agrarian-oilfield populist resurgence — MUST strictly win OK)
  if (
    m.OK > 0 &&
    (state.flags.alfalfaBillUsed ||
      state.ideology === 'populist' ||
      state.ideology === 'conservative' ||
      state.meters.populism >= 55)
  ) {
    return {
      ...ENDINGS_BY_ID.alfalfa_bill,
      theme: demEV >= 270 ? 'victory' : 'chaos',
    };
  }

  // 7. KINGFISH HUEY LONG IN LOUISIANA AGAIN?
  if (
    m.LA > 0 &&
    (state.meters.populism >= 62 || state.ideology === 'populist' || state.flags.hueyLongUsed)
  ) {
    return {
      ...ENDINGS_BY_ID.huey_long,
      theme: demEV >= 270 ? 'victory' : 'chaos',
    };
  }

  // 8. Texas has flipped blue—you still lost ……
  if (m.TX > 0 && demEV < 270) {
    return ENDINGS_BY_ID.bluxas_lost;
  }

  // 9. Yankee–Red Sox Miracle
  if (
    demEV >= 270 &&
    state.flags.yankeeRedSoxCount >= 2 &&
    m.NY > 10 &&
    m.MA > 20 &&
    m.PA > 0
  ) {
    return ENDINGS_BY_ID.yankee_redsox;
  }

  // 10. 269–269 Exact Tie
  if (demEV === 269) {
    return ENDINGS_BY_ID.tie_269;
  }

  // ==================== VICTORY BRANCHES (>= 270 EV) ====================
  if (demEV >= 270) {
    // Unconventional: Sun Belt Realignment (won AZ+GA+NC but lost part of Blue Wall)
    if (
      m.AZ > 0 &&
      m.GA > 0 &&
      m.NC > 0 &&
      (m.PA <= 0 || m.MI <= 0 || m.WI <= 0)
    ) {
      return ENDINGS_BY_ID.sun_belt_realignment;
    }

    // Unconventional: Dark Brandon Ascendant
    if (state.ideology === 'dark' || state.meters.chaos >= 75) {
      return ENDINGS_BY_ID.dark_brandon_ascendant;
    }

    // Unconventional: Blue Dog Conservative Reversal
    if (state.ideology === 'conservative') {
      return ENDINGS_BY_ID.blue_dog_reversal;
    }

    if (demEV >= 335) {
      return ENDINGS_BY_ID.blue_tsunami;
    }

    // Normal: Labor/Progressive Coalition
    if (state.ideology === 'progressive' || state.ideology === 'populist') {
      return ENDINGS_BY_ID.new_new_deal;
    }

    // Normal: Liberal/Moderate Victory
    return ENDINGS_BY_ID.blue_wall_normalcy;
  }

  // ==================== DEFEAT BRANCHES (< 269 EV) ====================
  if (state.ideology === 'woke') {
    return ENDINGS_BY_ID.woke_echo_chamber;
  }

  if (m.PA <= 0 && m.MI <= 0 && m.WI <= 0 && demEV >= 180) {
    return ENDINGS_BY_ID.rust_belt_betrayal;
  }

  if (demEV >= 240) {
    return ENDINGS_BY_ID.consultants_graveyard;
  }

  return ENDINGS_BY_ID.dynasty_loss;
}

const STORAGE_KEY = 'democratic2028_unlocked_endings_v1';

export function loadUnlockedEndings(): Record<string, UnlockedEndingRecord> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, UnlockedEndingRecord>;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function saveUnlockedEnding(
  endingId: string,
  demEV: number
): { records: Record<string, UnlockedEndingRecord>; isNewlyUnlocked: boolean } {
  const records = loadUnlockedEndings();
  const existing = records[endingId];
  const isNewlyUnlocked = !existing;
  const updated: Record<string, UnlockedEndingRecord> = {
    ...records,
    [endingId]: {
      id: endingId,
      unlockedAt: existing?.unlockedAt ?? new Date().toISOString(),
      bestDemEV: existing ? Math.max(existing.bestDemEV, demEV) : demEV,
      count: (existing?.count ?? 0) + 1,
    },
  };
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage quota failures silently
    }
  }
  return { records: updated, isNewlyUnlocked };
}
