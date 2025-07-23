import * as core from '@actions/core';
import * as github from './github';
import { loadConfig } from './config';
import { createLlmClient } from './llm/factory';
import { Linter } from './linter';
import { Commenter } from './commenter';

export async function run() {
  try {
    const token = core.getInput('repo-token', { required: true });
    const configPath = core.getInput('config-path', { required: true });
    const llmProvider = core.getInput('llm-provider', { required: true });
    const llmApiKey = core.getInput('llm-api-key', { required: true });
    const llmModel = core.getInput('llm-model');

    const config = loadConfig(configPath);
    const llmClient = createLlmClient(llmProvider, llmApiKey);

    const octokit = github.getOctokit(token);
    const context = github.context;

    if (context.payload.pull_request == null) {
      core.setFailed('No pull request found.');
      return;
    }

    const pullRequest = context.payload.pull_request;
    core.info(`PR Number: ${pullRequest.number}`);

    const diffResponse = await octokit.rest.pulls.get({
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: pullRequest.number,
      mediaType: {
        format: 'diff'
      }
    });

    const linter = new Linter(
      llmClient,
      config,
      String(diffResponse.data),
      llmModel
    );
    const suggestions = await linter.run();

    const commenter = new Commenter(octokit, context);
    await commenter.postSuggestions(suggestions);

  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

// This allows the action to be run directly or imported for testing.
if (require.main === module) {
  run();
}