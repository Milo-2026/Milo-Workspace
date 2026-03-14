# LinkedIn Lead Import Workflow

Since the Apify API is blocked by network/firewall, here's how to import leads:

## Option 1: Export from Apify Console

1. Go to: https://console.apify.com/actors/AgfKk0sQQxkpQJ1Dt
2. Click "Run" with your search parameters
3. After it completes, click "Export" → "JSON" or "CSV"
4. Import with:
```bash
python3 import_leads.py --file exported_leads.json
```

## Option 2: Manual Entry

```bash
python3 import_leads.py --manual
```

## Option 3: LinkedIn Sales Navigator Export

1. Search LinkedIn Sales Navigator for roofing contractors
2. Use "Export" to download CSV
3. Import with:
```bash
python3 import_leads.py --file sales_navigator_export.csv
```

## Import Commands

```bash
# Check CRM status
python3 import_leads.py --stats

# Import JSON file
python3 import_leads.py --file leads.json

# Import CSV
python3 import_leads.py --file leads.csv

# Manual entry
python3 import_leads.py --manual

# Add single contact
python3 import_leads.py --name "John Doe" --email "john@company.com" --company "ACME Inc" --location "Miami, FL"
```

## CRM Commands

```bash
# View all contacts
python3 import_leads.py --stats

# Export CRM to JSON
python3 import_leads.py --export
```

## Lead Sources

- Apify console exports
- LinkedIn Sales Navigator
- Apollo.io exports
- Manual research
- Referrals
