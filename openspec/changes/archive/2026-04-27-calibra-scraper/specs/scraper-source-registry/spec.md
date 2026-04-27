## ADDED Requirements

### Requirement: Source registry dispatches Calibra URLs
The source registry SHALL route any URL containing `mycalibra.eu` to the Calibra scraper.

#### Scenario: Calibra URL is dispatched to Calibra scraper
- **WHEN** `findSource` is called with a URL containing `mycalibra.eu`
- **THEN** the returned entry SHALL use the `scrapeCalibra` function and have brand `Calibra`
