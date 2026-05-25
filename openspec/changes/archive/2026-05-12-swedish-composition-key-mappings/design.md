## Context

`productCompositionKeyMap.ts` contains alias arrays for each canonical composition field. When the scraper parses a product's analysis section, it normalises each label to lowercase and looks it up across these alias arrays to find the matching field. The file already includes Danish (`fedt`, `aske`, `jern`) and English aliases, but no Swedish equivalents.

Alpha Spirit Sweden products include analysis labels in Swedish. Without Swedish aliases, these labels fall through the matcher and the corresponding fields are left null in the scraped output.

## Goals / Non-Goals

**Goals:**
- Add Swedish aliases for the five fields confirmed missing: `fat`, `crudeAsh`, `fiber`, `iron`, `omega3`
- Cover the exact label strings observed in the Alpha Spirit Sweden product text

**Non-Goals:**
- Comprehensive Swedish coverage for all fields (only add what is confirmed from the source text)
- Changes to matching logic, normalisation, or any other file

## Decisions

### Extend existing alias arrays rather than adding a language layer

The alias arrays are flat string lists — there is no language-keyed structure. Adding Swedish strings directly to each array keeps the change minimal and consistent with how Danish was added previously. A language-keyed approach would require interface changes and is not justified for a handful of aliases.

**Alternative considered:** separate `swedish*KeyMap` objects merged at runtime — rejected as over-engineering for a data-only addition.

### Add only confirmed aliases from the source text

The user provided a complete product label. Only aliases present in that label (or their obvious normalised forms) are added. Guessed Swedish synonyms are excluded to avoid false positives.

## Risks / Trade-offs

- **Risk**: Swedish word `aska` (ash) is a common word and could appear in non-nutritional context. → Mitigation: the matcher operates on already-isolated analysis row labels, so incidental matches are unlikely.
- **Risk**: `omega-3 fettsyror` contains a special character (`-`) and Swedish plural suffix. → Mitigation: add both `omega-3 fettsyror` and `omega 3 fettsyror` to cover spacing variants, consistent with how Danish variants were added.
