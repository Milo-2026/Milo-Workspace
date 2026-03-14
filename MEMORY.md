# Milo Long-Term Memory

## Core Identity
- **Name:** Milo
- **Role:** AI assistant at Side Quest Studios
- **Personality:** Proactive, sharp, solutions-oriented, autonomous
- **Vibe:** Corporate-free, direct, witty when earned

## User Context
- **Alfredo Alvarez:** Cofounder at Side Quest Studios
- **Focus:** SaaS products, marketing, sales, lead generation
- **Communication:** Telegram (ID: 7250756082)
- **Preferences:** Autonomous help, no corporate speak, brevity, strong opinions

## Critical Rules
- **NO political content** - Never post, engage, or comment on political topics
- **NO controversial topics** - Avoid anything that could be divisive
- **Cross-promote all brands** - Every 5th post mentions other products
- **Privacy-first messaging** - Emphasize data stays on device for Sheet It Now
- **Anti-corporate positioning** - Side Quest is maker-first, no enterprise speak

## Side Quest Studios Products

### AddOnQuote (Roofing SaaS)
- **Pricing:** 14-day free trial, $29/mo Pro, $299 (1 seat lifetime), $799 (2 seats lifetime)
- **Positioning:** Profit protection, stop leaving $800/job on the table
- **X Account:** @addonquote
- **Key Content:** Change orders, documentation, contractor workflows

### Side Quest Studios (Studio Brand)
- **Positioning:** Build in public, clean code, anti-corporate, no standups
- **X Account:** @SideQuestStd
- **Key Content:** Shipping fast, indie hacker life, tool picks

### Sheet It Now (PDF to Excel)
- **Pricing:** $5/conversion, lifetime deals available
- **Positioning:** Privacy-first (no upload), 3-second conversion, no subscription
- **X Account:** @sheetitnow
- **Key Content:** Privacy, speed, use cases (tax prep, bookkeeping)

## MRR Growth Strategy

### Target: $1,000 MRR
- **Revenue Math:** 35 subscribers × $29 = $1,015 MRR
- **Lifetime Deals:** $299 (1 seat), $799 (2 seats) - prioritize over monthly

### Current State (Feb 2026)
- MRR: $0 (all products)
- Status: Launching growth initiatives

### Key Initiatives
1. Facebook Ads - Miami test ($100/month) pending setup
2. Content Marketing - Blog posts for AddOnQuote + Side Quest
3. X Automation - Moved to laptop (orchestrator removed from server)
4. Cold Outreach - X DMs and search replies (no email list yet)
5. Affiliate Program - Planned but not launched

### Content Strategy
- **AddOnQuote:** 6 posts/day, roofing/contractor content
- **Side Quest:** 6 posts/day, build-in-public/SaaS content
- **Sheet It Now:** 6 posts/day, privacy/fintech content
- **Cross-promotion:** Every 5th post mentions other products
- **NO hashtags** per user request

## Multi-Account X System (REMOVED)

The X posting orchestrator has been moved to user's laptop.

### Historical Configuration
- **Accounts:** AddOnQuote, SideQuest, SheetItNow, NoCode Lab
- **Target:** 80 posts/day (20 per account)
- **Interval:** 12-15 minutes between posts
- **Credentials:** Stored in `~/.config/multi-social/credentials/` (now deleted)

X automation is now managed locally on user's laptop.

## Notion Workspace Structure

### Pages Created
- Master Dashboard: Side Quest Studios - Master Dashboard
- Projects: Projects Overview
- Social Media: Social Media Accounts
- Content: Content Calendar + Strategy Links
- Operations: Tasks & Todos
- Ideas: Ideas Backlog

### Content Strategy Pages
- AddOnQuote Content Strategy
- Side Quest Studios Content Strategy
- Sheet It Now Content Strategy

## Key Files

### Strategy Documents
- `/Users/alfredoalvarez/.openclaw/workspace/PROJECTS/mrr-growth-strategy.md`
- `/Users/alfredoalvarez/.openclaw/workspace/PROJECTS/mrr-execution-plan.md`
- `/Users/alfredoalvarez/.openclaw/workspace/PROJECTS/content-calendar.md`
- `/Users/alfredoalvarez/.openclaw/workspace/PROJECTS/news-content.md`
- `/Users/alfredoalvarez/.openclaw/workspace/PROJECTS/linkedin-strategy.md`

### Scripts (REMOVED 2026-03-12)
- ~~`/Users/alfredoalvarez/.openclaw/skills/multi-social/multi_social.py`~~ - Removed
- ~~`/Users/alfredoalvarez/.openclaw/social-automation/orchestrator.py`~~ - Removed

## Today's Agenda (Feb 2026-02-11)
1. Complete Facebook Business Manager setup
2. Create LinkedIn pages for all brands
3. Continue X automation (orchestrator running)
4. Generate Week 1 content for all brands
5. Launch Miami Facebook Ads test

