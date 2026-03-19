import OpenAI from 'openai';
import { percentageStringToInt } from './percentageStringToInt';
import { matchesAlias } from './matchesAlias';
import {
  AminoAcidsData,
  FattyAcidsData,
  MineralsData,
  NutritionData,
  SaltsData,
  SugarAlcoholsData,
  VitaminLikeData,
  VitaminsData,
} from '../interfaces/productComposition';
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

export interface CompositionEntry {
  name: string;
  valueText: string;
}

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

const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-5-nano';
const DEFAULT_TIMEOUT_MS = 8_000;
const DEFAULT_MAX_RETRIES = 1;

const parseNumberEnv = (value: string | undefined, fallback: number): number => {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
};

function createEmptySections(): CompositionSections {
  return {
    nutritionData: {},
    mineralsData: {},
    saltsData: {},
    vitaminsData: {},
    aminoAcidsData: {},
    vitaminLikeData: {},
    fattyAcidsData: {},
    sugarAlcoholsData: {},
  };
}

function createCanonicalSchemaTemplate(): Record<SectionName, Record<string, null>> {
  const template = {} as Record<SectionName, Record<string, null>>;

  for (const sectionName of Object.keys(SECTION_KEY_MAPS) as SectionName[]) {
    const sectionTemplate: Record<string, null> = {};
    const keyMap = SECTION_KEY_MAPS[sectionName] as Record<string, string[]>;

    for (const canonicalField of Object.keys(keyMap)) {
      sectionTemplate[canonicalField] = null;
    }

    template[sectionName] = sectionTemplate;
  }

  return template;
}

function mapEntriesByAliases(entries: CompositionEntry[]): CompositionSections {
  const sections = createEmptySections();

  for (const entry of entries) {
    const normalizedName = entry.name.toLowerCase().trim();
    const numericValue = percentageStringToInt(entry.valueText);

    if (!Number.isFinite(numericValue)) {
      continue;
    }

    for (const sectionName of Object.keys(SECTION_KEY_MAPS) as SectionName[]) {
      const keyMap = SECTION_KEY_MAPS[sectionName] as Record<string, string[]>;

      for (const [canonical, aliases] of Object.entries(keyMap)) {
        if (aliases.some((alias) => matchesAlias(normalizedName, alias))) {
          (sections[sectionName] as Record<string, number>)[canonical] = numericValue;
        }
      }
    }
  }

  return sections;
}

function createPrompt(entries: CompositionEntry[]): string {
  const schemaTemplate = createCanonicalSchemaTemplate();

  return [
    'You are a data extraction API.',
    '',
    'Return ONLY valid JSON.',
    '',
    'Rules:',
    '- Use null when missing',
    '- Do not guess values',
    '- Convert percentages to numbers (e.g. "29%" -> 29)',
    '- Use exactly this top-level shape and keys:',
    JSON.stringify(schemaTemplate, null, 2),
    '',
    'Input rows:',
    JSON.stringify(entries),
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

function mergeSections(primary: CompositionSections, secondary: CompositionSections): CompositionSections {
  const merged = createEmptySections();

  for (const sectionName of Object.keys(SECTION_KEY_MAPS) as SectionName[]) {
    const keyMap = SECTION_KEY_MAPS[sectionName] as Record<string, string[]>;
    const mergedSection = merged[sectionName] as Record<string, number>;
    const primarySection = primary[sectionName] as Record<string, number | undefined>;
    const secondarySection = secondary[sectionName] as Record<string, number | undefined>;

    for (const key of Object.keys(keyMap)) {
      const primaryValue = primarySection[key];
      const secondaryValue = secondarySection[key];
      if (typeof primaryValue === 'number' && Number.isFinite(primaryValue)) {
        mergedSection[key] = primaryValue;
      } else if (typeof secondaryValue === 'number' && Number.isFinite(secondaryValue)) {
        mergedSection[key] = secondaryValue;
      }
    }
  }

  return merged;
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

async function requestAIMapping(entries: CompositionEntry[]): Promise<CompositionSections> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set');
  }

  const timeoutMs = parseNumberEnv(process.env.OPENAI_TIMEOUT_MS, DEFAULT_TIMEOUT_MS);
  const maxRetries = parseNumberEnv(process.env.OPENAI_MAX_RETRIES, DEFAULT_MAX_RETRIES);
  const prompt = createPrompt(entries);
  const client = new OpenAI({ apiKey });

  let lastError: unknown = null;

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      const response = await withTimeout(
        client.chat.completions.create({
          model: DEFAULT_MODEL,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0,
        }),
        timeoutMs
      );

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
      lastError = error;

      if (attempt < maxRetries) {
        await wait(300 * (attempt + 1));
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Unknown AI mapping error');
}

export async function mapProductCompositionWithAI(entries: CompositionEntry[]): Promise<CompositionMappingResult> {
  const manualMapped = mapEntriesByAliases(entries);
  const notes: string[] = [];

  if (!process.env.OPENAI_API_KEY) {
    notes.push('AI mapping disabled because OPENAI_API_KEY is not configured. Using alias-based fallback mapping.');
    return {
      mappedSections: manualMapped,
      usedAI: false,
      notes,
    };
  }

  try {
    const aiMapped = await requestAIMapping(entries);
    return {
      mappedSections: mergeSections(aiMapped, manualMapped),
      usedAI: true,
      notes,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown AI mapping failure';
    notes.push(`AI mapping failed (${message}). Falling back to alias-based mapping.`);

    return {
      mappedSections: manualMapped,
      usedAI: false,
      notes,
    };
  }
}