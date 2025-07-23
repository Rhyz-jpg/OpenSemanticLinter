// A factory function to create an LLM client based on the specified provider.

import { LlmClient } from './client';
import { OpenAiClient } from './openai';
import { GeminiClient } from './gemini';
import * as core from '@actions/core';

/**
 * Creates an LLM client based on the specified provider.
 * @param provider The LLM provider to use (e.g., openai, gemini).
 * @param apiKey The API key for the selected provider.
 * @returns An instance of the LlmClient.
 */
export function createLlmClient(provider: string, apiKey: string): LlmClient {
  core.info(`Creating LLM client for provider: ${provider}`);

  switch (provider.toLowerCase()) {
    case 'openai':
      return new OpenAiClient(apiKey);
    case 'gemini':
      return new GeminiClient(apiKey);
    case 'mock':
      // This is a special case for local testing
      const { MockOpenAiClient } = require('../../scripts/mocks/openai');
      return new MockOpenAiClient();
    default:
      throw new Error(`Unsupported LLM provider: ${provider}`);
  }
}