#!/usr/bin/env python3
"""
Supabase Analytics Data Access Layer

Access and manage all analytics data from Supabase.

Usage:
    python3 supabase-data-access.py --account addonquote --action get
    python3 supabase-data-access.py --action insert_followers --account addonquote --count 128
    python3 supabase-data-access.py --action update_post --post_id "12345" --impressions 5000
"""

import urllib.request
import json
import os
from datetime import datetime, date

def load_config():
    """Load Supabase credentials from .env"""
    env_file = '/Users/alfredoalvarez/.openclaw/workspace/.env'
    with open(env_file) as f:
        for line in f:
            if 'SUPABASE_URL' in line: url = line.strip().split('=')[1]
            elif 'SUPABASE_ANON_KEY' in line: key = line.strip().split('=')[1]
    return url, key

def make_request(url, method='GET', data=None):
    """Make HTTP request to Supabase"""
    headers = {
        'apikey': key,
        'Authorization': f'Bearer {key}',
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
    }
    
    req = urllib.request.Request(url, headers=headers, method=method)
    if data:
        req.data = json.dumps(data).encode()
    
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return {'status': resp.status, 'data': json.loads(resp.read().decode()) if resp.read() else None}
    except urllib.error.HTTPError as e:
        return {'error': f'HTTP {e.code}: {e.reason}', 'details': e.read().decode()[:500]}
    except Exception as e:
        return {'error': str(e)}

# X Analytics Functions
def get_x_accounts():
    """Get all X accounts"""
    url = f'{url}/rest/v1/x_accounts?select=*'
    return make_request(url)

def insert_x_account(account_id, handle, name, followers=0, posts=0):
    """Insert or update X account"""
    data = {
        'account_id': account_id,
        'handle': handle,
        'name': name,
        'followers': followers,
        'posts_count': posts
    }
    url = f'{url}/rest/v1/x_accounts'
    return make_request(url, 'POST', data)

def log_followers_daily(account_id, count, new_followers=0, source='manual'):
    """Log daily follower count"""
    today = date.today().isoformat()
    data = {
        'account_id': account_id,
        'date': today,
        'follower_count': count,
        'new_followers': new_followers,
        'source': source
    }
    url = f'{url}/rest/v1/x_followers_daily'
    return make_request(url, 'POST', data)

def log_post(account_id, post_id, content, impressions=0, engagements=0, 
             likes=0, retweets=0, replies=0, clicks=0, posted_at=None):
    """Log a post with metrics"""
    data = {
        'post_id': post_id,
        'account_id': account_id,
        'content': content[:280],  # Truncate if too long
        'impressions': impressions,
        'engagements': engagements,
        'likes': likes,
        'retweets': retweets,
        'replies': replies,
        'clicks': clicks,
        'posted_at': posted_at or datetime.now().isoformat()
    }
    url = f'{url}/rest/v1/x_posts'
    return make_request(url, 'POST', data)

def create_experiment(experiment_id, name, account_id, variant_a, variant_b):
    """Create A/B experiment"""
    data = {
        'experiment_id': experiment_id,
        'name': name,
        'account_id': account_id,
        'variant_a_text': variant_a,
        'variant_b_text': variant_b,
        'status': 'active'
    }
    url = f'{url}/rest/v1/x_experiments'
    return make_request(url, 'POST', data)

# CRM Functions
def add_contact(contact_id, name, email=None, company=None, size=None, location=None, source='manual'):
    """Add CRM contact"""
    data = {
        'contact_id': contact_id,
        'name': name,
        'email': email,
        'company_name': company,
        'company_size': size,
        'location': location,
        'source': source,
        'status': 'new',
        'stage': 1
    }
    url = f'{url}/rest/v1/crm_contacts'
    return make_request(url, 'POST', data)

def log_activity(contact_id, activity_type, note=None, direction='outbound'):
    """Log CRM activity"""
    data = {
        'contact_id': contact_id,
        'activity_type': activity_type,
        'note': note,
        'direction': direction
    }
    url = f'{url}/rest/v1/crm_activities'
    return make_request(url, 'POST', data)

# Revenue Functions
def log_subscription(subscription_id, product, plan, amount, email, started_at=None):
    """Log subscription"""
    data = {
        'subscription_id': subscription_id,
        'product': product,
        'plan': plan,
        'amount': amount,
        'customer_email': email,
        'started_at': started_at or datetime.now().isoformat(),
        'status': 'active'
    }
    url = f'{url}/rest/v1/revenue_subscriptions'
    return make_request(url, 'POST', data)

def log_mrr_daily(date_str, product, mrr, subscribers):
    """Log daily MRR"""
    data = {
        'date': date_str,
        'product': product,
        'mrr': mrr,
        'active_subscribers': subscribers
    }
    url = f'{url}/rest/v1/revenue_mrr_daily'
    return make_request(url, 'POST', data)

# Sample usage functions
def demo_inserts():
    """Insert sample data"""
    # Add accounts
    insert_x_account('addonquote', '@addonquote', 'AddOnQuote', 127, 1250)
    insert_x_account('sidequest', '@SideQuestStd', 'Side Quest Studios', 234, 1180)
    insert_x_account('sheetitnow', '@sheetitnow', 'Sheet It Now', 89, 980)
    
    # Add sample followers log
    log_followers_daily('addonquote', 127, 1, 'manual')
    log_followers_daily('sidequest', 234, 1, 'manual')
    log_followers_daily('sheetitnow', 89, 0, 'manual')
    
    # Add sample post
    log_post('addonquote', 'post_demo', 'Test post content', 1000, 50, 20, 5, 3, 10)
    
    print('Sample data inserted!')

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description='Supabase Analytics Data Access')
    parser.add_argument('--action', choices=['get_accounts', 'insert_followers', 'log_post', 
                                             'create_experiment', 'add_contact', 'log_activity',
                                             'demo', 'demo_inserts'], default='demo')
    parser.add_argument('--account', help='Account ID')
    parser.add_argument('--count', type=int, help='Follower count')
    parser.add_argument('--post_id', help='Post ID')
    parser.add_argument('--impressions', type=int, help='Impressions')
    parser.add_argument('--engagements', type=int, help='Engagements')
    parser.add_argument('--name', help='Contact/Experiment name')
    parser.add_argument('--email', help='Email')
    parser.add_argument('--company', help='Company')
    
    args = parser.parse_args()
    
    if args.action == 'demo_inserts':
        demo_inserts()
    elif args.action == 'get_accounts':
        print(get_x_accounts())
    elif args.action == 'insert_followers' and args.account:
        print(log_followers_daily(args.account, args.count or 0))
    elif args.action == 'log_post' and args.account:
        print(log_post(args.account, args.post_id or 'demo', 'Content'))
