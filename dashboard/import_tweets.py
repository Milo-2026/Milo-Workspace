#!/usr/bin/env python3
"""
Import tweets from existing sources into content_queue

Sources:
1. Supabase x_posts table
2. Publishing Agent posted_tracking.json
"""

import json
import os
import sys
from datetime import datetime, timedelta

# Add workspace to path
sys.path.insert(0, os.path.expanduser('~/.openclaw/workspace'))

try:
    from supabase import create_client, Client
    from dotenv import load_dotenv
    load_dotenv(os.path.expanduser('~/.openclaw/workspace/.env'))
except ImportError as e:
    print(f"❌ Missing deps: {e}")
    print("   Install: pip install supabase python-dotenv")
    sys.exit(1)

def get_supabase_client():
    """Initialize Supabase client."""
    url = os.environ.get('SUPABASE_URL')
    key = os.environ.get('SUPABASE_ANON_KEY')
    
    if not url or not key:
        # Try to extract from env file
        with open(os.path.expanduser('~/.openclaw/workspace/.env')) as f:
            for line in f:
                if 'SUPABASE_URL' in line:
                    url = line.strip().split('=')[1]
                elif 'SUPABASE_ANON_KEY' in line:
                    key = line.strip().split('=')[1]
    
    if not url or not key:
        print("❌ Supabase credentials not found")
        sys.exit(1)
    
    return create_client(url, key)

def import_from_x_posts(supabase: Client, days_back=30):
    """Import tweets from x_posts table."""
    print(f"📥 Fetching x_posts from last {days_back} days...")
    
    cutoff = (datetime.now() - timedelta(days=days_back)).isoformat()
    
    try:
        result = supabase.table('x_posts').select('*').gte('posted_at', cutoff).order('posted_at', desc=True).execute()
        posts = result.data or []
    except Exception as e:
        print(f"❌ Error fetching x_posts: {e}")
        posts = []
    
    print(f"   Found {len(posts)} posts in x_posts")
    
    imported = 0
    for post in posts:
        try:
            # Check if already exists
            existing = supabase.table('content_queue').select('id').eq('original_post_id', post.get('post_id')).execute()
            
            if existing.data:
                print(f"   ⏭️  Already exists: {post.get('post_id')[:20]}...")
                continue
            
            # Insert into content_queue
            data = {
                'content': post.get('content', '')[:280],
                'account_id': post.get('account_id'),
                'status': 'archive',  # Historical posts go to archive
                'posted_at': post.get('posted_at'),
                'impressions': post.get('impressions') or 0,
                'engagements': post.get('engagements') or 0,
                'likes': post.get('likes') or 0,
                'retweets': post.get('retweets') or 0,
                'replies': post.get('replies') or 0,
                'clicks': post.get('clicks') or 0,
                'engagement_rate': post.get('engagements', 0) / max(post.get('impressions', 1), 1) * 100,
                'performance_tier': post.get('performance_tier'),
                'monitoring_status': 'complete',
                'original_post_id': post.get('post_id')
            }
            
            supabase.table('content_queue').insert(data).execute()
            imported += 1
            
        except Exception as e:
            print(f"   ❌ Error inserting post: {e}")
    
    print(f"   ✅ Imported {imported} posts from x_posts")
    return imported

def import_from_tracking_file(supabase: Client, tracking_file=None):
    """Import from publishing agent's posted_tracking.json."""
    if not tracking_file:
        tracking_file = os.path.expanduser('~/.openclaw/workspace/dashboard/data/tasks.json')
    
    if not os.path.exists(tracking_file):
        print(f"   ⏭️  Tracking file not found: {tracking_file}")
        return 0
    
    print(f"📥 Fetching from tracking file: {tracking_file}")
    
    try:
        with open(tracking_file) as f:
            data = json.load(f)
    except Exception as e:
        print(f"   ❌ Error reading tracking file: {e}")
        return 0
    
    posts = data if isinstance(data, list) else data.get('posts', [])
    print(f"   Found {len(posts)} posts in tracking file")
    
    imported = 0
    for post in posts:
        try:
            post_id = post.get('id') or post.get('post_id')
            if not post_id:
                continue
            
            # Check if exists
            existing = supabase.table('content_queue').select('id').eq('original_post_id', post_id).execute()
            if existing.data:
                continue
            
            # Determine account from file path or data
            account_id = post.get('account_id') or detect_account(post)
            if not account_id:
                continue
            
            data = {
                'content': post.get('content', post.get('text', ''))[:280],
                'account_id': account_id,
                'status': 'archive',
                'posted_at': post.get('posted_at') or post.get('timestamp'),
                'monitoring_status': 'complete',
                'original_post_id': post_id
            }
            
            supabase.table('content_queue').insert(data).execute()
            imported += 1
            
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    print(f"   ✅ Imported {imported} posts from tracking file")
    return imported

def detect_account(post):
    """Detect account from post data."""
    content = str(post.get('content', '')).lower()
    file_path = str(post.get('file_path', '')).lower()
    
    if 'addonquote' in content or 'addonquote' in file_path:
        return 'addonquote'
    if 'sidequest' in content or 'sidequest' in file_path:
        return 'sidequest'
    if 'sheetitnow' in content or 'sheetitnow' in file_path:
        return 'sheetitnow'
    
    return None

def show_status(supabase: Client):
    """Show current content_queue status."""
    print("\n📊 Content Queue Status:")
    print("-" * 40)
    
    try:
        result = supabase.table('content_queue').select('status, account_id, needs_revision').execute()
        tweets = result.data or []
        
        # By status
        by_status = {}
        for tweet in tweets:
            status = tweet.get('status', 'unknown')
            by_status[status] = by_status.get(status, 0) + 1
        
        for status in ['queue', 'revision', 'posted', 'archive', 'monitoring']:
            count = by_status.get(status, 0)
            print(f"   {status:12} : {count}")
        
        print("-" * 40)
        print(f"   {'TOTAL':12} : {len(tweets)}")
        
        # By account
        print("\n📊 By Account:")
        for acc in ['addonquote', 'sidequest', 'sheetitnow']:
            count = len([t for t in tweets if t.get('account_id') == acc])
            print(f"   {acc:12} : {count}")
        
    except Exception as e:
        print(f"❌ Error: {e}")

def main():
    import argparse
    parser = argparse.ArgumentParser(description='Import tweets to content queue')
    parser.add_argument('--status', action='store_true', help='Show current status')
    parser.add_argument('--days', type=int, default=30, help='Days of history to import (default: 30)')
    parser.add_argument('--tracking-file', type=str, help='Path to tracking file')
    parser.add_argument('--all', action='store_true', help='Import from all sources')
    
    args = parser.parse_args()
    
    supabase = get_supabase_client()
    
    if args.status:
        show_status(supabase)
        return
    
    total_imported = 0
    
    if args.all or args.status is False:
        # Import from x_posts
        total_imported += import_from_x_posts(supabase, args.days)
        
        # Import from tracking file
        total_imported += import_from_tracking_file(supabase, args.tracking_file)
    
    print(f"\n✅ Total imported: {total_imported}")
    show_status(supabase)

if __name__ == '__main__':
    main()
