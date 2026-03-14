#!/usr/bin/env python3
"""
Data Logger for Side Quest Studios
Fetches and logs data from various sources to Supabase.

Usage:
    python3 log_data.py --all           # Log all available data
    python3 log_data.py --followers    # Log follower counts
    python3 log_data.py --posts       # Log post metrics
    python3 log_data.py --crm          # Log CRM activities
    python3 log_data.py --revenue      # Log revenue
    python3 log_data.py --status       # Show current data status
"""

import sys
import os
from datetime import datetime, date
import json

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from supabase_client import SupabaseClient

db = SupabaseClient()

ACCOUNT_CONFIG = {
    'addonquote': {'handle': '@addonquote', 'name': 'AddOnQuote'},
    'sidequest': {'handle': '@SideQuestStd', 'name': 'Side Quest Studios'},
    'sheetitnow': {'handle': '@sheetitnow', 'name': 'Sheet It Now'}
}

def show_status():
    """Show current data status in Supabase."""
    print("\n📊 DATA STATUS IN SUPABASE")
    print("="*60)
    
    # X Analytics
    accounts = db.get_x_accounts()
    print(f"\n🐦 X ACCOUNTS ({len(accounts)}):")
    for acc in accounts:
        print(f"   {acc.get('handle', '?')}: {acc.get('followers', 0)} followers")
    
    # Get counts
    followers_count = len(db._request('x_followers_daily').get('data', []))
    posts_count = len(db._request('x_posts').get('data', []))
    experiments_count = len(db._request('x_experiments').get('data', []))
    
    print(f"\n📈 FOLLOWER HISTORY: {followers_count} records")
    print(f"📝 POSTS: {posts_count} records")
    print(f"🧪 EXPERIMENTS: {experiments_count} records")
    
    # CRM
    contacts_count = len(db._request('crm_contacts').get('data', []))
    activities_count = len(db._request('crm_activities').get('data', []))
    
    print(f"\n🏠 CRM: {contacts_count} contacts, {activities_count} activities")
    
    # Revenue
    subs_count = len(db._request('revenue_subscriptions').get('data', []))
    mrr_count = len(db._request('revenue_mrr_daily').get('data', []))
    
    print(f"\n💰 REVENUE: {subs_count} subscriptions, {mrr_count} MRR records")
    
    print("\n" + "="*60)

def log_followers_manual():
    """Log follower counts manually."""
    print("\n📈 LOG FOLLOWER COUNTS")
    print("="*60)
    
    for acc_id, config in ACCOUNT_CONFIG.items():
        print(f"\n{config['icon']} {config['name']} ({config['handle']})")
        
        followers = input(f"   Followers: ").strip()
        following = input(f"   Following: ").strip()
        posts = input(f"   Total Posts: ").strip()
        
        if followers:
            try:
                # Get previous count
                prev = db._request(f'x_accounts?account_id=eq.{acc_id}&select=followers').get('data', [])
                prev_count = prev[0].get('followers', 0) if prev else 0
                new_count = int(followers)
                net = new_count - prev_count
                
                db.upsert_x_account(
                    acc_id, config['handle'], config['name'],
                    int(followers), int(following or 0), int(posts or 0)
                )
                db.log_followers_daily(acc_id, int(followers), net if net > 0 else 0, abs(net) if net < 0 else 0, 'manual')
                print(f"   ✅ Logged: {followers} followers (net: {net:+d})")
            except Exception as e:
                print(f"   ❌ Error: {e}")

