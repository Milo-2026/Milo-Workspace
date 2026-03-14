#!/usr/bin/env python3
"""
Dashboard API - Serves data from Supabase for the dashboard

Run with: python3 dashboard_api.py
Access at: http://localhost:3334
"""

import http.server
import socketserver
import json
import os
from datetime import datetime

PORT = 3334

# Load Supabase credentials
env_file = '/Users/alfredoalvarez/.openclaw/workspace/.env'
supabase_url = anon_key = None
with open(env_file) as f:
    for line in f:
        if 'SUPABASE_URL' in line: supabase_url = line.strip().split('=')[1]
        elif 'SUPABASE_ANON_KEY' in line: anon_key = line.strip().split('=')[1]

import urllib.request

def query_supabase(table, select='*', filters=None):
    """Query Supabase table."""
    url = f'{supabase_url}/rest/v1/{table}?select={select}'
    if filters:
        url += '&' + '&'.join(filters)
    
    headers = {'apikey': anon_key, 'Authorization': f'Bearer {anon_key}'}
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            return json.loads(resp.read().decode())
    except Exception as e:
        return {'error': str(e)}

class DashboardAPI(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # CORS headers
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        path = self.path.split('?')[0]
        
        # API endpoints
        if path == '/api/x-analytics/followers':
            # Get accounts and follower history
            accounts = query_supabase('x_accounts')
            followers = query_supabase('x_followers_daily', 'account_id,date,follower_count,new_followers')
            
            # Format accounts
            accounts_dict = {}
            for acc in accounts:
                accounts_dict[acc.get('account_id')] = {
                    'followers': acc.get('followers', 0),
                    'following': acc.get('following', 0),
                    'posts': acc.get('posts_count', 0)
                }
            
            # Format history
            history_by_date = {}
            for f in followers:
                date = f.get('date')
                if date not in history_by_date:
                    history_by_date[date] = {}
                history_by_date[date][f.get('account_id')] = f.get('follower_count')
            
            history = [{'date': k, **v} for k, v in history_by_date.items()]
            history.sort(key=lambda x: x['date'])
            
            self.wfile.write(json.dumps({'accounts': accounts_dict, 'followerHistory': history}).encode())
            
        elif path == '/api/x-analytics/posts':
            posts = query_supabase('x_posts')
            self.wfile.write(json.dumps({'posts': posts}).encode())
            
        elif path == '/api/x-analytics/experiments':
            experiments = query_supabase('x_experiments')
            self.wfile.write(json.dumps({'experiments': experiments}).encode())
            
        elif path == '/api/crm/contacts':
            contacts = query_supabase('crm_contacts')
            activities = query_supabase('crm_activities')
            self.wfile.write(json.dumps({'contacts': contacts, 'activities': activities}).encode())
            
        elif path == '/api/revenue/summary':
            subs = query_supabase('revenue_subscriptions')
            mrr = query_supabase('revenue_mrr_daily', 'date,product,mrr,active_subscribers')
            
            total_mrr = sum(s.get('amount', 0) for s in subs if s.get('status') == 'active')
            total_subs = len([s for s in subs if s.get('status') == 'active'])
            
            self.wfile.write(json.dumps({
                'mrr': total_mrr,
                'subscribers': total_subs,
                'mrr_history': mrr,
                'subscriptions': subs
            }).encode())
            
        elif path == '/api/status':
            # Quick status check
            try:
                accounts = query_supabase('x_accounts')
                self.wfile.write(json.dumps({
                    'status': 'connected',
                    'tables': {
                        'x_accounts': len(accounts),
                        'x_posts': len(query_supabase('x_posts')),
                        'experiments': len(query_supabase('x_experiments')),
                        'crm_contacts': len(query_supabase('crm_contacts'))
                    },
                    'timestamp': datetime.now().isoformat()
                }).encode())
            except Exception as e:
                self.wfile.write(json.dumps({'status': 'error', 'error': str(e)}).encode())
        
        else:
            self.wfile.write(json.dumps({'error': 'Not found'}).encode())
    
    def log_message(self, format, *args):
        pass  # Suppress logging

if __name__ == '__main__':
    with socketserver.TCPServer(('0.0.0.0', PORT), DashboardAPI) as httpd:
        print(f'🚀 Dashboard API running at http://localhost:{PORT}')
        httpd.serve_forever()
