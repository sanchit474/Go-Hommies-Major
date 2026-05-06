#!/bin/bash
# Health check script for GoHomies services
# Run periodically (e.g., every 5 minutes) to monitor application health

set -e

BACKEND_URL="${BACKEND_URL:-http://localhost:8080}"
FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}"
ADMIN_URL="${ADMIN_URL:-http://localhost:3001}"
TIMEOUT=10

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check service
check_service() {
    local name=$1
    local url=$2
    local endpoint=$3
    
    if [ "$name" = "backend" ]; then
        url="${url}/api${endpoint}"
    else
        url="${url}${endpoint}"
    fi
    
    echo -n "Checking $name... "
    
    if curl -sf --max-time $TIMEOUT "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC}"
        return 0
    else
        echo -e "${RED}✗${NC}"
        return 1
    fi
}

# Check all services
echo "GoHomies Health Check - $(date)"
echo "================================"

failed=0

check_service "backend" "$BACKEND_URL" "/actuator/health" || failed=$((failed + 1))
check_service "frontend" "$FRONTEND_URL" "/" || failed=$((failed + 1))
check_service "admin" "$ADMIN_URL" "/" || failed=$((failed + 1))

echo "================================"

if [ $failed -eq 0 ]; then
    echo -e "${GREEN}All services healthy!${NC}"
    exit 0
else
    echo -e "${RED}$failed service(s) unhealthy${NC}"
    exit 1
fi
