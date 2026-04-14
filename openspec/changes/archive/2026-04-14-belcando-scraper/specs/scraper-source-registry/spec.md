## ADDED Requirements

### Requirement: Source registry routes belcando.com URLs
The `sourceRegistry` array in `scraper/src/sourceRegistry.ts` SHALL include an entry with `domain: 'belcando.com'`, `brand: 'Belcando'`, and `scrape: scrapeBelcando`.

#### Scenario: belcando.com entry exists in the registry
- **WHEN** `sourceRegistry` is imported
- **THEN** it SHALL contain an entry with `domain` equal to `'belcando.com'`

#### Scenario: findSource resolves a belcando.com URL
- **WHEN** `findSource` is called with a URL that contains `belcando.com`
- **THEN** it SHALL return the Belcando source entry (not `undefined`)
