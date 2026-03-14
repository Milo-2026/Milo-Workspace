#!/bin/bash
# Daily Data Check Script
# Run this via cron: 0 9 * * * /path/to/daily_check.sh

cd ~/.openclaw/workspace/data-logger

echo "========================================"
echo "Side Quest Studios - Daily Data Check"
echo "Date: $(date)"
echo "========================================"

# Check Supabase connection
echo ""
echo "📡 Checking Supabase..."
if python3 -c "from supabase_client import db; db._request('x_accounts')" 2>/dev/null; then
    echo "✅ Supabase: Connected"
else
    echo "❌ Supabase: Connection failed"
    exit 1
fi

# Log follower counts (manual input required)
echo ""
echo "📈 Follower Check"
echo "Run: python3 log_data.py --followers"

# Check for pending tasks
echo ""
echo "📋 Pending Tasks:"
echo "   - Check X for engagement on recent posts"
echo "   - Review CRM for follow-ups"
echo "   - Check email open rates"
echo "   - Review experiment results"

# Generate daily report
echo ""
echo "📊 Generating Report..."
python3 -c "
from supabase_client import db

accounts = db.get_x_accounts()
total_followers = sum(a.get('followers', 0) for a in accounts)
posts = db._request('x_posts?select=engagements').get('data', [])
total_eng = sum(p.get('engagements', 0) for p in posts)
contacts = db._request('crm_contacts?select=id').get('data', [])

print(f'   Followers: {total_followers}')
print(f'   Total Engagements: {total_eng}')
print(f'   CRM Contacts: {len(contacts)}')
"

echo ""
echo "========================================"
echo "✅ Daily check complete"
echo "========================================"
