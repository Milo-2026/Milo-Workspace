---
children_hash: b61915f0e1fda46d1829fb1caa4612e0b8485c4f94a306bc072b3c2e624e190f
compression_ratio: 0.6686390532544378
condensation_order: 2
covers: [daemon_patterns/_index.md]
covers_token_total: 338
summary_level: d2
token_count: 226
type: summary
---
# Architectural Summary: Daemon Patterns

This domain defines standards for background task execution, specifically focusing on singleton reliability and observability for macOS environments.

## Core Implementation: Morning Report Daemon
The `morning_report_daemon.md` provides a template for scheduled Python daemons integrated with macOS `LaunchAgent`.

* **Execution Model**: Employs a 30-second loop interval managed by a self-contained lifecycle.
* **Singleton Enforcement**: Mandatory PID locking prevents instance duplication.
* **Observability**: Heartbeat logging is required for all cycles to ensure health monitoring.
* **Operational Controls**: Includes a `--test` flag for isolated validation and external monitoring scripts for automated recovery.

## Mandatory Standards
1. **PID Locking**: Required for all daemon instances.
2. **Heartbeat Logging**: Mandatory for every execution cycle.