#!/usr/bin/env python3
"""
Apollo.io Lead Search

Usage:
    python3 apollo_search.py --title "Founder" --size "1-50" --location "United States" --limit 100
    python3 apollo_search.py --titles "Founder,CEO,Owner" --output leads.json
"""

import os
import sys
import json
import argparse
import urllib.request
import urllib.error

def get_api_key():
    """Get Apollo API key from .env file."""
    env_file = os.path.expanduser('~/.openclaw/workspace/.env')
    with open(env_file) as f:
        for line in f:
            if 'APOLLO_API_KEY' in line:
                return line.strip().split('=')[1].strip()
    return None

def search_leads(title, company_size, location, limit=100):
    """Search for leads using Apollo API."""
    api_key = get_api_key()
    if not api_key:
        print("❌ Apollo API key not found in ~/.openclaw/workspace/.env")
        print("   Add: APOLLO_API_KEY=your_key_here")
        sys.exit(1)
    
    url = "https://api.apollo.io/v1/mixed_people/search"
    
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    # Build query parameters
    payload = {
        "per_page": min(limit, 100),
        "page": 1,
        "person_titles": [t.strip() for t in title.split(",")],
        "person_locations": [location] if location else [],
        "organization_sizes": [company_size] if company_size else [],
    }
    
    data = json.dumps(payload).encode()
    req = urllib.request.Request(url, data=data, headers=headers, method='POST')
    
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            result = json.loads(resp.read().decode())
            return result.get('people', [])
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        print(f"❌ Error: {e.code}")
        print(error_body[:500])
        return []

def format_lead(lead):
    """Format a lead for output."""
    name = f"{lead.get('first_name', '')} {lead.get('last_name', '')}".strip()
    title = lead.get('title', '')
    company = lead.get('organization', {}).get('name', '') if lead.get('organization') else ''
    location = lead.get('locations', [{}])[0].get('name', '') if lead.get('locations') else ''
    linkedin = lead.get('linkedin_url', '')
    email = lead.get('email', '')
    
    return {
        "name": name,
        "title": title,
        "company": company,
        "location": location,
        "linkedin": linkedin,
        "email": email
    }

def main():
    parser = argparse.ArgumentParser(description='Apollo.io Lead Search')
    parser.add_argument('--title', '-t', default="Founder", help='Job title filter (comma-separated)')
    parser.add_argument('--titles', '-T', help='Alternative: comma-separated titles')
    parser.add_argument('--size', '-s', default="1-50", help='Company size (1-10, 11-50, 51-200, etc.)')
    parser.add_argument('--location', '-l', default="United States", help='Location filter')
    parser.add_argument('--limit', '-n', type=int, default=100, help='Max results')
    parser.add_argument('--output', '-o', help='Output file (JSON)')
    parser.add_argument('--csv', action='store_true', help='Export as CSV')
    
    args = parser.parse_args()
    
    title = args.titles or args.title
    print(f"🔍 Searching Apollo.io...")
    print(f"   Titles: {title}")
    print(f"   Size: {args.size}")
    print(f"   Location: {args.location}")
    
    leads = search_leads(title, args.size, args.location, args.limit)
    
    if not leads:
        print("❌ No results found or API error")
        sys.exit(1)
    
    print(f"\n✅ Found {len(leads)} leads")
    
    formatted = [format_lead(l) for l in leads]
    
    # Output
    if args.csv:
        import csv
        filename = args.output or f"apollo_leads_{title.replace(',', '_').replace(' ', '_')}.csv"
        with open(filename, 'w', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=['name', 'title', 'company', 'location', 'linkedin', 'email'])
            writer.writeheader()
            for lead in formatted:
                writer.writerow(lead)
        print(f"📊 Exported to: {filename}")
    elif args.output:
        with open(args.output, 'w') as f:
            json.dump(formatted, f, indent=2)
        print(f"💾 Saved to: {args.output}")
    else:
        # Print results
        print("\n📋 Results:")
        print("-" * 80)
        for i, lead in enumerate(formatted[:20], 1):
            print(f"{i}. {lead['name']}")
            print(f"   {lead['title']} @ {lead['company']}")
            print(f"   📍 {lead['location']}")
            if lead['linkedin']:
                print(f"   🔗 {lead['linkedin']}")
            print()
        
        if len(formatted) > 20:
            print(f"... and {len(formatted) - 20} more")

if __name__ == "__main__":
    main()
