# Automation Templates Collection
## 50+ Copy-Paste Workflows for Small Business

---

## Introduction

You don't need to be a developer to automate your business. This guide gives you 50+ copy-paste automation templates for the most common business tasks.

Each template works with free or low-cost tools like Zapier, Make (Integromat), and Google Sheets.

---

## How to Use These Templates

### Understanding the Format

Each template shows:
- **What it does**: Plain English description
- **Tools needed**: Which apps required
- **Setup time**: How long to implement
- **Copy-paste content**: Exact settings to use

### Tools Used in This Guide

| Tool | Best For | Cost |
|------|----------|------|
| Zapier | App connections | Free (100 tasks/mo) |
| Make | Complex workflows | Free (1,000 ops/mo) |
| Google Sheets | Data storage | Free |
| Gmail | Email automation | Free |
| Slack | Team communication | Free |

---

## Part 1: Lead Generation (12 Templates)

### Template 1: New Lead → Slack Notification
**What:** Get instant Slack when a new lead arrives  
**Tools:** Form → Zapier → Slack  
**Time:** 10 minutes

**Setup:**
1. Create Google Form for leads
2. Zapier trigger: "New Form Response"
3. Action: "Send Slack Message"
4. Message: "🎯 New lead: {{Name}} - {{Email}} - {{Company}}"

---

### Template 2: Website Form → CRM
**What:** Add new website visitors to your CRM automatically  
**Tools:** Typeform/Form → Zapier → HubSpot  
**Time:** 15 minutes

**Copy this:**
- Trigger: Form submission
- Action: Create contact in HubSpot
- Map: Name → First Name, Email → Email, Phone → Phone

---

### Template 3: Lead Score Auto-Update
**What:** Automatically score leads based on actions  
**Tools:** Airtable + Zapier  
**Time:** 20 minutes

**Formula:**
```
Score = 
  (Email opened = +5)
  (Link clicked = +10)
  (Page visited pricing = +15)
  (Demo requested = +25)
```

---

### Template 4: New Lead → Welcome Email Sequence
**What:** Send 5-email nurture sequence to new leads  
**Tools:** Form → Zapier → Email sequence  
**Time:** 30 minutes

**Email 1 (Immediate):** "Thanks for your interest!"
**Email 2 (Day 2):** "Here's a quick tip..."
**Email 3 (Day 4):** "Case study..."
**Email 4 (Day 7):** "Quick question..."
**Email 5 (Day 14):** "Special offer..."

---

### Template 5: Duplicate Lead Detector
**What:** Prevent same lead from entering twice  
**Tools:** Airtable  
**Time:** 5 minutes

**Formula:**
```
IF(
  OR(
    {Email} = {Previous Email},
    {Phone} = {Previous Phone}
  ),
  "Duplicate",
  "New"
)
```

---

### Template 6: Lead Source Tracker
**What:** Automatically tag where each lead came from  
**Tools:** UTM parameters → Google Sheets  
**Time:** 10 minutes

**Track these parameters:**
- utm_source (google, facebook, linkedin)
- utm_medium (cpc, email, social)
- utm_campaign (spring_sale, webinar)

---

### Template 7: Hot Lead → SMS Alert
**What:** Get text when lead scores above 50  
**Tools:** Zapier + Twilio  
**Time:** 20 minutes

**Message:** "🔥 HOT LEAD: {{Name}} ({{Company}}) - Score: {{Score}}"

---

### Template 8: Meeting Request → Calendar + Email
**What:** Automatically confirm meetings  
**Tools:** Calendly → Zapier → Google Calendar + Email  
**Time:** 15 minutes

---

### Template 9: Webinar Register → Email Course
**What:** Add webinar attendees to 7-day email course  
**Tools:** Webinar → Zapier → Email  
**Time:** 20 minutes

---

### Template 10: Abandoned Form → Follow-up
**What:** Email someone who started but didn't finish form  
**Tools:** Typeform + Zapier  
**Time:** 15 minutes

**Email:** "We noticed you started but didn't finish..."

---

### Template 11: LinkedIn Connection → CRM
**What:** Add new LinkedIn connections automatically  
**Tools:** LinkedIn → Zapier → Airtable  
**Time:** 15 minutes

---

### Template 12: Lead Rotation
**What:** Distribute leads evenly among sales team  
**Tools:** Airtable  
**Time:** 10 minutes

**Formula:**
```
MOD(ROW(), 3) + 1
// Distributes 1, 2, 3, 1, 2, 3...
```

