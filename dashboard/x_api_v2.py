#!/usr/bin/env python3
"""
X API v2 Client - Syncs tweets with real metrics and tweet URLs

Tiers:
- Free/Basic: public_metrics (likes, reposts, replies) via Bearer token
- OAuth 1.0a: non_public_metrics (impressions, engagements) for owned posts < 30 days

Usage:
    python3 x_api_v2.py --sync         # Sync all accounts
    python3 x_api_v2.py --account addonquote  # Sync specific account
"""

import os
import json
import time
import hmac
import base64
import urllib.parse
import urllib.request
import random
from datetime import datetime, timedelta

class XAPIClient:
    def __init__(self, account='addonquote'):
        creds_file = f"/Users/alfredoalvarez/.config/multi-social/credentials/{account}.json"
        
        with open(creds_file) as f:
            self.creds = json.load(f)
        
        self.bearer_token = self.creds['bearer_token']
        self.api_key = self.creds['api_key']
        self.api_secret = self.creds['api_secret']
        self.access_token = self.creds['access_token']
        self.access_token_secret = self.creds['access_token_secret']
    
    def oauth1_header(self, method, url):
        """Generate OAuth 1.0a Authorization header."""
        oauth = {
            'oauth_consumer_key': self.api_key,
            'oauth_token': self.access_token,
            'oauth_signature_method': 'HMAC-SHA1',
            'oauth_timestamp': str(int(time.time())),
            'oauth_nonce': str(random.randint(0, 999999999)),
            'oauth_version': '1.0'
        }
        
        param_string = '&'.join(f"{urllib.parse.quote(str(k), safe='')}={urllib.parse.quote(str(v), safe='')}" 
                              for k, v in sorted(oauth.items()))
        signature_base = '&'.join([method.upper(), urllib.parse.quote(url, safe=''), urllib.parse.quote(param_string)])
        
        signing_key = f"{urllib.parse.quote(self.api_secret)}&{urllib.parse.quote(self.access_token_secret)}"
        signature = base64.b64encode(hmac.new(signing_key.encode(), signature_base.encode(), 'sha1').digest()).decode()
        
        oauth['oauth_signature'] = signature
        
        auth = 'OAuth ' + ', '.join(f'{k}="{urllib.parse.quote(str(v))}"' for k, v in sorted(oauth.items()))
        return {'Authorization': auth}
    
    def bearer_header(self):
        return {'Authorization': f'Bearer {self.bearer_token}'}
    
    def get_user_id(self, username):
        """Get user ID from username."""
        url = f"https://api.twitter.com/2/users/by?usernames={username}"
        
        req = urllib.request.Request(url, headers=self.bearer_header())
        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = json.loads(resp.read().decode())
                if 'data' in data and len(data['data']) > 0:
                    return data['data'][0]['id']
        except Exception as e:
            print(f"Error getting user ID: {e}")
        return None
    
    def get_user_tweets(self, user_id, max_results=100):
        """Get tweets with public metrics (Bearer token)."""
        url = f"https://api.twitter.com/2/users/{user_id}/tweets?tweet.fields=public_metrics,created_at&max_results={max_results}"
        
        req = urllib.request.Request(url, headers=self.bearer_header())
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                return json.loads(resp.read().decode())
        except Exception as e:
            print(f"Error getting tweets: {e}")
            return {'data': []}


def get_handle(account):
    """Get the X handle for an account."""
    handles = {
        'addonquote': 'addonquote',
        'sidequest': 'SideQuestStd',
        'sheetitnow': 'SheetItNow'
    }
    return handles.get(account, account)


def sync_all_accounts():
    """Sync metrics for all accounts to Supabase."""
    from supabase import create_client
    
    with open('/Users/alfredoalvarez/.openclaw/workspace/.env') as f:
        for line in f:
            if 'SUPABASE_URL' in line:
                url = line.strip().split('=')[1]
            elif 'SUPABASE_ANON_KEY' in line:
                anon_key = line.strip().split('=')[1]
    
    supabase = create_client(url, anon_key)
    
    accounts = ['addonquote', 'sidequest', 'sheetitnow']
    
    for account in accounts:
        print(f"\n🔄 Syncing {account}...")
        client = XAPIClient(account)
        
        handle = get_handle(account)
        user_id = client.get_user_id(handle)
        
        if not user_id:
            print(f"   ⚠️  Could not find user ID for {account}")
            continue
        
        tweets = client.get_user_tweets(user_id, max_results=100)
        
        updated = 0
        for tweet in tweets.get('data', []):
            tweet_id = tweet.get('id')
            handle = get_handle(account)
            tweet_url = f"https://twitter.com/{handle}/status/{tweet_id}"
            metrics = tweet.get('public_metrics', {})
            
            try:
                data = {
                    'likes': metrics.get('like_count', 0),
                    'retweets': metrics.get('retweet_count', 0),
                    'replies': metrics.get('reply_count', 0),
                    'engagements': (metrics.get('like_count', 0) + 
                                   metrics.get('retweet_count', 0) + 
                                   metrics.get('reply_count', 0)),
                    'tweet_url': tweet_url,  # Store the actual URL
                    'tweet_id': tweet_id  # Store the actual tweet ID
                }
                
                supabase.table('x_posts').upsert({
                    'post_id': f"{account}_{tweet_id}",
                    'account_id': account,
                    'content': tweet.get('text', '')[:280],
                    'likes': data['likes'],
                    'retweets': data['retweets'],
                    'replies': data['replies'],
                    'engagements': data['engagements'],
                    'posted_at': tweet.get('created_at'),
                    'tweet_url': data['tweet_url'],
                    'tweet_id': data['tweet_id']
                }).execute()
                
                updated += 1
            except Exception as e:
                print(f"   ⚠️  Error: {e}")
        
        print(f"   ✅ Updated {updated} tweets for @{handle}")


