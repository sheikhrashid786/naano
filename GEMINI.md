# Project Rules: Agent Capture

1. Automatic capture is active via the background capture daemon (`.agents/capture-daemon.js`) and lifecycle hooks (`.agents/hooks.json`).
2. All user prompts and model final responses are recorded in `.agent-logs/`.
3. Do not add `.agent-logs/` to `.gitignore`.
4. Commit the logs in `.agent-logs/` interleaved with code commits as you build.