---

## Part 2: Sales & CRM (10 Templates)

### Template 13: Deal Stage Change → Notify Team
**What:** Slack when deal moves to "Negotiation"  
**Tools:** CRM → Zapier → Slack  
**Time:** 10 minutes

---

### Template 14: Win Deal → Create Invoice
**What:** Auto-generate invoice when deal closes  
**Tools:** CRM → Zapier → QuickBooks/Stripe  
**Time:** 20 minutes

---

### Template 15: Deal Close → Thank You Email
**What:** Send thank you + upsell automatically  
**Tools:** CRM → Zapier → Email  
**Time:** 15 minutes

---

### Template 16: Follow-up Reminder
**What:** Auto-remind to contact stalled leads  
**Tools:** Airtable → Zapier → Slack  
**Time:** 15 minutes

**Rule:** If no activity for 7 days → Slack reminder

---

### Template 17: Customer Onboarding Sequence
**What:** Auto-start onboarding when deal closes  
**Tools:** CRM → Zapier → Email + Tasks  
**Time:** 30 minutes

---

### Template 18: Upsell Trigger
**What:** Alert when customer hits spending threshold  
**Tools:** Stripe → Zapier → CRM + Email  
**Time:** 20 minutes

**Trigger:** Lifetime value > $1,000

---

### Template 19: Churn Risk Alert
**What:** Get alert when customer shows churn signals  
**Tools:** Usage data → Zapier → Slack  
**Time:** 20 minutes

**Signals:**
- Login frequency dropped 50%
- No purchases in 30 days
- Support tickets increased

---

### Template 20: Refund Request → Slack
**What:** Instant notification of refund requests  
**Tools:** Stripe → Zapier → Slack  
**Time:** 10 minutes

---

### Template 21: Commission Calculator
**What:** Auto-calculate sales commissions  
**Tools:** Airtable  
**Time:** 10 minutes

**Formula:**
```
IF({Tier}="Bronze", {Revenue}*0.05,
IF({Tier}="Silver", {Revenue}*0.07,
IF({Tier}="Gold", {Revenue}*0.10, 0)))
```

---

### Template 22: Quarterly Business Review Generator
**What:** Auto-create QBR document  
**Tools:** CRM + Google Docs + Zapier  
**Time:** 30 minutes

---

## Part 3: Customer Support (8 Templates)

### Template 23: New Ticket → Slack
**What:** Real-time support ticket notifications  
**Tools:** Helpdesk → Zapier → Slack  
**Time:** 10 minutes

---

### Template 24: Ticket Assign → Auto-Assign
**What:** Route tickets based on type  
**Tools:** Helpdesk → Zapier  
**Time:** 15 minutes

**Rules:**
- Billing → Accounting team
- Technical → Support team
- Sales → Sales team

---

### Template 25: Negative Review → Immediate Response
**What:** Alert + template response for 1-star reviews  
**Tools:** Review site → Zapier → Email  
**Time:** 20 minutes

---

### Template 26: Support Close → Survey
**What:** Send satisfaction survey after ticket closes  
**Tools:** Helpdesk → Zapier → Email  
**Time:** 15 minutes

---

### Template 27: Common Question FAQ Bot
**What:** Auto-respond to common questions  
**Tools:** Chatbot builder  
**Time:** 30 minutes

**Common questions:**
- "What are your hours?"
- "How much does it cost?"
- "Do you offer refunds?"

---

### Template 28: Ticket Priority Auto-Tag
**What:** Score urgency automatically  
**Tools:** Helpdesk → Zapier → AI  
**Time:** 20 minutes

**Send to AI with prompt:** "Rate urgency 1-10 based on: {{Subject}} {{Description}}"

---

### Template 29: Knowledge Base Sync
**What:** Keep help docs in sync with product  
**Tools:** Notion → Zapier → Helpdesk  
**Time:** 30 minutes

---

### Template 30: Weekly Support Summary
**What:** Auto-Digest of support metrics  
**Tools:** Helpdesk → Zapier → Email  
**Time:** 15 minutes

---

## Part 4: Marketing & Social (10 Templates)

### Template 31: Blog Post → Social Auto-Post
**What:** Share new blog to all social channels  
**Tools:** WordPress/Zapier → Buffer/Hootsuite  
**Time:** 20 minutes

---

### Template 32: New Subscriber → Welcome Sequence
**What:** Nurture new email subscribers  
**Tools:** Email → Zapier → Email sequence  
**Time:** 30 minutes

