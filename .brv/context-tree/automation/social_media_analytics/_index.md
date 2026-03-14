---
children_hash: c0e28f86d7f31ea437948a9c838e6ba4e620a95cec5e3070cdde6476dab8bdc9
compression_ratio: 0.8050541516245487
condensation_order: 1
covers: [social_media_analytics_pattern.md]
covers_token_total: 277
summary_level: d1
token_count: 223
type: summary
---
# Social Media Analytics Pattern Overview

The Social Media Analytics pattern standardizes metric collection across multiple project accounts (@addonquote, @sidequeststd, @sheetitnow, @NoCodeLab) using a modular Python-based automation flow.

## Core Architecture
- **Workflow:** Authentication -> Metric Extraction -> JSON Output.
- **Implementation:** Reusable wrapper scripts designed for consistency across social platforms.
- **Key Files:** 
    - `scripts/x_analytics.py` (Production: X API v2)
    - `scripts/linkedin_analytics.py` (Pending: LinkedIn API access)

## Operational Rules & Facts
- **Output Standard:** All scripts must produce structured JSON containing follower counts per account.
- **Integration Status:** X API v2 is fully integrated; LinkedIn integration is currently in development.

For detailed implementation logic, refer to `social_media_analytics_pattern.md`.