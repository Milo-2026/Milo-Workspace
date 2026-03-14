---
children_hash: a0283adfa999c58d1d0fae5130ae902c3f777f0f75fa66e844cbd004173e76ef
compression_ratio: 0.5446716899892358
condensation_order: 1
covers: [x_orchestrator_incident_report.md, x_orchestrator_maintenance.md, x_orchestrator_operations.md]
covers_token_total: 929
summary_level: d1
token_count: 506
type: summary
---
# X Orchestrator Structural Overview

The X Orchestrator automates multi-account social media posting for AddOnQuote, SheetItNow, NoCode Lab, and SideQuest, managed via a centralized operational framework.

## Operational Architecture
*   **Workflow:** The system utilizes a batch process flow: extract page blocks (via Notion `/children` endpoint) → validate content → batch post → update Notion status.
*   **Scheduling:** Operates on a 45-minute batch interval, processing content for all four accounts simultaneously. A system "silence zone" is enforced between 12AM and 6AM.
*   **Capacity:** Processes approximately 60 posts per day (roughly 20 per account).
*   **Data Dependencies:** Relies on Notion APIs for content retrieval and status tracking. Key resources include `pipelines.json` and `watchdog_history.json` (30-day/500-entry cache limit for duplicate prevention).

## Incident Management & Maintenance
*   **Incident Recovery:** Credentials for the X API are sensitive; recent recovery involved manual re-entry following a repository cleanup incident.
*   **Maintenance Patterns:**
    *   System stability fixes include case-sensitive key handling in `pipelines.json` and resolution of duplicate process issues.
    *   Watchdog history requires periodic manual clearing once the 500-entry cache limit is reached.
*   **Core Conventions:** 
    *   Never delete credentials or touch sensitive data without explicit user confirmation.
    *   Always extract content from the `/children` endpoint to prevent truncation issues common with the `Name` field.

## Key References
*   **[X Orchestrator Operations](x_orchestrator_operations.md):** Details the latest batch posting flow and Notion integration logic.
*   **[X Orchestrator Maintenance](x_orchestrator_maintenance.md):** Provides technical background on daily volumes, scheduling, and watchdog cache management.
*   **[X Orchestrator Incident Report](x_orchestrator_incident_report.md):** Documents security protocols and credential management rules.