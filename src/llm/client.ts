// Defines the interface for an LLM client, ensuring a consistent
// contract for all supported LLM providers.

export interface LlmClient {
  /**
   * Sends a prompt to the LLM and returns the completion.
   * @param prompt The prompt to send to the LLM.
   * @returns The LLM's response.
   */
  getCompletion(prompt: string): Promise<string>;
}