# Side Quest Studios Data Logger

Comprehensive data logging system for tracking all analytics in Supabase.

## Quick Start

```bash
# Check current data status
python3 log_data.py --status

# Log follower counts
python3 log_data.py --followers

# Log a post
python3 log_data.py --posts

# Add CRM contact
python3 log_data.py --crm

# Log revenue
python3 log_data.py --revenue

# Create A/B experiment
python3 log_data.py --experiment

# Export all data to JSON
python3 log_data.py --export
```

## Commands

| Command | Description |
|---------|-------------|
| `--status` | Show all data currently in Supabase |
| `--followers` | Log daily follower counts |
| `--posts` | Log a post with metrics |
| `--crm` | Add contacts or log activities |
| `--revenue` | Log subscriptions or MRR |
| `--experiment` | Create new A/B test |
| `--export` | Export all data to JSON |

## Daily Workflow

```bash
# 1. Check current status
python3 log_data.py --status

# 2. Log today's follower counts
python3 log_data.py --followers

# 3. If you posted content today
python3 log_data.py --posts

# 4. If you contacted leads
python3 log_data.py --crm

# 5. Export backup
python3 log_data.py --export
```

## Files

```
data-logger/
├── supabase_client.py   # Supabase client library
├── log_data.py          # Main data logging script
├── daily_check.sh       # Daily check script (cron)
├── dashboard_api.py     # Dashboard API server
└── README.md            # This file
```

## Cron Setup (Optional)

```bash
# Add to crontab for daily checks
crontab -e

# Add this line for daily reminder at 9am:
0 9 * * * cd ~/.openclaw/workspace/data-logger && python3 daily_check.sh >> ~/daily_check.log 2>&1
```

## Data Stored in Supabase

| Table | Description |
|-------|-------------|
| x_accounts | X account profiles |
| x_followers_daily | Daily follower counts |
| x_posts | All posts with metrics |
| x_experiments | A/B test results |
| x_viral_spikes | Viral moment tracking |
| crm_contacts | Lead profiles |
| crm_activities | Every interaction logged |
| crm_sequences | Email sequences |
| revenue_subscriptions | Customer subscriptions |
| revenue_mrr_daily | Daily MRR snapshots |
| content_inventory | All content pieces |
| marketing_campaigns | Ad/email campaigns |

## Dashboard

Access the dashboard at: **http://localhost:3333**

Navigate to **X Analytics** to see your data visualized.

## Manual Data Entry Examples

### Log Follower Counts
```
$ python3 log_data.py --followers

📈 LOG FOLLOWER COUNTS
=============================================

🏠 AddOnQuote (@addonquote)
   Followers: 130
   Following: 89
   Total Posts: 1260
   ✅ Logged: 130 followers (net: +3)

⚡ Side Quest (@SideQuestStd)
   Followers: 240
   ...
```

### Log a Post
```
$ python3 log_data.py --posts

📝 LOG A POST
=============================================

Select account:
   1. AddOnQuote (@addonquote)
   2. Side Quest Studios (@SideQuestStd)
   3. Sheet It Now (@sheetitnow)

Account (1-3): 1

Logging post for AddOnQuote
Content: You're losing $800/job
Type: single
Hook: pain_point
Topic: roofing

Metrics:
   Impressions: 5000
   Engagements: 350
   Likes: 150
   ...
✅ Post logged
```

### Add CRM Contact
```
$ python3 log_data.py --crm

🏠 LOG CRM ACTIVITY
=============================================

1. Add new contact
2. Log activity for existing contact

Choice (1-2): 1

--- Add New Contact ---
Name: John Rodriguez
Email: john@rodriguezroofing.com
Phone: 555-0123
Company: Rodriguez Roofing LLC
Title: Owner
Location: Miami, FL
Size: small
Source: LinkedIn
Estimated Value: 299

✅ Contact added: John Rodriguez
```

## Best Practices

1. **Log daily** - Run `--followers` every day for accurate growth tracking
2. **Log every post** - Use `--posts` within 24 hours of publishing
3. **Log every interaction** - Use `--crm` for all lead activities
4. **Export weekly** - Keep JSON backups with `--export`
5. **Review insights** - Check dashboard for patterns

## Notes

- All data is stored in Supabase (`tvrhuxkgaktstiawhsji`)
- Manual entry is required for most data
- X API integration possible with Enterprise plan ($100+/month)
- Email metrics require SMTP integration