def log_post_manual():
    """Log a post manually."""
    print("\n📝 LOG A POST")
    print("="*60)
    
    # Select account
    print("\nSelect account:")
    for i, (acc_id, config) in enumerate(ACCOUNT_CONFIG.items(), 1):
        print(f"   {i}. {config['name']} ({config['handle']})")
    
    choice = input("\nAccount (1-3): ").strip()
    acc_id = list(ACCOUNT_CONFIG.keys())[int(choice) - 1] if choice.isdigit() and 1 <= int(choice) <= 3 else None
    
    if not acc_id:
        print("Invalid choice")
        return
    
    print(f"\nLogging post for {ACCOUNT_CONFIG[acc_id]['name']}")
    
    post_id = f"post_{datetime.now().strftime('%Y%m%d%H%M%S')}"
    content = input("Content (first 280 chars): ").strip()[:280]
    post_type = input("Type (single/thread/reply/quote): ").strip() or 'single'
    hook_type = input("Hook (question/pain_point/statement/stat): ").strip() or 'statement'
    topic = input("Topic (roofing/saas/privacy/indie-hacker): ").strip() or 'general'
    
    print("\nMetrics (press Enter to skip):")
    impressions = input("   Impressions: ").strip()
    engagements = input("   Engagements: ").strip()
    likes = input("   Likes: ").strip()
    retweets = input("   Retweets: ").strip()
    replies = input("   Replies: ").strip()
    clicks = input("   Clicks: ").strip()
    new_followers = input("   New Followers from Post: ").strip()
    
    try:
        db.log_post(
            post_id=post_id,
            account_id=acc_id,
            content=content,
            content_type=post_type,
            hook_type=hook_type,
            topic_category=topic,
            impressions=int(impressions or 0),
            engagements=int(engagements or 0),
            likes=int(likes or 0),
            retweets=int(retweets or 0),
            replies=int(replies or 0),
            clicks=int(clicks or 0),
            new_followers_from_post=int(new_followers or 0),
            posted_at=datetime.now().isoformat()
        )
        print(f"\n✅ Post logged: {post_id}")
    except Exception as e:
        print(f"❌ Error: {e}")

def log_crm_manual():
    """Log CRM activities manually."""
    print("\n🏠 LOG CRM ACTIVITY")
    print("="*60)
    
    print("\n1. Add new contact")
    print("2. Log activity for existing contact")
    choice = input("Choice (1-2): ").strip()
    
    if choice == '1':
        print("\n--- Add New Contact ---")
        contact_id = f"lead_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        name = input("Name: ").strip()
        email = input("Email: ").strip()
        phone = input("Phone: ").strip()
        company = input("Company: ").strip()
        title = input("Title: ").strip()
        location = input("Location: ").strip()
        size = input("Size (freelancer/small/medium/large): ").strip() or 'unknown'
        source = input("Source (LinkedIn/Apollo/Referral): ").strip() or 'manual'
        value = input("Estimated Value: ").strip()
        
        try:
            db.add_contact(
                contact_id=contact_id,
                name=name, email=email, phone=phone, company_name=company,
                title=title, location=location, company_size=size,
                source=source, estimated_value=int(value or 0)
            )
            print(f"\n✅ Contact added: {name}")
        except Exception as e:
            print(f"❌ Error: {e}")
    
    elif choice == '2':
        print("\n--- Log Activity ---")
        contact_id = input("Contact ID (e.g., lead_001): ").strip()
        if not contact_id:
            print("Contact ID required")
            return
        
        print("\nActivity types:")
        print("   email_sent, email_opened, email_clicked, call, meeting, note, task")
        activity_type = input("Activity type: ").strip()
        note = input("Note: ").strip()
        
        try:
            db.log_activity(contact_id, activity_type, note)
            print(f"\n✅ Activity logged for {contact_id}")
        except Exception as e:
            print(f"❌ Error: {e}")

def log_revenue_manual():
    """Log revenue data manually."""
    print("\n💰 LOG REVENUE")
    print("="*60)
    
    print("\n1. Log subscription")
    print("2. Log daily MRR")
    choice = input("Choice (1-2): ").strip()
    
    if choice == '1':
        print("\n--- Log Subscription ---")
        sub_id = f"sub_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        print("Product: addonquote, sidequest, sheetitnow")
        product = input("Product: ").strip()
        plan = input("Plan (monthly/lifetime): ").strip()
        amount = input("Amount: ").strip()
        email = input("Customer Email: ").strip()
        source = input("Source (direct/affiliate/referral/ads): ").strip() or 'direct'
        
        try:
            db.log_subscription(
                subscription_id=sub_id, product=product, plan=plan,
                amount=float(amount), customer_email=email, source=source
            )
            print(f"\n✅ Subscription logged: {sub_id}")
        except Exception as e:
            print(f"❌ Error: {e}")
    
    elif choice == '2':
        print("\n--- Log Daily MRR ---")
        print("Product: addonquote, sidequest, sheetitnow")
        product = input("Product: ").strip()
        mrr = input("MRR: ").strip()
        subscribers = input("Active Subscribers: ").strip()
        new_subs = input("New Today: ").strip()
        churned = input("Churned Today: ").strip()
        
        try:
            db.log_mrr_daily(
                date_str=date.today().isoformat(),
                product=product, mrr=float(mrr), active_subscribers=int(subscribers),
                new_subscribers=int(new_subs or 0), churned_subscribers=int(churned or 0)
            )
            print(f"\n✅ MRR logged for {product}")
        except Exception as e:
            print(f"❌ Error: {e}")

