# Side Quest Studios Analytics Metrics

Comprehensive list of all metrics tracked across platforms.

---

## 📊 X/Twitter Analytics

### Account Level
| Metric | Description | Granularity |
|--------|-------------|-------------|
| `followers` | Total follower count | Daily |
| `following` | Accounts followed | Daily |
| `posts_count` | Total posts ever | Real-time |
| `verified` | Verification status | Real-time |

### Follower Growth (Most Granular)
| Metric | Description |
|--------|-------------|
| `follower_count` | Count on specific date |
| `new_followers` | Gained that day |
| `lost_followers` | Unfollows |
| `net_growth` | New - Lost |
| `source` | organic, campaign, viral |
| `trigger_post_id` | If spike from specific post |

### Post Performance
| Metric | Description | Calculated |
|--------|-------------|------------|
| `impressions` | Times seen | - |
| `impressions_organic` | Free reach | - |
| `impressions_viral` | Amplified reach | - |
| `impressions_paid` | Ads reach | - |
| `engagements` | Total interactions | - |
| `likes` | ❤️ | - |
| `retweets` | 🔁 | - |
| `replies` | 💬 | - |
| `quotes` | Quote tweets | - |
| `bookmarks` | 🔖 | - |
| `clicks` | Link clicks | - |
| `shares` | Reshares | - |
| `engagement_rate` | Eng/Impressions % | Auto |
| `new_followers_from_post` | Direct follows | - |
| `conversion_rate` | Followers/Impressions % | Auto |
| `performance_tier` | viral/high/medium/low/flop | Auto |

### Content Attributes
| Attribute | Values |
|-----------|--------|
| `content_type` | single, thread, reply, quote |
| `topic_category` | roofing, saas, privacy, indie-hacker |
| `hook_type` | question, pain_point, statement, stat |
| `sentiment` | positive, neutral, negative, provocative |

### A/B Experiments
| Metric | Description |
|--------|-------------|
| `variant_a_text` | Content of variant A |
| `variant_b_text` | Content of variant B |
| `variant_a_metrics` | {impressions, engagements, etc} |
| `variant_b_metrics` | {impressions, engagements, etc} |
| `winner` | A, B, or null |
| `confidence_level` | Statistical significance |
| `improvement_%` | How much better winner performed |
| `insight` | Key learning |

### Viral Spikes
| Metric | Description |
|--------|-------------|
| `follower_growth` | Day-over-day increase |
| `engagement_spike` | Rate vs average |
| `trigger_type` | post, retweet, mention, external |
| `virality_score` | 1-100 velocity score |
| `reach_estimate` | Est. total reach |
| `top_sources` | Where traffic came from |

---

## 🏠 CRM Analytics

### Contact Level
| Metric | Description |
|--------|-------------|
| `name` | Full name |
| `email` | Email address |
| `phone` | Phone number |
| `website` | Company website |
| `company_size` | freelancer, small, medium, large |
| `location` | City, State |
| `source` | LinkedIn, Apollo, Referral, etc |
| `lead_score` | 0-100 fit score |
| `estimated_value` | Deal value |
| `status` | new, contacted, replied, qualified, proposal, closed |
| `stage` | 1-6 pipeline stage |

### Activity Tracking (Most Granular)
| Activity Type | Sub-metrics |
|---------------|-------------|
| `email_sent` | subject, template, status (sent/opened/clicked/replied) |
| `email_opened` | timestamp, location |
| `email_clicked` | link clicked |
| `call` | duration, outcome (positive/neutral/negative/voicemail) |
| `meeting` | type (demo/discovery/proposal), notes, scheduled/completed |
| `note` | Text note |
| `task` | Follow-up task |

### Sequence Metrics
| Metric | Description |
|--------|-------------|
| `steps` | JSON array of sequence steps |
| `total_sent` | Emails sent |
| `total_opened` | Opens |
| `total_clicked` | Clicks |
| `total_replied` | Replies |
| `open_rate` | Opens/Sent % (auto) |
| `reply_rate` | Replies/Sent % (auto) |

