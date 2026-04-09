## ADDED Requirements

### Requirement: Every log line includes an ISO 8601 timestamp
Every line emitted to stdout/stderr by the scraper SHALL be prefixed with an ISO 8601 UTC timestamp so that operators can sort and correlate concurrent log output.

#### Scenario: Log line emitted during batch run
- **WHEN** any log line is emitted during a batch run (startup, per-URL, AI, sheets)
- **THEN** the line SHALL begin with a UTC timestamp in the format `YYYY-MM-DDTHH:mm:ss.SSSZ`

### Requirement: Batch context prefix propagated to all sub-system logs
Every log line emitted while processing a specific URL in batch mode SHALL include the `[n/total]` prefix, including lines from the AI mapper and sheets appender, so that each line can be attributed to a specific URL task.

#### Scenario: AI mapper log during batch run
- **WHEN** the AI mapper emits a log line while processing URL index 5 of 47
- **THEN** the line SHALL include the prefix `[5/47]`

#### Scenario: Sheets appender log during batch run
- **WHEN** the Google Sheets appender emits a log line while appending url index 12 of 47
- **THEN** the line SHALL include the prefix `[12/47]`

#### Scenario: Single-URL run has no batch prefix
- **WHEN** the scraper is run in single-URL mode
- **THEN** no `[n/total]` prefix SHALL appear on log lines (timestamps still present)

## MODIFIED Requirements

### Requirement: AI composition mapper invocation log
When the AI composition mapper is called for a URL, it SHALL log a line when the call begins, a line when the call ends (success or failure), and a line when the call times out. All lines SHALL include the batch context prefix when running in batch mode.

#### Scenario: AI mapper is invoked
- **WHEN** `mapProductCompositionWithAI` is called with composition text for a URL
- **THEN** a log line SHALL appear as `[ai-mapper] calling AI for <url>` before the API request is sent

#### Scenario: AI call succeeds
- **WHEN** the AI API call completes successfully
- **THEN** a log line SHALL appear as `[ai-mapper] done in <duration>ms`

#### Scenario: AI call fails with an error
- **WHEN** the AI API call throws an error (network error, API error, invalid response)
- **THEN** a log line SHALL appear as `[ai-mapper] error after <duration>ms — <message>`

#### Scenario: AI call times out
- **WHEN** the AI API call does not respond within the configured timeout
- **THEN** a log line SHALL appear as `[ai-mapper] timed out after <timeoutMs>ms`

#### Scenario: AI retry logged
- **WHEN** the AI mapper retries after a failure
- **THEN** a log line SHALL appear as `[ai-mapper] retry <n>/<maxRetries> after <delay>ms`
