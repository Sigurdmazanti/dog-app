import OpenAI from 'openai';
import { log, logWarn } from '../utils/logger';
import { percentageStringToInt } from '../parsing/percentageStringToInt';
import {
  AminoAcidsData,
  FattyAcidsData,
  MineralsData,
  NutritionData,
  SaltsData,
  SugarAlcoholsData,
  VitaminLikeData,
  VitaminsData,
} from '../../interfaces/productComposition';
import {
  aminoAcidsKeyMap,
  fattyAcidsKeyMap,
  mineralsKeyMap,
  nutritionKeyMap,
  saltsKeyMap,
  sugarAlcoholsKeyMap,
  vitaminLikeKeyMap,
  vitaminsKeyMap,
} from './productCompositionKeyMap';

export interface CompositionSections {
  nutritionData: Partial<NutritionData>;
  mineralsData: Partial<MineralsData>;
  saltsData: Partial<SaltsData>;
  vitaminsData: Partial<VitaminsData>;
  aminoAcidsData: Partial<AminoAcidsData>;
  vitaminLikeData: Partial<VitaminLikeData>;
  fattyAcidsData: Partial<FattyAcidsData>;
  sugarAlcoholsData: Partial<SugarAlcoholsData>;
}

export interface CompositionMappingResult {
  mappedSections: CompositionSections;
  usedAI: boolean;
  notes: string[];
}

type SectionName = keyof CompositionSections;

const SECTION_KEY_MAPS = {
  nutritionData: nutritionKeyMap,
  mineralsData: mineralsKeyMap,
  saltsData: saltsKeyMap,
  vitaminsData: vitaminsKeyMap,
  aminoAcidsData: aminoAcidsKeyMap,
  vitaminLikeData: vitaminLikeKeyMap,
  fattyAcidsData: fattyAcidsKeyMap,
  sugarAlcoholsData: sugarAlcoholsKeyMap,
} as const;

// Expected output unit for every canonical field. Used to annotate the schema template so the AI knows the target unit without guessing.
const CANONICAL_FIELD_UNITS: Record<string, string> = {
  // nutritionData
  kiloJoule: 'kJ/100g',
  water: 'g/100g',
  protein: 'g/100g',
  fat: 'g/100g',
  fiber: 'g/100g',
  crudeAsh: 'g/100g',
  nfe: 'g/100g',
  sugar: 'g/100g',
  // mineralsData
  calcium: 'mg/100g',
  phosphorus: 'mg/100g',
  magnesium: 'mg/100g',
  potassium: 'mg/100g',
  sodium: 'mg/100g',
  chlorine: 'mg/100g',
  sulphur: 'mg/100g',
  iron: 'mg/100g',
  copper: 'mg/100g',
  manganese: 'mg/100g',
  zinc: 'mg/100g',
  silicon: 'mg/100g',
  clinoptilolite: 'mg/100g',
  iodine: 'ug/100g',
  selenium: 'ug/100g',
  cobalt: 'ug/100g',
  molybdenum: 'ug/100g',
  fluorine: 'ug/100g',
  chromium: 'ug/100g',
  vanadium: 'ug/100g',
  nickel: 'ug/100g',
  tin: 'ug/100g',
  arsenic: 'ug/100g',
  lead: 'ug/100g',
  cadmium: 'ug/100g',
  mercury: 'ug/100g',
  // saltsData
  sodiumChloride: 'g/100g',
  potassiumChloride: 'mg/100g',
  ferrousSulfate: 'mg/100g',
  copperSulfate: 'mg/100g',
  pentasodiumTriphosphate: 'mg/100g',
  // vitaminsData — IU fields include conversion factor in the annotation
  aVitamin: 'ug/100g (if in IU: multiply by 0.3 to get ug, then scale to per 100g)',
  dVitamin: 'ug/100g (if in IU: multiply by 0.025 to get ug, then scale to per 100g)',
  dVitamin3: 'ug/100g (if in IU: multiply by 0.025 to get ug, then scale to per 100g)',
  dVitamin2: 'ug/100g (if in IU: multiply by 0.025 to get ug, then scale to per 100g)',
  hydroxyVitaminD3: 'ug/100g (if in IU: multiply by 0.025 to get ug, then scale to per 100g)',
  hydroxyVitaminD2: 'ug/100g (if in IU: multiply by 0.025 to get ug, then scale to per 100g)',
  eVitamin: 'mg/100g (if in IU: multiply by 0.67 to get mg, then scale to per 100g)',
  kVitamin: 'ug/100g',
  k1Vitamin: 'ug/100g',
  k2Vitamin: 'ug/100g',
  bVitamin: 'mg/100g',
  b1: 'mg/100g',
  b2: 'mg/100g',
  b3: 'mg/100g',
  b5: 'mg/100g',
  b6: 'mg/100g',
  b7: 'ug/100g',
  b9: 'ug/100g',
  b12: 'ug/100g',
  cVitamin: 'mg/100g',
  // aminoAcidsData
  lLysine: 'g/100g',
  taurine: 'g/100g',
  // vitaminLikeData
  lCarnitine: 'mg/100g',
  choline: 'mg/100g',
  // fattyAcidsData
  omega3: 'g/100g',
  omega6: 'g/100g',
  // sugarAlcoholsData
  glycerin: 'g/100g',
  sorbitol: 'g/100g',
};

