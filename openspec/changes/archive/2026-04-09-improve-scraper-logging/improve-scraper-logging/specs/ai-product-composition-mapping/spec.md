## ADDED Requirements

### Requirement: AI request timeout is enforced
The AI composition mapper SHALL enforce a maximum duration on each OpenAI API call. Calls that exceed the timeout SHALL be treated as failures and trigger the retry loop.

#### Scenario: AI call exceeds timeout
- **WHEN** the OpenAI API does not respond within the configured timeout duration
- **THEN** the in-flight call SHALL be aborted and the mapper SHALL proceed to the next retry attempt (or return the fallback-safe output if retries are exhausted)

#### Scenario: AI call completes within timeout
- **WHEN** the OpenAI API responds before the configured timeout
- **THEN** the response SHALL be processed normally with no timeout-related side effects

### Requirement: AI request timeout is configurable with a documented default
The timeout for AI API calls SHALL default to **60 000 ms (60 seconds)** and SHALL be overridable via the `OPENAI_TIMEOUT_MS` environment variable so operators can tune it without code changes.

#### Scenario: Default timeout applied when env var is absent
- **WHEN** `OPENAI_TIMEOUT_MS` is not set in the environment
- **THEN** the mapper SHALL use a 60 000 ms timeout for each AI API call

#### Scenario: Custom timeout applied when env var is set
- **WHEN** `OPENAI_TIMEOUT_MS` is set to `30000`
- **THEN** the mapper SHALL use a 30 000 ms timeout for each AI API call
