# Side Quest Studios - Agent Fleet 🦁

Multi-agent AI system for SaaS marketing, sales, and development automation.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ORCHESTRATOR (Milo)                       │
│  • Receives goals from human                                │
│  • Breaks into missions → steps                             │
│  • Coordinates specialized agents                           │
└─────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│    CODER      │    │   MARKETER   │    │    SOCIAL    │
│  • Write code │    │ • Blog posts │    │ • X/LinkedIn │
│  • Review PRs │    │ • Email seq  │    │ • Engagement │
└──────────────┘    └──────────────┘    └──────────────┘
         │                    │                    │
         └────────────────────┼────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      SUPABASE                                │
│  • ops_agents       • ops_missions                         │
│  • ops_proposals    • ops_mission_steps                     │
│  • ops_events       • ops_content                           │
│  • ops_campaigns                                           │
└─────────────────────────────────────────────────────────────┘
```

## Quick Start

### 1. Get Vercel Token

```bash
# Go to: https://vercel.com/account/tokens
# Create a new token with "Full Account Access"
# Add to GitHub repo secrets: VERCEL_TOKEN
```

### 2. Push Database Schema

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Push schema
supabase db push
```

### 3. Deploy

```bash
# Push to GitHub (triggers CI/CD)
git add .
git commit -m "Initial agent fleet setup"
git push

# Vercel auto-deploys on merge to main
```

## API Endpoints

### POST /api/orchestrator
Submit a new goal for the fleet.

```bash
curl -X POST https://your-domain/api/orchestrator \
  -H "Content-Type: application/json" \
  -d '{
    "goal": "Increase demo signups by 20%",
    "priority": "high",
    "context": {
      "description": "Q1 growth target"
    }
  }'
```

### GET /api/orchestrator
Get fleet dashboard.

```bash
curl https://your-domain/api/orchestrator
```

## Agent Fleet

| Agent | Role | Capabilities |
|-------|------|--------------|
| orchestrator | Meta-Agent | Coordination, routing, reporting |
| coder | Development | write_code, review_code, debug |
| marketer | Content | write_content, email_marketing |
| social | Social Media | post_social, engage, community |
| ads | Paid Acquisition | create_ads, optimize_campaigns |
| research | Intelligence | research, analysis, competitor_tracking |
| ops | Operations | note_taking, task_tracking |

## Project Structure

```
├── supabase/
│   └── schema.sql           # Database schema
├── src/
│   └── app/
│       └── api/
│           └── orchestrator/
│               └── route.ts  # Orchestrator API
├── lib/
│   ├── supabase.ts          # Supabase client
│   └── agents.ts            # Agent definitions
├── .github/workflows/
│   └── agent-fleet.yml      # CI/CD pipeline
├── vercel.json              # Vercel config
└── package.json
```

## Workflow

1. **Human** sends goal to Orchestrator
2. **Orchestrator** breaks into missions → steps
3. **Specialized agents** execute steps
4. **Events** logged to Supabase
5. **Human** receives progress updates

## Example: New Blog Post

1. Human → Orchestrator: "Write blog post about AI agents"
2. Orchestrator → Marketer: Create draft_content step
3. Marketer → ops_content: Stores draft
4. Human: Reviews and approves
5. Orchestrator → Social: Schedule social promotion
6. Social → posts to X/LinkedIn
7. Event logged, human notified

## Secrets (set in Vercel)

```
SUPABASE_URL=https://tvrhuxkgaktstiawhsji.supabase.co
SUPABASE_ANON_KEY=...
```

## License

MIT - Side Quest Studios 🦁
