# HEARTBEAT.md

# Morning Report Check
# Every 30 minutes, check if there's a new report to send

REPORT_FILE=/Users/alfredoalvarez/.openclaw/logs/today_report.txt
LAST_SENT_FILE=/Users/alfredoalvarez/.openclaw/logs/last_report_sent.txt

if [ -f "$REPORT_FILE" ]; then
    LAST_SENT=""
    if [ -f "$LAST_SENT_FILE" ]; then
        LAST_SENT=$(cat "$LAST_SENT_FILE")
    fi
    
    CURRENT=$(date +%Y-%m-%d)
    
    if [ "$LAST_SENT" != "$CURRENT" ]; then
        # Report exists and hasn't been sent today - send it via message tool
        echo "Sending morning report for $CURRENT"
        # The OpenClaw session will pick up the report content and send it
    fi
fi