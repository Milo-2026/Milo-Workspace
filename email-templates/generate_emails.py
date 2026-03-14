#!/usr/bin/env python3
"""
Email Generator for CRM Leads
Generate personalized emails for each lead based on company size.

Usage:
    python3 generate_emails.py --all          # Generate for all leads
    python3 generate_emails.py --status new    # Only new leads
    python3 generate_emails.py --size small    # Only small companies
    python3 generate_emails.py --preview       # Preview without saving
"""

import json
import os
from datetime import datetime

CRM_FILE = os.path.expanduser("~/.openclaw/workspace/dashboard/data/crm/contacts.json")
TEMPLATES_DIR = os.path.expanduser("~/.openclaw/workspace/email-templates")

TEMPLATE_MAP = {
    "freelancer": "freelancer-template.txt",
    "small": "small-company-template.txt",
    "medium": "medium-company-template.txt",
    "large": "medium-company-template.txt"
}

def load_templates():
    templates = {}
    for filename in os.listdir(TEMPLATES_DIR):
        if filename.endswith('.txt') and filename != 'generate_emails.py':
            with open(os.path.join(TEMPLATES_DIR, filename)) as f:
                templates[filename.replace('.txt', '')] = f.read()
    return templates

def personalize(template, contact):
    """Replace placeholders with contact data."""
    text = template
    
    replacements = {
        "{{first_name}}": contact.get('name', '').split()[0] if contact.get('name') else '',
        "{{last_name}}": ' '.join(contact.get('name', '').split()[1:]) if contact.get('name') else '',
        "{{company_name}}": contact.get('company', ''),
        "{{email}}": contact.get('email', 'N/A'),
        "{{phone}}": contact.get('phone', 'N/A'),
        "{{website}}": contact.get('website', 'N/A'),
        "{{employee_count}}": "20+",  # Estimate based on size
        "{{job_count}}": "15-20",
    }
    
    for placeholder, value in replacements.items():
        text = text.replace(placeholder, str(value))
    
    return text

def get_template_for_contact(contact):
    size = contact.get('size', 'small')
    template_name = TEMPLATE_MAP.get(size, 'small-company-template')
    return template_name

def generate_emails(status_filter=None, size_filter=None, preview=True):
    """Generate emails for matching contacts."""
    
    with open(CRM_FILE) as f:
        crm = json.load(f)
    
    contacts = crm.get('contacts', [])
    templates = load_templates()
    
    # Filter contacts
    if status_filter:
        contacts = [c for c in contacts if c.get('status') == status_filter]
    if size_filter:
        contacts = [c for c in contacts if c.get('size') == size_filter]
    
    print(f"\n📧 EMAIL GENERATION REPORT")
    print("="*60)
    print(f"Contacts matching filters: {len(contacts)}")
    print()
    
    generated = []
    
    for contact in contacts:
        template_key = get_template_for_contact(contact)
        template = templates.get(template_key, templates.get('small-company-template'))
        
        personalized_email = personalize(template, contact)
        
        # Extract subject line
        lines = personalized_email.strip().split('\n')
        subject = lines[0].replace('SUBJECT: ', '')
        body = '\n'.join(lines[1:])
        
        result = {
            "id": contact['id'],
            "name": contact['name'],
            "company": contact['company'],
            "email": contact['email'],
            "size": contact.get('size', 'unknown'),
            "status": contact.get('status', 'new'),
            "template": template_key,
            "subject": subject,
            "body": body,
            "sent": False,
            "sentAt": None
        }
        
        generated.append(result)
        
        if preview:
            print(f"📬 {contact['name']}")
            print(f"   Company: {contact['company']}")
            print(f"   Email: {contact['email']}")
            print(f"   Size: {contact.get('size', 'unknown')}")
            print(f"   Template: {template_key}")
            print(f"   Subject: {subject}")
            print("-" * 40)
    
    if not preview:
        # Save generated emails
        output_file = f"generated_emails_{datetime.now().strftime('%Y%m%d_%H%M')}.json"
        with open(output_file, 'w') as f:
            json.dump(generated, f, indent=2)
        print(f"💾 Saved {len(generated)} emails to: {output_file}")
    
    return generated

def show_template(template_name):
    """Show a template with placeholder examples."""
    templates = load_templates()
    template = templates.get(template_name, templates.get('small-company-template'))
    print(f"\n📝 TEMPLATE: {template_name}")
    print("="*60)
    print(template)
    print("="*60)

def main():
    import argparse
    parser = argparse.ArgumentParser(description='Generate personalized emails for CRM leads')
    parser.add_argument('--all', action='store_true', help='Generate for all leads')
    parser.add_argument('--status', choices=['new', 'contacted', 'replied', 'qualified', 'proposal', 'closed'], help='Filter by status')
    parser.add_argument('--size', choices=['freelancer', 'small', 'medium', 'large'], help='Filter by company size')
    parser.add_argument('--preview', action='store_true', default=True, help='Preview emails (default)')
    parser.add_argument('--save', action='store_true', help='Save generated emails to file')
    parser.add_argument('--show-template', choices=list(load_templates().keys()), help='Show a specific template')
    
    args = parser.parse_args()
    
    if args.show_template:
        show_template(args.show_template)
    elif args.all or args.status or args.size:
        generate_emails(status_filter=args.status, size_filter=args.size, preview=not args.save)
    else:
        print("""
EMAIL GENERATOR

Usage:
    # Preview emails for all new leads
    python3 generate_emails.py --all --status new

    # Preview emails for small companies only
    python3 generate_emails.py --all --size small

    # Generate and save to file
    python3 generate_emails.py --all --save

    # Show a specific template
    python3 generate_emails.py --show-template small-company-template

Available templates:
    - freelancer-template.txt
    - small-company-template.txt
    - medium-company-template.txt
    - followup-1.txt
    - followup-2.txt
""")

if __name__ == "__main__":
    main()
