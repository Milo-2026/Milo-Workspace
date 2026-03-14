# AddOnQuote Automation System
**Goal:** $1,000 MRR with 2 hours/week human intervention
**Date:** March 11, 2026
**Status:** Draft - Building Blocks

---

## Executive Summary

We are building a fully automated lead generation and conversion system for AddOnQuote. The goal is to generate leads, nurture them, and convert them to paid subscribers without manual intervention.

**Revenue Target:** $1,000 MRR = 35 subscribers × $29/mo

**The Funnel:**
```
Traffic (X + SEO) → Lead Capture → Nurture (Email/X) → Conversion → Onboarding → Retain
     ↓                    ↓                ↓              ↓           ↓          ↓
  Content Agent      Lead Gen Agent    Outreach Agent  Sales Bot   Support    Upsell
```

---

## System Architecture

### 1. LEAD GENERATION AGENT
**Purpose:** Find and qualify roofing contractors automatically

**Inputs:**
- Target: US-based residential roofing companies
- Source: Web scraping, directories, social media
- Data needed: Name, email, X handle, company size, website

**Tools:**
- grok-researcher (Brave Search + Grok)
- Custom scraper for roofing directories
- Apollo.io or similar (if available)

**Workflow:**
```
Daily (8 AM):
1. Search for new roofing companies (geo-targeted)
2. Scrape contact info
3. Enrich data (website, social, size)
4. Score leads (1-35 points based on criteria)
5. Add to Notion database
6. Tag for outreach priority
```

**Lead Scoring Criteria:**
| Criteria | Points |
|----------|--------|
| Has website | +5 |
| Active X account | +3 |
| 5+ employees | +5 |
| Multiple locations | +5 |
| Posts about business | +3 |
| Uses other software | +5 |
| Recently posted job ads | +5 |

**Output:** Qualified leads in Notion "Roofing Leads" database

---

### 2. CONTENT AGENT (ALREADY RUNNING)
**Purpose:** Create content that attracts traffic and builds trust

**Current Status:**
- ✅ X Orchestrator: 60 posts/day (20 per brand)
- ✅ Blog pipeline: 10 articles outlined
- ✅ Content calendar: Monthly rhythm defined

**What's Needed:**
```
Weekly:
1. Generate 1 full blog post (2000+ words)
2. Create X thread from blog
3. Update Notion database
4. Schedule social posts

Monthly:
1. SEO audit of top posts
2. Update top-performing content
3. Research new topics
```

**Content Distribution:**
- Blog → X Thread → Newsletter → Daily X Posts → Email Sequence

---

### 3. OUTREACH AGENT
**Purpose:** Personalized outreach to qualified leads

**Channels:**
- X DMs (primary)
- Email (secondary)

**Workflow:**
```
Trigger: New lead added to Notion (score 20+)

Hour 1:
1. Research lead (check recent posts, website)
2. Personalize template
3. Send X DM

Day 1-3:
1. If no reply: Send follow-up #1
2. If no reply: Send follow-up #2

Day 7:
1. If no reply: Add to long-tail nurture
2. Move to cold email sequence
```

**DM Templates (Personalized):**

**Template A - Value Hook:**
```
Hey [Name]! 🚗

Just saw your post about [topic from their recent X].

Quick question: How do you handle change orders on your jobs?

I ask because most roofers we talk to are leaving $800+/job on the table by not documenting extras.

Here's a 2-minute video that shows the exact system:
[link to 2-min video]

Worth a look?
```

**Template B - Problem Aware:**
```
Hi [Name] 👋

Curious - do you have a system for tracking all the little extras that come up during a job?

The guys at [similar company] used to write down extra work on napkins. Lost thousands.

Now they use a simple system that captures every add-on automatically.

Worth 2 mins to see?
[link]

Either way, keep up the good work on [something from their content].
```

**Template C - Soft Close:**
```
[Name] - just following up on my last msg.

I know you're busy running [Company Name], so I'll be quick.

The tool we built helps roofers:
✅ Capture every change order
✅ Get paid for extras
✅ Protect profit margins

14-day free trial, no credit card.

Worth checking out: addonquote.app

Let me know if you have questions!
```

---

### 4. CONVERSION AGENT (SALES BOT)
**Purpose:** Convert interested leads to paid subscribers

**Triggers:**
- Clicked link in DM
- Visited pricing page
- Started free trial
- Abandoned checkout

**Auto-Responses:**

**After Link Click (15 min):**
```
Hey [Name]! Glad you checked it out. 👏

Questions I hear a lot:

1. "I'm not techy" → Takes 5 minutes to set up
2. "Will it work for my size" → Used by 1-person crews to 20+ employee companies
3. "What if I don't like it" → 14-day free trial, cancel anytime

Want a quick walkthrough? Book 10 mins here:
calendly.com/addonquote/demo
```

**After Trial Signup (Day 1):**
```
Welcome to AddOnQuote! 🎉

Here's your quick start:

1. Add your first job → See how easy it is
2. Try the change order feature → Watch the 2-min video
3. Set up your first template → Saves time on every job

Need help? Just reply to this msg.

- The AddOnQuote Team
```

**Abandoned Checkout (Day 3):**
```
Hi [Name] - noticed you started the trial but didn't finish setup.

Totally get it - new tools take time.

Here's what's holding most people back and how to push past it:

[Objection handling based on lead source]

Quick question: What's the ONE thing that would make this a no-brainer for you?
```

---

## Notion Database Structure

