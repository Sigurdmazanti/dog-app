## MODIFIED Requirements

### Requirement: URL dispatch routes to correct scraper
The scraping pipeline MUST route incoming URLs to the correct brand-specific scraper module using a declarative source registry (array of domain-pattern/scraper-function pairs), and MUST throw an error for unrecognised URLs in single-URL mode. In batch mode, unrecognised URLs MUST be skipped rather than throwing.

#### Scenario: Known URL is dispatched correctly
- **WHEN** the scraper receives a URL containing a recognised brand domain fragment (e.g., `zooplus`, `emea.acana`, `advancepet.com`, `almonature.com`, `amanova`, `animonda`)
- **THEN** the pipeline invokes the corresponding brand scraper function from the source registry

#### Scenario: Unknown URL is rejected in single-URL mode
- **WHEN** the scraper receives a single URL that does not match any registered source
- **THEN** the pipeline throws an `Unsupported URL` error

#### Scenario: Unknown URL is skipped in batch mode
- **WHEN** the batch processor encounters a URL that does not match any registered source
- **THEN** the URL is skipped with a log message and does not cause the batch to fail

#### Scenario: No fallthrough between URL branches
- **WHEN** the scraper receives a URL matching one source
- **THEN** no other source scraper is invoked and no error is thrown from subsequent entries

#### Scenario: Source registry is queryable for domain matching
- **WHEN** the batch processor needs to filter a list of URLs
- **THEN** it queries the source registry to determine which URLs have a matching scraper