const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-5-nano';
const DEFAULT_TIMEOUT_MS = 60_000;
const DEFAULT_MAX_RETRIES = 2;

const parseNumberEnv = (value: string | undefined, fallback: number): number => {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
};

function createEmptySections(): CompositionSections {
  const sections = {
    nutritionData: {},
    mineralsData: {},
    saltsData: {},
    vitaminsData: {},
    aminoAcidsData: {},
    vitaminLikeData: {},
    fattyAcidsData: {},
    sugarAlcoholsData: {},
  } as CompositionSections;

  for (const sectionName of Object.keys(SECTION_KEY_MAPS) as SectionName[]) {
    const section = sections[sectionName] as Record<string, number | undefined>;
    const keyMap = SECTION_KEY_MAPS[sectionName] as Record<string, string[]>;

    for (const canonicalField of Object.keys(keyMap)) {
      section[canonicalField] = undefined;
    }
  }

  return sections;
}

function createCanonicalSchemaTemplate(): Record<SectionName, Record<string, string>> {
  const template = {} as Record<SectionName, Record<string, string>>;

  for (const sectionName of Object.keys(SECTION_KEY_MAPS) as SectionName[]) {
    const sectionTemplate: Record<string, string> = {};
    const keyMap = SECTION_KEY_MAPS[sectionName] as Record<string, string[]>;

    for (const canonicalField of Object.keys(keyMap)) {
      sectionTemplate[canonicalField] = CANONICAL_FIELD_UNITS[canonicalField] ?? 'number';
    }

    template[sectionName] = sectionTemplate;
  }

  return template;
}

function createPrompt(rawText: string): string {
  const schemaTemplate = createCanonicalSchemaTemplate();

  return [
    'You map nutrient text to a fixed JSON schema.',
    'Return ONLY valid JSON. No prose or markdown.',
    'Rules:',
    '- Use exactly this top-level shape and keys. Do not add or remove keys.',
    JSON.stringify(schemaTemplate),
    '- Values must be numbers or null. The schema value shows the expected unit for each field.',
    '- Do not guess values. Use null when missing.',
    '- Convert percentages to numbers (e.g. "29%" -> 29).',
    '- VERY IMPORTANT: Output each field as a plain number in the unit shown in the schema. Apply all conversions before writing the value.',
    '- Values expressed per kg must be divided by 10 to get per 100g (e.g. 700 mg/kg -> 70 mg/100g).',
    '- IU conversions — apply these before the per-unit scaling:',
    '  - aVitamin: if in IU, multiply by 0.3 to get ug, then divide by 10 if per kg. Output ug/100g.',
    '  - dVitamin / dVitamin3 / dVitamin2 / hydroxyVitaminD3 / hydroxyVitaminD2: if in IU, multiply by 0.025 to get ug, then divide by 10 if per kg. Output ug/100g.',
    '  - eVitamin: if in IU, multiply by 0.67 to get mg, then divide by 10 if per kg. Output mg/100g.',
    '- Energy (kiloJoule): always output in kJ/100g. If given in kcal, multiply by 4.184. If per kg, divide by 10.',
    '- dVitamin: use total vitamin D if present; otherwise sum dVitamin3, dVitamin2, hydroxyVitaminD3, hydroxyVitaminD2.',
    '- kVitamin: use total vitamin K if present; otherwise sum k1Vitamin, k2Vitamin.',
    '- Product name and brand name fields MUST NOT include trademark (™), copyright (©), registered (®), or any other legal or special symbols. Return clean, trimmed name values with no extra surrounding whitespace.',
    'Input text:',
    rawText,
  ].join('\n');
}

function extractMessageText(content: unknown): string | null {
  if (typeof content === 'string') {
    return content;
  }

  if (Array.isArray(content)) {
    const textParts = content
      .map((item) => {
        if (typeof item === 'string') {
          return item;
        }

        if (item && typeof item === 'object' && 'text' in item && typeof item.text === 'string') {
          return item.text;
        }

        return '';
      })
      .filter(Boolean);

    if (textParts.length > 0) {
      return textParts.join('\n');
    }
  }

  return null;
}

function stripCodeFences(rawText: string): string {
  const trimmed = rawText.trim();

  if (!trimmed.startsWith('```')) {
    return trimmed;
  }

  const withoutStartFence = trimmed.replace(/^```(?:json)?\s*/i, '');
  return withoutStartFence.replace(/\s*```$/, '').trim();
}

type NumberParseResult = {
  valid: boolean;
  value?: number;
};