### Database 1: Roofing Leads
| Field | Type | Description |
|-------|------|-------------|
| Name | Title | Contact name |
| Company | Text | Company name |
| Email | Email | Contact email |
| X Handle | Text | @mention |
| Website | URL | Company website |
| Score | Number | Lead score (0-35) |
| Status | Select | New, Contacted, Replied, Trial, Customer |
| Source | Select | Search, Scraped, Referral |
| Last Contact | Date | Last outreach |
| Notes | Text | Research notes |

### Database 2: Content Calendar
| Field | Type | Description |
|-------|------|-------------|
| Title | Title | Blog post title |
| Status | Select | Draft, Review, Published, Promoted |
| Publish Date | Date | Scheduled date |
| Keyword | Text | Primary SEO keyword |
| X Thread | Text | Thread link |
| Performance | Number | Views/engagement |

### Database 3: Email Sequence
| Field | Type | Description |
|-------|------|-------------|
| Trigger | Select | Trial start, Link click, Abandoned checkout |
| Day | Number | Day in sequence |
| Subject | Text | Email subject line |
| Body | Text | Email content |
| Opens | Number | Track performance |

---

## SOPs (Standard Operating Procedures)

### SOP 1: Daily Startup (5 minutes)
```
1. Check Notion "Roofing Leads" for new leads (score 20+)
2. Check email for customer inquiries
3. Check X DMs for replies
4. Review yesterday's metrics (opens, clicks, replies)
5. Approve any AI-generated content ready for publishing
```

### SOP 2: Weekly Content Day (1 hour)
```
Monday - Content Day:
1. Generate blog post #1 of the month using Content Strategist agent
2. Create X thread from blog post
3. Update Notion content calendar
4. Schedule social posts for the week
5. Review performance of last week's content
```

### SOP 3: Lead Research (30 minutes, 2x week)
```
Wednesday + Saturday:
1. Run grok-researcher for new roofing companies
2. Enrich leads with contact info
3. Score each lead
4. Add qualified leads to Notion
5. Tag for immediate outreach
```

### SOP 4: Monthly Review (30 minutes)
```
1st of each month:
1. Review MRR and conversion metrics
2. Identify best-performing content
3. Update top 5 blog posts with fresh stats
4. Refresh email sequences based on performance
5. Plan next month's content topics
```

---

## Metrics to Track

### Weekly Metrics
| Metric | Target | Why |
|--------|--------|-----|
| New leads found | 50 | Pipeline health |
| DMs sent | 30 | Outreach volume |
| Replies received | 10 | 33% reply rate |
| Link clicks | 5 | 50% click rate |
| Trial starts | 2 | 40% conversion |
| Paid conversions | 1 | 50% trial-to-paid |

### Monthly Metrics
| Metric | Target | Why |
|--------|--------|-----|
| MRR | $500 | Growth |
| Trial starts | 8 | Pipeline |
| Trial-to-paid | 50% | Conversion |
| Content views | 5,000 | Awareness |
| X followers | +200 | Growth |

---

## Tools Needed

| Tool | Purpose | Status |
|------|---------|--------|
| Claude CLI | Content generation | ✅ Ready |
| Notion API | Database automation | ✅ Connected |
| X API | Posting automation | ✅ Running |
| grok-researcher | Lead research | ✅ Installed |
| Email service | Sequence emails | ❌ Needed |
| Calendly | Demo bookings | ✅ calendly.com/truehabitatmiami/add-on-quote-demo |
| Video hosting | 2-min demo videos | ❌ YouTube unlisted |

---

## Immediate Action Items

### This Week (Priority)
- [ ] Set up Calendly for demo bookings
- [ ] Create 2-minute demo video for AddOnQuote
- [ ] Set up email service (ConvertKit/Mailchimp)
- [ ] Build email sequences in Notion
- [ ] Test outreach DM automation

### This Month
- [ ] Generate and publish 4 blog posts
- [ ] Reach 200 new X followers
- [ ] Generate 200 qualified leads
- [ ] Get 8 trial signups
- [ ] Convert 4 to paid

---

## The 90-Day Plan

### Month 1: Foundation
- System built and tested
- 4 blog posts published
- 100 leads captured
- 2 trial signups
- 1 paid subscriber

### Month 2: Scale
- Content engine humming
- 200 leads captured
- 8 trial signups
- 4 paid subscribers
- MRR: $116

### Month 3: Optimize
- Fully automated
- 400 leads captured
- 16 trial signups
- 8 paid subscribers
- MRR: $232

### Month 6: Full Scale
- 1000+ leads captured
- 40 trial signups
- 20 paid subscribers
- MRR: $580

### Month 12: $1,000 MRR
- 2500+ leads captured
- 100 trial signups
- 35 paid subscribers
- **MRR: $1,015**

---

## Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| X API changes | Medium | High | Diversify to newsletter/blog |
| Low reply rate | High | Medium | Test different templates |
| Content saturation | Medium | Low | Unique angles, niche focus |
| Competitor copy | Low | Medium | Stay anti-corporate, authentic |
| Burnout | Low | High | Full automation removes this |

---

## Success Metrics Dashboard

**Daily (automated report):**
- Leads found
- DMs sent
- Replies received
- Link clicks
- Trial signups

**Weekly (1-hour review):**
- Conversion rates
- Best-performing content
- Email performance
- Revenue total

**Monthly (30-min review):**
- MRR growth
- Funnel conversion rates
- Content ROI
- System health check

---

## Next Steps

1. ✅ This document created
2. ⏳ Calendly account set up
3. ⏳ Demo video recorded
4. ⏳ Email service configured
5. ⏳ First outreach sequence tested
6. ⏳ First blog post generated

**What would you like to build first?**
- Calendly integration
- Demo video script
- Email sequences
- Lead research automation

Let me know and I'll execute.