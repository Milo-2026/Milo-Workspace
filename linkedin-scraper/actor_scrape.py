#!/usr/bin/env python3
"""
LinkedIn Scraper using Apify Actor

Actor: AgfKk0sQQxkpQJ1Dt
"""

import urllib.request
import json
import time
from datetime import datetime

# Get API key
with open('/Users/alfredoalvarez/.openclaw/workspace/.env') as f:
    api_key = f.read().strip().split('=')[1]

ACTORS = {
    "linkedin": "AgfKk0sQQxkpQJ1Dt"  # User's LinkedIn scraper
}

def run_actor(actor_id, input_data):
    """Start an actor run."""
    url = f"https://api.apify.com/v2/acts/{actor_id}/runs"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    print(f"🚀 Starting actor: {actor_id}")
    print(f"   Input: {json.dumps(input_data)}")
    
    req = urllib.request.Request(url, data=json.dumps(input_data).encode(), headers=headers, method='POST')
    
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            result = json.loads(resp.read().decode())
            run_id = result.get('data', {}).get('id')
            print(f"   Run ID: {run_id}")
            return run_id
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def wait_for_run(actor_id, run_id, timeout=180):
    """Wait for actor to complete."""
    url = f"https://api.apify.com/v2/acts/{actor_id}/runs/{run_id}/waitForFinish?timeout={timeout}"
    headers = {"Authorization": f"Bearer {api_key}"}
    
    print(f"⏳ Waiting for completion...")
    
    for attempt in range(10):
        try:
            req = urllib.request.Request(url, headers=headers, method='POST')
            with urllib.request.urlopen(req, timeout=60) as resp:
                result = json.loads(resp.read().decode())
                status = result.get('status')
                print(f"   Status: {status}")
                
                if status == 'SUCCEEDED':
                    return result
                elif status == 'FAILED':
                    print(f"❌ Actor failed: {result.get('error', 'Unknown')}")
                    return None
                else:
                    time.sleep(15)
        except Exception as e:
            print(f"   Error: {e}")
            time.sleep(15)
    
    return None

def get_dataset(actor_id, run_id):
    """Get the dataset from a completed run."""
    url = f"https://api.apify.com/v2/acts/{actor_id}/runs/{run_id}/dataset/items"
    headers = {"Authorization": f"Bearer {api_key}"}
    
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as resp:
            items = json.loads(resp.read().decode())
            print(f"✅ Got {len(items)} results")
            return items
    except Exception as e:
        print(f"❌ Error getting dataset: {e}")
        return []

def search_linkedin(query, location="Florida", limit=50):
    """Search LinkedIn using the actor."""
    actor_id = ACTORS["linkedin"]
    
    input_data = {
        "searchTerms": query,
        "locations": [location] if location else [],
        "limit": limit,
        "includeCompanyInfo": True,
        "includeContactInfo": True
    }
    
    run_id = run_actor(actor_id, input_data)
    if not run_id:
        return None
    
    result = wait_for_run(actor_id, run_id)
    if not result:
        return None
    
    return get_dataset(actor_id, run_id)

def main():
    import argparse
    parser = argparse.ArgumentParser(description='LinkedIn Scraper using Apify')
    parser.add_argument('query', help='Search query')
    parser.add_argument('--location', '-l', default='Florida', help='Location')
    parser.add_argument('--limit', '-n', type=int, default=50, help='Max results')
    
    args = parser.parse_args()
    
    print(f"\n🔍 Searching LinkedIn for: {args.query}")
    print(f"   Location: {args.location}")
    print(f"   Limit: {args.limit}")
    
    results = search_linkedin(args.query, args.location, args.limit)
    
    if results:
        print(f"\n✅ Found {len(results)} results:")
        for r in results[:5]:
            print(f"   - {r.get('name', 'Unknown')}")
    else:
        print("\n❌ No results or error occurred")

if __name__ == "__main__":
    main()
