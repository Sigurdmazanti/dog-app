import * as fs from 'fs';
import * as path from 'path';

export function stripMarkdownPrefix(line: string): string {
  const trimmed = line.trimStart();
  // Bullet list: - or *
  if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
    return trimmed.slice(2);
  }
  // Numbered list: 1. , 12. , etc.
  const numberedMatch = trimmed.match(/^\d+\.\s/);
  if (numberedMatch) {
    return trimmed.slice(numberedMatch[0].length);
  }
  return trimmed;
}

export function extractMarkdownLinkUrl(line: string): string {
  const match = line.match(/\[.*?\]\((.*?)\)/);
  if (match) {
    return match[1];
  }
  return line;
}

export function parseUrlListFile(filePath: string): string[] {
  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`URL list file not found: ${resolved}`);
  }

  const content = fs.readFileSync(resolved, 'utf-8');
  return content
    .split('\n')
    .map((line) => stripMarkdownPrefix(line))
    .map((line) => extractMarkdownLinkUrl(line))
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'));
}
