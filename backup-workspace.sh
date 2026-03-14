#!/bin/bash
# Milo Workspace Backup Script
# Usage: ./backup-workspace.sh "Your change message"

set -e

cd /Users/alfredoalvarez/.openclaw/workspace

# Check for changes
if [ -z "$(git status --short)" ]; then
    echo "No changes to commit"
    exit 0
fi

# Stage all changes
git add -A

# Get current version from CHANGELOG
CURRENT_VERSION=$(grep -oP '## \[\K[^\]]+' CHANGELOG.md | head -1)
BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Create commit message with version
COMMIT_MSG="${1:-Update workspace}"

# Commit
git commit -m "$COMMIT_MSG" -m "Version: $CURRENT_VERSION" -m "[$BRANCH]"

# Push to GitHub
git push origin "$BRANCH:main" 2>/dev/null || git push origin main

echo "✅ Backed up to https://github.com/Milo-2026/Milo-Workspace"
echo "📝 Version: $CURRENT_VERSION"