#!/usr/bin/env python3
"""
Apify LinkedIn Scraper - Reusable Tool

Usage:
    python3 apify_linkedin_scraper.py --url "https://www.linkedin.com/in/williamhgates"
    python3 apify_linkedin_scraper.py --urls file.txt
    python3 apify_linkedin_scraper.py --search "roofing contractor Miami"
    python3 apify_linkedin_scraper.py --status               # Check last run status
    python3 apify_linkedin_scraper.py --results             # Get last results
"""

import os
import sys
import json
import time
import argparse
from datetime import datetime

# Configuration
ACTOR_ID = "AgfKk0sQQxkpQJ1Dt"
BASE_URL = "https://api.apify.com/v2"

def get_api_key():
    """Get Apify API key from .env file."""
    env_file = os.path.expanduser('~/.openclaw/workspace/.env')
    with open(env_file) as f:
        for line in f:
            if 'APIFY_API_KEY' in line:
                return line.strip().split('=')[1]
    return None

def start_actor(urls, timeout=300):
    """Start the actor with URLs to scrape."""
    api_key = get_api_key()
    if not api_key:
        print("❌ Apify API key not found in ~/.openclaw/workspace/.env")
        sys.exit(1)
    
    # Build start URLs
    start_urls = []
    for i, url in enumerate(urls):
        start_urls.append({
            "url": url.strip(),
            "id": str(i + 1),
            "method": "GET"
        })
    
    payload = {
        "startUrls": start_urls,
        "timeout": timeout,
        "memory": 256
    }
    
    url = f"{BASE_URL}/acts/{ACTOR_ID}/runs"
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    import urllib.request
    import urllib.error
    
    data = json.dumps(payload).encode()
    req = urllib.request.Request(url, data=data, headers=headers, method='POST')
    
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            result = json.loads(resp.read().decode())
            run_id = result.get('data', {}).get('id')
            print(f"🚀 Actor started!")
            print(f"   Run ID: {run_id}")
            print(f"   URLs to scrape: {len(start_urls)}")
            return run_id
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        print(f"❌ Error starting actor: {e.code}")
        print(error_body[:500])
        return None

def get_run_status(run_id):
    """Get the status of an actor run."""
    api_key = get_api_key()
    if not api_key:
        print("❌ Apify API key not found")
        return None
    
    url = f"{BASE_URL}/actor-runs/{run_id}"
    headers = {"Accept": "application/json", "Authorization": f"Bearer {api_key}"}
    
    import urllib.request
    
    req = urllib.request.Request(url, headers=headers)
    
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            result = json.loads(resp.read().decode())
            return result.get('data', {})
    except Exception as e:
        print(f"❌ Error getting status: {e}")
        return None

def wait_for_completion(run_id, max_wait=600, poll_interval=10):
    """Wait for actor run to complete."""
    print(f"⏳ Waiting for completion (max {max_wait}s)...")
    start_time = time.time()
    
    while time.time() - start_time < max_wait:
        status = get_run_status(run_id)
        if not status:
            return None
        
        status_name = status.get('status', 'UNKNOWN')
        elapsed = int(time.time() - start_time)
        
        if status_name == 'SUCCEEDED':
            print(f"✅ Completed in {elapsed}s")
            return status
        elif status_name == 'FAILED':
            error = status.get('error', 'Unknown error')
            print(f"❌ Failed: {error}")
            return None
        elif status_name == 'TIMED-OUT':
            print("❌ Timed out")
            return None
        else:
            print(f"   Status: {status_name} ({elapsed}s)... ", end="\r")
            sys.stdout.flush()
            time.sleep(poll_interval)
    
    print("❌ Max wait time exceeded")
    return None

def get_dataset_id(run_id):
    """Get dataset ID from run."""
    status = get_run_status(run_id)
    if status:
        return status.get('defaultDatasetId')
    return None

def get_results(dataset_id):
    """Get results from dataset."""
    if not dataset_id:
        print("❌ No dataset ID found")
        return []
    
    api_key = get_api_key()
    if not api_key:
        print("❌ Apify API key not found")
        return []
    
    url = f"{BASE_URL}/datasets/{dataset_id}/items"
    headers = {"Accept": "application/json", "Authorization": f"Bearer {api_key}"}
    
    import urllib.request
    
    req = urllib.request.Request(url, headers=headers)
    
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            results = json.loads(resp.read().decode())
            print(f"✅ Got {len(results)} results")
            return results
    except Exception as e:
        print(f"❌ Error getting results: {e}")
        return []

def save_results(results, output_file=None):
    """Save results to file."""
    if not output_file:
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        output_file = f"linkedin_leads_{timestamp}.json"
    
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"💾 Saved to: {output_file}")
    return output_file

def export_to_csv(results, output_file=None):
    """Export results to CSV."""
    if not results:
        print("❌ No results to export")
        return
    
    if not output_file:
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        output_file = f"linkedin_leads_{timestamp}.csv"
    
    import csv
    
    # Get all unique keys from results
    all_keys = set()
    for r in results:
        if isinstance(r, dict):
            all_keys.update(r.keys())
    
    with open(output_file, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=sorted(all_keys))
        writer.writeheader()
        for r in results:
            if isinstance(r, dict):
                writer.writerow(r)
    
    print(f"📊 Exported to: {output_file}")
    return output_file

