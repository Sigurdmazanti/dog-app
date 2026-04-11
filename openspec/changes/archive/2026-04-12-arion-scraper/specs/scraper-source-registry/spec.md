## ADDED Requirements

### Requirement: Source registry dispatches Arion URLs
The source registry SHALL route any URL containing `arion-petfood.dk` to the Arion scraper.

#### Scenario: Arion URL is dispatched to Arion scraper
- **WHEN** `findSource` is called with a URL containing `arion-petfood.dk`
- **THEN** the returned entry SHALL use the `scrapeArion` function and have brand `Arion`