---

### Template 33: Social Mention → Alert
**What:** Know when someone mentions your brand  
**Tools:** Mention → Zapier → Slack  
**Time:** 15 minutes

---

### Template 34: Customer Testimonial → Social Proof
**What:** Auto-share new testimonials  
**Tools:** Form → Zapier → Twitter/LinkedIn  
**Time:** 20 minutes

---

### Template 35: Weekly Content Digest
**What:** Compile week's content for newsletter  
**Tools:** Airtable → Zapier → Email  
**Time:** 20 minutes

---

### Template 36: Hashtag Tracker
**What:** Track performance of specific hashtags  
**Tools:** Airtable + Zapier  
**Time:** 15 minutes

---

### Template 37: Influencer Outreach Tracker
**What:** Manage influencer collaborations  
**Tools:** Airtable  
**Time:** 10 minutes

---

### Template 38: Campaign ROI Calculator
**What:** Auto-calculate marketing ROI  
**Tools:** Google Sheets  
**Time:** 15 minutes

**Formula:**
```
ROI = (Revenue - Cost) / Cost * 100
```

---

### Template 39: Email Open → Update Score
**What:** Track engagement by email opens  
**Tools:** Email → Zapier → CRM  
**Time:** 15 minutes

---

### Template 40: A/B Test Tracker
**What:** Track A/B test results automatically  
**Tools:** Airtable  
**Time:** 10 minutes

---

## Part 5: Operations (10 Templates)

### Template 41: New Employee → Provision All Accounts
**What:** Auto-create accounts for new hires  
**Tools:** HR system → Zapier → All tools  
**Time:** 30 minutes

**Onboarding checklist:**
- [ ] Create email
- [ ] Add to Slack
- [ ] Add to CRM
- [ ] Set up project access
- [ ] Assign training

---

### Template 42: Expense Approval Workflow
**What:** Auto-route expenses for approval  
**Tools:** Expensify → Zapier → Email  
**Time:** 20 minutes

**Rules:**
- Under $100 → Auto-approve
- $100-500 → Manager approval
- Over $500 → Two-level approval

---

### Template 43: Invoice Overdue → Reminder
**What:** Auto-send payment reminders  
**Tools:** Stripe/QuickBooks → Zapier → Email  
**Time:** 15 minutes

**Schedule:**
- Day 1: Friendly reminder
- Day 7: Second reminder
- Day 14: Urgent
- Day 30: Final + suspend service

---

### Template 44: Inventory Low → Order
**What:** Auto-reorder when stock is low  
**Tools:** E-commerce → Zapier → Supplier email  
**Time:** 20 minutes

---

### Template 45: Daily Team Standup Digest
**What:** Compile daily updates automatically  
**Tools:** Slack/Standup → Zapier → Email  
**Time:** 15 minutes

---

### Template 46: Weekly Report Generator
**What:** Auto-generate weekly business reports  
**Tools:** Multiple sources → Google Sheets → PDF → Email  
**Time:** 30 minutes

---

### Template 47: Contract Signature → Onboarding
**What:** Start onboarding when contract signs  
**Tools:** DocuSign → Zapier → All systems  
**Time:** 25 minutes

---

### Template 48: Subscription Renewals
**What:** Track upcoming renewals  
**Tools:** Stripe → Airtable  
**Time:** 15 minutes

---

### Template 49: Vendor Payment Schedule
**What:** Track and schedule vendor payments  
**Tools:** Google Sheets  
**Time:** 10 minutes

---

### Template 50: Year-End Tax Prep
**What:** Auto-categorize expenses for taxes  
**Tools:** Bank → Google Sheets  
**Time:** 30 minutes

---

## Quick Start: Pick 3

Don't try to implement all 50. Start with these:

1. **Lead → Slack notification** - Never miss a lead
2. **Follow-up reminder** - Stop losing leads
3. **Invoice overdue → Reminder** - Get paid faster

Add more as you see wins.

---

## Tools Quick Reference

| Tool | Best For | Free Tier |
|------|----------|-----------|
| Zapier | Beginners | 100 tasks/mo |
| Make | Complex workflows | 1,000 ops/mo |
| Airtable | Database | 1,000 records |
| Buffer | Social scheduling | 3 channels |
| Mailchimp | Email | 500 contacts |

---

## Need Help?

- Join r/zapier for troubleshooting
- Check Make academy for video tutorials
- Email support for specific questions

---

*© 2026 AI Ops Lab. All rights reserved.*
