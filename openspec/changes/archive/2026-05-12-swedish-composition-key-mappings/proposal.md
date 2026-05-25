## Why

Swedish-language product pages use different words for nutritional fields than the Danish and English aliases already in `productCompositionKeyMap.ts`. Without Swedish aliases, the scraper's local key-matching step fails to map Swedish analysis labels (e.g. `Fett`, `Växttråd`, `Järn`) to canonical fields, leaving them unparsed.

## What Changes

- Add Swedish aliases to the `fat`, `crudeAsh`, `fiber`, `iron`, and `omega3` key maps in `productCompositionKeyMap.ts`
- Swedish terms identified from Alpha Spirit (Sweden) product label:
  - `fett` → fat
  - `aska` → crudeAsh
  - `växttråd` → fiber (crude fibre)
  - `järn` → iron
  - `omega-3 fettsyror` / `omega 3 fettsyror` → omega3

## Capabilities

### New Capabilities

- `swedish-composition-key-mappings`: Defines which Swedish-language nutritional label aliases map to canonical composition fields in the key map lookup table.

### Modified Capabilities

<!-- No existing spec-level requirements change — this extends alias data only. -->

## Impact

- `scraper/src/helpers/composition/productCompositionKeyMap.ts` — data-only additions, no interface or logic changes
- No breaking changes; existing Danish and English aliases are unaffected
- No new dependencies, no Supabase schema changes, no EAS build required