## Security Notes
- **NEVER** paste API keys in chat
- Store sensitive keys in `.env` files only
- Credentials were in `~/.config/multi-social/credentials/` - now removed (moved to laptop)

## Lessons Learned
- Paid API required for X posting
- OAuth 2.0 credentials needed alongside OAuth 1.0
- App permissions must be "Read and Write"
- Access tokens must be regenerated after permission changes
- No political content filters engagement positively
- Cross-promotion increases brand awareness
- Orchestrator running 24/7 with organic patterns works best

## Pending Projects (Updated 2026-03-12)

| Project | Status | Priority | Notes |
|---------|--------|----------|-------|
| Meta Ads Miami Test | Pending | High | Waiting for Access Token |
| Blog Creation - AddOnQuote | Pending | High | Admin API pending |
| Blog Creation - Side Quest | Pending | High | Admin API pending |
| Blog Creation - Sheet It Now | Pending | High | Admin API pending |
| X Automation | Removed | - | Moved to laptop |
| Trend Content Generator | Pending | Medium | Brave API + grok-researcher |
| Cold Email Outreach | Pending | Medium | SMTP configured |
| Email Templates (AddOnQuote) | Pending | Medium | $800/job angle |
| Apollo.io Lead List | Pending | Medium | Roofing contractors |
| Google Maps Lead Scraper | Pending | Low | Free alternative |
| VidClaw Dashboard | Done | Low | localhost:3333 |
| Grok Researcher Skill | Done | Low | Skill installed |

## Blog & Fresh Content Strategy (Updated 2026-02-17)

### Daily Content Output Per Account
- 3 trend-aligned posts (LLM-generated via grok-researcher)
- 1 thread (5 tweets, LLM-generated)
- 16 regular posts (from existing pool)
- **Total:** 20 posts/day per account

### Blog-to-X Pipeline
1. Blog Draft → 2. Publish (Admin API pending) → 3. Teaser tweet → 4. Thread → 5. Link post

### Weekly Blog Target
- 1 blog post per account per week
- 3 X posts per blog (teaser + thread + link)

---

## Installed Skills

### Grok Researcher
- **Path:** `/opt/homebrew/lib/node_modules/openclaw/skills/grok-researcher/`
- **Usage:** `openclaw agent --local -c "Research [TOPIC]"`
- **Models:** Grok (OpenRouter) + Brave Search
- **Purpose:** Topic research, trend discovery, content opportunity identification

### Meta Ads Marketing
- **Path:** `/opt/homebrew/lib/node_modules/openclaw/skills/meta-ads-marketing/`
- **Purpose:** Campaign creation, ad templates, targeting for roofers
- **Status:** Ready - waiting for Meta Ad Account Access Token

---

## Infrastructure

### VidClaw Dashboard
- **URL:** http://localhost:3333
- **Path:** `~/.openclaw/workspace/dashboard/`
- **Features:** Task queue, activity logging, 18 projects tracked
- **Status:** Running (manual start, no systemd)

### Publishing Agent Health Check (REMOVED)
- ~~**Script:** `/Users/alfredoalvarez/.openclaw/social-automation/health_check.sh`~~ - Removed
- Moved to laptop with orchestrator

### Google Service Account
- **Email:** milo-ai@milo-486315.iam.gserviceaccount.com
- **APIs:** Gmail, Drive, Sheets, Calendar
- **Status:** Configured - OAuth verification pending for Gmail API

### SMTP Configuration
- **Host:** mail.sidequeststudios.io:587
- **Email:** milo@sidequeststudios.io
- **Status:** Verified working for cold email outreach

### API Keys
- **OpenRouter:** Configured in keyring (Grok access)
- **Brave API:** BS... (stored in .env)
## Daily Morning Report (Added 2026-03-04)
Every morning, send Alfredo a report covering:
1. Posts published yesterday per account (AddOnQuote, SideQuest, SheetItNow)
2. Engagement metrics: likes, retweets, comments
3. Current status on all open tasks
4. Progress toward $1000 MRR goal
5. Accountability and motivation message

First report: Tomorrow morning (2026-03-05)

---

## X POSTING ORCHESTRATOR SYSTEM (REMOVED 2026-03-12)

### Agent Agency Removed
All components removed per user's request (moving to laptop):
- ~~`~/.openclaw/skills/multi-social/`~~ - Removed
- ~~`~/.openclaw/skills/orchestrator-manager/`~~ - Removed
- ~~`/Users/alfredoalvarez/.openclaw/social-automation/`~~ - Removed
- ~~`~/.config/multi-social/`~~ - Removed (credentials deleted)

### Historical Info
The orchestrator previously ran with these specs:
- 4 accounts: AddOnQuote, SideQuest, SheetItNow, NoCode Lab
- 80 posts/day (20 per account)
- 12-15 minute intervals
- PID 60650 was last running instance

X content now managed locally on user's laptop.
