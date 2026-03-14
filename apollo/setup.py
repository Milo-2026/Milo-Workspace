#!/usr/bin/env python3
"""
Apollo.io Setup Script

This script helps set up Apollo.io integration for lead generation.
"""

import os
import sys

def check_api_key():
    """Check if Apollo API key is configured."""
    env_file = os.path.expanduser('~/.openclaw/workspace/.env')
    with open(env_file) as f:
        for line in f:
            if 'APOLLO_API_KEY' in line:
                key = line.strip().split('=')[1].strip()
                if key and key != 'your_key_here':
                    print(f"✅ Apollo API key configured: {key[:10]}...")
                    return True
    print("❌ Apollo API key not found or not configured")
    return False

def add_api_key(key):
    """Add Apollo API key to .env file."""
    env_file = os.path.expanduser('~/.openclaw/workspace/.env')
    
    # Read existing content
    with open(env_file) as f:
        content = f.read()
    
    # Check if key already exists
    if 'APOLLO_API_KEY' in content:
        # Replace existing key
        lines = content.split('\n')
        new_lines = []
        for line in lines:
            if line.startswith('APOLLO_API_KEY'):
                new_lines.append(f'APOLLO_API_KEY={key}')
            else:
                new_lines.append(line)
        content = '\n'.join(new_lines)
    else:
        content += f'\nAPOLLO_API_KEY={key}\n'
    
    # Write back
    with open(env_file, 'w') as f:
        f.write(content)
    
    print(f"✅ Added Apollo API key to ~/.openclaw/workspace/.env")

def test_connection():
    """Test the Apollo API connection."""
    import urllib.request
    import json
    
    api_key = None
    env_file = os.path.expanduser('~/.openclaw/workspace/.env')
    with open(env_file) as f:
        for line in f:
            if 'APOLLO_API_KEY' in line:
                api_key = line.strip().split('=')[1].strip()
                break
    
    if not api_key:
        print("❌ No API key found")
        return False
    
    url = "https://api.apollo.io/v1/mixed_people/search"
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    payload = {
        "per_page": 1,
        "page": 1,
        "person_titles": ["CEO"],
        "person_locations": ["United States"],
        "organization_sizes": ["1-50"],
    }
    
    data = json.dumps(payload).encode()
    req = urllib.request.Request(url, data=data, headers=headers, method='POST')
    
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            result = json.loads(resp.read().decode())
            print(f"✅ Apollo API connected successfully!")
            print(f"   Found {result.get('total_entries', 0)} matches for test query")
            return True
    except Exception as e:
        print(f"❌ Apollo API error: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) > 1:
        if sys.argv[1] == 'test':
            test_connection()
        elif sys.argv[1] == 'add' and len(sys.argv) > 2:
            add_api_key(sys.argv[2])
        else:
            print("Usage: python3 setup.py [test|add KEY]")
    else:
        print("Apollo.io Setup")
        print("=" * 40)
        check_api_key()
        print("\nTo configure:")
        print("  1. Get API key from https://app.apollo.io/settings/api")
        print("  2. Run: python3 setup.py add YOUR_API_KEY")
        print("  3. Test: python3 setup.py test")
