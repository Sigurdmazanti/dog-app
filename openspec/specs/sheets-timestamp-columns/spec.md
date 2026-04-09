## Purpose

Define how the scraper export pipeline appends `item_created_at` and `item_updated_at` timestamp columns to Google Sheets rows, formatted as Supabase/PostgreSQL-compatible ISO 8601 strings localised to the `Europe/Copenhagen` timezone.

## Requirements

### Requirement: Timestamp columns appended to schema tail
The scraper export pipeline MUST append `item_created_at` and `item_updated_at` as the last two columns of `GOOGLE_SHEETS_SCHEMA`, in that order, positioned after `item_note`.

#### Scenario: Timestamp columns present at schema tail
- **WHEN** `GOOGLE_SHEETS_SCHEMA` is inspected
- **THEN** `item_created_at` appears at the second-to-last position and `item_updated_at` appears at the last position, both after `item_note`

### Requirement: Timestamps formatted as PostgreSQL-compatible ISO 8601 with Copenhagen timezone
The scraper export pipeline MUST format `item_created_at` and `item_updated_at` as ISO 8601 strings with a UTC offset reflecting the `Europe/Copenhagen` timezone (DST-aware), compatible with PostgreSQL `timestamptz`.

#### Scenario: Timestamp in winter (CET, UTC+1)
- **WHEN** a row is built during a date where Copenhagen is on CET (UTC+1)
- **THEN** both timestamp columns contain a string matching the pattern `YYYY-MM-DDTHH:mm:ss+01:00`

#### Scenario: Timestamp in summer (CEST, UTC+2)
- **WHEN** a row is built during a date where Copenhagen is on CEST (UTC+2)
- **THEN** both timestamp columns contain a string matching the pattern `YYYY-MM-DDTHH:mm:ss+02:00`

### Requirement: Both timestamps set to scrape time on creation
The scraper export pipeline MUST set both `item_created_at` and `item_updated_at` to the same timestamp captured at scrape time when building a new row.

#### Scenario: Created and updated match on initial scrape
- **WHEN** the appender builds a row for a freshly scraped product
- **THEN** the value of `item_created_at` equals the value of `item_updated_at`
