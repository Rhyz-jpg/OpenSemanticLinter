# Semantic Linter GitHub Action Plan

- [ ] **Phase 1: Core Action Setup**
  - [ ] Initialize a new TypeScript GitHub Action project.
  - [ ] Define the action's inputs and outputs in `action.yml` (e.g., `repo-token`, `config-path`).
  - [ ] Implement basic PR interaction to fetch the diff.

- [ ] **Phase 2: Configuration and Rule Ingestion**
  - [ ] Design the YAML structure for the human-readable linting rules.
  - [ ] Implement the logic to parse the rule configuration file.

- [ ] **Phase 3: LLM Integration**
  - [ ] Create a modular interface for interacting with different LLM providers.
  - [ ] Implement the first LLM provider (e.g., OpenAI).
  - [ ] Implement support for other major providers (e.g., Anthropic, Google).

- [ ] **Phase 4: Code Analysis and Suggestion**
  - [ ] Implement the core logic to send the code diff and rules to the LLM.
  - [ ] Process the LLM's response to extract suggestions.
  - [ ] Implement the logic to post suggestions as comments on the PR.

- [ ] **Phase 5: Documentation and Refinement**
  - [ ] Write a comprehensive `README.md` with usage instructions.
  - [ ] Add unit and integration tests.
  - [ ] Publish the action to the GitHub Marketplace.