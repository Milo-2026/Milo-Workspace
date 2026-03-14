---
children_hash: e12726689db8b9af60575c578121c133f9526a551144ffc662fcecdba9118e3d
compression_ratio: 0.3488372093023256
condensation_order: 3
covers: [architecture/_index.md, automation/_index.md, integrations/_index.md, marketing/_index.md]
covers_token_total: 1419
summary_level: d3
token_count: 495
type: summary
---
# Structural Knowledge Summary: Level D3

This summary synthesizes operational and architectural patterns across four primary domains.

### Architecture: Daemon Patterns
Focuses on reliable background execution on macOS via `LaunchAgent`.
* **Core Standards**: Mandatory PID locking for singleton enforcement and heartbeat logging for cycle observability.
* **Implementation Template**: `morning_report_daemon.md` details a 30-second loop interval with `--test` validation flags.

### Automation and Analytics
Consolidates infrastructure for social media metrics and operational tracking.
* **Social Media Analytics**: Standardized Python flow (Auth → Extraction → JSON) across multiple accounts. Refer to `social_media_analytics_pattern.md` and `x_analytics_integration.md`.
* **Operational Tracking**: Agency-wide pipeline health monitoring using a status-based framework (see `agency_operations_status.md`).
* **X Orchestrator**: Manages high-volume posting (~60/day) via Notion `/children` integration.
    * **State Management**: Requires `pipelines.json` and `watchdog_history.json`.
    * **Maintenance**: Manual clearing of `watchdog_history.json` (500-entry limit) is required to prevent state duplication. Refer to `x_orchestrator_operations.md` and `x_orchestrator_maintenance.md`.

### Integrations: Claude CLI
Governs the deployment and operational configuration of the Claude CLI.
* **Configuration**: OAuth-based authentication with state persisted at `~/.claude/config.json`.
* **Performance**: Latency ranges from 2–5s for simple queries to >60s for complex generation. Refer to `claude_cli_setup.md`.

### Marketing: Content Strategy
Targets the roofing industry to improve SEO and domain authority for AddOnQuote.
* **Strategy**: Focuses on professional pain points (profit margins, change orders).
* **Workflow**: Topic Research → Title Generation → Content Creation.
* **Deliverables**: 10 SEO-optimized blog titles; see `addonquote_blog_content_strategy.md`.