import { IdeologyId, IdeologyProfile, IdeologyScores } from './types';

export const EMPTY_IDEOLOGY_SCORES: IdeologyScores = {
  liberal: 0,
  progressive: 0,
  moderate: 0,
  conservative: 0,
  woke: 0,
  populist: 0,
  dark: 0,
};

export const IDEOLOGIES: IdeologyProfile[] = [
  {
    id: 'liberal',
    nameZh: '自由派',
    nameEn: 'Liberal',
    handle: '@DemNominee2028',
    tagline: '宪法秩序、机构尊严与微软新闻晚间节目的精神支柱。',
    description: '精通郊区中产话术与纽约时报专栏修辞，能稳住海岸线和高学历郊区，但面对工人阶级时容易听起来像华盛顿律所合伙人。',
    multipliers: {
      workingClass: 0.9,
      suburban: 1.3,
      progressiveYouth: 1.1,
      sunBeltDiverse: 1.0,
      southernPopulist: 0.7,
      moderateHeartland: 1.1,
    },
    accentColor: '#3B82F6',
  },
  {
    id: 'progressive',
    nameZh: '进步派',
    nameEn: 'Progressive',
    handle: '@GreenNew2028',
    tagline: '财富税、全民医保与联合工会——把华尔街和海湖庄园塞进同一张传票。',
    description: '点燃大学城与工会车间的怒火，但每多提一次富豪税，K街金主和电视评论员的血压就飙高十毫米汞柱。',
    multipliers: {
      workingClass: 1.25,
      suburban: 0.85,
      progressiveYouth: 1.4,
      sunBeltDiverse: 1.1,
      southernPopulist: 0.8,
      moderateHeartland: 0.9,
    },
    accentColor: '#6366F1',
  },
  {
    id: 'moderate',
    nameZh: '温和派',
    nameEn: 'Moderate',
    handle: '@CommonSense28',
    tagline: '降通胀、修桥梁、别吓跑宾州费城郊区的摇摆会计师。',
    description: '像一碗无糖燕麦粥般令摇摆州中间派安心，能在艾奥瓦、新罕布什尔和宾夕法尼亚稳定抢票，缺点是推文不够毒辣时容易被流量吞没。',
    multipliers: {
      workingClass: 1.1,
      suburban: 1.35,
      progressiveYouth: 0.75,
      sunBeltDiverse: 1.05,
      southernPopulist: 1.0,
      moderateHeartland: 1.35,
    },
    accentColor: '#0EA5E9',
  },
  {
    id: 'conservative',
    nameZh: '保守派',
    nameEn: 'Blue Dog',
    handle: '@BlueDog2028',
    tagline: '页岩油、强治安、减税加上帝保佑——用1994年的剧本把共和党逼成左翼。',
    description: '专攻南方白人农村与西部保守选民，甚至能在红州撕开缺口，但布鲁克林和旧金山的选民随时准备把你的照片倒挂。',
    multipliers: {
      workingClass: 1.15,
      suburban: 1.0,
      progressiveYouth: 0.5,
      sunBeltDiverse: 0.9,
      southernPopulist: 1.6,
      moderateHeartland: 1.25,
    },
    accentColor: '#64748B',
  },
  {
    id: 'woke',
    nameZh: 'Wokes',
    nameEn: 'Hyper-Woke',
    handle: '@CancelFascism28',
    tagline: '全天候道德显微镜与学术黑话空袭——每个标点符号都经过交叉性审查。',
    description: 'Z世代和曼哈顿媒体圈为你疯狂点赞，但在密歇根汽车厂和威斯康星加油站，你的用词正在免费给川普拍摄竞选广告。',
    multipliers: {
      workingClass: 0.7,
      suburban: 0.8,
      progressiveYouth: 1.65,
      sunBeltDiverse: 1.0,
      southernPopulist: 0.4,
      moderateHeartland: 0.65,
    },
    accentColor: '#EC4899',
  },
  {
    id: 'populist',
    nameZh: '民粹',
    nameEn: 'Populist',
    handle: '@Kingfish2028',
    tagline: '“人皆为王！”——从底特律装配线到路易斯安那河口，把寡头连根拔起。',
    description: '继承休伊·朗衣钵的平民狂飙路线，专挑亿万富翁与华盛顿既得利益开火，能画出令民调专家当场撕毁教科书的魔幻版图。',
    multipliers: {
      workingClass: 1.5,
      suburban: 0.8,
      progressiveYouth: 1.0,
      sunBeltDiverse: 1.15,
      southernPopulist: 1.55,
      moderateHeartland: 1.2,
    },
    accentColor: '#F59E0B',
  },
  {
    id: 'dark',
    nameZh: '黑化',
    nameEn: 'Dark Brandon',
    handle: '@DarkNominee28',
    tagline: '戴上墨镜、放弃体面、用麦基雅维利式下三路把2027修宪闹剧反杀到底。',
    description: '既然这群家伙连第22修正案都敢撕，那你也别指望我走《白宫风云》那套圣母剧本——高热度、高混乱，赢就赢个彻底，输就一起进马戏团。',
    multipliers: {
      workingClass: 1.35,
      suburban: 1.05,
      progressiveYouth: 1.25,
      sunBeltDiverse: 1.25,
      southernPopulist: 1.35,
      moderateHeartland: 1.0,
    },
    accentColor: '#EF4444',
  },
];

export const IDEOLOGIES_BY_ID: Record<IdeologyId, IdeologyProfile> = IDEOLOGIES.reduce(
  (acc, item) => {
    acc[item.id] = item;
    return acc;
  },
  {} as Record<IdeologyId, IdeologyProfile>
);

export function getDominantIdeology(scores: IdeologyScores): IdeologyId {
  let bestId: IdeologyId = 'liberal';
  let bestVal = -Infinity;
  const order: IdeologyId[] = [
    'dark',
    'populist',
    'woke',
    'conservative',
    'progressive',
    'moderate',
    'liberal',
  ];
  for (const id of order) {
    if (scores[id] > bestVal) {
      bestVal = scores[id];
      bestId = id;
    }
  }
  return bestVal <= 0 ? 'liberal' : bestId;
}
