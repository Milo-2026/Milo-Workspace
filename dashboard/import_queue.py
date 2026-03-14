#!/usr/bin/env python3
"""
Import UNPOSTED content from fresh_content.json to the queue
"""

import json
import os

def import_queue():
    from supabase import create_client
    from dotenv import load_dotenv
    
    load_dotenv(os.path.expanduser('~/.openclaw/workspace/.env'))
    
    with open('/Users/alfredoalvarez/.openclaw/workspace/.env') as f:
        for line in f:
            if 'SUPABASE_URL' in line:
                url = line.strip().split('=')[1]
            elif 'SUPABASE_ANON_KEY' in line:
                anon_key = line.strip().split('=')[1]
    
    supabase = create_client(url, anon_key)
    
    # Load content pools
    with open('/Users/alfredoalvarez/.openclaw/social-automation/data/fresh_content.json') as f:
        pools = json.load(f)
    
    with open('/Users/alfredoalvarez/.openclaw/social-automation/data/posted_tracking.json') as f:
        tracking = json.load(f)
    
    imported = 0
    skipped = 0
    
    for account_id in ['addonquote', 'sidequest', 'sheetitnow']:
        posts = pools.get(account_id, [])
        posted_ids = set(tracking.get('singles', {}).get(account_id, {}).keys())
        
        for idx, post in enumerate(posts):
            post_id = str(idx)
            
            # Skip if already posted
            if post_id in posted_ids:
                continue
            
            # Check if already in queue
            try:
                existing = supabase.table('content_queue').select('id').eq('original_post_id', f"{account_id}_queue_{post_id}").execute()
                if existing.data:
                    skipped += 1
                    continue
            except:
                pass
            
            # Add to queue
            try:
                content = post if isinstance(post, str) else post.get('content', str(post))
                
                data = {
                    'content': content[:280],
                    'account_id': account_id,
                    'status': 'queue',
                    'needs_revision': False,
                    'monitoring_status': 'pending',
                    'original_post_id': f"{account_id}_queue_{post_id}"
                }
                
                supabase.table('content_queue').insert(data).execute()
                imported += 1
            except Exception as e:
                print(f"   ⚠️  Error: {e}")
    
    return imported, skipped

def show_status():
    from supabase import create_client
    from dotenv import load_dotenv
    
    load_dotenv(os.path.expanduser('~/.openclaw/workspace/.env'))
    
    with open('/Users/alfredoalvarez/.openclaw/workspace/.env') as f:
        for line in f:
            if 'SUPABASE_URL' in line:
                url = line.strip().split('=')[1]
            elif 'SUPABASE_ANON_KEY' in line:
                anon_key = line.strip().split('=')[1]
    
    supabase = create_client(url, anon_key)
    result = supabase.table('content_queue').select('account_id,status').execute()
    tweets = result.data
    
    by_status = {}
    for t in tweets:
        status = t.get('status', 'unknown')
        by_status[status] = by_status.get(status, 0) + 1
    
    print("\n📊 By Status:")
    for status in ['queue', 'revision', 'posted', 'archive', 'monitoring']:
        count = by_status.get(status, 0)
        print(f"   {status:12} : {count}")
    
    by_account = {}
    for t in tweets:
        acc = t.get('account_id')
        by_account[acc] = by_account.get(acc, 0) + 1
    
    print("\n📊 By Account:")
    for acc in ['addonquote', 'sidequest', 'sheetitnow']:
        count = by_account.get(acc, 0)
        print(f"   {acc:12} : {count}")
    
    print(f"\n   {'TOTAL':12} : {len(tweets)}")

if __name__ == '__main__':
    imported, skipped = import_queue()
    print(f"✅ Imported to queue: {imported}")
    print(f"⏭️  Skipped: {skipped}")
    show_status()