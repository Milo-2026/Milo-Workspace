#!/usr/bin/env python3
"""
Import ALL posts from the activity_log.txt into content_queue

This parses the full activity log to get every tweet ever posted.
"""

import re
import os
from datetime import datetime

def parse_activity_log():
    """Parse activity log and extract all posts."""
    log_file = os.path.expanduser('~/.openclaw/social-automation/data/activity_log.txt')
    
    posts = []
    
    with open(log_file) as f:
        for line in f:
            # Parse lines like: [2026-02-14T23:14:41.283704] addonquote: post - The content here...
            match = re.search(r'\[([^\]]+)\] (\w+): post - (.+)', line)
            if match:
                timestamp = match.group(1)
                account = match.group(2)
                content = match.group(3)
                
                posts.append({
                    'timestamp': timestamp,
                    'account': account,
                    'content': content,
                    'original_id': f"{account}_{timestamp}"
                })
    
    return posts

def import_to_supabase(posts):
    """Import all posts to Supabase."""
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
    
    imported = 0
    skipped = 0
    
    for post in posts:
        # Skip if not a valid account
        if post['account'] not in ['addonquote', 'sidequest', 'sheetitnow']:
            continue
        
        # Check if already exists
        try:
            existing = supabase.table('content_queue').select('id').eq('original_post_id', post['original_id']).execute()
            if existing.data:
                skipped += 1
                continue
        except Exception as e:
            print(f"   ⚠️  Error checking {post['original_id'][:30]}...: {e}")
            continue
        
        # Insert
        try:
            data = {
                'content': post['content'][:280],
                'account_id': post['account'],
                'status': 'archive',
                'posted_at': post['timestamp'],
                'monitoring_status': 'complete',
                'original_post_id': post['original_id']
            }
            
            supabase.table('content_queue').insert(data).execute()
            imported += 1
            
        except Exception as e:
            print(f"   ⚠️  Error inserting {post['original_id'][:30]}...: {e}")
    
    return imported, skipped

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
    parser = argparse.ArgumentParser(description='Import all posts from activity log')
    parser.add_argument('--status', action='store_true', help='Show current status')
    parser.add_argument('--import', action='store_true', dest='do_import', help='Import all posts')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be imported')
    
    args = parser.parse_args()
    
    posts = parse_activity_log()
    
    print(f"📥 Found {len(posts)} posts in activity log")
    
    # Group by account
    by_account = {}
    for p in posts:
        acc = p['account']
        if acc not in by_account:
            by_account[acc] = []
        by_account[acc].append(p)
    
    for acc, acc_posts in by_account.items():
        print(f"   {acc}: {len(acc_posts)} posts")
    
    if args.dry_run:
        print("\n📝 Sample posts:")
        for p in posts[:5]:
            print(f"   [{p['account']}] {p['content'][:60]}...")
        return
    
    if args.status:
        show_status()
        return
    
    if args.do_import:
        imported, skipped = import_to_supabase(posts)
        print(f"\n✅ Imported {imported} tweets")
        print(f"   ⏭️  Skipped (already exists): {skipped}")
        show_status()
    else:
        print("\nUsage:")
        print("   python3 import_activity_log.py --import   # Import all posts")
        print("   python3 import_activity_log.py --dry-run  # Preview posts")
        print("   python3 import_activity_log.py --status   # Show current status")

if __name__ == '__main__':
    main()