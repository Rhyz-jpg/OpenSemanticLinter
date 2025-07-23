import { LlmClient } from './llm/client';
import { Config, Rule } from './config';
import { Suggestion } from './suggestion';
import * as core from '@actions/core';

export class Linter {
  constructor(
    private readonly llmClient: LlmClient,
    private readonly config: Config,
    private readonly diff: string
  ) {}

  async run(): Promise<Suggestion[]> {
    core.info('Running linter...');

    const allSuggestions: Suggestion[] = [];

    for (const rule of this.config.rules) {
      const suggestions = await this.processRule(rule);
      allSuggestions.push(...suggestions);
    }

    return allSuggestions;
  }

  private async processRule(rule: Rule): Promise<Suggestion[]> {
    core.info(`Processing rule: ${rule.name}`);

    const prompt = this.createPrompt(rule);
    const completion = await this.llmClient.getCompletion(prompt);

    core.info(`LLM response for rule "${rule.name}":\n${completion}`);

    return this.parseSuggestions(completion);
  }

  private parseSuggestions(completion: string): Suggestion[] {
    try {
      const suggestions = JSON.parse(completion) as Suggestion[];
      return suggestions.filter(s => s.file && s.line && s.message);
    } catch (error) {
      core.warning(`Failed to parse LLM response as JSON: ${completion}`);
      return [];
    }
  }

  private createPrompt(rule: Rule): string {
    return `
      Rule: ${rule.name}
      Description: ${rule.description}
      Language: ${rule.language}
      Prompt: ${rule.prompt}

      Code Diff:
      \`\`\`diff
      ${this.diff}
      \`\`\`

      Please analyze the code diff based on the rule and provide a JSON array of suggestions in the following format:
      [
        {
          "file": "path/to/file.ext",
          "line": 123,
          "message": "Your suggestion here."
        }
      ]
    `;
  }
}