# Agentic Workflows Implementation Guide
**For Side Quest Studios**
**Generated:** March 11, 2026

---

## Executive Summary

This guide provides step-by-step instructions to implement **agentic workflows** in your business, based on the 6-hour course by Maker School. Agentic workflows transform AI from a "glorified copy-paste tool" into an autonomous employee that executes multi-step tasks.

**Target Outcomes:**
- Reduce content creation time from 4 hours/day → 30 minutes/day
- Automate lead qualification
- Enable 24/7 autonomous operations
- Create scalable systems that heal themselves

---

## Part 1: Understanding the Core Concepts

### 1.1 The Overhang Problem

```
┌─────────────────────────────────────────────────────────┐
│  AI Reality (What AI can do)                           │
│  ════════════════════════════════                       │
│  • Autonomous multi-step tasks                          │
│  • Tool use (search, email, API calls)                 │
│  • Self-correction and validation                      │
│                                                         │
│         ╔═══════════════════════╗                       │
│         ║   THE OVERHANG        ║  ← Gap = Opportunity │
│         ╚═══════════════════════╝                       │
│                                                         │
│  Public Perception (What people do)                    │
│  ════════════════════════════════                       │
│  • Ask AI a question                                   │
│  • Copy answer from one tab to another                 │
│  • Repeat                                              │
└─────────────────────────────────────────────────────────┘
```

**Your Advantage:** By implementing agentic workflows NOW, you capture this arbitrage window before it closes.

### 1.2 The DO Framework

Every agentic workflow follows three phases:

| Phase | Description | Example |
|-------|-------------|---------|
| **Directive** | Clear instructions + success criteria | "Find 5 meal prep companies, get emails, send our specs" |
| **Orchestration** | Agent plans and coordinates sub-tasks | Claude searches, finds contacts, drafts emails |
| **Execution** | Tool calls + validation + self-correction | MCP sends emails, validates delivery |

---

## Part 2: Implementation Roadmap

### Phase 1: Upgrade X Orchestrator (Week 1)

**Current State (Basic Loop):**
```python
# Current orchestrator.py
while True:
    post_to_x()
    sleep(780-1020 seconds)  # 13-17 minutes
```

**Upgraded State (Agentic):**
```python
# orchestrator_v2.py - Agentic Social Media Manager
DIRECTIVE = """
You are a social media manager for 3- @ brands:
addonquote (roofing SaaS)
- @SideQuestStd (studio brand)
- @sheetitnow (PDF conversion)

Your responsibilities:
1. Post content from pipelines.json (20 posts/day/brand)
2. Engage with relevant posts (like, comment, retweet)
3. Research trending topics in each niche
4. Report metrics to Notion daily

Success criteria:
- 20 posts/day per account (60 total)
- 10+ engagement actions/day
- Trending topics identified by 9AM
- Silence zone: 12AM-6AM

Tools available:
- post_to_x (post tweet)
- search_x (search mentions)
- engage_with_post (like/retweet/comment)
- sync_to_notion (log metrics)
- get_trending_topics (research)
"""

def agent_loop():
    # 1. DIRECTIVE: Load and understand task
    directive = load_directive()
    
    # 2. ORCHESTRATION: Plan the day's work
    plan = create_daily_plan(directive)
    
    # 3. EXECUTION: Run tasks with validation
    results = execute_with_validation(plan)
    
    # 4. SELF-HEALING: Retry failed tasks
    if not results.success:
        heal_and_retry(results.errors)
    
    # 5. REPORT: Sync to Notion
    sync_metrics(results)
```

**Implementation Steps:**

| Step | Task | Time |
|------|------|------|
| 1 | Backup current orchestrator | 5 min |
| 2 | Create directive.md file | 30 min |
| 3 | Implement orchestration logic | 2 hours |
| 4 | Add self-healing hooks | 1 hour |
| 5 | Test for 24 hours | 24 hours |
| 6 | Deploy to production | 1 hour |

---

### Phase 2: Build Lead Qualifier Agent (Week 2-3)

**Purpose:** Automatically qualify leads for AddOnQuote

**Directive:**
```
You are a lead qualification agent for AddOnQuote (roofing SaaS).

Your task: Evaluate incoming leads and score them based on:
- Company size (1-10 points)
- Website quality (1-10 points)
- Social presence (1-5 points)
- Urgency signals (1-10 points)
- Budget indicators (1-10 points)

Scoring:
- 35+ points: HOT - immediate follow-up
- 25-34 points: WARM - nurture sequence
- 15-24 points: COLD - newsletter only
- 0-14 points: PASS - no action

Output: JSON with score, notes, and recommended action.
```

