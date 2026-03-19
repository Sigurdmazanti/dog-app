## ADDED Requirements

### Requirement: Whole-word alias matching
The scraper helper module SHALL expose a `matchesAlias(name: string, alias: string): boolean` function that returns `true` only when `alias` appears in `name` as a complete word — meaning there is no Unicode letter (`\p{L}`) immediately before or after the matched region.

The function SHALL be case-insensitive and MUST handle multi-word aliases (e.g. `"crude fat"`) correctly by checking boundaries only at the outer edges of the alias string.

The function SHALL escape any regex special characters in `alias` before constructing the pattern.

#### Scenario: Exact match
- **WHEN** `matchesAlias("fedt", "fedt")` is called
- **THEN** it SHALL return `true`

#### Scenario: Compound word false positive rejected
- **WHEN** `matchesAlias("fedtsyre", "fedt")` is called
- **THEN** it SHALL return `false` because `s` (a Unicode letter) immediately follows `fedt`

#### Scenario: Prefixed compound word false positive rejected
- **WHEN** `matchesAlias("råfedt", "fedt")` is called
- **THEN** it SHALL return `false` because `å` (a Unicode letter) immediately precedes `fedt`

#### Scenario: Label with preceding/following punctuation
- **WHEN** `matchesAlias("fedt, tørret", "fedt")` is called
- **THEN** it SHALL return `true` because `,` is not a Unicode letter

#### Scenario: Multi-word alias matches full phrase
- **WHEN** `matchesAlias("crude fat", "crude fat")` is called
- **THEN** it SHALL return `true`

#### Scenario: Multi-word alias not matched as suffix
- **WHEN** `matchesAlias("total crude fat", "crude fat")` is called
- **THEN** it SHALL return `true` because a space (non-letter) precedes `crude`

#### Scenario: Alias not matched as prefix of longer word in multi-word alias
- **WHEN** `matchesAlias("crude fatty", "crude fat")` is called
- **THEN** it SHALL return `false` because `t` and `y` (Unicode letters) follow `fat`
