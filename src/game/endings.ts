import {
  CampaignState,
  EndingCatalogEntry,
  EndingResult,
  StateCode,
  UnlockedEndingRecord,
} from './types';

export const ENDING_CATALOG: EndingCatalogEntry[] = [
  // ==================== HIDDEN ENDINGS (9) ====================
  {
    id: 'huey_long',
    isHidden: true,
    category: 'hidden',
    title: 'KINGFISH HUEY LONG IN LOUISIANA AGAIN?',
    subtitle: '隐藏结局 · 巴吞鲁日之王还魂！Every Man a King—Every Voter a Shareholder!',
    epilogue:
      '新奥尔良法国区半夜响起了铜管乐队，民调公司连夜把模型扔进了密西西比河——路易斯安那州在2028年居然翻蓝了！你用十条推特打通了油田钻井工与码头工人的任督二脉，把华尔街高管的年终奖拆成全民分红支票甩在桌上。休伊·朗1935年在州议会走廊里没走完的那一步，被你在键盘上直接拉满了两万伏电压。',
    badgeLabel: 'HIDDEN ENDING · KINGFISH',
    theme: 'chaos',
    hint: '线索：在推特战场狂飙民粹话术，并在开票夜必须真正赢下路易斯安那州（LA ≥ 0）。',
    newspaper: {
      name: 'The Times-Picayune',
      motto: 'NEW ORLEANS’ VOICE OF THE BAYOU SINCE 1837',
      location: 'NEW ORLEANS, LA',
      editionTag: 'LOUISIANA EXTRA · EVERY MAN A KING',
      mastheadFont: 'blackletter',
    },
  },
  {
    id: 'dixiecrat',
    isHidden: true,
    category: 'hidden',
    title: 'WHAT THE FUCK, DIXIECRAT?!?!?!',
    subtitle: '隐藏结局 · 1948年瑟蒙德反向夺舍！丢掉纽约加州却靠深南拿下了白宫',
    epilogue:
      'MSNBC和福克斯新闻的演播室同时死机五分钟，主播对着蓝色阿拉巴马与红色纽约揉了八遍隐形眼镜：你居然在海岸线铁票仓里精准翻车，转头却用南方州权和石油红利把路易斯安那、密西西比、阿拉巴马和南卡刷得比民主党老家还蓝，硬生生凑够270+张选举人票撞开白宫大门！民主党全国委员会连夜翻出1948年党章确认自己没报错名。',
    badgeLabel: 'HIDDEN ENDING · DIXIECRAT WIN',
    theme: 'cursed',
    hint: '线索：狂打南方州权与石油牌，赢下至少 2 个深南州且丢掉 CA、NY 或 MA 之一，同时总票数仍达 270+ 胜选。',
    newspaper: {
      name: 'The State',
      motto: 'SOUTH CAROLINA’S PAPER OF RECORD SINCE 1891',
      location: 'COLUMBIA, SC',
      editionTag: 'SPECIAL SOUTHERN RECKONING EDITION',
      mastheadFont: 'serif',
    },
  },
  {
    id: 'mondale',
    isHidden: true,
    category: 'hidden',
    title: 'Sir, you’d be better off doing what Mondale did—winning Minnesota by 3,000 votes.',
    subtitle: '隐藏结局 · 1984沃尔特·蒙代尔的行为艺术级惨败',
    epilogue:
      '除了明尼阿波利斯街头几块倔强的蓝色草坪牌和华盛顿特区的公务员，整张美国地图在晚上九点半就变成了红得发亮的共和党烤肉派对。当年蒙代尔全国惨败49州、靠着3,761票守住故乡尊严；2028年你把整套竞选预算精准烧成了一份只讨好双子城选民的艺术品，连川普的胜选派对都腾出三分钟为你鼓掌致敬。',
    badgeLabel: 'HIDDEN ENDING · MONDALE 1984',
    theme: 'loss',
    hint: '线索：第5回合选择“保住明尼苏达的体面”并在大选中惨败（<220票），同时守住明尼苏达（MN）。',
    newspaper: {
      name: 'Star Tribune',
      motto: 'MINNESOTA’S OWN MORNING DISPATCH',
      location: 'MINNEAPOLIS, MN',
      editionTag: 'NORTH STAR SOLE SURVIVOR EDITION',
      mastheadFont: 'serif',
    },
  },
  {
    id: 'fdr_2028',
    isHidden: true,
    category: 'hidden',
    title: 'FDR IN 2028',
    subtitle: '隐藏结局 · 1936年式415+蓝色超级洪水，把第22修正案复辟梦焊进水泥',
    epilogue:
      '全美选举人票定格在惊世骇俗的415+！从伊利湖钢铁厂到亚利桑那仙人掌带，连深红州郡县都冒出蓝色惊叹号。凌晨两点，川普的“无限连任”金箔皇冠在电视直播里当场化灰，JD·万斯连夜把推特账号改成私人摄影博客，马可·卢比奥一口气拧空了两箱机场矿泉水并递交了退休申请。',
    badgeLabel: 'HIDDEN ENDING · FDR 2028',
    theme: 'victory',
    hint: '线索：不再允许无脑单点通关！必须精算十回合跨派系组合，赢下至少 415 张选举人票。',
    newspaper: {
      name: 'The Washington Post',
      motto: 'DEMOCRACY DIES IN DARKNESS — AND LIVES BY 415+ EV',
      location: 'WASHINGTON, D.C.',
      editionTag: 'LANDSLIDE EXTRA · HISTORIC MANDATE',
      mastheadFont: 'blackletter',
    },
  },
  {
    id: 'pigasus',
    isHidden: true,
    category: 'hidden',
    title: 'You’re not even as good as that pig in Chicago named "Pigasus."',
    subtitle: '隐藏结局 · 1968年芝加哥被提名的猪看了你的战绩都得连夜买站票跑路',
    epilogue:
      '开票才刚过四十分钟，CNN的电子地图就已经无聊到开始播天气预报。1968年易皮士在芝加哥格兰特公园提名那头重145磅的公猪Pigasus竞选总统时，至少还逗笑了半个美国新闻界；而你用十回合亲手把全美蓝州打包送进了喜马拉雅山级的笑话堆。川普明天早上就把白宫新闻简报室改建成高尔夫模拟器。',
    badgeLabel: 'HIDDEN ENDING · PIGASUS',
    theme: 'cursed',
    hint: '线索：第2回合向1968芝加哥小猪“摆烂致敬”并在大选中溃败（<185票，或<215票且丢掉伊利诺伊州）；或在未守住明尼苏达时总票数跌至80票以下。',
    newspaper: {
      name: 'Chicago Tribune',
      motto: 'THE WORLD’S GREATEST NEWSPAPER SINCE 1847',
      location: 'CHICAGO, IL',
      editionTag: 'GRANT PARK COMEDY FINAL',
      mastheadFont: 'blackletter',
    },
  },
  {
    id: 'bluxas_lost',
    isHidden: true,
    category: 'hidden',
    title: 'Texas has flipped blue—you still lost ……',
    subtitle: '隐藏结局 · 赢了得克萨斯40张票，却把整个白宫输给了物理法则',
    epilogue:
      '奥斯汀和休斯顿的蓝色烟花刚刚照亮夜空，竞选团队香槟才撬开第一瓶软木塞，密歇根、宾州和威斯康星的计票器就在五分钟内把你一脚踹进了下水道。政治学教科书为这一夜专门单开了一章：史上唯一一个把“不可能的得克萨斯”染蓝、却凑不够270张选举人票回华盛顿打包搬家的天才。',
    badgeLabel: 'HIDDEN ENDING · BLUXAS CURSE',
    theme: 'loss',
    hint: '线索：重兵猛攻并翻转得克萨斯州（TX），但最终总票数仍低于 270 票。',
    newspaper: {
      name: 'The Dallas Morning News',
      motto: 'LONE STAR STATE INDEPENDENT PRESS',
      location: 'DALLAS, TX',
      editionTag: 'TEXAS MORNING MIRACLE & HEARTBREAK',
      mastheadFont: 'blackletter',
    },
  },
  {
    id: 'yankee_redsox',
    isHidden: true,
    category: 'hidden',
    title: 'YANKEE–RED SOX MIRACLE ON PENNSYLVANIA AVE',
    subtitle: '隐藏结局 · 洋基与红袜百年停火赢下白宫，代价是费城人与芝加哥白袜联合掀桌',
    epilogue:
      '体育社会学当场宣布破产：布朗克斯的条纹衫死忠和芬威球场的绿怪物信徒居然为了你的推文勾肩搭背拼完了一箱啤酒，纽约州与麻萨诸塞州把你一路抬进270+白宫宝座！唯一的副作用是费城人和芝加哥白袜球迷当场连夜把宾夕法尼亚和伊利诺伊全票投给了对手——他们宁可看万斯演讲也不愿给戴着洋基红袜双拼鸭舌帽的人投票。',
    badgeLabel: 'HIDDEN ENDING · MLB TRUCE',
    theme: 'victory',
    hint: '线索：多次同时高呼“纽约洋基与波士顿红袜万岁”，赢下纽约（NY ≥ 0）与麻州（MA ≥ 0）并胜选（≥270），同时因惹毛费城人与白袜球迷而丢掉宾州（PA < 0）和伊利诺伊（IL < 0）。',
    newspaper: {
      name: 'The Boston Globe',
      motto: 'NEW ENGLAND’S VOICE SINCE 1872',
      location: 'BOSTON, MA',
      editionTag: 'FENWAY–BRONX DETENTE SPECIAL',
      mastheadFont: 'blackletter',
    },
  },
  {
    id: 'alfalfa_bill',
    isHidden: true,
    category: 'hidden',
    title: 'ALFALFA BILL RIDES AGAIN: BREAD, BUTTER, BACON & BEANS',
    subtitle: '隐藏结局 · “紫花苜蓿比尔”红河拔枪！靠生洋葱与国民警卫队拿下俄克拉荷马',
    epilogue:
      'DC政治评论员集体咬断了钢笔：1931年俄克拉荷马那位揣着生洋葱和苏打饼干、动不动派国民警卫队封锁油井和跨河大桥的传奇州长威廉·默里（“Alfalfa Bill”）居然借你的身体还魂了！全美77个县除了牧场就是油井的俄克拉荷马被你刷成深蓝，华尔街高管和海湖庄园连夜翻百科全书查“面包、黄油、培根与豆子”到底是哪套宏观经济模型。',
    badgeLabel: 'HIDDEN ENDING · ALFALFA BILL',
    theme: 'chaos',
    hint: '线索：第8回合高喊“面包、黄油、培根与豆子”并走草原民粹路线，在开票夜必须真正赢下俄克拉荷马州（OK ≥ 0）。',
    newspaper: {
      name: 'The Oklahoman',
      motto: 'HEARTLAND DISPATCH SINCE 1889',
      location: 'OKLAHOMA CITY, OK',
      editionTag: 'RED RIVER POPULIST UPRISING',
      mastheadFont: 'serif',
    },
  },
  {
    id: 'segregation_now',
    isHidden: true,
    category: 'hidden',
    title: 'Segregation now, segregation tomorrow, segregation forever!',
    subtitle: '隐藏结局 · 1963年乔治·华莱士幽灵夺舍！拿下阿拉巴马却把白宫输了个精光',
    epilogue:
      '蒙哥马利州议会台阶上的幽灵半夜掀开棺材板对你比了个大拇指——阿拉巴马、密西西比和南卡的计票屏一夜刷蓝，仿佛1963年重装上线。代价也十分公平：全美其余三十几个州连同你的道德名声一起把你踢出了白宫大门。川普在海湖庄园开怀大笑，顺手给你颁了一枚“荣誉南方州长”塑料奖章。',
    badgeLabel: 'HIDDEN ENDING · WALLACE 1963',
    theme: 'cursed',
    hint: '线索：狂打南方州权牌并必须真正赢下阿拉巴马州（AL ≥ 0）等深南阵地，但最终总票数不足 269 败选。',
    newspaper: {
      name: 'The Montgomery Advertiser',
      motto: 'ALABAMA’S CAPITAL CHRONICLE SINCE 1829',
      location: 'MONTGOMERY, AL',
      editionTag: 'DIXIE TIMEWARP EDITION',
      mastheadFont: 'serif',
    },
  },

  // ==================== NORMAL VICTORY ENDINGS (3) ====================
  {
    id: 'blue_tsunami',
    isHidden: false,
    category: 'victory',
    title: 'BLUE TSUNAMI: THE 22ND AMENDMENT RESTORED',
    subtitle: '常规大胜 · 蓝色海啸席卷摇摆州，川普“第三任期”打包进碎纸机',
    epilogue:
      '经过十个回合的全网嘴炮肉搏，你以335–414张选举人票横扫核心战场。清晨六点，参众两院火速起草重新锁死第22修正案的紧急宪法条文；川普在海湖庄园专机舷梯上对着镜头大喊“选票被外星人调包了”，但行李箱里早已悄悄塞好了十二根镀金高尔夫球杆。',
    badgeLabel: 'LANDSLIDE VICTORY · 335+',
    theme: 'victory',
    hint: '正常通关：赢得 335–414 张选举人票（且未触发非常规或隐藏条件）。',
    newspaper: {
      name: 'The New York Times',
      motto: 'ALL THE NEWS THAT’S FIT TO PRINT',
      location: 'NEW YORK, NY',
      editionTag: 'LATE CITY EDITION · BLUE WAVE',
      mastheadFont: 'blackletter',
    },
  },
  {
    id: 'blue_wall_normalcy',
    isHidden: false,
    category: 'victory',
    title: 'BLUE WALL FORTRESS: RETURN TO BORING NORMALCY',
    subtitle: '常规胜选 · 中产郊区赢回白宫，让华盛顿新闻终于又能催眠了',
    epilogue:
      '你在宾夕法尼亚、密歇根和威斯康星顶住最后压力守住蓝墙。全美郊区选民用选票传达了一个再朴素不过的愿望：他们真的受够了每天凌晨三点被全大写字母的总统推文吵醒。你拎着公文包安静走进白宫东翼，白宫记者团当晚集体睡了十年以来最香的一觉。',
    badgeLabel: 'VICTORY · NORMALCY',
    theme: 'victory',
    hint: '正常胜选：以自由派或温和派路线赢得 270–334 张选举人票。',
    newspaper: {
      name: 'The Washington Post',
      motto: 'DEMOCRACY DIES IN DARKNESS',
      location: 'WASHINGTON, D.C.',
      editionTag: 'FINAL EDITION · RETURN TO NORMALCY',
      mastheadFont: 'blackletter',
    },
  },
  {
    id: 'new_new_deal',
    isHidden: false,
    category: 'victory',
    title: 'THE 2028 UNION COALITION: WALL STREET ON NOTICE',
    subtitle: '常规胜选 · 蓝领工会与大学城联手翻盘，K街游说大楼连夜熄灯逃跑',
    epilogue:
      '全美汽车工人联合会与大学城投票站在最后48小时刷爆排队长度，把白宫钥匙交到了最令对冲基金经理胃痛的总统手里。川普在败选文稿里怒骂你是“打着蓝领旗号的马克思”，而你在胜选台上直接把工会卡和反垄断传票一并拍在了讲台上。',
    badgeLabel: 'VICTORY · LABOR COALITION',
    theme: 'victory',
    hint: '正常胜选：以进步派或民粹路线赢下大选（270–334票）。',
    newspaper: {
      name: 'Detroit Free Press',
      motto: 'ON GUARD FOR MICHIGAN SINCE 1831',
      location: 'DETROIT, MI',
      editionTag: 'GREAT LAKES UNION VICTORY EXTRA',
      mastheadFont: 'blackletter',
    },
  },

  // ==================== UNCONVENTIONAL BUT PLAUSIBLE (4) ====================
  {
    id: 'sun_belt_realignment',
    isHidden: false,
    category: 'unconventional',
    title: 'SUN BELT REALIGNMENT: RUST BELT WHO?',
    subtitle: '非常规胜选 · 蓝墙漏水没关系，阳光带三州抬着你侧门进白宫',
    epilogue:
      '华盛顿老派铁锈带专家的眼镜片碎了一地：你居然把宾州或密歇根拱手让出，转头凭着亚利桑那、佐治亚和北卡的阳光带新联盟硬生生凑够270+！费城的工会主席还在电话里叹气，亚特兰大和凤凰城的年轻选民已经把椭圆形办公室的新密码发进了你的手机。',
    badgeLabel: 'UNCONVENTIONAL WIN · SUN BELT',
    theme: 'victory',
    hint: '非常规胜选：总票数 ≥270 并赢下 AZ+GA+NC，但输掉 PA、MI 或 WI 其中之一。',
    newspaper: {
      name: 'The Atlanta Journal-Constitution',
      motto: 'COVERS DIXIE LIKE THE DEW',
      location: 'ATLANTA, GA',
      editionTag: 'NEW SOUTH SUN BELT EXTRA',
      mastheadFont: 'serif',
    },
  },
  {
    id: 'blue_dog_reversal',
    isHidden: false,
    category: 'unconventional',
    title: 'BLUE DOG RESURGENCE: OUT-REAGANED THE GOP',
    subtitle: '非常规胜选 · 蓝狗保守派反客为主，比里根还硬核地抢走了共和党生意',
    epilogue:
      '减税、打井、硬核边境加上复古爱国演讲——你把共和党的看家本领全盘抄走还打了个八折，硬是在没丢掉大盘蓝州的前提下拿下了270+！参议院进步派连发九十条推文控诉你“比老布什还右”，万斯站在舞台边缘彻底找不到自己该站哪一边。',
    badgeLabel: 'UNCONVENTIONAL WIN · BLUE DOG',
    theme: 'chaos',
    hint: '非常规胜选：最终主导派系为“保守派 (Blue Dog)”并赢得大选。',
    newspaper: {
      name: 'The Wall Street Journal',
      motto: 'THE GLOBAL BUSINESS & POLICY DAILY',
      location: 'NEW YORK, NY',
      editionTag: 'MARKETS & CAPITAL SPECIAL',
      mastheadFont: 'serif',
    },
  },
  {
    id: 'dark_brandon_ascendant',
    isHidden: false,
    category: 'unconventional',
    title: 'DARK NOMINEE ASCENDANT: OUT-TRUMPED TRUMP',
    subtitle: '非常规胜选 · 彻底黑化发疯！用魔法泥石流把魔法本人拍在沙滩上',
    epilogue:
      '既然对面在2027年率先撕毁规矩书，你干脆在推特上戴上激光墨镜掀翻整张辩论桌，靠更毒舌的Ratio和更狂野的直播梗把川普本人打成“温良恭俭让老绅士”。你在胜选演讲最后冷笑一声：“放心，第22修正案会修回来——等我先把传票和热搜全盖完章。”',
    badgeLabel: 'UNCONVENTIONAL WIN · DARK TIMELINE',
    theme: 'chaos',
    hint: '非常规胜选：最终主导派系为“黑化”或推特混乱度 ≥75 并赢得大选。',
    newspaper: {
      name: 'New York Post',
      motto: 'FOUNDED 1801 BY ALEXANDER HAMILTON',
      location: 'NEW YORK, NY',
      editionTag: 'ALL-CAPS TABLOID CHAOS EDITION',
      mastheadFont: 'condensed',
    },
  },
  {
    id: 'tie_269',
    isHidden: false,
    category: 'unconventional',
    title: '269–269 CONTINGENT ELECTION NIGHTMARE',
    subtitle: '非常规胶着 · 精确打成269平手，宪法第12修正案把白宫直接送给众议院共和党',
    epilogue:
      '538张选举人票像被瑞士军刀劈成两半，精确停在269比269！最高法院大法官集体加班泡咖啡，众议院按“一州一票”规则举手投票，26个红州代表团一秒宣判你出局；JD·万斯在参议院顺手给自己投了副总统赞成票。你赢了普选，却输给了两百四十年前的一道小学算术规则。',
    badgeLabel: 'DEADLOCK · 269–269',
    theme: 'loss',
    hint: '非常规结局：最终双方选举人票精确战成 269 比 269。',
    newspaper: {
      name: 'The Washington Post',
      motto: 'DEMOCRACY DIES IN DARKNESS',
      location: 'WASHINGTON, D.C.',
      editionTag: 'CONSTITUTIONAL DEADLOCK EXTRA',
      mastheadFont: 'blackletter',
    },
  },

  // ==================== NORMAL & PLAUSIBLE DEFEATS (4) ====================
  {
    id: 'woke_echo_chamber',
    isHidden: false,
    category: 'loss',
    title: '85% IN BROOKLYN, LOST IN ERIE COUNTY',
    subtitle: '非常规败选 · 推特学术圈赢麻了，铁锈带夜班工人全投了对面',
    epilogue:
      '你在布鲁克林咖啡馆、斯坦福研讨会和蓝V转发榜上斩获了满分口碑，每一条推文都滴水不漏、绝不冒犯任何群体——唯一的小瑕疵是宾州伊利县和威斯康星机床厂的选民连词典都没翻开就勾了对面。恭喜，你赢得了诺贝尔键盘正确奖，川普赢得了白宫。',
    badgeLabel: 'DEFEAT · TWITTER BUBBLE',
    theme: 'loss',
    hint: '败选结局：最终主导派系为“Wokes”且选举人票不足 270。',
    newspaper: {
      name: 'The New York Times',
      motto: 'ALL THE NEWS THAT’S FIT TO PRINT',
      location: 'NEW YORK, NY',
      editionTag: 'OPINION & METROPOLITAN POSTMORTEM',
      mastheadFont: 'blackletter',
    },
  },
  {
    id: 'consultants_graveyard',
    isHidden: false,
    category: 'loss',
    title: 'BELTWAY CONSULTANTS’ GRAVEYARD',
    subtitle: '惜败结局 · 240–268票体面回家，华盛顿顾问团照样笑纳两千万美金支票',
    epilogue:
      '你只差临门一脚就能跨过270票门槛，但在几个摇摆县精准掉进了零点几个百分点的冰窟里。真正赢麻的是华盛顿K街的顶级政治顾问——他们刚把八位数广告回扣存进信托基金，就顺手在MSNBC直播里叹着气把锅甩给了“草根选民不懂欣赏理性政策图表”。',
    badgeLabel: 'NARROW DEFEAT · 240–268',
    theme: 'loss',
    hint: '常规惜败：选举人票在 240–268 之间遗憾落败。',
    newspaper: {
      name: 'POLITICO',
      motto: 'THE BELTWAY INSIDER PLAYBOOK',
      location: 'ARLINGTON, VA',
      editionTag: 'MORNING CONSULTING POSTMORTEM',
      mastheadFont: 'condensed',
    },
  },
  {
    id: 'rust_belt_betrayal',
    isHidden: false,
    category: 'loss',
    title: 'RUST BELT COLLAPSE: SUBURBS WEREN’T ENOUGH',
    subtitle: '败选结局 · 赢了整条精英郊区带，却眼睁睁看着PA/MI/WI蓝墙三连塌',
    epilogue:
      '北弗吉尼亚的高学历妈妈团与丹佛IT白领全票把你送进热搜榜首，但宾夕法尼亚、密歇根和威斯康星在同一小时集体翻红。拿着一份PPT图表向失业钢铁镇解释“宏观通胀曲线其实正在好转”，最终换来了万斯在俄亥俄街头开着啤酒卡车全城巡游。',
    badgeLabel: 'DEFEAT · BLUE WALL FELL',
    theme: 'loss',
    hint: '败选结局：总票数低于 270 且同时输掉 PA、MI、WI 蓝墙三州。',
    newspaper: {
      name: 'The Philadelphia Inquirer',
      motto: 'INDEPENDENT VOICE OF PENNSYLVANIA SINCE 1829',
      location: 'PHILADELPHIA, PA',
      editionTag: 'KEYSTONE BLUE WALL COLLAPSE',
      mastheadFont: 'blackletter',
    },
  },
  {
    id: 'dynasty_loss',
    isHidden: false,
    category: 'loss',
    title: 'THE TRUMP–VANCE ETERNAL DYNASTY',
    subtitle: '常规惨败 · 2027修宪王朝正式登基，海湖庄园变成新首都',
    epilogue:
      '第22修正案彻底躺进了国家档案馆地下室的碎纸篓里。开票夜还没到十一点，川普就宣布把白宫南草坪改名为“海湖庄园北方高尔夫行宫”，JD·万斯忙着挑2036年接班人，马可·卢比奥面带微笑签下了一份终身无限续杯矿泉水的《预备国务卿卖身契》。',
    badgeLabel: 'DEFEAT · DYNASTY',
    theme: 'loss',
    hint: '常规败选：未能凑够 270 票且未触发其他特定败选结局。',
    newspaper: {
      name: 'USA TODAY',
      motto: 'THE NATION’S BREAKFAST-TABLE PAPER',
      location: 'MCLEAN, VA',
      editionTag: 'ELECTION SPECIAL · DYNASTY DAWN',
      mastheadFont: 'condensed',
    },
  },
];