**Sub-Agent Architecture:**
```
┌─────────────────────────────────────────────────────────┐
│  LEAD QUALIFIER AGENT                                    │
│  ├── Research Sub-Agent (search company info)           │
│  │   └── Tools: Brave Search, X Search                  │
│  ├── Score Sub-Agent (evaluate fit)                    │
│  │   └── Tools: Scoring algorithm                       │
│  └── Notify Sub-agent (alert team)                      │
│      └── Tools: Email, Slack, Notion                    │
└─────────────────────────────────────────────────────────┘
```

**Tools Needed:**
- Apollo.io API (company data)
- Brave Search (research)
- Email/SMTP (notifications)

---

### Phase 3: Content Research Agent (Week 3-4)

**Purpose:** Automatically find trending content ideas

**Directive:**
```
You are a content research agent.

Daily tasks:
1. Search for trending topics in: roofing, SaaS, AI tools
2. Find 3 potential content angles per brand
3. Identify 5 engagement opportunities (relevant posts to engage with)
4. Compile report by 9AM

Output format:
- Trending topics list
- Content suggestions
- Engagement targets
```

---

### Phase 4: Customer Support Agent (Week 4-5)

**Purpose:** Handle Sheet It Now support automatically

**Directive:**
```
You are a customer support agent for Sheet It Now.

Capabilities:
- Answer FAQs about PDF to Excel conversion
- Troubleshoot common errors
- Process refund requests under $10
- Escalate complex issues to human

Knowledge base: /knowledge/base/faq.md
```

---

## Part 3: Technical Implementation Details

### 3.1 Project Structure

```
/Users/alfredoalvarez/.openclaw/agentic/
├── directives/
│   ├── orchestrator_directive.md
│   ├── lead_qualifier_directive.md
│   ├── content_researcher_directive.md
│   └── support_agent_directive.md
├── sub_agents/
│   ├── researcher/
│   │   ├── directive.md
│   │   └── system_prompt.txt
│   ├── scorer/
│   ├── emailer/
│   └── publisher/
├── mcp_servers/
│   ├── email_server.py
│   ├── search_server.py
│   └── crm_server.py
├── core/
│   ├── do_framework.py
│   ├── orchestration.py
│   ├── self_healing.py
│   └── validation.py
├── utils/
│   ├── logger.py
│   ├── metrics.py
│   └── config.py
├── tests/
│   ├── test_directives.py
│   ├── test_workflows.py
│   └── test_self_healing.py
└── config.yaml
```

### 3.2 Self-Healing Implementation

```python
# core/self_healing.py
from typing import List, Dict, Any
import time

class SelfHealingAgent:
    def __init__(self, max_retries=3, backoff_factor=2):
        self.max_retries = max_retries
        self.backoff_factor = backoff_factor
    
    def execute_with_healing(self, task: Dict) -> Dict:
        """Execute task with automatic retry and recovery."""
        
        errors = []
        
        for attempt in range(self.max_retries):
            try:
                result = task.execute()
                
                # Validate output
                if not self.validate(result):
                    raise ValidationError(f"Invalid result: {result}")
                
                return {
                    "status": "success",
                    "result": result,
                    "attempts": attempt + 1
                }
                
            except Exception as e:
                errors.append({
                    "attempt": attempt + 1,
                    "error": str(e),
                    "timestamp": time.time()
                })
                
                # Analyze error and adjust
                self.heal(task, e)
                
                # Exponential backoff
                wait_time = self.backoff_factor ** attempt
                time.sleep(wait_time)
        
        return {
            "status": "failed",
            "errors": errors,
            "attempts": self.max_retries
        }
    
    def heal(self, task: Dict, error: Exception):
        """Attempt to heal from error."""
        
        error_type = type(error).__name__
        
        healing_strategies = {
            "APIError": "Switch to backup API or reduce rate",
            "TimeoutError": "Increase timeout, retry with smaller batch",
            "ValidationError": "Fix input format, add sanitization",
            "AuthError": "Refresh credentials, use backup endpoint"
        }
        
        strategy = healing_strategies.get(error_type, "generic_retry")
        print(f"Healing strategy: {strategy}")
```

### 3.3 Least Privilege for Sub-Agents

