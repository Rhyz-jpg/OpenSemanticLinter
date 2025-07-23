// A script to run the action locally for testing.
// This script mocks the GitHub Actions environment and context.

import * as github from '@actions/github';
import { run } from '../src/main';

async function localTest() {
  // Set environment variables to mock action inputs
  process.env['INPUT_REPO-TOKEN'] = 'mock-token-for-local-test';
  process.env['INPUT_CONFIG-PATH'] = '.github/linter.yml';
  process.env['INPUT_LLM-PROVIDER'] = 'mock';
  process.env['INPUT_LLM-API-KEY'] = 'mock-api-key';

  // Mock the GitHub context
  Object.defineProperty(github, 'context', {
    value: {
      payload: {
        pull_request: {
          number: 123,
          head: { sha: 'test-sha' },
        },
      },
      repo: {
        owner: 'local-owner',
        repo: 'local-repo',
      },
      eventName: 'pull_request',
    },
  });

  // Mock the getOctokit function to return a client with a mocked 'get' method
  Object.defineProperty(github, 'getOctokit', {
    value: () => ({
      rest: {
        pulls: {
          get: async () => ({
            data: '--- a/test.js\n+++ b/test.js\n@@ -1,1 +1,2 @@\n-console.log("hello");\n+console.log("hello, world!");\n',
          }),
          createReviewComment: async (options: any) => {
            console.log('[MOCK] Creating review comment:', options);
            return { data: {} };
          },
        },
      },
    }),
  });

  console.log('Starting local test run...');
  await run();
  console.log('Local test run finished.');
}

localTest().catch(error => {
  console.error('Local test failed:', error);
  process.exit(1);
});