#!/usr/bin/env python3
"""
Generate trending topic content for Side Quest Studios products
"""

import json
from supabase import create_client
from datetime import datetime

# Trending topics content
CONTENT = {
    # INDIE HACKER / MAKER MOVEMENT (Side Quest)
    'sidequest': [
        "Solo founders hit 36% of new startups in 2025. The era of the indie hacker is back.",
        "I built this alone. I ship alone. The solo founder advantage: zero stakeholders, zero meetings, pure execution.",
        "36% of 2025 startups have 1 founder. The other 64% are coordinating meetings.",
        "The indie hacker path: Build alone, grow slowly, keep control.",
        "No standups. No sprints. Just code that works.",
    ],
    
    # PRIVACY-FIRST (Sheet It Now)
    'sheetitnow': [
        "Your data stays on your device. That's it. No cloud. No tracking. No exceptions.",
        "Privacy software market projected at $2.29B in 2026. Privacy is no longer optional—it's a selling point.",
        "18 US states now have privacy laws. Local-first software is the future.",
        "Why pay $10/month for software you use once? One-time privacy-first conversion.",
        "The fastest conversion? 3 seconds. The safest? Zero data leaves your device.",
    ],
    
    # CONTRACTORS (AddOnQuote)
    'addonquote': [
        "You're losing $800/job on undocumented extras. The roofer who documents wins.",
        "The roof is done. The paperwork is not. That is not a product—it's a problem waiting to happen.",
        "Roofers who document everything do not stress about payment.",
        "Every undocumented extra is a donation to your customer.",
        "Track your roofing profit. Recover lost revenue. Get paid for every change order.",
    ],
    
    # ANTI-CORPORATE CULTURE (Side Quest)
    'sidequest_culture': [
        "We don't do standups. We don't do sprints. We ship.",
        "The best code I ever wrote is the code I deleted.",
        "No stakeholders, no meetings, just code that works.",
        "Features are liabilities. Launch with less.",
        "Ship on Fridays. Learn on Mondays.",
    ]
}

def add_to_supabase():
    # Load Supabase
    with open('/Users/alfredoalvarez/.openclaw/workspace/.env') as f:
        for line in f:
            if 'SUPABASE_URL' in line:
                url = line.strip().split('=')[1]
            elif 'SUPABASE_ANON_KEY' in line:
                anon_key = line.strip().split('=')[1]
    
    supabase = create_client(url, anon_key)
    
    total_added = 0
    
    # Add content for each account
    account_topics = [
        ('addonquote', CONTENT['addonquote']),
        ('sheetitnow', CONTENT['sheetitnow']),
        ('sidequest', CONTENT['sidequest'] + CONTENT['sidequest_culture']),
    ]
    
    for account_id, tweets in account_topics:
        for content in tweets:
            try:
                data = {
                    'content': content[:280],
                    'account_id': account_id,
                    'status': 'queue',
                    'needs_revision': False,
                    'monitoring_status': 'pending',
                    'original_post_id': f"{account_id}_trend_{content[:20].replace(' ', '_')}"
                }
                
                supabase.table('content_queue').insert(data).execute()
                total_added += 1
                
            except Exception as e:
                print(f"   ⚠️  Error: {e}")
    
    return total_added

def create_experiments():
    """Create A/B experiments for testing hooks."""
    with open('/Users/alfredoalvarez/.openclaw/workspace/.env') as f:
        for line in f:
            if 'SUPABASE_URL' in line:
                url = line.strip().split('=')[1]
            elif 'SUPABASE_ANON_KEY' in line:
                anon_key = line.strip().split('=')[1]
    
    supabase = create_client(url, anon_key)
    
    experiments = [
        {
            'name': 'Solo Founder Hook Test',
            'account_id': 'sidequest',
            'status': 'active',
            'variant_a_text': 'Solo founders hit 36% of new startups in 2025.',
            'variant_b_text': 'I built this alone and it works great.',
            'experiment_type': 'hook'
        },
        {
            'name': 'Privacy Hook Test',
            'account_id': 'sheetitnow',
            'status': 'active',
            'variant_a_text': 'Your data stays on your device. No cloud, no tracking.',
            'variant_b_text': 'Convert PDFs locally. Your data never leaves.',
            'experiment_type': 'hook'
        },
        {
            'name': 'Contractor Pain Test',
            'account_id': 'addonquote',
            'status': 'active',
            'variant_a_text': "You're losing $800/job on undocumented extras.",
            'variant_b_text': 'Track every change order. Keep every dollar.',
            'experiment_type': 'hook'
        },
        {
            'name': 'Question vs Statement Test',
            'account_id': 'sidequest',
            'status': 'active',
            'variant_a_text': 'Why do indie hackers insist on standups?',
            'variant_b_text': 'Standups are a waste of time.',
            'experiment_type': 'format'
        },
    ]
    
    created = 0
    for exp in experiments:
        try:
            supabase.table('x_experiments').insert(exp).execute()
            created += 1
            print(f"   ✅ Created: {exp['name']}")
        except Exception as e:
            print(f"   ⚠️  Error: {e}")
    
    return created

if __name__ == '__main__':
    print("📝 Generating trending topic content...")
    
    added = add_to_supabase()
    print(f"\n✅ Added {added} tweets to content queue")
    
    print("\n🧪 Creating A/B experiments...")
    experiments = create_experiments()
    print(f"✅ Created {experiments} experiments")
    
    print("\n🎯 Done! Content ready in Mission Control")