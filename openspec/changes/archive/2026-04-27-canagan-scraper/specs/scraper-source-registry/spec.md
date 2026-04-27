## ADDED Requirements

### Requirement: Source registry dispatches Canagan URLs
The source registry SHALL route any URL containing `canagan.com` to the Canagan scraper.

#### Scenario: Canagan URL is dispatched to Canagan scraper
- **WHEN** `findSource` is called with a URL containing `canagan.com`
- **THEN** the returned entry SHALL use the `scrapeCanagan` function and have `brand` set to `"Canagan"`
