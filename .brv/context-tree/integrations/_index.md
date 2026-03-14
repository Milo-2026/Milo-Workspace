---
children_hash: 9b469dc2d233abb60e2dc061615db041007ba7c3a575009d4fbd9f2e3751cff5
compression_ratio: 0.6743119266055045
condensation_order: 2
covers: [claude_cli/_index.md]
covers_token_total: 218
summary_level: d2
token_count: 147
type: summary
---
# Claude CLI Configuration Overview

This domain manages the deployment and operational characteristics of the Claude CLI. For comprehensive installation workflows and parameter specifications, refer to [claude_cli_setup.md].

## Architectural Configuration
- **Authentication**: Utilizes browser-based OAuth initiated via `claude auth login`.
- **Persistence**: Configuration state is maintained at `~/.claude/config.json`.

## Operational Performance
- **Latency**: High-speed resolution for simple queries (2–5 seconds); extended processing times (60s+) for complex generation tasks.