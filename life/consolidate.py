#!/usr/bin/env python3
"""
Nightly Memory Consolidation
Runs at 2am to index the day's conversations into the knowledge graph
"""
import os
import json
from datetime import datetime, timedelta

WORKSPACE = "/Users/alfredoalvarez/.openclaw/workspace"
LIFE_DIR = f"{WORKSPACE}/life"
MEMORY_DIR = f"{WORKSPACE}/memory"

def get_yesterday_date():
    return (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")

def consolidate():
    """Main consolidation function"""
    yesterday = get_yesterday_date()
    daily_note_path = f"{MEMORY_DIR}/{yesterday}.md"
    
    if not os.path.exists(daily_note_path):
        print(f"No daily notes found for {yesterday}")
        return
    
    print(f"Consolidating memory from {yesterday}...")
    
    # Read the daily notes
    with open(daily_note_path, 'r') as f:
        content = f.read()
    
    # Extract key facts and update knowledge graph
    # This would use AI to extract important facts
    # For now, just log that we ran
    
    # Update the tacit knowledge with any new lessons
    print(f"Consolidation complete for {yesterday}")
    
    # Could add: extract action items, update project files, etc.

if __name__ == "__main__":
    consolidate()
