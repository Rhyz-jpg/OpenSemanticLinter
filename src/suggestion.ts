// Represents a single suggestion from the linter.

export interface Suggestion {
  /** The file path of the suggestion. */
  file: string;
  /** The line number of the suggestion. */
  line: number;
  /** The suggestion message. */
  message: string;
}