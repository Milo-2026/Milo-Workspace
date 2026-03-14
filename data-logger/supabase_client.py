#!/usr/bin/env python3
"""
Supabase Client for Side Quest Studios Analytics
Handles all data operations for X Analytics, CRM, and Revenue tracking.
"""

import urllib.request
import json
import os
from datetime import datetime, date
from typing import Optional, Dict, List, Any

class SupabaseClient:
    def __init__(self):
        self.url, self.anon_key, self.service_key = self._load_credentials()
        self.headers_anon = {
            'apikey': self.anon_key,
            'Authorization': f'Bearer {self.anon_key}',
            'Content-Type': 'application/json'
        }
        self.headers_service = {
            'apikey': self.service_key,
            'Authorization': f'Bearer {self.service_key}',
            'Content-Type': 'application/json'
        }
    
    def _load_credentials(self):
        env_file = '/Users/alfredoalvarez/.openclaw/workspace/.env'
        url = anon_key = service_key = None
        with open(env_file) as f:
            for line in f:
                if 'SUPABASE_URL' in line: url = line.strip().split('=')[1]
                elif 'SUPABASE_ANON_KEY' in line: anon_key = line.strip().split('=')[1]
                elif 'SUPABASE_SERVICE_ROLE' in line: service_key = line.strip().split('=')[1]
        return url, anon_key, service_key
    
    def _request(self, endpoint: str, data: Dict = None, method: str = 'GET', use_service: bool = False) -> Dict:
        headers = self.headers_service if use_service else self.headers_anon
        url = f'{self.url}/rest/v1/{endpoint}'
        
        req = urllib.request.Request(url, headers=headers, method=method)
        if data:
            req.data = json.dumps(data).encode()
            req.add_header('Prefer', 'return=minimal')
        
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                return {'status': resp.status, 'data': json.loads(resp.read().decode()) if resp.read() else None}
        except urllib.error.HTTPError as e:
            error_body = e.read().decode()[:500] if hasattr(e, 'read') else str(e)
            return {'error': f'HTTP {e.code}: {error_body}'}
        except Exception as e:
            return {'error': str(e)}
    
    def _upsert(self, table: str, data: Dict) -> Dict:
        """Insert or update a record"""
        url = f'{self.url}/rest/v1/{table}'
        headers = self.headers_service.copy()
        headers['Prefer'] = 'resolution=merge-duplicates'
        
        req = urllib.request.Request(url, data=json.dumps(data).encode(), headers=headers, method='POST')
        try:
            with urllib.request.urlopen(req, timeout=20) as resp:
                return {'status': resp.status}
        except Exception as e:
            return {'error': str(e)}
    
    # ==================== X ANALYTICS ====================
    
    def get_x_accounts(self) -> List[Dict]:
        result = self._request('x_accounts?select=*')
        return result.get('data', [])
    
    def upsert_x_account(self, account_id: str, handle: str, name: str, followers: int = 0, following: int = 0, posts_count: int = 0) -> Dict:
        return self._upsert('x_accounts', {
            'account_id': account_id,
            'handle': handle,
            'name': name,
            'followers': followers,
            'following': following,
            'posts_count': posts_count,
            'updated_at': datetime.now().isoformat()
        })
    
    def log_followers_daily(self, account_id: str, follower_count: int, new_followers: int = 0, lost_followers: int = 0, 
                           source: str = 'manual', trigger_post_id: str = None, notes: str = None) -> Dict:
        return self._upsert('x_followers_daily', {
            'account_id': account_id,
            'date': date.today().isoformat(),
            'follower_count': follower_count,
            'following_count': 0,
            'new_followers': new_followers,
            'lost_followers': lost_followers,
            'source': source,
            'trigger_post_id': trigger_post_id,
            'notes': notes
        })
    
    def log_post(self, post_id: str, account_id: str, content: str, content_type: str = 'single',
                 topic_category: str = None, hook_type: str = None, sentiment: str = 'neutral',
                 impressions: int = 0, engagements: int = 0, likes: int = 0, retweets: int = 0,
                 replies: int = 0, quotes: int = 0, bookmarks: int = 0, clicks: int = 0, shares: int = 0,
                 new_followers_from_post: int = 0, performance_tier: str = None, posted_at: str = None) -> Dict:
        return self._upsert('x_posts', {
            'post_id': post_id,
            'account_id': account_id,
            'content': content[:280],
            'content_type': content_type,
            'topic_category': topic_category,
            'hook_type': hook_type,
            'sentiment': sentiment,
            'impressions': impressions,
            'engagements': engagements,
            'likes': likes,
            'retweets': retweets,
            'replies': replies,
            'quotes': quotes,
            'bookmarks': bookmarks,
            'clicks': clicks,
            'shares': shares,
            'new_followers_from_post': new_followers_from_post,
            'performance_tier': performance_tier,
            'posted_at': posted_at or datetime.now().isoformat()
        })
    
    def create_experiment(self, experiment_id: str, name: str, account_id: str, 
                         variant_a_text: str, variant_b_text: str, hypothesis: str = None,
                         description: str = None, start_date: str = None) -> Dict:
        return self._upsert('x_experiments', {
            'experiment_id': experiment_id,
            'name': name,
            'account_id': account_id,
            'variant_a_text': variant_a_text,
            'variant_b_text': variant_b_text,
            'hypothesis': hypothesis,
            'description': description,
            'status': 'active',
            'start_date': start_date or date.today().isoformat()
        })
    
    def update_experiment_results(self, experiment_id: str, winner: str, insight: str, 
                                  variant_a_metrics: Dict = None, variant_b_metrics: Dict = None,
                                  confidence_level: float = None, improvement_percentage: float = None) -> Dict:
        return self._upsert('x_experiments', {
            'experiment_id': experiment_id,
            'winner': winner,
            'insight': insight,
            'variant_a_metrics': variant_a_metrics,
            'variant_b_metrics': variant_b_metrics,
            'confidence_level': confidence_level,
            'improvement_percentage': improvement_percentage,
            'status': 'completed' if winner else 'active',
            'end_date': date.today().isoformat()
        })
    
    def log_viral_spike(self, account_id: str, spike_date: str, follower_growth: int,
                       engagement_spike: float, trigger_type: str, post_id: str = None,
                       virality_score: int = None, reach_estimate: int = None, top_sources: List[str] = None) -> Dict:
        return self._upsert('x_viral_spikes', {
            'account_id': account_id,
            'post_id': post_id,
            'spike_date': spike_date,
            'follower_growth': follower_growth,
            'engagement_spike': engagement_spike,
            'trigger_type': trigger_type,
            'virality_score': virality_score,
            'reach_estimate': reach_estimate,
            'top_sources': top_sources
        })
    
    # ==================== CRM ====================
    
    def add_contact(self, contact_id: str, name: str, email: str = None, phone: str = None,
                   website: str = None, company_name: str = None, company_size: str = None,
                   title: str = None, linkedin_url: str = None, location: str = None,
                   source: str = 'manual', estimated_value: int = 0, notes: str = None,
                   tags: List[str] = None) -> Dict:
        return self._upsert('crm_contacts', {
            'contact_id': contact_id,
            'name': name,
            'email': email,
            'phone': phone,
            'website': website,
            'company_name': company_name,
            'company_size': company_size,
            'title': title,
            'linkedin_url': linkedin_url,
            'location': location,
            'source': source,
            'estimated_value': estimated_value,
            'status': 'new',
            'stage': 1,
            'notes': notes,
            'tags': tags,
            'updated_at': datetime.now().isoformat()
        })
    
    def update_contact_status(self, contact_id: str, status: str, stage: int = None) -> Dict:
        return self._upsert('crm_contacts', {
            'contact_id': contact_id,
            'status': status,
            'stage': stage or self._get_stage_from_status(status),
            'last_contact_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        })
    
    def log_activity(self, contact_id: str, activity_type: str, note: str = None,
                    direction: str = 'outbound', email_subject: str = None, 
                    email_template: str = None, email_status: str = None,
                    call_duration: int = None, call_outcome: str = None,
                    meeting_type: str = None, meeting_notes: str = None) -> Dict:
        return self._upsert('crm_activities', {
            'contact_id': contact_id,
            'activity_type': activity_type,
            'note': note,
            'direction': direction,
            'email_subject': email_subject,
            'email_template': email_template,
            'email_status': email_status,
            'call_duration_minutes': call_duration,
            'call_outcome': call_outcome,
            'meeting_type': meeting_type,
            'meeting_notes': meeting_notes
        })
    
    def create_sequence(self, sequence_id: str, name: str, steps: List[Dict],
                       description: str = None) -> Dict:
        return self._upsert('crm_sequences', {
            'sequence_id': sequence_id,
            'name': name,
            'steps': steps,
            'description': description,
            'status': 'active'
        })
    
    def update_sequence_stats(self, sequence_id: str, total_sent: int, total_opened: int,
                             total_clicked: int, total_replied: int) -> Dict:
        return self._upsert('crm_sequences', {
            'sequence_id': sequence_id,
            'total_sent': total_sent,
            'total_opened': total_opened,
            'total_clicked': total_clicked,
            'total_replied': total_replied
        })
    
    def _get_stage_from_status(self, status: str) -> int:
        stages = {'new': 1, 'contacted': 2, 'replied': 3, 'qualified': 4, 'proposal': 5, 'closed': 6}
        return stages.get(status, 1)
    
    # ==================== REVENUE ====================
    
    def log_subscription(self, subscription_id: str, product: str, plan: str,
                        amount: float, customer_email: str, customer_name: str = None,
                        status: str = 'active', source: str = 'direct',
                        utm_source: str = None, utm_medium: str = None, utm_campaign: str = None) -> Dict:
        return self._upsert('revenue_subscriptions', {
            'subscription_id': subscription_id,
            'product': product,
            'plan': plan,
            'amount': amount,
            'customer_email': customer_email,
            'customer_name': customer_name,
            'status': status,
            'source': source,
            'utm_source': utm_source,
            'utm_medium': utm_medium,
            'utm_campaign': utm_campaign,
            'started_at': datetime.now().isoformat()
        })
    
    def log_mrr_daily(self, date_str: str, product: str, mrr: float, 
                     active_subscribers: int, new_subscribers: int = 0,
                     churned_subscribers: int = 0, lifetime_deals_count: int = 0,
                     lifetime_value: float = 0) -> Dict:
        return self._upsert('revenue_mrr_daily', {
            'date': date_str,
            'product': product,
            'mrr': mrr,
            'active_subscribers': active_subscribers,
            'new_subscribers': new_subscribers,
            'churned_subscribers': churned_subscribers,
            'lifetime_deals_count': lifetime_deals_count,
            'lifetime_value': lifetime_value
        })
    
    # ==================== CONTENT ====================
    
    def log_content(self, content_id: str, platform: str, content_type: str,
                   title: str = None, topic_category: str = None,
                   views: int = 0, impressions: int = 0, engagements: int = 0,
                   clicks: int = 0, shares: int = 0, conversions: int = 0,
                   published_at: str = None) -> Dict:
        return self._upsert('content_inventory', {
            'content_id': content_id,
            'platform': platform,
            'content_type': content_type,
            'title': title,
            'topic_category': topic_category,
            'views': views,
            'impressions': impressions,
            'engagements': engagements,
            'clicks': clicks,
            'shares': shares,
            'conversions': conversions,
            'published_at': published_at or datetime.now().isoformat()
        })
    
    # ==================== MARKETING ====================
    
    def log_campaign(self, campaign_id: str, name: str, type_: str,
                    platform: str = None, budget: float = None,
                    target_metric: str = None, target_value: int = None,
                    start_date: str = None, end_date: str = None) -> Dict:
        return self._upsert('marketing_campaigns', {
            'campaign_id': campaign_id,
            'name': name,
            'type': type_,
            'platform': platform,
            'budget': budget,
            'target_metric': target_metric,
            'target_value': target_value,
            'start_date': start_date,
            'end_date': end_date,
            'status': 'active'
        })
    
    def update_campaign_results(self, campaign_id: str, spent: float = None,
                               impressions: int = None, clicks: int = None,
                               conversions: int = None, cpa: float = None,
                               roi: float = None) -> Dict:
        return self._upsert('marketing_campaigns', {
            'campaign_id': campaign_id,
            'spent': spent,
            'impressions': impressions,
            'clicks': clicks,
            'conversions': conversions,
            'cost_per_acquisition': cpa,
            'roi': roi
        })

# Initialize client
db = SupabaseClient()
