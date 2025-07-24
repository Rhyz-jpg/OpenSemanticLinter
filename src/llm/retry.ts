import { LlmClient } from './client';
import * as core from '@actions/core';

export function withRetry(
  client: LlmClient,
  maxRetries: number,
  retryDelay: number
): LlmClient {
  return {
    getCompletion: async (prompt: string, model?: string) => {
      for (let i = 0; i <= maxRetries; i++) {
        try {
          return await client.getCompletion(prompt, model);
        } catch (error) {
          if (i === maxRetries) {
            throw error;
          }
          if (error instanceof Error && error.message.includes('503')) {
            core.warning(
              `Attempt ${i + 1} failed with 503. Retrying in ${
                retryDelay / 1000
              }s...`
            );
            await new Promise(resolve => setTimeout(resolve, retryDelay));
          } else {
            throw error;
          }
        }
      }
      throw new Error('Max retries reached');
    },
  };
}