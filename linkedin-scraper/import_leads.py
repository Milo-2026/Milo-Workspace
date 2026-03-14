#!/usr/bin/env python3
"""
Lead Import Tool
Import leads from Apify exports, manual entry, or CSV format.

Usage:
    python3 import_leads.py --file leads.json
    python3 import_leads.py --manual  # Interactive entry
    python3 import_leads.py --name "John Doe" --email "john@company.com" --company "Company Inc"
"""

import json
import sys
import os
from datetime import datetime

CRM_FILE = os.path.expanduser("~/.openclaw/workspace/dashboard/data/crm/contacts.json")

def load_crm():
    """Load existing CRM data."""
    if os.path.exists(CRM_FILE):
        with open(CRM_FILE) as f:
            return json.load(f)
    return {"contacts": [], "pipeline": {}, "stats": {}}

def save_crm(data):
    """Save CRM data."""
    os.makedirs(os.path.dirname(CRM_FILE), exist_ok=True)
    with open(CRM_FILE, 'w') as f:
        json.dump(data, f, indent=2)

def add_contact(contact):
    """Add a single contact to CRM."""
    data = load_crm()
    
    # Generate ID
    contact_id = f"lead_{datetime.now().strftime('%Y%m%d')}_{hash(contact.get('email', contact.get('name', ''))) % 10000}"
    
    new_contact = {
        "id": contact_id,
        "name": contact.get('name', ''),
        "email": contact.get('email'),
        "phone": contact.get('phone'),
        "website": contact.get('website'),
        "company": contact.get('company', ''),
        "title": contact.get('title', ''),
        "linkedin": contact.get('linkedin', ''),
        "location": contact.get('location', ''),
        "source": contact.get('source', 'Manual'),
        "size": contact.get('size', 'unknown'),
        "status": contact.get('status', 'new'),
        "value": contact.get('value', 299),
        "notes": contact.get('notes', ''),
        "createdAt": datetime.now().isoformat(),
        "lastContact": None,
        "activities": [
            {
                "type": "created",
                "date": datetime.now().isoformat(),
                "note": contact.get('import_note', 'Manually added')
            }
        ]
    }
    
    data['contacts'].append(new_contact)
    save_crm(data)
    
    print(f"✅ Added: {new_contact['name']} at {new_contact['company']}")
    return new_contact

def import_json_file(filepath):
    """Import leads from JSON file."""
    with open(filepath) as f:
        data = json.load(f)
    
    leads = data.get('leads', data.get('contacts', []))
    
    if not isinstance(leads, list):
        leads = [leads]
    
    print(f"📥 Importing {len(leads)} leads from {filepath}")
    
    for lead in leads:
        add_contact({
            "name": lead.get('name'),
            "email": lead.get('email'),
            "phone": lead.get('phone'),
            "website": lead.get('website'),
            "company": lead.get('company'),
            "title": lead.get('title'),
            "linkedin": lead.get('linkedin'),
            "location": lead.get('location'),
            "source": "LinkedIn Import",
            "size": lead.get('size', 'unknown'),
            "import_note": f"Imported from {os.path.basename(filepath)}"
        })
    
    print(f"\n✅ Successfully imported {len(leads)} leads")

def interactive_import():
    """Interactive lead entry."""
    print("\n📝 INTERACTIVE LEAD IMPORT")
    print("="*40)
    
    contacts = []
    
    while True:
        print("\n--- New Contact (empty name to finish) ---")
        name = input("Name: ").strip()
        if not name:
            break
        
        contact = {"name": name}
        contact["email"] = input("Email (optional): ").strip() or None
        contact["phone"] = input("Phone (optional): ").strip() or None
        contact["website"] = input("Website: ").strip() or None
        contact["company"] = input("Company: ").strip() or None
        contact["title"] = input("Title: ").strip() or None
        contact["linkedin"] = input("LinkedIn URL: ").strip() or None
        contact["location"] = input("Location: ").strip() or "Florida"
        contact["source"] = "Manual Entry"
        
        contacts.append(contact)
    
    for contact in contacts:
        add_contact(contact)
    
    print(f"\n✅ Added {len(contacts)} contacts")

def show_crm_stats():
    """Show CRM statistics."""
    data = load_crm()
    contacts = data.get('contacts', [])
    
    print("\n📊 CRM STATISTICS")
    print("="*40)
    print(f"Total contacts: {len(contacts)}")
    
    # By status
    from collections import Counter
    statuses = Counter(c.get('status', 'new') for c in contacts)
    print("\nBy Status:")
    for status, count in statuses.items():
        print(f"   {status}: {count}")
    
    # By source
    sources = Counter(c.get('source', 'Unknown') for c in contacts)
    print("\nBy Source:")
    for source, count in sources.items():
        print(f"   {source}: {count}")
    
    # Total value
    total_value = sum(c.get('value', 0) for c in contacts)
    closed_value = sum(c.get('value', 0) for c in contacts if c.get('status') == 'closed')
    print(f"\nPipeline Value: ${total_value}")
    print(f"Closed Value: ${closed_value}")

def main():
    import argparse
    parser = argparse.ArgumentParser(description='Lead Import Tool for CRM')
    parser.add_argument('--file', '-f', help='Import from JSON file')
    parser.add_argument('--manual', '-m', action='store_true', help='Interactive manual entry')
    parser.add_argument('--name', help='Add single contact (use with other flags)')
    parser.add_argument('--email', help='Email')
    parser.add_argument('--company', help='Company')
    parser.add_argument('--website', help='Website')
    parser.add_argument('--phone', help='Phone')
    parser.add_argument('--title', help='Job title')
    parser.add_argument('--location', default='Florida', help='Location')
    parser.add_argument('--stats', action='store_true', help='Show CRM statistics')
    
    args = parser.parse_args()
    
    if args.stats:
        show_crm_stats()
    elif args.manual:
        interactive_import()
    elif args.file:
        import_json_file(args.file)
    elif args.name:
        add_contact({
            "name": args.name,
            "email": args.email,
            "phone": args.phone,
            "website": args.website,
            "company": args.company,
            "title": args.title,
            "location": args.location,
            "source": "CLI Import"
        })
    else:
        print("""
LEAD IMPORT TOOL

Usage:
    # Show statistics
    python3 import_leads.py --stats

    # Interactive manual entry
    python3 import_leads.py --manual

    # Import from JSON file
    python3 import_leads.py --file leads.json

    # Add single contact
    python3 import_leads.py --name "John Doe" --email "john@company.com" --company "ACME"

    # Add full contact
    python3 import_leads.py --name "Jane Smith" --email "jane@roofing.com" \\
        --company "Smith Roofing" --phone "555-1234" \\
        --website "smithroofing.com" --title "Owner" --location "Miami, FL"
""")

if __name__ == "__main__":
    main()