def print_results_summary(results):
    """Print a summary of results."""
    if not results:
        print("❌ No results")
        return
    
    print(f"\n📋 Results Summary ({len(results)} profiles):")
    print("-" * 60)
    
    for i, r in enumerate(results[:10], 1):  # Show first 10
        if not isinstance(r, dict):
            continue
        
        name = r.get('name', r.get('fullName', 'Unknown'))
        headline = r.get('headline', r.get('jobTitle', ''))[:50]
        location = r.get('location', '')
        url = r.get('url', r.get('profileUrl', ''))
        
        print(f"{i}. {name}")
        print(f"   📝 {headline}...")
        print(f"   📍 {location}")
        print(f"   🔗 {url[:80]}...")
        print()
    
    if len(results) > 10:
        print(f"   ... and {len(results) - 10} more")

def main():
    parser = argparse.ArgumentParser(description='Apify LinkedIn Scraper')
    
    parser.add_argument('--url', '-u', help='Single URL to scrape')
    parser.add_argument('--urls', '-U', help='File with URLs (one per line)')
    parser.add_argument('--list', '-l', help='Comma-separated URLs')
    parser.add_argument('--search', '-s', help='Search query (uses LinkedIn search)')
    parser.add_argument('--output', '-o', help='Output file (JSON or CSV)')
    parser.add_argument('--format', '-f', choices=['json', 'csv'], default='json', help='Output format')
    parser.add_argument('--wait', '-w', action='store_true', help='Wait for completion')
    parser.add_argument('--status', action='store_true', help='Check last run status')
    parser.add_argument('--results', action='store_true', help='Get last run results')
    parser.add_argument('--run-id', help='Specific run ID to check')
    
    args = parser.parse_args()
    
    # Build URL list
    urls = []
    
    if args.url:
        urls = [args.url]
    elif args.urls:
        with open(args.urls) as f:
            urls = [line.strip() for line in f if line.strip()]
    elif args.list:
        urls = [u.strip() for u in args.list.split(',') if u.strip()]
    elif args.search:
        # For search, we'd need a different actor that supports search
        # For now, create URLs for LinkedIn search results
        query = args.search.replace(' ', '+')
        urls = [f"https://www.linkedin.com/search/results/people/?keywords={query}"]
        print(f"🔍 Search URL: {urls[0]}")
    elif args.status or args.results:
        pass  # Handle separately
    else:
        parser.print_help()
        return
    
    if args.status:
        # Check last run status
        run_id = args.run_id
        if not run_id:
            # Get last run from file
            run_file = os.path.expanduser('~/.openclaw/workspace/dashboard/data/apify_last_run.json')
            if os.path.exists(run_file):
                with open(run_file) as f:
                    data = json.load(f)
                    run_id = data.get('run_id')
        
        if run_id:
            status = get_run_status(run_id)
            if status:
                print(f"📊 Run Status: {status.get('status')}")
                print(f"   Started: {status.get('startedAt')}")
                print(f"   Finished: {status.get('finishedAt')}")
                if status.get('defaultDatasetId'):
                    print(f"   Dataset: {status.get('defaultDatasetId')}")
        else:
            print("❌ No run ID provided and no previous run found")
        return
    
    if args.results:
        # Get results from last run
        run_id = args.run_id
        if not run_id:
            run_file = os.path.expanduser('~/.openclaw/workspace/dashboard/data/apify_last_run.json')
            if os.path.exists(run_file):
                with open(run_file) as f:
                    data = json.load(f)
                    run_id = data.get('run_id')
                    dataset_id = data.get('dataset_id')
        
        if dataset_id:
            results = get_results(dataset_id)
            print_results_summary(results)
            if args.output or args.format == 'csv':
                output = args.output or f"linkedin_results.csv"
                if args.format == 'csv' or args.output.endswith('.csv'):
                    export_to_csv(results, args.output or 'linkedin_results.csv')
                else:
                    save_results(results, args.output)
        else:
            print("❌ No dataset ID found. Run with --wait first.")
        return
    
    if not urls:
        parser.print_help()
        return
    
    print(f"🚀 Apify LinkedIn Scraper")
    print(f"   URLs: {len(urls)}")
    print()
    
    # Start the actor
    run_id = start_actor(urls)
    
    if not run_id:
        sys.exit(1)
    
    # Save run ID for later reference
    run_file = os.path.expanduser('~/.openclaw/workspace/dashboard/data/apify_last_run.json')
    os.makedirs(os.path.dirname(run_file), exist_ok=True)
    with open(run_file, 'w') as f:
        json.dump({'run_id': run_id, 'started': datetime.now().isoformat()}, f)
    
    print(f"\n💾 Run ID saved to: {run_file}")
    
    if args.wait:
        status = wait_for_completion(run_id)
        if status:
            dataset_id = status.get('defaultDatasetId')
            if dataset_id:
                # Update run file with dataset ID
                with open(run_file, 'w') as f:
                    json.dump({
                        'run_id': run_id,
                        'dataset_id': dataset_id,
                        'started': datetime.now().isoformat()
                    }, f)
                
                # Get and display results
                results = get_results(dataset_id)
                print_results_summary(results)
                
                # Save/export results
                if args.output or args.format == 'csv':
                    output = args.output
                    if args.format == 'csv' or (output and output.endswith('.csv')):
                        export_to_csv(results, output or 'linkedin_results.csv')
                    else:
                        save_results(results, output or 'linkedin_results.json')
                else:
                    save_results(results)

if __name__ == '__main__':
    main()