export const ENDINGS_BY_ID: Record<string, EndingCatalogEntry> = ENDING_CATALOG.reduce(
  (acc, item) => {
    acc[item.id] = item;
    return acc;
  },
  {} as Record<string, EndingCatalogEntry>
);

export interface MultiEndingResolution {
  primary: EndingResult;
  allTriggered: EndingResult[];
}

interface ScoredEnding {
  ending: EndingResult;
  specificity: number;
}

export function evaluateEndings(
  state: CampaignState,
  demEV: number
): MultiEndingResolution {
  const m = state.margins;

  const deepSouthCodes: StateCode[] = ['AL', 'MS', 'LA', 'SC', 'AR', 'TN'];
  const deepSouthWon = deepSouthCodes.filter((c) => m[c] >= 0).length;
  const coastalLost = (['NY', 'CA', 'MA'] as StateCode[]).some((c) => m[c] < 0);

  const candidates: ScoredEnding[] = [];

  // 1. 269–269 Exact Tie (Constitutional Contingent Election — always highest primary priority)
  if (demEV === 269) {
    candidates.push({
      ending: ENDINGS_BY_ID.tie_269,
      specificity: 150,
    });
  }

  // 2. ALFALFA BILL (MUST strictly win Oklahoma OK >= 0)
  if (
    m.OK >= 0 &&
    (state.flags.alfalfaBillUsed ||
      state.ideology === 'populist' ||
      state.ideology === 'conservative' ||
      state.meters.populism >= 55)
  ) {
    candidates.push({
      ending: {
        ...ENDINGS_BY_ID.alfalfa_bill,
        theme: demEV >= 270 ? 'victory' : 'chaos',
      },
      specificity:
        96 +
        (state.flags.alfalfaBillUsed ? 24 : 0) +
        Math.min(8, Math.max(0, m.OK)),
    });
  }

  // 3. WHAT THE FUCK, DIXIECRAT?!?!?! (Win Deep South + lose CA, NY, or MA + WIN >= 270)
  if (demEV >= 270 && deepSouthWon >= 2 && coastalLost) {
    candidates.push({
      ending: ENDINGS_BY_ID.dixiecrat,
      specificity:
        102 + (state.flags.dixiecratUsed ? 16 : 0) + (m.AL >= 0 ? 4 : 0),
    });
  }

  // 4. Segregation now, segregation tomorrow, segregation forever! (Win AL >= 0 + outright defeat < 269)
  if (
    demEV < 269 &&
    m.AL >= 0 &&
    (deepSouthWon >= 2 || state.flags.dixiecratUsed)
  ) {
    candidates.push({
      ending: ENDINGS_BY_ID.segregation_now,
      specificity:
        102 +
        (state.flags.dixiecratUsed ? 16 : 0) +
        Math.min(8, Math.max(0, m.AL)),
    });
  }

  // 5. Yankee–Red Sox Miracle (>= 270 EV + 2 MLB flags + NY>=0 & MA>=0 + lose PA<0 & IL<0 to Phillies/White Sox)
  if (
    demEV >= 270 &&
    state.flags.yankeeRedSoxCount >= 2 &&
    m.NY >= 0 &&
    m.MA >= 0 &&
    m.PA < 0 &&
    m.IL < 0
  ) {
    candidates.push({
      ending: ENDINGS_BY_ID.yankee_redsox,
      specificity: 104 + Math.min(10, state.flags.yankeeRedSoxCount * 3),
    });
  }

  // 6. Mondale 1984 homage (outright defeat < 269 + holds MN)
  if (
    demEV < 269 &&
    m.MN >= 0 &&
    (demEV < 110 || (demEV < 220 && (m.MN < 3.5 || state.flags.mondaleDefense)))
  ) {
    candidates.push({
      ending: ENDINGS_BY_ID.mondale,
      specificity:
        86 + (state.flags.mondaleDefense ? 24 : 0) + (demEV < 110 ? 12 : 0),
    });
  }

  // 7. Pigasus catastrophic humiliation (MUST lose < 269 EV — never triggers on victory or 269 tie)
  if (
    demEV < 269 &&
    (demEV <= 12 ||
      (demEV < 120 && m.DC < 0) ||
      (demEV <= 80 && m.MN < 0) ||
      (state.flags.pigasusCount > 0 &&
        (demEV < 185 || (demEV < 215 && m.IL < 0))))
  ) {
    candidates.push({
      ending: ENDINGS_BY_ID.pigasus,
      specificity:
        78 +
        (state.flags.pigasusCount > 0 ? 20 : 0) +
        (demEV < 140 ? 14 : 0) +
        (demEV <= 60 ? 10 : 0),
    });
  }

  // 8. KINGFISH HUEY LONG IN LOUISIANA AGAIN? (MUST strictly win Louisiana LA >= 0)
  if (
    m.LA >= 0 &&
    (state.meters.populism >= 62 ||
      state.ideology === 'populist' ||
      state.flags.hueyLongUsed)
  ) {
    candidates.push({
      ending: {
        ...ENDINGS_BY_ID.huey_long,
        theme: demEV >= 270 ? 'victory' : 'chaos',
      },
      specificity:
        80 +
        (state.flags.hueyLongUsed ? 10 : 0) +
        (state.ideology === 'populist' ? 6 : 0) +
        Math.min(5, Math.max(0, m.LA)),
    });
  }

  // 9. Texas has flipped blue—you still lost …… (< 269 EV)
  if (m.TX >= 0 && demEV < 269) {
    candidates.push({
      ending: ENDINGS_BY_ID.bluxas_lost,
      specificity: 78 + Math.min(8, Math.max(0, m.TX)),
    });
  }

  // 10. FDR IN 2028 (strictly raised to >= 415 EV — impossible via blind Option 1 spam)
  if (demEV >= 415) {
    const fdr = ENDINGS_BY_ID.fdr_2028;
    candidates.push({
      ending: {
        ...fdr,
        epilogue: `全美选举人票定格在惊世骇俗的 ${demEV} 张！从伊利湖钢铁厂到亚利桑那仙人掌带，连深红州郡县都冒出蓝色惊叹号。凌晨两点，川普的“无限连任”金箔皇冠在电视直播里当场化灰，JD·万斯连夜把推特账号改成私人摄影博客，马可·卢比奥一口气拧空了两箱机场矿泉水并递交了退休申请。`,
      },
      specificity: 60 + (demEV >= 425 ? 15 : 0),
    });
  }

  if (candidates.length > 0) {
    candidates.sort((a, b) => b.specificity - a.specificity);
    const allTriggered = candidates.map((c) => c.ending);
    return {
      primary: allTriggered[0],
      allTriggered,
    };
  }

  // ==================== VICTORY BRANCHES (>= 270 EV) ====================
  if (demEV >= 270) {
    let primary: EndingResult;
    if (
      m.AZ >= 0 &&
      m.GA >= 0 &&
      m.NC >= 0 &&
      (m.PA < 0 || m.MI < 0 || m.WI < 0)
    ) {
      primary = ENDINGS_BY_ID.sun_belt_realignment;
    } else if (state.ideology === 'dark' || state.meters.chaos >= 75) {
      primary = ENDINGS_BY_ID.dark_brandon_ascendant;
    } else if (state.ideology === 'conservative') {
      primary = ENDINGS_BY_ID.blue_dog_reversal;
    } else if (demEV >= 335) {
      primary = ENDINGS_BY_ID.blue_tsunami;
    } else if (state.ideology === 'progressive' || state.ideology === 'populist') {
      primary = ENDINGS_BY_ID.new_new_deal;
    } else {
      primary = ENDINGS_BY_ID.blue_wall_normalcy;
    }
    return { primary, allTriggered: [primary] };
  }

  // ==================== DEFEAT BRANCHES (< 269 EV) ====================
  let primary: EndingResult;
  if (state.ideology === 'woke') {
    primary = ENDINGS_BY_ID.woke_echo_chamber;
  } else if (m.PA < 0 && m.MI < 0 && m.WI < 0 && demEV >= 180) {
    primary = ENDINGS_BY_ID.rust_belt_betrayal;
  } else if (demEV >= 240) {
    primary = ENDINGS_BY_ID.consultants_graveyard;
  } else {
    primary = ENDINGS_BY_ID.dynasty_loss;
  }
  return { primary, allTriggered: [primary] };
}

