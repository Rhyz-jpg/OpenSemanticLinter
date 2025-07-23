import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as core from '@actions/core';

export interface Rule {
  name: string;
  description: string;
  language: string;
  prompt: string;
}

export interface Config {
  rules: Rule[];
}

export function loadConfig(configPath: string): Config {
  try {
    const configContent = fs.readFileSync(configPath, 'utf8');
    const config = yaml.load(configContent) as Config;
    core.info(`Loaded ${config.rules.length} rules from ${configPath}`);
    return config;
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(`Failed to load config file: ${error.message}`);
    }
    throw error;
  }
}