#!/bin/bash

# Set text colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================"
echo -e "Starting Eigent Development Environment"
echo -e "========================================${NC}"

# Get the root directory of the project
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to kill process on a port
kill_port() {
    local port=$1
    local pid=$(lsof -t -i:$port)
    if [ -n "$pid" ]; then
        echo -e "${YELLOW}Killing process on port $port (PID: $pid)...${NC}"
        kill -9 $pid
    fi
}

echo -e "${BLUE}Cleaning up existing processes...${NC}"
kill_port 3001
kill_port 5001
kill_port 5173

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Stopping all services...${NC}"
    # Kill background processes started by this script
    kill $(jobs -p) 2>/dev/null
    exit
}

trap cleanup EXIT

# Start frontend dev server
echo -e "${YELLOW}Starting frontend dev server...${NC}"
npm run dev &
FRONTEND_PID=$!

# Wait a bit for frontend to start
sleep 2

# Start backend server
echo -e "${YELLOW}Starting backend server on port 5001...${NC}"
cd "$ROOT_DIR/backend" && uv run uvicorn main:api --port 5001 &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 2

# Check if PostgreSQL is running
echo -e "${BLUE}Checking PostgreSQL connectivity...${NC}"
if ! pg_isready -h localhost -p 5432 -U root -d eigent; then
    echo -e "${RED}PostgreSQL is not running on localhost:5432. Please start it.${NC}"
    exit 1
fi
echo -e "${GREEN}PostgreSQL is ready.${NC}"

# Run database migrations for server
echo -e "${YELLOW}Running database migrations for server...${NC}"
cd "$ROOT_DIR/server"
if ! uv run alembic upgrade head; then
    echo -e "${RED}Database migrations failed.${NC}"
    exit 1
fi

# Start server service on port 3001
echo -e "${YELLOW}Starting server service on port 3001...${NC}"
cd "$ROOT_DIR/server" && uv run uvicorn main:api --port 3001 --host 0.0.0.0 &
SERVER_PID=$!

echo -e "${GREEN}========================================${NC}"
echo -e "${CYAN}All services started:${NC}"
echo -e "${CYAN}- Frontend: http://localhost:5173${NC}"
echo -e "${CYAN}- Backend: http://localhost:5001${NC}"
echo -e "${CYAN}- Server: http://localhost:3001${NC}"
echo -e "${CYAN}Press Ctrl+C to stop all services${NC}"
echo -e "${GREEN}========================================${NC}"

# Wait for all processes
wait