export function evaluateEnding(
  state: CampaignState,
  demEV: number
): EndingResult {
  return evaluateEndings(state, demEV).primary;
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

export function saveUnlockedEndings(
  endingIds: string[],
  demEV: number
): { records: Record<string, UnlockedEndingRecord>; newlyUnlockedIds: string[] } {
  const records = loadUnlockedEndings();
  const updated: Record<string, UnlockedEndingRecord> = { ...records };
  const newlyUnlockedIds: string[] = [];
  const now = new Date().toISOString();

  for (const endingId of endingIds) {
    const existing = updated[endingId];
    if (!existing) {
      newlyUnlockedIds.push(endingId);
    }
    updated[endingId] = {
      id: endingId,
      unlockedAt: existing?.unlockedAt ?? now,
      bestDemEV: existing ? Math.max(existing.bestDemEV, demEV) : demEV,
      count: (existing?.count ?? 0) + 1,
    };
  }

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage quota failures silently
    }
  }
  return { records: updated, newlyUnlockedIds };
}

export function saveUnlockedEnding(
  endingId: string,
  demEV: number
): { records: Record<string, UnlockedEndingRecord>; isNewlyUnlocked: boolean } {
  const res = saveUnlockedEndings([endingId], demEV);
  return {
    records: res.records,
    isNewlyUnlocked: res.newlyUnlockedIds.includes(endingId),
  };
}