function parseAIMappedNumber(rawValue: unknown): NumberParseResult {
  if (rawValue === null || rawValue === undefined) {
    return { valid: true };
  }

  if (typeof rawValue === 'number' && Number.isFinite(rawValue)) {
    return { valid: true, value: rawValue };
  }

  if (typeof rawValue === 'string') {
    const parsed = percentageStringToInt(rawValue);
    if (Number.isFinite(parsed)) {
      return { valid: true, value: parsed };
    }
  }

  return { valid: false };
}

export function parseAndValidateAIMapping(payload: unknown): CompositionSections | null {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return null;
  }

  const payloadRecord = payload as Record<string, unknown>;
  const allowedSections = new Set(Object.keys(SECTION_KEY_MAPS));

  for (const topLevelKey of Object.keys(payloadRecord)) {
    if (!allowedSections.has(topLevelKey)) {
      return null;
    }
  }

  const parsedSections = createEmptySections();

  for (const sectionName of Object.keys(SECTION_KEY_MAPS) as SectionName[]) {
    const sectionPayload = payloadRecord[sectionName];
    const keyMap = SECTION_KEY_MAPS[sectionName] as Record<string, string[]>;

    if (sectionPayload === undefined || sectionPayload === null) {
      continue;
    }

    if (typeof sectionPayload !== 'object' || Array.isArray(sectionPayload)) {
      return null;
    }

    const sectionRecord = sectionPayload as Record<string, unknown>;
    const allowedKeys = new Set(Object.keys(keyMap));

    for (const key of Object.keys(sectionRecord)) {
      if (!allowedKeys.has(key)) {
        return null;
      }
    }

    for (const canonicalField of Object.keys(keyMap)) {
      const parseResult = parseAIMappedNumber(sectionRecord[canonicalField]);

      if (!parseResult.valid) {
        return null;
      }

      if (typeof parseResult.value === 'number') {
        (parsedSections[sectionName] as Record<string, number>)[canonicalField] = parseResult.value;
      }
    }
  }

  return parsedSections;
}


async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new Error(`AI mapping request timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
    }
  }
}

async function requestAIMapping(rawText: string, logPrefix = ''): Promise<CompositionSections> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set');
  }

  const timeoutMs = parseNumberEnv(process.env.OPENAI_TIMEOUT_MS, DEFAULT_TIMEOUT_MS);
  const maxRetries = parseNumberEnv(process.env.OPENAI_MAX_RETRIES, DEFAULT_MAX_RETRIES);
  const prompt = createPrompt(rawText);
  const client = new OpenAI({ apiKey });

  let lastError: unknown = null;

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    const callStart = Date.now();
    try {
      const response = await withTimeout(
        client.chat.completions.create({
          model: DEFAULT_MODEL,
          messages: [{ role: 'user', content: prompt }],
        }),
        timeoutMs,
      );

      const elapsed = Date.now() - callStart;
      log(logPrefix, `[ai-mapper] done in ${elapsed}ms`);

      const messageContent = response.choices[0]?.message?.content;
      const rawText = extractMessageText(messageContent);

      if (!rawText) {
        throw new Error('AI mapping response did not include text content');
      }

      const payload = JSON.parse(stripCodeFences(rawText));
      const parsed = parseAndValidateAIMapping(payload);

      if (!parsed) {
        throw new Error('AI mapping response failed schema validation');
      }

      return parsed;
    } catch (error) {
      const elapsed = Date.now() - callStart;
      lastError = error;

      const message = error instanceof Error ? error.message : String(error);
      const isTimeout = message.includes('timed out after');

      if (isTimeout) {
        log(logPrefix, `[ai-mapper] timed out after ${timeoutMs}ms`);
      } else {
        log(logPrefix, `[ai-mapper] error after ${elapsed}ms — ${message}`);
      }

      if (attempt < maxRetries) {
        const delay = 1000 * (attempt + 1);
        log(logPrefix, `[ai-mapper] retry ${attempt + 1}/${maxRetries} after ${delay}ms`);
        await wait(delay);
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Unknown AI mapping error');
}

export async function mapProductCompositionWithAI(rawText: string, logPrefix = ''): Promise<CompositionMappingResult> {
  const emptyMapped = createEmptySections();
  const notes: string[] = [];

  if (!rawText.trim()) {
    notes.push('AI mapping skipped because raw composition text is empty. Returning empty canonical sections.');
    return {
      mappedSections: emptyMapped,
      usedAI: false,
      notes,
    };
  }

  if (!process.env.OPENAI_API_KEY) {
    notes.push('AI mapping disabled because OPENAI_API_KEY is not configured. Returning empty canonical sections.');
    return {
      mappedSections: emptyMapped,
      usedAI: false,
      notes,
    };
  }

  try {
    const aiMapped = await requestAIMapping(rawText, logPrefix);
    return {
      mappedSections: aiMapped,
      usedAI: true,
      notes,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown AI mapping failure';
    notes.push(`AI mapping failed (${message}). Returning empty canonical sections.`);

    return {
      mappedSections: emptyMapped,
      usedAI: false,
      notes,
    };
  }
}