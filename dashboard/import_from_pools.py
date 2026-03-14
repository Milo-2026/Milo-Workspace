#!/usr/bin/env python3
"""
Import tweets from publishing agent's content pools into content_queue

This reads the actual tweet content from fresh_content.json and tracks
which posts have been posted using posted_tracking.json.
"""

import json
import os
import sys
from datetime import datetime

def load_content_pools():
    """Load all content pools."""
    pools = {}
    content_file = os.path.expanduser('~/.openclaw/social-automation/data/fresh_content.json')
    
    if os.path.exists(content_file):
        with open(content_file) as f:
            pools = json.load(f)
    
    return pools

def load_posted_tracking():
    """Load which posts have been posted."""
    tracking = {'singles': {}, 'threads': {}}
    tracking_file = os.path.expanduser('~/.openclaw/social-automation/data/posted_tracking.json')
    
    if os.path.exists(tracking_file):
        with open(tracking_file) as f:
            tracking = json.load(f)
    
    return tracking

def import_to_supabase():
    """Import all posted content to Supabase content_queue."""
    from supabase import create_client
    from dotenv import load_dotenv
    
    load_dotenv(os.path.expanduser('~/.openclaw/workspace/.env'))
    
    # Get Supabase credentials
    with open(os.path.expanduser('~/.openclaw/workspace/.env')) as f:
        for line in f:
            if 'SUPABASE_URL' in line:
                url = line.strip().split('=')[1]
            elif 'SUPABASE_ANON_KEY' in line:
                anon_key = line.strip().split('=')[1]
    
    supabase = create_client(url, anon_key)
    
    # Load content pools
    content_pools = load_content_pools()
    tracking = load_posted_tracking()
    
    print("📥 Content Pools:")
    for acc, posts in content_pools.items():
        print(f"   {acc}: {len(posts)} posts total")
    
    print("\n📤 Posted Tracking:")
    for acc, posted_ids in tracking.get('singles', {}).items():
        print(f"   {acc}: {len(posted_ids)} posts marked as posted")
    
    # Import posted content
    total_imported = 0
    
    for account_id, posts in content_pools.items():
        if account_id not in ['addonquote', 'sidequest', 'sheetitnow']:
            continue
            
        posted_ids = tracking.get('singles', {}).get(account_id, {})
        
        for idx, post in enumerate(posts):
            post_id = str(idx)
            
            # Only import if this post was actually posted
            if post_id not in posted_ids:
                continue
            
            # Check if already in Supabase
            try:
                existing = supabase.table('content_queue').select('id').eq('original_post_id', f"{account_id}_post_{post_id}").execute()
                if existing.data:
                    continue
            except Exception as e:
                print(f"   ⚠️  Error checking {account_id}: {e}")
                continue
            
            # Insert the tweet
            try:
                posted_at = posted_ids.get(post_id)
                
                # Content can be string or dict
                content = post if isinstance(post, str) else post.get('content', str(post))
                
                data = {
                    'content': content[:280],
                    'account_id': account_id,
                    'status': 'archive',  # Historical posts go to archive
                    'posted_at': posted_at,
                    'monitoring_status': 'complete',
                    'original_post_id': f"{account_id}_post_{post_id}"
                }
                
                supabase.table('content_queue').insert(data).execute()
                total_imported += 1
                
            except Exception as e:
                print(f"   ⚠️  Error inserting {account_id} post {post_id}: {e}")
    
    return total_imported

def show_status():
    """Show current content queue status."""
    from supabase import create_client
    from dotenv import load_dotenv
    
    load_dotenv(os.path.expanduser('~/.openclaw/workspace/.env'))
    
    with open(os.path.expanduser('~/.openclaw/workspace/.env')) as f:
        for line in f:
            if 'SUPABASE_URL' in line:
                url = line.strip().split('=')[1]
            elif 'SUPABASE_ANON_KEY' in line:
                anon_key = line.strip().split('=')[1]
    
    supabase = create_client(url, anon_key)
    
    try:
        result = supabase.table('content_queue').select('account_id, status').execute()
        tweets = result.data or []
    except Exception as e:
        print(f"Error: {e}")
        return
    
    print("\n📊 Content Queue Status:")
    print("-" * 50)
    
    for status in ['queue', 'revision', 'posted', 'archive', 'monitoring']:
        count = len([t for t in tweets if t.get('status') == status])
        print(f"   {status:12} : {count}")
    
    print("-" * 50)
    print(f"   {'TOTAL':12} : {len(tweets)}")
    
    print("\n📊 By Account:")
    for acc in ['addonquote', 'sidequest', 'sheetitnow']:
        count = len([t for t in tweets if t.get('account_id') == acc])
        print(f"   {acc:12} : {count}")

def main():
    import argparse
    parser = argparse.ArgumentParser(description='Import tweets from publishing agent')
    parser.add_argument('--status', action='store_true', help='Show current status')
    parser.add_argument('--import', action='store_true', dest='do_import', help='Import posted tweets')
    
    args = parser.parse_args()
    
    if args.status:
        show_status()
        return
    
    if args.do_import:
        imported = import_to_supabase()
        print(f"\n✅ Imported {imported} tweets")
        show_status()
    else:
        print("Usage:")
        print("   python3 import_from_pools.py --status   # Show status")
        print("   python3 import_from_pools.py --import   # Import posted tweets")

if __name__ == '__main__':
    main()
