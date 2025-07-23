import { LlmClient } from '../../src/llm/client';

export class MockOpenAiClient implements LlmClient {
  async getCompletion(prompt: string): Promise<string> {
    console.log(`[MOCK] OpenAI Client received prompt:\n${prompt}`);
    const mockSuggestions = [
      {
        file: 'src/main.ts',
        line: 10,
        message: 'This is a mock suggestion.',
      },
    ];
    return JSON.stringify(mockSuggestions);
  }
}