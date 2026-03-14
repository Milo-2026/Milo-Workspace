#!/bin/bash
# Mission Control Daemon - keeps the server running

DAEMON_PID=""
LOG_FILE="/Users/alfredoalvarez/.openclaw/workspace/dashboard/daemon.log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

get_pid() {
    ps aux | grep "node.*server.js" | grep -v grep | awk '{print $2}' | head -1
}

start_server() {
    local pid=$(get_pid)
    if [ -n "$pid" ]; then
        log "Server already running: PID $pid"
        return 0
    fi
    
    cd /Users/alfredoalvarez/.openclaw/workspace/dashboard
    node server.js >> server.log 2>&1 &
    pid=$!
    sleep 3
    
    if curl -s --connect-timeout 3 http://localhost:3333/api/heartbeat > /dev/null; then
        log "Server started: PID $pid"
        echo "$pid" > /Users/alfredoalvarez/.openclaw/workspace/dashboard/daemon.pid
        return 0
    else
        log "Server failed to start"
        return 1
    fi
}

stop_server() {
    local pid=$(get_pid)
    if [ -n "$pid" ]; then
        kill "$pid" 2>/dev/null
        log "Server stopped: PID $pid"
        rm -f /Users/alfredoalvarez/.openclaw/workspace/dashboard/daemon.pid
    fi
}

status_server() {
    local pid=$(get_pid)
    if [ -n "$pid" ]; then
        echo "Running: PID $pid"
        curl -s http://localhost:3333/api/heartbeat
    else
        echo "Not running"
    fi
}

case "$1" in
    start)
        start_server
        ;;
    stop)
        stop_server
        ;;
    restart)
        stop_server
        sleep 2
        start_server
        ;;
    status)
        status_server
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status}"
        ;;
esac
