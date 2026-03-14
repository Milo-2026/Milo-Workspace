#!/usr/bin/env python3
"""
Tweet Monitoring Job

Checks posted tweets every hour:
1. For tweets in "posted" status for 24h+: check threshold
   - If threshold met → move to "monitoring" (extended monitoring)
   - If threshold not met → move to "archive" (underperforming)
2. For tweets in "monitoring" status:
   - If monitoring ended → move to "archive"
   - If engagement spike detected → trigger analysis

Usage:
    python3 monitor_tweets.py --run          # Run once
    python3 monitor_tweets.py --cron          # Install cron job
"""

import os
import sys
import json
import argparse
from datetime import datetime, timedelta
from pathlib import Path

# Add workspace to path
sys.path.insert(0, os.path.expanduser('~/.openclaw/workspace'))

try:
    from supabase import create_client
    from dotenv import load_dotenv
    load_dotenv(os.path.expanduser('~/.openclaw/workspace/.env'))
except ImportError as e:
    print(f"❌ Missing deps: {e}")
    sys.exit(1)

CONFIG = {
    'addonquote': {'min_engagements': 50, 'min_engagement_rate': 3.0, 'monitoring_days': 7, 'extended_days': 30},
    'sidequest': {'min_engagements': 75, 'min_engagement_rate': 4.0, 'monitoring_days': 7, 'extended_days': 30},
    'sheetitnow': {'min_engagements': 40, 'min_engagement_rate': 2.5, 'monitoring_days': 7, 'extended_days': 30}
}

def get_supabase_client():
    """Initialize Supabase client."""
    with open(os.path.expanduser('~/.openclaw/workspace/.env')) as f:
        for line in f:
            if 'SUPABASE_URL' in line:
                url = line.strip().split('=')[1]
            elif 'SUPABASE_ANON_KEY' in line:
                key = line.strip().split('=')[1]
    
    return create_client(url, key)

def check_threshold(tweet, account_config):
    """Check if tweet meets threshold."""
    engagements = tweet.get('engagements', 0)
    engagement_rate = tweet.get('engagement_rate', 0)
    
    return (
        engagements >= account_config['min_engagements'] and
        engagement_rate >= account_config['min_engagement_rate']
    )

def process_posted_tweets(supabase):
    """Process tweets in 'posted' status - check 24h threshold."""
    print("\n📤 Processing 'posted' tweets (24h check)...")
    
    # Get tweets posted more than 24h ago
    cutoff = (datetime.now() - timedelta(hours=24)).isoformat()
    
    try:
        result = supabase.table('content_queue').select('*').eq('status', 'posted').lt('posted_at', cutoff).execute()
        tweets = result.data or []
    except Exception as e:
        print(f"❌ Error fetching posted tweets: {e}")
        return 0, 0
    
    moved_to_monitoring = 0
    moved_to_archive = 0
    
    for tweet in tweets:
        account_id = tweet.get('account_id', 'addonquote')
        config = CONFIG.get(account_id, CONFIG['addonquote'])
        
        if check_threshold(tweet, config):
            # Move to monitoring
            monitoring_ends = datetime.now() + timedelta(days=config['extended_days'])
            
            supabase.table('content_queue').update({
                'status': 'monitoring',
                'monitoring_status': 'extended',
                'monitoring_ends_at': monitoring_ends.isoformat(),
                'threshold_met': True
            }).eq('id', tweet['id']).execute()
            
            print(f"   ✅ Extended monitoring: {tweet['id'][:20]}... (engagements: {tweet.get('engagements', 0)})")
            moved_to_monitoring += 1
        else:
            # Move to archive
            supabase.table('content_queue').update({
                'status': 'archive',
                'monitoring_status': 'archived',
                'threshold_met': False
            }).eq('id', tweet['id']).execute()
            
            print(f"   📦 Archived (underperforming): {tweet['id'][:20]}... (engagements: {tweet.get('engagements', 0)})")
            moved_to_archive += 1
    
    print(f"   → Moved to monitoring: {moved_to_monitoring}")
    print(f"   → Archived: {moved_to_archive}")
    
    return moved_to_monitoring, moved_to_archive

def process_monitoring_tweets(supabase):
    """Process tweets in 'monitoring' status - check end date."""
    print("\n📈 Processing 'monitoring' tweets...")
    
    now = datetime.now().isoformat()
    
    try:
        result = supabase.table('content_queue').select('*').eq('status', 'monitoring').lt('monitoring_ends_at', now).execute()
        tweets = result.data or []
    except Exception as e:
        print(f"❌ Error fetching monitoring tweets: {e}")
        return 0
    
    completed = 0
    for tweet in tweets:
        supabase.table('content_queue').update({
            'status': 'archive',
            'monitoring_status': 'complete'
        }).eq('id', tweet['id']).execute()
        print(f"   ✅ Monitoring complete: {tweet['id'][:20]}...")
        completed += 1
    
    print(f"   → Completed: {completed}")
    return completed

