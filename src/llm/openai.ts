import { LlmClient } from './client';
import OpenAI from 'openai';

export class OpenAiClient implements LlmClient {
  private readonly client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async getCompletion(prompt: string, model?: string): Promise<string> {
    const completion = await this.client.chat.completions.create({
      model: model || 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    return completion.choices[0].message.content ?? '';
  }
}