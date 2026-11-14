import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '1mb' }));

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function formatGeminiError(err: unknown): { status: number; message: string } {
  const raw = err instanceof Error ? err.message : String(err);
  if (raw.includes('429') || raw.includes('RESOURCE_EXHAUSTED') || raw.includes('quota')) {
    return {
      status: 429,
      message: 'Gemini API 当前配额已耗尽 (429)，已自动保留离线/本地演算支持。',
    };
  }
  if (raw.includes('403') || raw.includes('400') || raw.includes('API_KEY_INVALID') || raw.includes('PERMISSION_DENIED')) {
    return {
      status: 403,
      message: 'API Key 权限或配置无效，请在 Settings > Secrets 检查 GEMINI_API_KEY。',
    };
  }
  return {
    status: 502,
    message: '实时 AI 服务暂时不可用，已切换本地战况演算。',
  };
}

function extractJsonObject(raw: string): Record<string, unknown> | null {
  const cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(cleaned.slice(start, end + 1)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

app.post('/api/grounding-tweet', async (req, res) => {
  const { round, topic, dateLabel } = req.body as {
    round?: number;
    topic?: string;
    dateLabel?: string;
  };

  const ai = getGeminiClient();
  if (!ai) {
    res.status(503).json({
      error: 'GEMINI_API_KEY 未配置，无法联网检索实时热点。',
    });
    return;
  }

  try {
    const prompt = `使用 Google Search 搜索最近真实发生的美国政治、经济、通胀、关税、最高法院或体育娱乐热点新闻。
然后结合游戏设定（2028年大选，唐纳德·川普在2027年强行胁迫两院废除宪法第22修正案试图无限连任，JD·万斯仍为副总统，马可·卢比奥是预备国务卿），把你搜到的真实最新新闻事件融合成一条美式政治黑色幽默风格的中文“突发新闻”和一条对手推特发言（第 ${round ?? 1} 回合，主题：${topic ?? '选战交锋'}，时间：${dateLabel ?? '2028年秋季'}）。
注意：整体使用中文，但风格必须是纯正的美式政治讽刺（类似《副总统 Veep》或《洋葱新闻》），严禁使用中文网络流行梗（例如不要出现“老铁”“破防”“社死”“闹麻了”“逆天”“整活”等词）。

请严格只输出一个 JSON 对象，格式如下（不要附加多余说明）：
{
  "realEventSummary": "一句话概括搜到的真实热点新闻",
  "breakingNews": "融入该真实事件的2028突发新闻播报（60字以内）",
  "speaker": "trump 或 vance 或 rubio",
  "tweet": "对手结合真实热点发出的荒诞讽刺推文（100字以内，美式黑色幽默）"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    });

    const text = response.text ?? '';
    const parsed = extractJsonObject(text);

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
    const groundingSources = chunks
      .map((chunk) => {
        const web = (chunk as { web?: { uri?: string; title?: string } }).web;
        if (!web?.uri) return null;
        return {
          title: web.title || web.uri,
          uri: web.uri,
        };
      })
      .filter((item): item is { title: string; uri: string } => item !== null)
      .slice(0, 4);

    if (!parsed) {
      res.json({
        realEventSummary: '实时新闻检索完成',
        breakingNews: text.slice(0, 140),
        speaker: 'trump',
        tweet: text.slice(0, 180),
        groundingSources,
      });
      return;
    }

    const speakerRaw = String(parsed.speaker ?? 'trump').toLowerCase();
    const speaker = speakerRaw === 'vance' || speakerRaw === 'rubio' ? speakerRaw : 'trump';

    res.json({
      realEventSummary: String(parsed.realEventSummary ?? ''),
      breakingNews: String(parsed.breakingNews ?? ''),
      speaker,
      tweet: String(parsed.tweet ?? ''),
      groundingSources,
    });
  } catch (err) {
    const formatted = formatGeminiError(err);
    console.error('[/api/grounding-tweet] error:', err instanceof Error ? err.message : err);
    res.status(formatted.status).json({ error: formatted.message });
  }
});

app.post('/api/judge-tweet', async (req, res) => {
  const { playerTweet, ideology, round, opponentTweet, topic } = req.body as {
    playerTweet?: string;
    ideology?: string;
    round?: number;
    opponentTweet?: string;
    topic?: string;
  };

  if (!playerTweet || !playerTweet.trim()) {
    res.status(400).json({ error: '推文内容不能为空。' });
    return;
  }

  const ai = getGeminiClient();
  if (!ai) {
    res.status(503).json({
      error: 'GEMINI_API_KEY 未配置，已切换为本地裁判引擎。',
    });
    return;
  }

  try {
    const prompt = `你是一个美式政治讽刺模拟游戏《DEMOCRATIC 2028》的选举民调裁判兼华盛顿政治喜剧编剧。
背景：2028年美国总统大选（第${round ?? 1}/10回合，议题：${topic ?? '选战交锋'}）。川普2027年废除了宪法第22修正案试图无限连任，JD·万斯仍是副总统，马可·卢比奥是预备国务卿。
玩家当前塑形倾向：${ideology ?? 'liberal'}
对手刚才的推文：${opponentTweet ?? ''}
玩家手写的回击推文：${playerTweet}

要求：使用纯正的中文表达美式政治黑色幽默（类似《Veep》《The Onion》），严禁出现中文网络流行梗（如“老铁”“破防”“社死”“闹麻了”“逆天”“整活”等）。
请严格根据美国现实选举地理 + 讽刺喜剧效果评估这条推文的影响：
- 如果犀利好笑且切中铁锈带工人、郊区中产或摇摆州痛点，给予正向 nationalShift（0.5 到 2.5）；如果胡言乱语、严重自爆或冒犯核心摇摆群，给予负向 nationalShift（-3.5 到 -0.2）。
- 判断这条推文最接近哪一种民主党人设倾向（dominantIdeology）：liberal（自由派）, progressive（进步派）, moderate（温和派）, conservative（保守派Blue Dog）, woke（Wokes）, populist（民粹）, dark（黑化）。
- 如果同时提到“纽约洋基”和“波士顿红袜”，给 NY 和 MA 加分，并将 specialFlag 设为 "yankee_redsox"。
- 如果提到路易斯安那、休伊·朗或极致南方分钱民粹，给 LA 加分，并将 specialFlag 设为 "huey_long"。
- 如果提到“Alfalfa Bill”、紫花苜蓿比尔、俄克拉荷马、红河油田或“面包、黄油、培根与豆子”，给 OK 大幅加分，并将 specialFlag 设为 "alfalfa_bill"。
- 如果迎合深南红州州权同时激怒纽约加州，将 specialFlag 设为 "dixiecrat"。
- 数值范围约束：nationalShift 在 [-3.5, 2.8]，各个 demographics 增量在 [-5, 5]，meterDelta 各项在 [-20, 25]。`;

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            critique: { type: Type.STRING, description: '简短美式毒舌评语（12字以内）' },
            dominantIdeology: {
              type: Type.STRING,
              description: 'liberal, progressive, moderate, conservative, woke, populist, 或 dark',
            },
            opponentSpeaker: { type: Type.STRING, description: 'trump, vance, 或 rubio' },
            opponentReply: { type: Type.STRING, description: '对手暴怒或反讽的搞笑回复（80字以内，无中文网络梗）' },
            nationalShift: { type: Type.NUMBER },
            workingClass: { type: Type.NUMBER },
            suburban: { type: Type.NUMBER },
            progressiveYouth: { type: Type.NUMBER },
            sunBeltDiverse: { type: Type.NUMBER },
            southernPopulist: { type: Type.NUMBER },
            moderateHeartland: { type: Type.NUMBER },
            hypeDelta: { type: Type.NUMBER },
            establishmentDelta: { type: Type.NUMBER },
            populismDelta: { type: Type.NUMBER },
            chaosDelta: { type: Type.NUMBER },
            boostStateCode: { type: Type.STRING, description: '可选：两字母州代码如 PA, TX, LA, NY, FL, MN，无则留空' },
            boostStateDelta: { type: Type.NUMBER },
            specialFlag: { type: Type.STRING, description: '可选：yankee_redsox, huey_long, alfalfa_bill, dixiecrat, pigasus_selfown, dark_brandon, 或空字符串' },
          },
          required: [
            'critique',
            'dominantIdeology',
            'opponentSpeaker',
            'opponentReply',
            'nationalShift',
            'workingClass',
            'suburban',
            'progressiveYouth',
            'sunBeltDiverse',
            'southernPopulist',
            'moderateHeartland',
            'hypeDelta',
            'establishmentDelta',
            'populismDelta',
            'chaosDelta',
          ],
        },
      },
    });

    const data = JSON.parse(response.text ?? '{}') as Record<string, unknown>;
    const speakerRaw = String(data.opponentSpeaker ?? 'trump').toLowerCase();
    const opponentSpeaker = speakerRaw === 'vance' || speakerRaw === 'rubio' ? speakerRaw : 'trump';

    const validIdeologies = new Set([
      'liberal',
      'progressive',
      'moderate',
      'conservative',
      'woke',
      'populist',
      'dark',
    ]);
    const rawIdeology = String(data.dominantIdeology ?? 'liberal').toLowerCase().trim();
    const chosenIdeology = validIdeologies.has(rawIdeology) ? rawIdeology : 'liberal';

    const stateOverrides: Record<string, number> = {};
    const boostCode = String(data.boostStateCode ?? '').trim().toUpperCase();
    const boostVal = Number(data.boostStateDelta ?? 0);
    if (/^[A-Z]{2}$/.test(boostCode) && Number.isFinite(boostVal) && boostVal !== 0) {
      stateOverrides[boostCode] = Math.max(-8, Math.min(8, boostVal));
    }

    const validFlags = new Set(['yankee_redsox', 'huey_long', 'alfalfa_bill', 'dixiecrat', 'pigasus_selfown', 'dark_brandon', 'mondale_defense']);
    const flagStr = String(data.specialFlag ?? '').trim();

    res.json({
      critique: String(data.critique ?? '即时推文已计入民调'),
      opponentSpeaker,
      opponentReply: String(data.opponentReply ?? '假新闻！！连MSNBC都不敢这么编！'),
      nationalShift: Math.max(-3.5, Math.min(2.8, Number(data.nationalShift ?? 0.5))),
      demographics: {
        workingClass: Math.max(-5, Math.min(5, Number(data.workingClass ?? 0))),
        suburban: Math.max(-5, Math.min(5, Number(data.suburban ?? 0))),
        progressiveYouth: Math.max(-5, Math.min(5, Number(data.progressiveYouth ?? 0))),
        sunBeltDiverse: Math.max(-5, Math.min(5, Number(data.sunBeltDiverse ?? 0))),
        southernPopulist: Math.max(-5, Math.min(5, Number(data.southernPopulist ?? 0))),
        moderateHeartland: Math.max(-5, Math.min(5, Number(data.moderateHeartland ?? 0))),
      },
      meterDelta: {
        hype: Math.max(-20, Math.min(25, Number(data.hypeDelta ?? 10))),
        establishment: Math.max(-20, Math.min(25, Number(data.establishmentDelta ?? 0))),
        populism: Math.max(-20, Math.min(25, Number(data.populismDelta ?? 5))),
        chaos: Math.max(-20, Math.min(25, Number(data.chaosDelta ?? 8))),
      },
      ideologyDelta: { [chosenIdeology]: 3 },
      stateOverrides,
      specialFlag: validFlags.has(flagStr) ? flagStr : undefined,
    });
  } catch (err) {
    const formatted = formatGeminiError(err);
    console.error('[/api/judge-tweet] error:', err instanceof Error ? err.message : err);
    res.status(formatted.status).json({ error: formatted.message });
  }
});

async function startServer() {
  const PORT = 3000;
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DEMOCRATIC 2028 server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