def create_experiment():
    """Create a new A/B experiment."""
    print("\n🧪 CREATE A/B EXPERIMENT")
    print("="*60)
    
    exp_id = f"exp_{datetime.now().strftime('%Y%m%d%H%M%S')}"
    name = input("Experiment name: ").strip()
    
    print("\nAccount:")
    for i, (acc_id, config) in enumerate(ACCOUNT_CONFIG.items(), 1):
        print(f"   {i}. {config['name']}")
    acc_choice = input("Choice (1-3): ").strip()
    account_id = list(ACCOUNT_CONFIG.keys())[int(acc_choice) - 1] if acc_choice.isdigit() else 'addonquote'
    
    hypothesis = input("Hypothesis: ").strip()
    variant_a = input("Variant A (what you're testing): ").strip()
    variant_b = input("Variant B: ").strip()
    
    try:
        db.create_experiment(
            experiment_id=exp_id, name=name, account_id=account_id,
            variant_a_text=variant_a, variant_b_text=variant_b,
            hypothesis=hypothesis
        )
        print(f"\n✅ Experiment created: {exp_id}")
    except Exception as e:
        print(f"❌ Error: {e}")

def export_data():
    """Export all data to JSON files."""
    print("\n📤 EXPORTING DATA TO JSON")
    print("="*60)
    
    export_dir = os.path.expanduser('~/.openclaw/workspace/data-logger/exports')
    os.makedirs(export_dir, exist_ok=True)
    
    tables = ['x_accounts', 'x_followers_daily', 'x_posts', 'x_experiments', 
              'crm_contacts', 'crm_activities', 'revenue_subscriptions', 'revenue_mrr_daily']
    
    for table in tables:
        result = db._request(f'{table}?select=*')
        data = result.get('data', [])
        
        filename = f'{export_dir}/{table}.json'
        with open(filename, 'w') as f:
            json.dump(data, f, indent=2)
        print(f"   ✅ {table}: {len(data)} records -> {filename}")
    
    print(f"\n📁 All data exported to: {export_dir}")

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Side Quest Studios Data Logger')
    parser.add_argument('--status', action='store_true', help='Show current data status')
    parser.add_argument('--all', action='store_true', help='Log all available data')
    parser.add_argument('--followers', action='store_true', help='Log follower counts')
    parser.add_argument('--posts', action='store_true', help='Log post metrics')
    parser.add_argument('--crm', action='store_true', help='Log CRM activities')
    parser.add_argument('--revenue', action='store_true', help='Log revenue')
    parser.add_argument('--experiment', action='store_true', help='Create A/B experiment')
    parser.add_argument('--export', action='store_true', help='Export all data to JSON')
    
    args = parser.parse_args()
    
    # Default to status if no args
    if not any([args.status, args.all, args.followers, args.posts, args.crm, args.revenue, args.experiment, args.export]):
        args.status = True
    
    if args.status:
        show_status()
    elif args.followers:
        log_followers_manual()
    elif args.posts:
        log_post_manual()
    elif args.crm:
        log_crm_manual()
    elif args.revenue:
        log_revenue_manual()
    elif args.experiment:
        create_experiment()
    elif args.export:
        export_data()
    elif args.all:
        log_followers_manual()
        log_post_manual()

if __name__ == '__main__':
    main()