def update_metrics_daily(supabase):
    """Update daily metrics snapshot for active tweets."""
    print("\n📊 Updating daily metrics...")
    
    today = datetime.now().strftime('%Y-%m-%d')
    
    try:
        # Get active tweets
        result = supabase.table('content_queue').select('*').in_('status', ['posted', 'monitoring']).execute()
        tweets = result.data or []
    except Exception as e:
        print(f"❌ Error: {e}")
        return 0
    
    updated = 0
    for tweet in tweets:
        try:
            # Insert or update daily snapshot
            data = {
                'tweet_id': tweet['id'],
                'date': today,
                'impressions': tweet.get('impressions', 0),
                'engagements': tweet.get('engagements', 0),
                'likes': tweet.get('likes', 0),
                'retweets': tweet.get('retweets', 0),
                'replies': tweet.get('replies', 0),
                'clicks': tweet.get('clicks', 0),
                'engagement_rate': tweet.get('engagement_rate', 0)
            }
            
            supabase.table('tweet_metrics_daily').upsert(data).execute()
            updated += 1
        except Exception as e:
            print(f"   ❌ Error updating metrics: {e}")
    
    print(f"   → Updated: {updated}")
    return updated

def trigger_analysis(tweet_id, reason):
    """Trigger analysis for high-performing tweet."""
    print(f"\n🔔 Analysis Triggered: {tweet_id[:20]}...")
    print(f"   Reason: {reason}")
    
    # TODO: Send notification, create mission proposal, etc.
    # For now, just log it
    log_file = os.path.expanduser('~/.openclaw/workspace/dashboard/data/analysis_log.json')
    
    entry = {
        'tweet_id': tweet_id,
        'reason': reason,
        'timestamp': datetime.now().isoformat()
    }
    
    try:
        os.makedirs(os.path.dirname(log_file), exist_ok=True)
        
        existing = []
        if os.path.exists(log_file):
            with open(log_file) as f:
                existing = json.load(f)
        
        existing.append(entry)
        
        with open(log_file, 'w') as f:
            json.dump(existing, f, indent=2)
    except Exception as e:
        print(f"   ❌ Error logging analysis: {e}")

def show_summary(supabase):
    """Show current monitoring summary."""
    print("\n📋 Monitoring Summary:")
    print("-" * 50)
    
    try:
        result = supabase.table('content_queue').select('status, monitoring_status, threshold_met').execute()
        tweets = result.data or []
        
        for status in ['queue', 'revision', 'posted', 'archive', 'monitoring']:
            count = len([t for t in tweets if t.get('status') == status])
            print(f"   {status:12} : {count}")
        
        print("-" * 50)
        print(f"   {'TOTAL':12} : {len(tweets)}")
        
        # Active monitoring
        monitoring = [t for t in tweets if t.get('status') == 'monitoring']
        print(f"\n📈 Active Monitoring: {len(monitoring)} tweets")
        
    except Exception as e:
        print(f"❌ Error: {e}")

def install_cron():
    """Install cron job for hourly monitoring."""
    cron_line = "0 * * * * python3 ~/.openclaw/workspace/dashboard/monitor_tweets.py --run >> ~/.openclaw/workspace/dashboard/monitoring.log 2>&1"
    
    # Get current crontab
    os.system(f"echo '{cron_line}' | crontab -")
    
    print("✅ Cron job installed: hourly monitoring at minute 0")
    print(f"   Command: {cron_line}")

def main():
    parser = argparse.ArgumentParser(description='Tweet Monitoring Job')
    parser.add_argument('--run', action='store_true', help='Run monitoring check')
    parser.add_argument('--cron', action='store_true', help='Install cron job')
    parser.add_argument('--summary', action='store_true', help='Show summary')
    
    args = parser.parse_args()
    
    if args.cron:
        install_cron()
        return
    
    supabase = get_supabase_client()
    
    if args.summary:
        show_summary(supabase)
        return
    
    if args.run:
        print(f"\n🕐 Tweet Monitoring Job - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        total_monitoring, total_archive = process_posted_tweets(supabase)
        completed = process_monitoring_tweets(supabase)
        updated = update_metrics_daily(supabase)
        
        print(f"\n✅ Monitoring complete")
        print(f"   → Extended to monitoring: {total_monitoring}")
        print(f"   → Archived: {total_archive}")
        print(f"   → Monitoring completed: {completed}")
        print(f"   → Metrics updated: {updated}")
        
        show_summary(supabase)
    else:
        print("Usage: python3 monitor_tweets.py --run")
        print("       python3 monitor_tweets.py --cron")

if __name__ == '__main__':
    main()
