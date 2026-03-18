/**
 * Escapes all regex special characters in a string so it can be used as a
 * literal pattern inside a RegExp constructor.
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Returns true when `alias` appears in `name` as a complete word.
 *
 * Uses Unicode-aware negative lookbehind/lookahead (`\p{L}`) so that Danish
 * compound words are handled correctly:
 *   - "fedtsyre" does NOT match alias "fedt"  (letter 's' follows immediately)
 *   - "råfedt"  does NOT match alias "fedt"  (letter 'å' precedes immediately)
 *   - "fedt"    DOES match alias "fedt"
 *   - "crude fat" DOES match alias "crude fat" (boundaries are at the edges)
 *
 * The `u` flag enables \p{L} (Unicode letter category); `i` gives
 * case-insensitivity as a safety net (names are already lowercased).
 */
export function matchesAlias(name: string, alias: string): boolean {
  const pattern = new RegExp(
    '(?<!\\p{L})' + escapeRegex(alias) + '(?!\\p{L})',
    'iu'
  );
  return pattern.test(name);
}