def sync_account(account):
    """Sync metrics for a single account."""
    from supabase import create_client
    
    with open('/Users/alfredoalvarez/.openclaw/workspace/.env') as f:
        for line in f:
            if 'SUPABASE_URL' in line:
                url = line.strip().split('=')[1]
            elif 'SUPABASE_ANON_KEY' in line:
                anon_key = line.strip().split('=')[1]
    
    supabase = create_client(url, anon_key)
    
    print(f"\n🔄 Syncing {account}...")
    client = XAPIClient(account)
    
    handle = get_handle(account)
    user_id = client.get_user_id(handle)
    
    if not user_id:
        print(f"   ⚠️  Could not find user ID for {account}")
        return
    
    tweets = client.get_user_tweets(user_id, max_results=100)
    
    updated = 0
    for tweet in tweets.get('data', []):
        tweet_id = tweet.get('id')
        tweet_url = f"https://twitter.com/{handle}/status/{tweet_id}"
        metrics = tweet.get('public_metrics', {})
        
        try:
            data = {
                'likes': metrics.get('like_count', 0),
                'retweets': metrics.get('retweet_count', 0),
                'replies': metrics.get('reply_count', 0),
                'engagements': (metrics.get('like_count', 0) + 
                               metrics.get('retweet_count', 0) + 
                               metrics.get('reply_count', 0)),
                'tweet_url': tweet_url,
                'tweet_id': tweet_id
            }
            
            supabase.table('x_posts').upsert({
                'post_id': f"{account}_{tweet_id}",
                'account_id': account,
                'content': tweet.get('text', '')[:280],
                'likes': data['likes'],
                'retweets': data['retweets'],
                'replies': data['replies'],
                'engagements': data['engagements'],
                'posted_at': tweet.get('created_at'),
                'tweet_url': data['tweet_url'],
                'tweet_id': data['tweet_id']
            }).execute()
            
            updated += 1
        except Exception as e:
            print(f"   ⚠️  Error: {e}")
    
    print(f"   ✅ Updated {updated} tweets for @{handle}")
    return updated


def show_top_posts():
    """Show top performing posts with links."""
    from supabase import create_client
    
    with open('/Users/alfredoalvarez/.openclaw/workspace/.env') as f:
        for line in f:
            if 'SUPABASE_URL' in line:
                url = line.strip().split('=')[1]
            elif 'SUPABASE_ANON_KEY' in line:
                anon_key = line.strip().split('=')[1]
    
    supabase = create_client(url, anon_key)
    
    result = supabase.table('x_posts').select('tweet_url,account_id,content,likes,retweets,replies,engagements').order('engagements', desc=True).limit(10).execute()
    
    print("\n🏆 Top Performing Posts:")
    print("-" * 80)
    
    for i, post in enumerate(result.data, 1):
        content = post.get('content', '')[:50]
        print(f"{i}. {post.get('account_id')}: {content}...")
        print(f"   ❤️ {post.get('likes')} | 🔁 {post.get('retweets')} | 💬 {post.get('replies')}")
        if post.get('tweet_url'):
            print(f"   🔗 {post.get('tweet_url')}")
        print()


if __name__ == '__main__':
    import sys
    
    if len(sys.argv) > 1:
        if sys.argv[1] == '--sync':
            sync_all_accounts()
            show_top_posts()
        elif sys.argv[1] == '--account' and len(sys.argv) > 2:
            sync_account(sys.argv[2])
        elif sys.argv[1] == '--top':
            show_top_posts()
    else:
        print("Usage:")
        print("  python3 x_api_v2.py --sync       # Sync all accounts")
        print("  python3 x_api_v2.py --account addonquote  # Sync specific account")
        print("  python3 x_api_v2.py --top        # Show top posts")
