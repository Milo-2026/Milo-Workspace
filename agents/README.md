# Multi-Agent Architecture for Side Quest Studios

## Overview

This setup creates 3 autonomous agents for managing Side Quest Studios businesses:

1. **Milo** (main orchestrator) - Alfredo's personal assistant
2. **Sheet It Now Agent** - Autonomous agent for Sheet It Now business
3. **AddOnQuote Agent** - Autonomous agent for AddOnQuote business

## Architecture

```
Telegram (@MiloSideQuestBot)
│
├── Chat 1: Milo - Orchestrator
│   └── Context: Full awareness of all projects
│
├── Chat 2: Sheet It Now Agent
│   └── Context: Sheet It Now only
│
└── Chat 3: AddOnQuote Agent
    └── Context: AddOnQuote only
```

## Setup Instructions

### Step 1: Run the Setup Script

```bash
cd /Users/alfredoalvarez/.openclaw/workspace/agents
./setup-telegram-chats.sh
```

### Step 2: Create Telegram Chats

1. Open Telegram and search for `@MiloSideQuestBot`
2. **Chat 1 (Milo):** Use normally for orchestration
3. **Chat 2 (Sheet It Now):** Start new chat → "You are the Sheet It Now autonomous agent"
4. **Chat 3 (AddOnQuote):** Start new chat → "You are the AddOnQuote autonomous agent"

### Step 3: Each Agent Loads Its Config

- **Sheet It Now Agent** reads: `agents/sheet-it-now.md`
- **AddOnQuote Agent** reads: `agents/addon-quote.md`

## File Structure

```
agents/
├── setup-telegram-chats.sh          # Setup guide
├── sheet-it-now.md                  # Agent identity & goals
├── addon-quote.md                   # Agent identity & goals
├── sheet-it-now-report.py           # Morning report generator
├── addon-quote-report.py            # Morning report generator
└── README.md                        # This file

memory/
├── sheet-it-now/YYYY-MM-DD.md       # Daily notes for Sheet It Now
└── addon-quote/YYYY-MM-DD.md        # Daily notes for AddOnQuote

life/para/projects/
├── sheet-it-now.md                  # Project knowledge
└── addon-quote.md                   # Project knowledge
```

## Daily Workflow

### Morning (8 AM)
- Each agent generates its own morning report
- Sheet It Now agent → runs `sheet-it-now-report.py`
- AddOnQuote agent → runs `addon-quote-report.py`
- Both send reports to Telegram

### Throughout the Day
- Agents post to X autonomously (20 posts/day each)
- Agents engage with target audience
- Agents track metrics in Redis

### Evening (6 PM)
- Agents summarize day's activity
- Update daily notes
- Report to orchestrator if needed

### Nightly (3 AM)
- Memory consolidation runs
- Daily notes → knowledge graph
- Lessons learned → tacit knowledge

## Commands

### For Sheet It Now Agent

```bash
# View knowledge
cat ~/.openclaw/workspace/life/para/projects/sheet-it-now.md

# View today's notes
cat ~/.openclaw/workspace/memory/sheet-it-now/$(date +%Y-%m-%d).md

# Generate report manually
python3 ~/.openclaw/workspace/agents/sheet-it-now-report.py
```

### For AddOnQuote Agent

```bash
# View knowledge
cat ~/.openclaw/workspace/life/para/projects/addon-quote.md

# View today's notes
cat ~/.openclaw/workspace/memory/addon-quote/$(date +%Y-%m-%d).md

# Generate report manually
python3 ~/.openclaw/workspace/agents/addon-quote-report.py
```

## Memory System (3-Layer)

### Layer 1: Knowledge Graph
`~/.openclaw/workspace/life/para/projects/`
- Durable facts about each business
- Project status, goals, strategies

### Layer 2: Daily Notes
`~/.openclaw/workspace/memory/[business]/YYYY-MM-DD.md`
- What happened today
- Decisions made
- Issues encountered

### Layer 3: Tacit Knowledge
`~/.openclaw/workspace/life/tacit-knowledge.md`
- Lessons learned
- Preferences
- Hard rules

## Metrics Tracked

| Metric | Sheet It Now | AddOnQuote |
|--------|--------------|------------|
| Daily Posts | Redis | Redis |
| Engagement | Redis | Redis |
| Leads | Notion | Notion |
| Sales | Stripe | Stripe |
| MRR | $0 | $0 |

## Next Steps

1. ✅ Create agent configurations
2. ⏳ Create Telegram chats (manual step)
3. ⏳ Test each agent independently
4. ⏳ Set up automated morning reports
5. ⏳ Launch X automation for each agent

## Troubleshooting

### Agent doesn't remember previous conversation
- Check Redis is running: `redis-cli ping`
- Check daily notes are being written

### Agent posting wrong content
- Verify correct agent file is loaded
- Check content pipeline exists in `social-automation/data/pipelines.json`

### Can't start new Telegram chat
- Open Telegram web or desktop
- Search for the bot
- Click "Start" to begin new conversation