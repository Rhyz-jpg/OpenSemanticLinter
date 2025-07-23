graph TD
    A[GitHub PR] -->|Triggers Action| B(GitHub Action);
    B --> C{Read .yml config};
    B --> D{Get PR diff};
    C --> E[LLM API];
    D --> E[LLM API];
    E -->|Suggestions| B;
    B --> F[Post PR comments];