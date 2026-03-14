---
title: Claude CLI Setup
tags: []
keywords: []
importance: 50
recency: 1
maturity: draft
createdAt: '2026-03-12T01:19:35.777Z'
updatedAt: '2026-03-12T01:19:35.777Z'
---
## Raw Concept
**Task:**
Document Claude CLI setup and performance characteristics

**Timestamp:** 2026-03-12

## Narrative
### Structure
The Claude CLI uses OAuth for authentication via "claude auth login", which opens a browser for Anthropic authentication.

### Highlights
Configuration is saved to ~/.claude/config.json. Simple queries typically complete in 2-5s, while complex content generation can exceed 60s.

## Facts
- **auth_method**: Claude CLI authentication uses OAuth [project]
- **config_path**: Claude CLI configuration is saved to ~/.claude/config.json [project]
- **performance_simple**: Simple Claude CLI queries complete in 2-5s [project]
- **performance_complex**: Complex Claude CLI generation can take 60s+ [project]
