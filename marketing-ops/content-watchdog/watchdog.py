#!/usr/bin/env python3
"""
Content Watchdog — Deduplication Engine
Prevents repeated/near-duplicate posts from being published on X.

Usage:
    python watchdog.py check "Your proposed tweet text here"
    python watchdog.py log "Tweet that was just published" --account addonquote
    python watchdog.py stats
    python watchdog.py purge --older-than 90  # days

How it works:
    1. Exact match: SHA-256 hash of normalized text
    2. Fuzzy match: Similarity ratio (threshold: 80%)
    3. Keyword overlap: Flags posts with >70% shared keywords
"""

import hashlib
import json
import os
import sys
import re
from datetime import datetime, timedelta
from difflib import SequenceMatcher

WATCHDOG_DIR = os.path.dirname(os.path.abspath(__file__))
HISTORY_FILE = os.path.join(WATCHDOG_DIR, "published_history.json")
REJECTED_LOG = os.path.join(WATCHDOG_DIR, "rejected.log")

SIMILARITY_THRESHOLD = 0.80  # 80% similar = duplicate
KEYWORD_OVERLAP_THRESHOLD = 0.70  # 70% keyword overlap = flag

def load_history():
    if os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE, "r") as f:
            return json.load(f)
    return {"posts": []}

def save_history(history):
    with open(HISTORY_FILE, "w") as f:
        json.dump(history, f, indent=2)

def normalize(text):
    """Lowercase, strip URLs, mentions, extra whitespace."""
    text = text.lower().strip()
    text = re.sub(r"https?://\S+", "", text)
    text = re.sub(r"@\w+", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

def text_hash(text):
    return hashlib.sha256(normalize(text).encode()).hexdigest()

def similarity(a, b):
    return SequenceMatcher(None, normalize(a), normalize(b)).ratio()

def extract_keywords(text, min_len=4):
    words = set(re.findall(r"\b[a-z]{%d,}\b" % min_len, normalize(text)))
    stopwords = {"this", "that", "with", "have", "from", "your", "they",
                 "been", "were", "will", "would", "could", "should",
                 "about", "their", "there", "what", "when", "which",
                 "just", "like", "make", "know", "think", "than", "some"}
    return words - stopwords

def keyword_overlap(a, b):
    kw_a = extract_keywords(a)
    kw_b = extract_keywords(b)
    if not kw_a or not kw_b:
        return 0.0
    intersection = kw_a & kw_b
    return len(intersection) / min(len(kw_a), len(kw_b))

def check_post(text, account=None):
    """Check proposed text against history. Returns (is_ok, reason, matches)."""
    history = load_history()
    new_hash = text_hash(text)
    matches = []

    for entry in history["posts"]:
        # Filter by account if specified
        if account and entry.get("account") != account:
            continue

        # Exact duplicate
        if entry["hash"] == new_hash:
            return False, "EXACT_DUPLICATE", [entry]

        # Fuzzy match
        sim = similarity(text, entry["text"])
        if sim >= SIMILARITY_THRESHOLD:
            matches.append({"entry": entry, "similarity": round(sim, 3), "type": "fuzzy"})

        # Keyword overlap
        kw_ovlp = keyword_overlap(text, entry["text"])
        if kw_ovlp >= KEYWORD_OVERLAP_THRESHOLD and sim >= 0.60:
            matches.append({"entry": entry, "overlap": round(kw_ovlp, 3), "type": "keyword"})

    if matches:
        return False, "NEAR_DUPLICATE", matches

    return True, "FRESH", []

def log_post(text, account="unknown"):
    """Log a published post to history."""
    history = load_history()
    entry = {
        "text": text,
        "hash": text_hash(text),
        "account": account,
        "published_at": datetime.now().isoformat(),
    }
    history["posts"].append(entry)
    save_history(history)
    return entry

def log_rejection(text, reason, matches):
    """Log a rejected post."""
    with open(REJECTED_LOG, "a") as f:
        f.write(f"\n--- {datetime.now().isoformat()} ---\n")
        f.write(f"REJECTED: {reason}\n")
        f.write(f"TEXT: {text[:200]}\n")
        for m in matches[:3]:
            if "entry" in m:
                f.write(f"  MATCH: {m['entry']['text'][:200]} ({m.get('type','?')} {m.get('similarity', m.get('overlap',''))})\n")

def stats():
    history = load_history()
    total = len(history["posts"])
    accounts = {}
    for p in history["posts"]:
        acct = p.get("account", "unknown")
        accounts[acct] = accounts.get(acct, 0) + 1
    return {"total_posts": total, "by_account": accounts}

def purge(older_than_days=90):
    history = load_history()
    cutoff = (datetime.now() - timedelta(days=older_than_days)).isoformat()
    before = len(history["posts"])
    history["posts"] = [p for p in history["posts"] if p.get("published_at", "") >= cutoff]
    save_history(history)
    return {"purged": before - len(history["posts"]), "remaining": len(history["posts"])}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: watchdog.py [check|log|stats|purge] ...")
        sys.exit(1)

    cmd = sys.argv[1]

    if cmd == "check":
        text = sys.argv[2] if len(sys.argv) > 2 else ""
        account = None
        if "--account" in sys.argv:
            account = sys.argv[sys.argv.index("--account") + 1]
        ok, reason, matches = check_post(text, account)
        if ok:
            print(f"✅ FRESH — ok to post")
        else:
            print(f"🚫 {reason}")
            for m in matches[:3]:
                e = m.get("entry", {})
                print(f"   ↳ {m.get('type','?')}: \"{e.get('text','')[:100]}...\" ({m.get('similarity', m.get('overlap',''))})")
            log_rejection(text, reason, matches)
        sys.exit(0 if ok else 1)

    elif cmd == "log":
        text = sys.argv[2] if len(sys.argv) > 2 else ""
        account = "unknown"
        if "--account" in sys.argv:
            account = sys.argv[sys.argv.index("--account") + 1]
        entry = log_post(text, account)
        print(f"✅ Logged: {account} — {entry['hash'][:12]}...")

    elif cmd == "stats":
        s = stats()
        print(f"📊 Total published: {s['total_posts']}")
        for acct, count in s["by_account"].items():
            print(f"   {acct}: {count}")

    elif cmd == "purge":
        days = 90
        if "--older-than" in sys.argv:
            days = int(sys.argv[sys.argv.index("--older-than") + 1])
        result = purge(days)
        print(f"🗑 Purged {result['purged']} posts older than {days}d. Remaining: {result['remaining']}")

    else:
        print(f"Unknown command: {cmd}")
        sys.exit(1)
