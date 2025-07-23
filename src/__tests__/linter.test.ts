import { Linter } from '../linter';
import { LlmClient } from '../llm/client';
import { Config } from '../config';

describe('Linter', () => {
  it('should return suggestions from the LLM', async () => {
    const mockLlmClient: LlmClient = {
      getCompletion: async () =>
        JSON.stringify([
          {
            file: 'test.ts',
            line: 1,
            message: 'This is a test suggestion.',
          },
        ]),
    };

    const config: Config = {
      rules: [
        {
          name: 'Test Rule',
          description: 'A test rule.',
          language: 'typescript',
          prompt: 'A test prompt.',
        },
      ],
    };

    const linter = new Linter(mockLlmClient, config, 'a-diff');
    const suggestions = await linter.run();

    expect(suggestions).toHaveLength(1);
    expect(suggestions[0].message).toBe('This is a test suggestion.');
  });
});