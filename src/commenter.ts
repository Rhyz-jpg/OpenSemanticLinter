import { getOctokit } from './github';
import { Suggestion } from './suggestion';
import * as core from '@actions/core';

type Octokit = ReturnType<typeof getOctokit>;

export class Commenter {
  constructor(
    private readonly octokit: Octokit,
    private readonly context: {
      repo: { owner: string; repo: string };
      payload: { pull_request?: { number: number } };
    }
  ) {}

  async postSuggestions(suggestions: Suggestion[]): Promise<void> {
    core.info(`Posting ${suggestions.length} suggestions...`);

    if (!this.context.payload.pull_request) {
      core.warning('Not in a pull request, skipping commenting.');
      return;
    }

    for (const suggestion of suggestions) {
      await this.postSuggestion(suggestion);
    }
  }

  private async postSuggestion(suggestion: Suggestion): Promise<void> {
    core.info(
      `Posting suggestion for ${suggestion.file}:${suggestion.line} - ${suggestion.message}`
    );

    if (!this.context.payload.pull_request) {
      core.warning('Not in a pull request, skipping commenting.');
      return;
    }

    await this.octokit.rest.pulls.createReviewComment({
      owner: this.context.repo.owner,
      repo: this.context.repo.repo,
      pull_number: this.context.payload.pull_request.number,
      body: suggestion.message,
      path: suggestion.file,
      line: suggestion.line,
    });
  }
}