import { StateCode, StateDefinition } from './types';

/**
 * All 50 US states + DC with 2024/2028 Electoral Votes (sum = 538),
 * FIPS codes matching us-atlas/states-albers-10m.json, realistic baseline
 * partisan lean (2024 baseline + slight 2027 22nd-Amendment repeal backlash),
 * and demographic sensitivity vectors.
 */
export const STATES_DATA: StateDefinition[] = [
  {
    code: 'AL', fips: '01', name: 'Alabama', nameZh: '阿拉巴马', ev: 9, region: 'deepsouth',
    baselineMargin: -29.5,
    weights: { workingClass: 0.2, suburban: 0.1, progressiveYouth: 0.1, sunBeltDiverse: 0.4, southernPopulist: 1.4, moderateHeartland: 0.1 },
    note: '深红南方腹地，除非你上演1948年式Dixiecrat或休伊·朗式民粹奇迹。',
  },
  {
    code: 'AK', fips: '02', name: 'Alaska', nameZh: '阿拉斯加', ev: 3, region: 'mountain',
    baselineMargin: -8.6,
    weights: { workingClass: 0.5, suburban: 0.3, progressiveYouth: 0.2, sunBeltDiverse: 0.1, southernPopulist: 0.6, moderateHeartland: 0.8 },
    note: '独立选民比例极高，对资源与反建制民粹敏感。',
  },
  {
    code: 'AZ', fips: '04', name: 'Arizona', nameZh: '亚利桑那', ev: 11, region: 'sunbelt',
    baselineMargin: -4.1,
    weights: { workingClass: 0.3, suburban: 1.1, progressiveYouth: 0.6, sunBeltDiverse: 1.3, southernPopulist: 0.2, moderateHeartland: 0.7 },
    note: '阳光带关键摇摆州，马里科帕郊区与拉丁裔选民决定胜负。',
  },
  {
    code: 'AR', fips: '05', name: 'Arkansas', nameZh: '阿肯色', ev: 6, region: 'deepsouth',
    baselineMargin: -29.8,
    weights: { workingClass: 0.3, suburban: 0.1, progressiveYouth: 0.1, sunBeltDiverse: 0.2, southernPopulist: 1.3, moderateHeartland: 0.2 },
    note: '克林顿老家早已深红，但南方民粹煽动仍能制造戏剧效果。',
  },
  {
    code: 'CA', fips: '06', name: 'California', nameZh: '加利福尼亚', ev: 54, region: 'westcoast',
    baselineMargin: 20.5,
    weights: { workingClass: 0.3, suburban: 0.7, progressiveYouth: 1.4, sunBeltDiverse: 1.0, southernPopulist: -0.4, moderateHeartland: 0.3 },
    note: '54张选举人票的蓝营核武库，但若太右倾或Dixiecrat会掉基本盘。',
  },
  {
    code: 'CO', fips: '08', name: 'Colorado', nameZh: '科罗拉多', ev: 10, region: 'mountain',
    baselineMargin: 11.2,
    weights: { workingClass: 0.3, suburban: 1.1, progressiveYouth: 1.1, sunBeltDiverse: 0.6, southernPopulist: -0.2, moderateHeartland: 0.7 },
    note: '高学历郊区与进步青年稳固的蓝色高地。',
  },
  {
    code: 'CT', fips: '09', name: 'Connecticut', nameZh: '康涅狄格', ev: 7, region: 'northeast',
    baselineMargin: 14.5,
    weights: { workingClass: 0.4, suburban: 1.0, progressiveYouth: 0.9, sunBeltDiverse: 0.3, southernPopulist: -0.3, moderateHeartland: 0.5 },
    note: '洋基与红袜球迷在费尔菲尔德和哈特福德交锋的前线州。',
  },
  {
    code: 'DE', fips: '10', name: 'Delaware', nameZh: '特拉华', ev: 3, region: 'northeast',
    baselineMargin: 15.2,
    weights: { workingClass: 0.4, suburban: 0.9, progressiveYouth: 0.7, sunBeltDiverse: 0.4, southernPopulist: -0.2, moderateHeartland: 0.6 },
    note: '老拜登后院，建制与温和派的舒适区。',
  },
  {
    code: 'DC', fips: '11', name: 'District of Columbia', nameZh: '华盛顿特区', ev: 3, region: 'northeast',
    baselineMargin: 84.0,
    weights: { workingClass: 0.2, suburban: 0.5, progressiveYouth: 1.2, sunBeltDiverse: 0.6, southernPopulist: -0.5, moderateHeartland: 0.3 },
    note: '宾夕法尼亚大道1600号所在地；连这都输了不如芝加哥小猪。',
  },
  {
    code: 'FL', fips: '12', name: 'Florida', nameZh: '佛罗里达', ev: 30, region: 'sunbelt',
    baselineMargin: -6.0,
    weights: { workingClass: 0.4, suburban: 0.8, progressiveYouth: 0.4, sunBeltDiverse: 1.1, southernPopulist: 0.6, moderateHeartland: 0.6 },
    note: '卢比奥老家！狂飙至30张票，狠捶卢比奥可触发额外波动。',
  },
  {
    code: 'GA', fips: '13', name: 'Georgia', nameZh: '佐治亚', ev: 16, region: 'sunbelt',
    baselineMargin: -1.7,
    weights: { workingClass: 0.3, suburban: 1.1, progressiveYouth: 0.8, sunBeltDiverse: 1.4, southernPopulist: 0.5, moderateHeartland: 0.4 },
    note: '亚特兰大郊区与非裔选民引擎，最核心的新南方摇摆州。',
  },
  {
    code: 'HI', fips: '15', name: 'Hawaii', nameZh: '夏威夷', ev: 4, region: 'westcoast',
    baselineMargin: 23.0,
    weights: { workingClass: 0.5, suburban: 0.5, progressiveYouth: 1.1, sunBeltDiverse: 0.8, southernPopulist: -0.3, moderateHeartland: 0.3 },
    note: '太平洋蓝营堡垒。',
  },
  {
    code: 'ID', fips: '16', name: 'Idaho', nameZh: '爱达荷', ev: 4, region: 'mountain',
    baselineMargin: -35.5,
    weights: { workingClass: 0.3, suburban: 0.2, progressiveYouth: 0.1, sunBeltDiverse: 0.1, southernPopulist: 0.7, moderateHeartland: 0.4 },
    note: '极深红山地州。',
  },
  {
    code: 'IL', fips: '17', name: 'Illinois', nameZh: '伊利诺伊', ev: 19, region: 'rustbelt',
    baselineMargin: 11.4,
    weights: { workingClass: 0.8, suburban: 0.8, progressiveYouth: 1.1, sunBeltDiverse: 0.5, southernPopulist: -0.2, moderateHeartland: 0.5 },
    note: '芝加哥（以及1968年街头小猪Pigasus）所在地，不可大意。',
  },
  {
    code: 'IN', fips: '18', name: 'Indiana', nameZh: '印第安纳', ev: 11, region: 'rustbelt',
    baselineMargin: -17.5,
    weights: { workingClass: 0.9, suburban: 0.4, progressiveYouth: 0.3, sunBeltDiverse: 0.2, southernPopulist: 0.8, moderateHeartland: 0.5 },
    note: '铁锈带偏红邻居，工人民粹若爆棚仍可大幅缩水。',
  },
  {
    code: 'IA', fips: '19', name: 'Iowa', nameZh: '艾奥瓦', ev: 6, region: 'heartland',
    baselineMargin: -7.8,
    weights: { workingClass: 1.1, suburban: 0.4, progressiveYouth: 0.3, sunBeltDiverse: 0.1, southernPopulist: 0.5, moderateHeartland: 1.1 },
    note: '玉米地民粹温度计，农业与制造业口水战必争之地。',
  },
  {
    code: 'KS', fips: '20', name: 'Kansas', nameZh: '堪萨斯', ev: 6, region: 'heartland',
    baselineMargin: -15.5,
    weights: { workingClass: 0.4, suburban: 0.8, progressiveYouth: 0.3, sunBeltDiverse: 0.2, southernPopulist: 0.6, moderateHeartland: 0.9 },
    note: '堪萨斯城郊区温和化明显，但农村依然很红。',
  },
  {
    code: 'KY', fips: '21', name: 'Kentucky', nameZh: '肯塔基', ev: 8, region: 'deepsouth',
    baselineMargin: -29.0,
    weights: { workingClass: 0.6, suburban: 0.2, progressiveYouth: 0.1, sunBeltDiverse: 0.1, southernPopulist: 1.2, moderateHeartland: 0.3 },
    note: '阿巴拉契亚与蓝草州，除非极端经济民粹否则难撼动。',
  },
  {
    code: 'LA', fips: '22', name: 'Louisiana', nameZh: '路易斯安那', ev: 8, region: 'deepsouth',
    baselineMargin: -20.8,
    weights: { workingClass: 0.5, suburban: 0.2, progressiveYouth: 0.2, sunBeltDiverse: 0.6, southernPopulist: 1.6, moderateHeartland: 0.1 },
    note: 'Kingfish 休伊·朗的精神故乡！极致民粹能掀起百年难遇的奇迹。',
  },
  {
    code: 'ME', fips: '23', name: 'Maine', nameZh: '缅因', ev: 4, region: 'northeast',
    baselineMargin: 4.2,
    weights: { workingClass: 0.8, suburban: 0.6, progressiveYouth: 0.6, sunBeltDiverse: 0.1, southernPopulist: 0.2, moderateHeartland: 1.0 },
    note: '红袜后院之一，工人与独立选民决定能否守住4票。',
  },
  {
    code: 'MD', fips: '24', name: 'Maryland', nameZh: '马里兰', ev: 10, region: 'northeast',
    baselineMargin: 28.5,
    weights: { workingClass: 0.4, suburban: 0.9, progressiveYouth: 1.0, sunBeltDiverse: 0.7, southernPopulist: -0.3, moderateHeartland: 0.4 },
    note: '华盛顿郊区与巴尔的摩基本盘铁仓。',
  },
  {
    code: 'MA', fips: '25', name: 'Massachusetts', nameZh: '马萨诸塞', ev: 11, region: 'northeast',
    baselineMargin: 25.0,
    weights: { workingClass: 0.4, suburban: 0.9, progressiveYouth: 1.4, sunBeltDiverse: 0.4, southernPopulist: -0.5, moderateHeartland: 0.4 },
    note: '波士顿红袜大本营！喊“波士顿红袜万岁”可引爆芬威球场欢呼。',
  },
  {
    code: 'MI', fips: '26', name: 'Michigan', nameZh: '密歇根', ev: 15, region: 'rustbelt',
    baselineMargin: -0.6,
    weights: { workingClass: 1.4, suburban: 0.8, progressiveYouth: 0.9, sunBeltDiverse: 0.4, southernPopulist: 0.2, moderateHeartland: 0.7 },
    note: '蓝墙核心！底特律汽车工人、郊区女性与大学城三线拉锯。',
  },
  {
    code: 'MN', fips: '27', name: 'Minnesota', nameZh: '明尼苏达', ev: 10, region: 'heartland',
    baselineMargin: 1.4,
    weights: { workingClass: 0.9, suburban: 0.8, progressiveYouth: 0.9, sunBeltDiverse: 0.3, southernPopulist: 0.1, moderateHeartland: 1.2 },
    note: '蒙代尔1984年最后的尊严防线——千万别只赢这里三千票。',
  },
  {
    code: 'MS', fips: '28', name: 'Mississippi', nameZh: '密西西比', ev: 6, region: 'deepsouth',
    baselineMargin: -21.5,
    weights: { workingClass: 0.3, suburban: 0.1, progressiveYouth: 0.1, sunBeltDiverse: 0.7, southernPopulist: 1.4, moderateHeartland: 0.1 },
    note: '深南关键红州之一，若翻蓝通常意味着某种诡异的时空错乱。',
  },
  {
    code: 'MO', fips: '29', name: 'Missouri', nameZh: '密苏里', ev: 10, region: 'heartland',
    baselineMargin: -17.8,
    weights: { workingClass: 0.7, suburban: 0.4, progressiveYouth: 0.3, sunBeltDiverse: 0.3, southernPopulist: 0.9, moderateHeartland: 0.6 },
    note: '曾经的摇摆风向标，如今需要重火力民粹才能拉近。',
  },
  {
    code: 'MT', fips: '30', name: 'Montana', nameZh: '蒙大拿', ev: 4, region: 'mountain',
    baselineMargin: -19.5,
    weights: { workingClass: 0.6, suburban: 0.3, progressiveYouth: 0.2, sunBeltDiverse: 0.1, southernPopulist: 0.7, moderateHeartland: 0.9 },
    note: '西部自由意志主义与农牧民粹并存。',
  },
  {
    code: 'NE', fips: '31', name: 'Nebraska', nameZh: '内布拉斯加', ev: 5, region: 'heartland',
    baselineMargin: -19.8,
    weights: { workingClass: 0.5, suburban: 0.5, progressiveYouth: 0.2, sunBeltDiverse: 0.1, southernPopulist: 0.6, moderateHeartland: 0.9 },
    note: '全州偏红但奥马哈蓝点一直咬得很紧。',
  },
  {
    code: 'NV', fips: '32', name: 'Nevada', nameZh: '内华达', ev: 6, region: 'sunbelt',
    baselineMargin: -2.4,
    weights: { workingClass: 1.0, suburban: 0.6, progressiveYouth: 0.6, sunBeltDiverse: 1.3, southernPopulist: 0.2, moderateHeartland: 0.5 },
    note: '拉斯维加斯服务业工会与拉丁裔选民决定这6张关键票。',
  },
  {
    code: 'NH', fips: '33', name: 'New Hampshire', nameZh: '新罕布什尔', ev: 4, region: 'northeast',
    baselineMargin: 0.6,
    weights: { workingClass: 0.7, suburban: 0.9, progressiveYouth: 0.5, sunBeltDiverse: 0.1, southernPopulist: 0.1, moderateHeartland: 1.2 },
    note: '新英格兰独立选民堡垒，对温和与常识路线极其买账。',
  },
  {
    code: 'NJ', fips: '34', name: 'New Jersey', nameZh: '新泽西', ev: 14, region: 'northeast',
    baselineMargin: 3.8,
    weights: { workingClass: 0.7, suburban: 1.1, progressiveYouth: 0.8, sunBeltDiverse: 0.8, southernPopulist: -0.2, moderateHeartland: 0.5 },
    note: '2024年意外收窄的东海岸郊区州，万斯经常在这挑事。',
  },
  {
    code: 'NM', fips: '35', name: 'New Mexico', nameZh: '新墨西哥', ev: 5, region: 'sunbelt',
    baselineMargin: 3.1,
    weights: { workingClass: 0.5, suburban: 0.6, progressiveYouth: 0.7, sunBeltDiverse: 1.2, southernPopulist: 0.1, moderateHeartland: 0.6 },
    note: '阳光带少数族裔与油气/环保平衡州。',
  },
  {
    code: 'NY', fips: '36', name: 'New York', nameZh: '纽约', ev: 28, region: 'northeast',
    baselineMargin: 13.0,
    weights: { workingClass: 0.6, suburban: 0.9, progressiveYouth: 1.3, sunBeltDiverse: 0.8, southernPopulist: -0.5, moderateHeartland: 0.4 },
    note: '纽约洋基万岁！布朗克斯与曼哈顿的媒体舆论主场。',
  },
  {
    code: 'NC', fips: '37', name: 'North Carolina', nameZh: '北卡罗来纳', ev: 16, region: 'sunbelt',
    baselineMargin: -3.2,
    weights: { workingClass: 0.4, suburban: 1.1, progressiveYouth: 0.8, sunBeltDiverse: 1.1, southernPopulist: 0.5, moderateHeartland: 0.6 },
    note: '研究三角区狂涨，永远差一口气的16票大摇摆州。',
  },
  {
    code: 'ND', fips: '38', name: 'North Dakota', nameZh: '北达科他', ev: 3, region: 'heartland',
    baselineMargin: -35.0,
    weights: { workingClass: 0.5, suburban: 0.1, progressiveYouth: 0.1, sunBeltDiverse: 0.1, southernPopulist: 0.7, moderateHeartland: 0.5 },
    note: '油页岩与农业深红州。',
  },
  {
    code: 'OH', fips: '39', name: 'Ohio', nameZh: '俄亥俄', ev: 17, region: 'rustbelt',
    baselineMargin: -6.8,
    weights: { workingClass: 1.3, suburban: 0.5, progressiveYouth: 0.4, sunBeltDiverse: 0.2, southernPopulist: 0.7, moderateHeartland: 0.7 },
    note: 'JD·万斯的政治老巢！如果铁锈带民粹反击够狠，能让他连老家选票都险象环生。',
  },
  {
    code: 'OK', fips: '40', name: 'Oklahoma', nameZh: '俄克拉荷马', ev: 7, region: 'deepsouth',
    baselineMargin: -33.5,
    weights: { workingClass: 0.4, suburban: 0.2, progressiveYouth: 0.1, sunBeltDiverse: 0.2, southernPopulist: 1.0, moderateHeartland: 0.3 },
    note: '全美最稳的深红能源州之一——除非“紫花苜蓿比尔”Alfalfa Bill 携带面包、黄油、培根与豆子从1932年杀回红河油田。',
  },
  {
    code: 'OR', fips: '41', name: 'Oregon', nameZh: '俄勒冈', ev: 8, region: 'westcoast',
    baselineMargin: 14.5,
    weights: { workingClass: 0.5, suburban: 0.7, progressiveYouth: 1.3, sunBeltDiverse: 0.4, southernPopulist: -0.2, moderateHeartland: 0.5 },
    note: '波特兰进步主义与木材工人并存。',
  },
  {
    code: 'PA', fips: '42', name: 'Pennsylvania', nameZh: '宾夕法尼亚', ev: 19, region: 'rustbelt',
    baselineMargin: -1.1,
    weights: { workingClass: 1.4, suburban: 1.1, progressiveYouth: 0.7, sunBeltDiverse: 0.4, southernPopulist: 0.3, moderateHeartland: 0.8 },
    note: '宾夕法尼亚大道1600号的钥匙！得19票者大概率入主白宫。',
  },
  {
    code: 'RI', fips: '44', name: 'Rhode Island', nameZh: '罗得岛', ev: 4, region: 'northeast',
    baselineMargin: 14.2,
    weights: { workingClass: 0.7, suburban: 0.7, progressiveYouth: 1.0, sunBeltDiverse: 0.4, southernPopulist: -0.3, moderateHeartland: 0.4 },
    note: '小而坚定的新英格兰蓝州。',
  },
  {
    code: 'SC', fips: '45', name: 'South Carolina', nameZh: '南卡罗来纳', ev: 9, region: 'deepsouth',
    baselineMargin: -17.2,
    weights: { workingClass: 0.3, suburban: 0.5, progressiveYouth: 0.2, sunBeltDiverse: 0.7, southernPopulist: 1.2, moderateHeartland: 0.3 },
    note: '查尔斯顿郊区在变蓝，但整体仍是南方保守派要塞。',
  },
  {
    code: 'SD', fips: '46', name: 'South Dakota', nameZh: '南达科他', ev: 3, region: 'heartland',
    baselineMargin: -28.5,
    weights: { workingClass: 0.4, suburban: 0.2, progressiveYouth: 0.1, sunBeltDiverse: 0.1, southernPopulist: 0.8, moderateHeartland: 0.6 },
    note: '总统山下的深红草原州。',
  },
  {
    code: 'TN', fips: '47', name: 'Tennessee', nameZh: '田纳西', ev: 11, region: 'deepsouth',
    baselineMargin: -28.2,
    weights: { workingClass: 0.4, suburban: 0.3, progressiveYouth: 0.2, sunBeltDiverse: 0.3, southernPopulist: 1.3, moderateHeartland: 0.2 },
    note: '纳什维尔音乐城也救不回的乡村红海，除非狂飙南方民粹。',
  },
  {
    code: 'TX', fips: '48', name: 'Texas', nameZh: '得克萨斯', ev: 40, region: 'sunbelt',
    baselineMargin: -9.0,
    weights: { workingClass: 0.4, suburban: 0.9, progressiveYouth: 0.7, sunBeltDiverse: 1.4, southernPopulist: 0.5, moderateHeartland: 0.4 },
    note: '40张票的终极诱惑！小心“Bluxas翻蓝但你还是输了”的经典魔咒。',
  },
  {
    code: 'UT', fips: '49', name: 'Utah', nameZh: '犹他', ev: 6, region: 'mountain',
    baselineMargin: -20.5,
    weights: { workingClass: 0.2, suburban: 0.8, progressiveYouth: 0.3, sunBeltDiverse: 0.2, southernPopulist: -0.2, moderateHeartland: 1.0 },
    note: '对川普低俗粗口极其反感，理性温和派有机会大幅拉近。',
  },
  {
    code: 'VT', fips: '50', name: 'Vermont', nameZh: '佛蒙特', ev: 3, region: 'northeast',
    baselineMargin: 32.0,
    weights: { workingClass: 0.6, suburban: 0.6, progressiveYouth: 1.4, sunBeltDiverse: 0.1, southernPopulist: -0.2, moderateHeartland: 0.7 },
    note: '伯尼桑德斯的精神山峰。',
  },
  {
    code: 'VA', fips: '51', name: 'Virginia', nameZh: '弗吉尼亚', ev: 13, region: 'northeast',
    baselineMargin: 2.3,
    weights: { workingClass: 0.4, suburban: 1.3, progressiveYouth: 0.8, sunBeltDiverse: 0.7, southernPopulist: 0.1, moderateHeartland: 0.7 },
    note: '北弗吉尼亚联邦雇员与郊区中产构筑的蓝营门户。',
  },
  {
    code: 'WA', fips: '53', name: 'Washington', nameZh: '华盛顿', ev: 12, region: 'westcoast',
    baselineMargin: 18.2,
    weights: { workingClass: 0.5, suburban: 0.8, progressiveYouth: 1.3, sunBeltDiverse: 0.5, southernPopulist: -0.3, moderateHeartland: 0.5 },
    note: '西雅图科技左翼与太平洋海岸堡垒。',
  },
  {
    code: 'WV', fips: '54', name: 'West Virginia', nameZh: '西弗吉尼亚', ev: 4, region: 'deepsouth',
    baselineMargin: -40.5,
    weights: { workingClass: 1.0, suburban: 0.1, progressiveYouth: 0.0, sunBeltDiverse: 0.0, southernPopulist: 1.3, moderateHeartland: 0.2 },
    note: '煤矿山区的极致红州。',
  },
  {
    code: 'WI', fips: '55', name: 'Wisconsin', nameZh: '威斯康星', ev: 10, region: 'rustbelt',
    baselineMargin: -0.2,
    weights: { workingClass: 1.3, suburban: 0.8, progressiveYouth: 0.8, sunBeltDiverse: 0.2, southernPopulist: 0.2, moderateHeartland: 1.0 },
    note: '全美最焦灼的10张摇摆票之一，麦迪逊与乡村的毫米级拉锯。',
  },
  {
    code: 'WY', fips: '56', name: 'Wyoming', nameZh: '怀俄明', ev: 3, region: 'mountain',
    baselineMargin: -44.0,
    weights: { workingClass: 0.4, suburban: 0.1, progressiveYouth: 0.0, sunBeltDiverse: 0.0, southernPopulist: 0.8, moderateHeartland: 0.4 },
    note: '全美最红的3张选举人票。',
  },
];

export const STATES_BY_CODE: Record<StateCode, StateDefinition> = STATES_DATA.reduce(
  (acc, state) => {
    acc[state.code] = state;
    return acc;
  },
  {} as Record<StateCode, StateDefinition>
);

export const STATES_BY_FIPS: Record<string, StateDefinition> = STATES_DATA.reduce(
  (acc, state) => {
    acc[state.fips] = state;
    return acc;
  },
  {} as Record<string, StateDefinition>
);
