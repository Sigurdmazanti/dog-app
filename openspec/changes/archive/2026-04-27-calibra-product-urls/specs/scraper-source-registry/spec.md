## MODIFIED Requirements

### Requirement: Source registry dispatches Calibra URLs
The source registry SHALL route any URL containing `calibrastore.co.uk` to the Calibra scraper.

#### Scenario: Calibra URL is dispatched to Calibra scraper
- **WHEN** `findSource` is called with a URL containing `calibrastore.co.uk`
- **THEN** the returned entry SHALL use the `scrapeCalibra` function and have brand `Calibra`
