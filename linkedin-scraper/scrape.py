#!/usr/bin/env python3
"""
LinkedIn Roofing Lead Scraper
Uses Apify API to find roofing companies in Florida.

Usage:
    python3 scrape.py --query "roofing" --location "Florida" --size "small"
    python3 scrape.py --query "roofing contractor" --location "Miami" --all-sizes
"""

import json
import sys
import os
import time
from datetime import datetime

def get_apify_key():
    for path in ['~/.openclaw/workspace/.env', '~/.openclaw/.env', '~/.env']:
        path = os.path.expanduser(path)
        if os.path.exists(path):
            with open(path) as f:
                for line in f:
                    if 'APIFY_API_KEY' in line:
                        return line.strip().split('=')[1]
    return None

APIFY_KEY = get_apify_key()
BASE_URL = "https://api.apify.com/v2"

# Try multiple LinkedIn scraper actors
ACTORS = [
    "apify/linkedin-people-scraper",
    "karolis/linkedin-company-scraper", 
    "andres/linkedin-search-scraper",
    "streamers/linkedin-sales-navigator-scraper"
]

def call_apify(actor_id, input_data):
    """Call Apify actor and return results."""
    if not APIFY_KEY:
        print("❌ No Apify API key found!")
        return None
    
    import urllib.request
    import urllib.error
    
    url = f"{BASE_URL}/acts/{actor_id}/runs"
    headers = {
        "Authorization": f"Bearer {APIFY_KEY}",
        "Content-Type": "application/json"
    }
    
    print(f"🚀 Starting Apify actor: {actor_id}")
    print(f"   Input: {json.dumps(input_data, indent=2)}")
    
    try:
        req = urllib.request.Request(url, data=json.dumps(input_data).encode(), headers=headers, method='POST')
        with urllib.request.urlopen(req, timeout=30) as resp:
            result = json.loads(resp.read().decode())
            run_id = result.get('data', {}).get('id')
            print(f"   Run ID: {run_id}")
            
            if run_id:
                return wait_for_results(actor_id, run_id)
    except urllib.error.HTTPError as e:
        print(f"❌ HTTP Error: {e.code} - {e.reason}")
        if e.code == 404:
            return "NOT_FOUND"
        return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def wait_for_results(actor_id, run_id, timeout=300):
    import urllib.request
    
    headers = {"Authorization": f"Bearer {APIFY_KEY}"}
    wait_url = f"{BASE_URL}/acts/{actor_id}/runs/{run_id}/waitForFinish?timeout={timeout}"
    
    print(f"⏳ Waiting for completion...")
    
    try:
        req = urllib.request.Request(wait_url, headers=headers, method='POST')
        with urllib.request.urlopen(req, timeout=timeout + 10) as resp:
            result = json.loads(resp.read().decode())
            status = result.get('status', 'UNKNOWN')
            print(f"   Status: {status}")
            
            if status == 'SUCCEEDED':
                dataset_url = f"{BASE_URL}/acts/{actor_id}/runs/{run_id}/dataset/items"
                req = urllib.request.Request(dataset_url, headers=headers)
                with urllib.request.urlopen(req, timeout=30) as ds_resp:
                    items = json.loads(ds_resp.read().decode())
                    print(f"✅ Found {len(items)} results")
                    return items
            elif status == 'FAILED':
                print(f"❌ Actor failed: {result.get('error', 'Unknown error')}")
                return None
            else:
                return None
    except Exception as e:
        print(f"❌ Error waiting: {e}")
        return None

def search_with_actor(actor_id, query, location, limit):
    input_data = {
        "searchTerms": query,
        "locations": [location] if location else [],
        "limit": limit,
        "includePosts": False,
        "includeCompanyInfo": True
    }
    return call_apify(actor_id, input_data)

def main():
    import argparse
    parser = argparse.ArgumentParser(description='Scrape LinkedIn for roofing leads')
    parser.add_argument('--query', '-q', default='roofing contractor', help='Search query')
    parser.add_argument('--location', '-l', default='Florida', help='Location')
    parser.add_argument('--limit', '-n', type=int, default=50, help='Max results')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be searched')
    
    args = parser.parse_args()
    
    if args.dry_run:
        print("🔍 Would search for:")
        print(f"   Query: {args.query}")
        print(f"   Location: {args.location}")
        print(f"   Limit: {args.limit}")
        return
    
    print("\n" + "="*60)
    print("🔍 LINKEDIN ROOFING LEAD SCRAPER")
    print("="*60)
    print(f"Query: {args.query}")
    print(f"Location: {args.location}")
    print(f"API Key: {APIFY_KEY[:20] if APIFY_KEY else 'NOT FOUND'}...")
    print("="*60 + "\n")
    
    # Try each actor
    for actor_id in ACTORS:
        print(f"\n📡 Trying: {actor_id}")
        result = search_with_actor(actor_id, args.query, args.location, args.limit)
        
        if result == "NOT_FOUND":
            print(f"   Actor not found, trying next...")
            continue
        elif result:
            print(f"   Success! Found {len(result)} results")
            break
        else:
            print(f"   Failed or no results")
    
    print("\n💡 Note: If all actors fail, you may need to:")
    print("   1. Configure Apify with LinkedIn cookies")
    print("   2. Use a different Apify actor")
    print("   3. Try Apollo.io for verified emails")

if __name__ == "__main__":
    main()
