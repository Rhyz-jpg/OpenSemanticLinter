import { LlmClient } from './llm/client';
import { Config, Rule } from './config';
import { Suggestion } from './suggestion';
import * as core from '@actions/core';

export class Linter {
  constructor(
    private readonly llmClient: LlmClient,
    private readonly config: Config,
    private readonly diff: string,
    private readonly model?: string
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
    const completion = await this.llmClient.getCompletion(prompt, this.model);

    core.info(`LLM response for rule "${rule.name}":\n${completion}`);

    return this.parseSuggestions(completion);
  }

  private parseSuggestions(completion: string): Suggestion[] {
    core.debug(`Raw LLM response:\n---\n${completion}\n---`);

    let jsonString = '';

    const jsonBlockRegex = /```json\n([\s\S]*?)\n```/;
    const blockMatch = completion.match(jsonBlockRegex);

    if (blockMatch && blockMatch[1]) {
      jsonString = blockMatch[1];
      core.debug(`Extracted JSON from markdown block:\n---\n${jsonString}\n---`);
    } else {
      const arrayRegex = /\[[\s\S]*\]/;
      const arrayMatch = completion.match(arrayRegex);
      if (arrayMatch && arrayMatch[0]) {
        jsonString = arrayMatch[0];
        core.debug(`Extracted raw JSON array:\n---\n${jsonString}\n---`);
      }
    }

    if (!jsonString) {
      core.info('No suggestions found in LLM response.');
      return [];
    }

    try {
      const suggestions = JSON.parse(jsonString) as Suggestion[];
      return suggestions.filter(s => s.file && s.line && s.message);
    } catch (error) {
      core.warning(`Failed to parse extracted JSON. Raw response was: ${completion}`);
      if (error instanceof Error) {
        core.warning(`Error: ${error.message}`);
      }
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

      Analyze the code diff based on the rule. Your response MUST be a valid JSON array of suggestions and nothing else. Do not include any explanatory text, markdown formatting, or any characters outside of the JSON array. If there are no suggestions, return an empty array [].

      The JSON format is:
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