# OpenSemanticLinter

A flexible and powerful GitHub Action that uses Large Language Models (LLMs) to lint your pull requests based on a set of human-readable, semantic rules.

## Features

-   **Semantic Linting**: Go beyond traditional static analysis by defining rules in natural language.
-   **LLM-Powered**: Leverage the power of modern LLMs to analyze code changes.
-   **Extensible**: Easily add support for new LLM providers.
-   **Configurable**: Define your own linting rules in a simple YAML file.
-   **PR Integration**: Automatically posts suggestions as comments on your pull requests.

## Usage

To use the Semantic Linter in your workflow, add the following step to your job:

```yaml
name: Semantic Linter

on:
  pull_request:

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Run Semantic Linter
        uses: ./ # Replace with your-username/your-repo-name@v1 when published
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
          llm-provider: 'openai' # or another supported provider
          llm-api-key: ${{ secrets.OPENAI_API_KEY }}
          llm-model: 'gemini-2.5-pro' # optional, defaults to provider's default
```

## Configuration

The Semantic Linter is configured via a YAML file in your repository, by default at `.github/linter.yml`.

### Inputs

| Name             | Description                                            | Default                | Required |
| ---------------- | ------------------------------------------------------ | ---------------------- | -------- |
| `repo-token`     | The `GITHUB_TOKEN` secret.                             | -                      | `true`   |
| `config-path`    | Path to the linter configuration file.                 | `.github/linter.yml`   | `true`   |
| `llm-provider`   | The LLM provider to use (e.g., `openai`, `mock`).      | `openai`               | `true`   |
| `llm-api-key`    | The API key for the selected LLM provider.             | -                      | `true`   |
| `llm-model`      | The specific model to use (e.g., `gpt-4`, `gemini-pro`). | -                      | `false`  |
| `max-retries`    | The maximum number of retries for failed API calls.    | `3`                    | `false`  |
| `retry-delay`    | The delay in milliseconds between retries.             | `1000`                 | `false`  |

### Rule Configuration

Your configuration file should contain a list of rules to be enforced. Each rule has a `name`, `description`, `language`, and `prompt`.

**Example `.github/linter.yml`:**

```yaml
# A list of rules to enforce in pull requests.
rules:
  - name: "Enforce descriptive variable names"
    description: "Variable names should be descriptive and avoid single-letter names, except for loop counters."
    language: "javascript"
    prompt: "Review the following code and identify any variable names that are not descriptive. Suggest better names."

  - name: "Check for missing error handling"
    description: "Ensure that all fallible operations are wrapped in appropriate error handling blocks (e.g., try-catch)."
    language: "typescript"
    prompt: "Analyze the code for any operations that could fail (e.g., API calls, file I/O) and are not handled with try-catch or .catch()."
```

## Supported LLMs

-   **OpenAI**: `gpt-4`
-   **Google Gemini**: `gemini-pro`
-   **Mock**: A mock client for local testing.

The system is designed to be easily extensible. To add a new provider, simply implement the `LlmClient` interface and add it to the `LlmClientFactory`.

## Local Testing

To test the action locally without committing to a repository, you can use the provided test script:

```bash
npm install
npm run test:local
```

This will run the action with a mock GitHub environment and a mock LLM client, allowing you to quickly verify changes.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License

This project is licensed under the MIT License.
