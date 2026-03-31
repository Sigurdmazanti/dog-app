## MODIFIED Requirements

### Requirement: URL dispatch routes to correct scraper
The scraping pipeline MUST route incoming URLs to the correct brand-specific scraper module using a deterministic `if`/`else if` chain, and MUST throw an error for unrecognized URLs.

#### Scenario: Known URL is dispatched correctly
- **WHEN** the scraper receives a URL containing a recognized brand domain fragment (e.g., `zooplus`, `emea.acana`, `advancepet.com`, `almonature.com`, `amanova`, `animonda`)
- **THEN** the pipeline invokes the corresponding brand scraper function

#### Scenario: Unknown URL is rejected
- **WHEN** the scraper receives a URL that does not match any recognized brand
- **THEN** the pipeline throws an `Unsupported URL` error

#### Scenario: No fallthrough between URL branches
- **WHEN** the scraper receives a URL matching one brand
- **THEN** no other brand scraper is invoked and no error is thrown from subsequent branches
