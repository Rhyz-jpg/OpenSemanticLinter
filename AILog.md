# AI Development Log: OpenSemanticLinter

This document outlines the step-by-step process undertaken by the AI to develop the OpenSemanticLinter GitHub Action.

## Phase 1: Planning and Architecture

-   **Initial Goal**: Plan a GitHub Action to act as a semantic linter for pull requests, using an LLM to compare code against human-readable rules.
-   **Language Selection**: Chose TypeScript for its strong integration with the GitHub Actions toolkit (`@actions/toolkit`).
-   **Architecture Design**: Created a high-level architecture diagram using Mermaid to visualize the data flow between the GitHub PR, the action, the configuration file, the LLM API, and the PR comments.
-   **Project Plan**: Established a detailed, multi-phase project plan and tracked it using a `TODO.md` file and the interactive to-do list.

## Phase 2: Core Action Setup & Configuration

-   **Project Scaffolding**: Initialized a complete TypeScript project, creating `package.json`, `tsconfig.json`, and `jest.config.js`.
-   **Action Definition**: Created `action.yml` to define the action's metadata, inputs (`repo-token`, `config-path`), and execution environment.
-   **Rule Ingestion**: Designed a human-readable YAML format for linting rules and implemented the parsing logic in `src/config.ts` using the `js-yaml` library.
-   **PR Interaction**: Implemented the core logic in `src/main.ts` to interact with the GitHub API, fetch pull request diffs, and read the action's inputs.

## Phase 3: LLM Integration

-   **Modular Design**: Created a provider-agnostic `LlmClient` interface (`src/llm/client.ts`) and a factory function (`src/llm/factory.ts`) to easily switch between different LLM providers.
-   **OpenAI Integration**: Implemented the first LLM provider, creating an `OpenAiClient` in `src/llm/openai.ts` that integrates with the `openai` package.
-   **Google Gemini Integration**: Added support for Google Gemini models by implementing a `GeminiClient` in `src/llm/gemini.ts` using the `@google/generative-ai` package.
-   **Model Configuration**: Added an `llm-model` input to `action.yml` to allow users to specify the exact model to use (e.g., `gpt-4`, `gemini-pro`).

## Phase 4: Code Analysis and Suggestion Posting

-   **Core Linter Logic**: Created a `Linter` class (`src/linter.ts`) to orchestrate the analysis, which involves creating prompts, sending them to the LLM, and parsing the response.
-   **Suggestion Handling**: Implemented logic to process the LLM's response, expecting a JSON array of suggestions.
-   **PR Commenting**: Created a `Commenter` class (`src/commenter.ts`) to post the extracted suggestions as review comments directly on the relevant lines of the pull request.

## Phase 5: Refinement, Testing, and Debugging

-   **File Structure Refactoring**: Improved the project's organization by moving the main entry point to `src/main.ts`, creating a `scripts` directory for the local test runner, and adding a `src/github.ts` wrapper for better mocking.
-   **Local Testing Environment**: Set up a robust local testing script (`scripts/local-test.ts`) using `ts-node` and a mock LLM client to allow for rapid development and verification without requiring a live GitHub workflow.
-   **Unit Testing**: Established a unit testing framework with Jest and added an initial test for the `Linter` class.
-   **Documentation**: Created a comprehensive `README.md` detailing the action's features, usage, configuration options, and local testing procedures.
-   **Bug Fixing & Robustness**:
    -   **JSON Parsing**: Iteratively improved the JSON parsing logic to handle various LLM response formats, including markdown code blocks and conversational preambles. This was the most significant debugging challenge.
    -   **Prompt Engineering**: Refined the prompt sent to the LLM, adding role-playing ("You are an expert code reviewer") and more explicit instructions to ensure a reliable, JSON-only response.
    -   **Retry Logic**: Implemented a configurable retry mechanism (`src/llm/retry.ts`) to handle transient network errors (like `503 Service Unavailable`) when communicating with the LLM API.
    -   **GitHub Actions Workflow Issues**: Diagnosed and fixed several common GitHub Actions issues, including ensuring the `dist` directory is committed to the repository and correcting the entry point in `action.yml`.
-   **Code Commits**: Staged, committed, and pushed all changes to the remote repository, incorporating user feedback to improve commit practices.