## ADDED Requirements

### Requirement: Source registry dispatches Avlskovgaard URLs
The source registry SHALL route any URL containing `avlskovgaard.dk` to the Avlskovgaard scraper.

#### Scenario: Avlskovgaard URL is dispatched to Avlskovgaard scraper
- **WHEN** `findSource` is called with a URL containing `avlskovgaard.dk`
- **THEN** the returned entry SHALL use the `scrapeAvlskovgaard` function and have brand `Avlskovgaard`
