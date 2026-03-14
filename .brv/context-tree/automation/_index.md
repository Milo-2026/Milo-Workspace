---
children_hash: aa7717961b94c8050ee442ce55ba9db83aae131dc36e6c5d1c4e971e37158d79
compression_ratio: 0.44275966641395
condensation_order: 2
covers: [social_media_analytics/_index.md, task_tracking/_index.md, x_analytics/_index.md, x_orchestrator/_index.md]
covers_token_total: 1319
summary_level: d2
token_count: 584
type: summary
---
# Automation and Analytics Structural Overview

This summary consolidates the automation and analytics infrastructure across social media and operational tracking domains.

### Social Media Analytics and Integration
The system employs a standardized Python-based automation flow for multi-account metric collection (AddOnQuote, SideQuest, SheetItNow, NoCodeLab).
* **Social Media Analytics Pattern:** Defines the core workflow (Authentication → Metric Extraction → JSON Output).
* **X Analytics Integration:** Leverages `scripts/x_analytics.py` for X API v2 interactions.
* **Constraints:** LinkedIn analytics remain restricted pending formal API partnership access.
* **Standardization:** All scripts are required to output consistent JSON structures for follower counts.

### Task and Operational Tracking
The agency operations framework provides health monitoring for all pipelines.
* **Agency Operations Status:** Utilizes a color-coded status framework (✅, 🔴, ⚠️) to track pipeline health. 
* **Key Statuses:** X Posting and Analytics are fully operational; LinkedIn and Reddit integrations require manual intervention or remain blocked.

### X Orchestrator (Multi-Account Posting)
The orchestrator manages centralized, high-volume automated posting across all company accounts.
* **Operational Architecture:** 
    * **Workflow:** Notion `/children` endpoint → Content Validation → Batch Posting → Status Update.
    * **Scheduling:** 45-minute batch intervals with a "silence zone" (12AM–6AM).
    * **Capacity:** ~60 posts/day; requires `pipelines.json` and `watchdog_history.json` for state management.
* **Incident Management & Maintenance:**
    * **Cache Management:** The 500-entry limit on `watchdog_history.json` requires periodic manual clearing to prevent duplication.
    * **Security Protocols:** Incident recovery involves strict credential management; changes to sensitive data require explicit user confirmation.
    * **Technical Conventions:** Content must be pulled from the `/children` endpoint to avoid `Name`-field truncation.

**Drill-down References:**
* **Analytics:** `social_media_analytics_pattern.md`, `x_analytics_integration.md`
* **Operations:** `agency_operations_status.md`
* **Orchestrator:** `x_orchestrator_operations.md`, `x_orchestrator_maintenance.md`, `x_orchestrator_incident_report.md`