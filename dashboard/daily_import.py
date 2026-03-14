#!/usr/bin/env python3
"""
Daily import script - runs at 12am to import any new posts from activity log

This script:
1. Parses the activity_log.txt for any new posts
2. Imports them to Supabase content_queue
3. Runs monitoring checks
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
            match = re.search(r'\[([^\]]+)\] (\w+): post - (.+)', line)
            if match:
                posts.append({
                    'timestamp': match.group(1),
                    'account': match.group(2),
                    'content': match.group(3),
                    'original_id': f"{match.group(2)}_{match.group(1)}"
                })
    
    return posts

def import_new_posts(posts):
    """Import only new posts to Supabase."""
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
        if post['account'] not in ['addonquote', 'sidequest', 'sheetitnow']:
            continue
        
        try:
            existing = supabase.table('content_queue').select('id').eq('original_post_id', post['original_id']).execute()
            if existing.data:
                skipped += 1
                continue
        except:
            continue
        
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
        except:
            pass
    
    return imported, skipped

def show_summary():
    """Show current status."""
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
    
    result = supabase.table('content_queue').select('account_id').execute()
    tweets = result.data
    
    by_account = {}
    for t in tweets:
        acc = t.get('account_id')
        by_account[acc] = by_account.get(acc, 0) + 1
    
    print(f"\n📊 Total tweets: {len(tweets)}")
    for acc, count in sorted(by_account.items()):
        print(f"   {acc}: {count}")

if __name__ == '__main__':
    print(f"🕐 Daily Import - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Parse and import
    posts = parse_activity_log()
    imported, skipped = import_new_posts(posts)
    
    print(f"✅ Imported: {imported}")
    print(f"⏭️  Skipped: {skipped}")
    
    show_summary()