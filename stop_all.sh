#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Stopping all Eigent services...${NC}"

# Function to kill process on a port
kill_port() {
    local port=$1
    local pid=$(lsof -t -i:$port)
    if [ -n "$pid" ]; then
        echo -e "${YELLOW}Stopping service on port $port (PID: $pid)...${NC}"
        kill -9 $pid
        echo -e "${GREEN}Service on port $port stopped.${NC}"
    else
        echo -e "${YELLOW}No service found on port $port.${NC}"
    fi
}

# Stop frontend, backend, and server
kill_port 3001
kill_port 5001
kill_port 5173

echo -e "${GREEN}All services have been stopped.${NC}"