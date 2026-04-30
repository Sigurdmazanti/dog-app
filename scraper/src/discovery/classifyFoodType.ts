import axios from 'axios';
import * as cheerio from 'cheerio';
import OpenAI from 'openai';
import { FoodType } from '../interfaces/foodTypes';
import { DiscoveredUrl } from './types';

export interface ClassifyOptions {
  /** Minimum model confidence to accept the classification (default 0.8) */
  threshold?: number;
  /** OpenAI model name (default env OPENAI_MODEL or 'gpt-5-nano') */
  model?: string;
  /** Timeout for the OpenAI request in ms (default 8000) */
  timeoutMs?: number;
  /** Override fetch User-Agent */
  userAgent?: string;
}

const DEFAULT_USER_AGENT =
  'dogapp-scraper/0.1 (+https://github.com/sigmu/dogapp; product-discovery)';
const DEFAULT_THRESHOLD = 0.8;
const DEFAULT_TIMEOUT_MS = 8000;

const FOOD_TYPES = Object.values(FoodType);

/** Strip scripts/styles, then collect title, breadcrumbs, and lead paragraphs. */
function extractContext(html: string): string {
  const $ = cheerio.load(html);
  $('script, style, noscript').remove();

  const title = $('title').first().text().trim();
  const h1 = $('h1').first().text().trim();
  const breadcrumb = $('[class*="breadcrumb" i] a, nav[aria-label*="breadcrumb" i] a')
    .map((_, el) => $(el).text().trim())
    .get()
    .filter(Boolean)
    .join(' > ');
  const meta = $('meta[name="description"]').attr('content')?.trim() ?? '';
  const lead = $('p').slice(0, 3).map((_, el) => $(el).text().trim()).get().join(' ');

  return [
    title && `Title: ${title}`,
    h1 && `Heading: ${h1}`,
    breadcrumb && `Breadcrumb: ${breadcrumb}`,
    meta && `Meta: ${meta}`,
    lead && `Lead: ${lead.slice(0, 800)}`,
  ]
    .filter(Boolean)
    .join('\n');
}

interface ModelResponse {
  foodType: string;
  confidence: number;
}

function parseModelResponse(raw: string): ModelResponse | undefined {
  // Try direct JSON parse, then extract first JSON object substring.
  const tryParse = (s: string): unknown => {
    try {
      return JSON.parse(s);
    } catch {
      return undefined;
    }
  };
  let obj = tryParse(raw);
  if (!obj || typeof obj !== 'object') {
    const m = raw.match(/\{[\s\S]*\}/);
    if (m) obj = tryParse(m[0]);
  }
  if (!obj || typeof obj !== 'object') return undefined;
  const o = obj as Record<string, unknown>;
  const ft = typeof o.foodType === 'string' ? o.foodType.toLowerCase() : undefined;
  const conf = typeof o.confidence === 'number' ? o.confidence : undefined;
  if (!ft || conf === undefined) return undefined;
  return { foodType: ft, confidence: conf };
}

/**
 * Classify a single product URL into a food type using OpenAI as fallback
 * when listing-derived classification is unavailable.
 *
 * Network or model errors are caught and returned as needs-review entries
 * so a single bad URL never aborts a discovery run.
 */
export async function classifyFoodType(
  url: string,
  opts: ClassifyOptions = {}
): Promise<DiscoveredUrl> {
  const threshold = opts.threshold ?? DEFAULT_THRESHOLD;
  const model = opts.model ?? process.env.OPENAI_MODEL ?? 'gpt-5-nano';
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const userAgent = opts.userAgent ?? DEFAULT_USER_AGENT;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { url, source: 'needs-review', reason: 'OPENAI_API_KEY not set' };
  }

  let context: string;
  try {
    const { data } = await axios.get<string>(url, {
      responseType: 'text',
      headers: { 'User-Agent': userAgent, Accept: 'text/html,application/xhtml+xml' },
      timeout: 15000,
    });
    context = extractContext(data);
  } catch (e: any) {
    return { url, source: 'needs-review', reason: `fetch failed: ${e?.message ?? e}` };
  }

  if (!context) {
    return { url, source: 'needs-review', reason: 'no extractable page context' };
  }

  const client = new OpenAI({ apiKey, timeout: timeoutMs });
  const prompt = [
    'You classify a single dog-food product page into ONE of these food types:',
    FOOD_TYPES.map((t) => `- ${t}`).join('\n'),
    '',
    'Reply ONLY with a JSON object: {"foodType": "<one of the values above>", "confidence": <0..1>}.',
    'Use "misc" for accessories, supplements, or items that are not food.',
    '',
    'Page context:',
    context,
  ].join('\n');

  let raw: string;
  try {
    const completion = await client.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });
    raw = completion.choices[0]?.message?.content ?? '';
  } catch (e: any) {
    return { url, source: 'needs-review', reason: `OpenAI error: ${e?.message ?? e}` };
  }

  const parsed = parseModelResponse(raw);
  if (!parsed) {
    return { url, source: 'needs-review', reason: 'unparseable model response' };
  }

  if (!FOOD_TYPES.includes(parsed.foodType as FoodType)) {
    return {
      url,
      source: 'needs-review',
      reason: `model returned unknown foodType "${parsed.foodType}"`,
      confidence: parsed.confidence,
    };
  }

  const foodType = parsed.foodType as FoodType;
  if (parsed.confidence < threshold) {
    return {
      url,
      source: 'needs-review',
      bestGuess: foodType,
      confidence: parsed.confidence,
      reason: `confidence ${parsed.confidence} below threshold ${threshold}`,
    };
  }

  return { url, foodType, source: 'ai', confidence: parsed.confidence };
}