---

## 💰 Revenue Analytics

### Subscription Level
| Metric | Description |
|--------|-------------|
| `product` | addonquote, sidequest, sheetitnow |
| `plan` | monthly, lifetime |
| `amount` | Price paid |
| `status` | active, churned, paused, trial |
| `source` | direct, affiliate, referral, ads |
| `utm_tags` | Source tracking |

### Daily MRR Tracking (Most Granular)
| Metric | Description |
|--------|-------------|
| `date` | Day |
| `product` | Brand |
| `mrr` | Monthly Recurring Revenue |
| `active_subscribers` | Count |
| `new_subscribers` | Day's new |
| `churned_subscribers` | Day's lost |
| `net_change` | New - Churned (auto) |
| `lifetime_deals_count` | LTDs sold |
| `lifetime_value` | Total LTD revenue |

---

## 📝 Content Analytics (Cross-Platform)

| Metric | Description |
|--------|-------------|
| `platform` | x, linkedin, blog, newsletter |
| `content_type` | post, article, thread, video, image |
| `topic_category` | Main topic |
| `views` | Total views |
| `impressions` | Times shown |
| `engagements` | Interactions |
| `clicks` | Link clicks |
| `shares` | Shares |
| `conversions` | Desired actions |
| `engagement_rate` | Eng/Imp % (auto) |
| `performance_tier` | Rating |

---

## 📢 Marketing Campaigns

| Metric | Description |
|--------|-------------|
| `type` | paid_ads, email, social, affiliate |
| `platform` | facebook, google, x, etc |
| `budget` | Total budget |
| `spent` | Amount spent |
| `impressions` | Ad impressions |
| `clicks` | Ad clicks |
| `conversions` | Conversions |
| `cpa` | Cost per acquisition |
| `roi` | Return on investment |

---

## 🔧 Dashboard & Config

### Refresh Schedules
| Data Source | Frequency | Status |
|-------------|-----------|--------|
| X API | hourly | active/paused |
| CRM | real-time | active |
| Revenue | daily | active |

---

## 📈 Key Metrics to Monitor Daily

### Must Track (Daily)
- [ ] Follower counts for all 3 accounts
- [ ] New posts published
- [ ] Post engagement rates
- [ ] New leads added to CRM
- [ ] Emails sent/opened/clicked

### Monitor Weekly
- [ ] MRR change
- [ ] Best performing posts
- [ ] A/B experiment results
- [ ] Lead source breakdown
- [ ] Content performance by topic

### Review Monthly
- [ ] Overall growth trends
- [ ] Conversion rates by stage
- [ ] Campaign ROI
- [ ] Content ROI analysis
- [ ] Competitor benchmarks

---

## 🎯 Success Metrics (North Star)

| Goal | Current | Target | Metric |
|------|---------|--------|--------|
| MRR Growth | $0 | $1,000 | Monthly revenue |
| Followers | 450 | 2,000 | Total across 3 accounts |
| Lead Generation | 0 | 50/month | New contacts |
| Email Engagement | - | 25% open rate | Email performance |
| Content Performance | - | 5% engagement | Avg engagement rate |
| Sales Pipeline | 0 | 10 deals | Qualified leads |

---

## 📊 Dashboard Widgets

1. **MRR Progress Bar** - Goal tracking
2. **Follower Growth Chart** - Daily trend
3. **Post Performance Table** - Latest posts with metrics
4. **CRM Pipeline** - Stage-by-stage breakdown
5. **A/B Test Results** - Active experiments
6. **Revenue Breakdown** - By product
7. **Lead Sources** - Where leads come from
8. **Content Performance** - Best and worst content

---

## 🔗 Data Sources

| Source | API | Manual | Frequency |
|--------|-----|--------|-----------|
| X/Twitter | ✅ | Optional | Hourly |
| Supabase | ✅ | - | Real-time |
| Email (SMTP) | - | ✅ | Per send |
| Web Analytics | - | ⏳ | TBD |
| Paid Ads | ⏳ | Optional | Daily |