```python
# sub_agents/researcher/agent.py
RESEARCHER_PRIVILEGES = {
    "allowed_tools": [
        "brave_search",
        "x_search",
        "read_file",
    ],
    "denied_tools": [
        "send_email",
        "write_file",
        "execute_code",
        "delete_data"
    ],
    "rate_limits": {
        "search": 100,  # per hour
        "read": 1000    # per hour
    }
}

# sub_agents/emailer/agent.py
EMAILER_PRIVILEGES = {
    "allowed_tools": [
        "send_email",
        "read_template",
    ],
    "denied_tools": [
        "brave_search",
        "x_post",
        "execute_code",
    ],
    "rate_limits": {
        "email": 50  # per hour
    }
}
```

---

## Part 4: MCP Integration

### 4.1 What is MCP?

MCP (Model Context Protocol) lets agents directly call tools without exposing API keys or complex prompts.

### 4.2 Email MCP Server

```python
# mcp_servers/email_server.py
from mcp.server import Server
from typing import Optional
import smtplib
from email.mime.text import MIMEText

class EmailMCPServer(Server):
    def __init__(self):
        super().__init__("email-server")
        self.smtp_config = load_smtp_config()  # Hidden from agent
    
    @Server.tool()
    def send_email(
        self,
        to: str,
        subject: str,
        body: str,
        template: Optional[str] = None
    ) -> dict:
        """Send email - agent calls this directly."""
        
        # Agent sees only this interface
        # API keys never exposed
        
        msg = MIMEText(body)
        msg['Subject'] = subject
        msg['From'] = self.smtp_config['from']
        msg['To'] = to
        
        with smtplib.SMTP(
            self.smtp_config['host'],
            self.smtp_config['port']
        ) as server:
            server.starttls()
            server.login(
                self.smtp_config['username'],
                self.smtp_config['password']
            )
            server.send_message(msg)
        
        return {
            "status": "sent",
            "message_id": generate_id(),
            "to": to
        }
```

---

## Part 5: Implementation Checklist

### Week 1: X Orchestrator Upgrade
- [ ] Backup current orchestrator.py
- [ ] Create directive.md for social media agent
- [ ] Implement orchestration logic
- [ ] Add self-healing hooks
- [ ] Test for 24 hours
- [ ] Deploy to production

### Week 2-3: Lead Qualifier
- [ ] Set up Apollo.io API
- [ ] Create lead_qualifier_directive.md
- [ ] Build research sub-agent
- [ ] Build scorer sub-agent
- [ ] Build notification sub-agent
- [ ] Test with sample leads

### Week 3-4: Content Research
- [ ] Set up Brave Search API
- [ ] Create content_researcher_directive.md
- [ ] Build daily research workflow
- [ ] Connect to Notion for reporting

### Week 4-5: Support Agent
- [ ] Build knowledge base
- [ ] Create support_agent_directive.md
- [ ] Set up FAQ automation
- [ ] Configure escalation rules
- [ ] Test with real support tickets

---

## Part 6: Success Metrics

| Metric | Before | After (Target) |
|--------|--------|----------------|
| Content creation time | 4 hrs/day | 30 min/day |
| Lead response time | 24-48 hours | < 1 hour |
| Engagement actions | 0/day | 15+/day |
| Support tickets handled | 0 (manual) | 50%/day automated |
| Revenue per lead | Baseline | +30% (better qualify) |

---

## Part 7: Synergy with NCL

### No Code Lab as Case Study

Your NCL (No Code Lab) business becomes the perfect demonstration:

| NCL Playbook | Your Implementation |
|--------------|---------------------|
| G01: Identify Opportunities | Lead Qualifier Agent |
| G02: Build Solutions | Content Creator Agent |
| G03: Write Listings | Publisher Agent |
| G04: Customer Acquisition | Outreach Agent |
| G05: Retention | Support Responder Agent |
| G06: Scale | Multi-agent Orchestrator |

**You = living proof of agentic workflows in action.**

---

## Part 8: Resources

| Resource | Link |
|----------|------|
| Video Course | https://youtu.be/MxyRjL7NG18 |
| Maker School | https://makerschool.com |
| MCP Docs | modelcontextprotocol.io |
| Agency-Agents | https://github.com/msitarzewski/agency-agents |

---

## Next Steps

1. **Today:** Review this guide and decide on Phase 1 start
2. **This Week:** Upgrade X orchestrator with DO Framework
3. **Next Week:** Build Lead Qualifier agent

**Ready to start?** Let me know which phase you'd like me to implement first.

---

*Generated by Milo for Side Quest Studios*
*Based on Maker School's Agentic Workflows Course (2026)*