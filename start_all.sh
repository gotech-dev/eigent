#!/bin/bash

# Set text colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================"
echo -e "Starting Eigent Development Environment"
echo -e "========================================${NC}"

# Function to cleanup on exit
cleanup() {
    echo -e "${YELLOW}Stopping all services...${NC}"
    kill 0
}

trap cleanup EXIT

# Start frontend dev server
echo -e "${YELLOW}Starting frontend dev server...${NC}"
npm run dev &
FRONTEND_PID=$!

# Wait a bit for frontend to start
sleep 2

# Start backend server (without --reload to avoid memory issues)
echo -e "${YELLOW}Starting backend server on port 5001...${NC}"
cd backend && uv run uvicorn main:api --port 5001 &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 2

# Start server service on port 3001
echo -e "${YELLOW}Starting server service on port 3001...${NC}"
cd ../server && uv run uvicorn main:api --port 3001 --host 0.0.0.0 &
SERVER_PID=$!

echo -e "${GREEN}========================================${NC}"
echo -e "${CYAN}All services started:${NC}"
echo -e "${CYAN}- Frontend: http://localhost:7777 (VITE_DEV_SERVER_URL)${NC}"
echo -e "${CYAN}- Backend: http://localhost:5001${NC}"
echo -e "${CYAN}- Server: http://localhost:3001${NC}"
echo -e "${CYAN}Press Ctrl+C to stop all services${NC}"
echo -e "${GREEN}========================================${NC}"

# Wait for all processes
wait