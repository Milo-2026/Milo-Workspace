# Database Blueprint for Small Business
## What Data to Track and How to Set It Up

---

## Introduction

**"What gets measured gets managed."**

The businesses that grow fastest are the ones that track their data. Not complicated databases. Simple systems that help you make better decisions.

This guide shows you exactly what to track and how to set it up—even if you've never built a database before.

---

## Why Most Small Businesses Fail at Data

### The Problem
- 53% of SMBs don't know what insights their data could provide
- Most try to track everything and end up tracking nothing
- They buy expensive software they don't use

### The Solution
- Start with 5 metrics
- Use simple tools
- Build complexity only when needed

---

## The 5 Core Metrics Every Business Must Track

### 1. Revenue
**What:** Money coming in
**Why:** Know if you're growing or shrinking
**How often:** Daily

### 2. Customer Count
**What:** Total active customers
**Why:** Track growth and churn
**How often:** Weekly

### 3. Lead Volume
**What:** New potential customers
**Why:** Predict future revenue
**How often:** Daily

### 4. Conversion Rate
**What:** % of leads that become customers
**Why:** Measure sales efficiency
**How often:** Weekly

### 5. Average Transaction Value
**What:** Average sale amount
**Why:** Know what drives revenue
**How often:** Weekly

---

## The Data Stack (Choose Your Level)

### Level 1: Spreadsheets (Free)
- Google Sheets
- Excel Online
- Works for: 0-100 customers

### Level 2: No-Code Databases ($0-20/mo)
- Airtable
- Notion
- Glide
- Works for: 100-1,000 customers

### Level 3: Simple CRM ($20-50/mo)
- HubSpot Free
- Pipedrive
- Works for: 1,000+ customers

---

## Setting Up Your First Database

### Option A: Google Sheets (Free)

#### Step 1: Create a Sheet
1. Go to sheets.google.com
2. Create new sheet called "Business Metrics"

#### Step 2: Create These Columns
| Column | Type | Description |
|--------|------|-------------|
| Date | Date | When |
| Revenue | Currency | How much |
| New Leads | Number | How many |
| Customers | Number | Total |
| Conversion % | Percentage | Close rate |

#### Step 3: Set Up Simple Tracking
- Add one row per day
- Use formulas: =Revenue/Customers for average value

---

### Option B: Airtable (Recommended)

#### Step 1: Sign Up
- Go to airtable.com
- Start free

#### Step 2: Create Base
1. Click "Create a base"
2. Choose "Start from scratch"

#### Step 3: Create Tables

**Table 1: Customers**
| Field | Type |
|-------|------|
| Name | Single line text |
| Email | Email |
| Phone | Phone number |
| Status | Single select (Active, Churned) |
| Created | Date |
| Lifetime Value | Currency |

**Table 2: Revenue**
| Field | Type |
|-------|------|
| Customer | Link to Customers |
| Amount | Currency |
| Date | Date |
| Type | Single select (One-time, Recurring) |

**Table 3: Leads**
| Field | Type |
|-------|------|
| Name | Single line text |
| Source | Single select (Referral, Ad, Organic) |
| Status | Single select (New, Contacted, Won, Lost) |
| Created | Date |

---

## The Dashboard View

Create a dashboard to see your business at a glance:

### Essential Dashboard Elements

1. **Today's Revenue** - Big number display
2. **This Month vs Last Month** - Comparison
3. **Lead Sources** - Pie chart
4. **Conversion Funnel** - Pipeline view

### Airtable Dashboard
1. Click "Views" → "Create view"
2. Choose "Gallery" or "Kanban"
3. Name it "Dashboard"

---

## Automation Ideas

### Auto-Capture Leads from Forms
1. Create a Google Form
2. Connect to Airtable via Zapier
3. New form submission → New lead in Airtable

### Auto-Calculate Metrics
Airtable formulas:
```
Revenue This Month: =SUMIF({Date}, IS_BEFORE_TODAY(), {Amount})
Conversion Rate: ={Won Leads} / {Total Leads}
```

### Auto-Email Reports
1. Set up scheduled Zap
2. Every Monday at 9 AM
3. Pull dashboard data
4. Email to yourself

---

## Templates Included

### Template 1: Daily Dashboard
```
| Date | Revenue | Leads | Customers | Conversion |
|------|---------|-------|-----------|------------|
| 2/1  | $1,200 | 15    | 150       | 20%        |
| 2/2  | $800   | 12    | 151       | 18%        |
```

### Template 2: Lead Tracking
```
| Name | Email | Source | Status | Next Action |
|------|-------|--------|--------|-------------|
| John | j@..  | Google | New    | Call today  |

Next Actions:
- New: Contact within 24h
- Contacted: Follow up in 3 days
- Won: Add to customers
- Lost: Move to archive
```

### Template 3: Customer Health Score
```
Formula: (Days Since Last Purchase × -1) + (Support Tickets × -2) + ( NPS Score × 2)

Result:
- Score > 50: Healthy
- Score 20-50: At Risk
- Score < 20: Churn Risk
```

---

## What to Track by Industry

### Service Business (Consulting, Agency)
- Hours billed
- Utilization rate
- Client satisfaction score
- Proposal win rate

### E-Commerce
- Orders per day
- Average order value
- Return rate
- Customer lifetime value

### SaaS / Subscription
- Monthly recurring revenue (MRR)
- Churn rate
- Net revenue retention
- Activation rate

### Retail
- Units sold
- Inventory turnover
- Gross margin
- Foot traffic

---

## Growth Metrics (When Ready)

Once your basics are solid, add:

### Marketing Metrics
- Cost per lead
- Cost per acquisition
- Return on ad spend (ROAS)
- Email open rate

### Team Metrics
- Revenue per employee
- Sales cycle length
- Support tickets per customer

---

## Common Mistakes

### Mistake #1: Tracking Everything
Start with 5 metrics. Add more only when you use them.

### Mistake #2: No Review Cadence
Set a weekly 15-minute review. Look at your dashboard every Monday.

### Mistake #3: Fancy Tools Before Needed
Google Sheets → Airtable → Custom. Upgrade only when current tool slows you down.

### Mistake #4: No Accountability
Share your numbers with someone. Accountability drives action.

---

## Quick Start Checklist

- [ ] Choose your tool (Sheets or Airtable)
- [ ] Set up 5 core metrics
- [ ] Add 10 historical data points
- [ ] Create your dashboard view
- [ ] Set weekly review reminder
- [ ] Add one automation

---

## What's Next?

- **AI Agent Starter Pack** - Use AI to automate data entry
- **Automation Templates** - 50+ copy-paste workflows

---

*© 2026 AI Ops Lab. All rights reserved.*
