#!/bin/bash
# Production Deployment Script for GoHomies
# Usage: ./deploy.sh production

set -e

ENVIRONMENT=${1:-staging}
DOCKER_REGISTRY=${DOCKER_REGISTRY:-""}

echo "========================================="
echo "Deploying GoHomies to $ENVIRONMENT"
echo "========================================="

# Check if .env exists
if [ ! -f ".env.$ENVIRONMENT" ]; then
    echo "ERROR: .env.$ENVIRONMENT file not found!"
    echo "Please copy .env.example to .env.$ENVIRONMENT and fill in values"
    exit 1
fi

# Load environment variables
set -a
source ".env.$ENVIRONMENT"
set +a

echo "✓ Environment variables loaded"

# Build Docker images
echo "Building Docker images..."
docker compose build --no-cache

echo "✓ Docker images built successfully"

# Tag images for registry (optional)
if [ -n "$DOCKER_REGISTRY" ]; then
    echo "Tagging images for registry..."
    docker tag gohomies-backend:latest "$DOCKER_REGISTRY/gohomies-backend:latest"
    docker tag gohomies-frontend:latest "$DOCKER_REGISTRY/gohomies-frontend:latest"
    docker tag gohomies-admin:latest "$DOCKER_REGISTRY/gohomies-admin:latest"
    
    echo "Pushing to registry..."
    docker push "$DOCKER_REGISTRY/gohomies-backend:latest"
    docker push "$DOCKER_REGISTRY/gohomies-frontend:latest"
    docker push "$DOCKER_REGISTRY/gohomies-admin:latest"
    
    echo "✓ Images pushed to registry"
fi

# Stop existing containers (if any)
echo "Stopping existing containers..."
docker compose down --remove-orphans 2>/dev/null || true

# Start services
echo "Starting services..."
docker compose up -d

# Wait for services to be healthy
echo "Waiting for services to be healthy..."
sleep 10

# Verify services are running
if docker compose ps | grep -q "healthy"; then
    echo "✓ Services are healthy"
else
    echo "⚠ Services may still be starting... check with 'docker compose logs'"
fi

# Display service URLs
echo ""
echo "========================================="
echo "Deployment Complete!"
echo "========================================="
echo "Backend:  http://localhost:${BACKEND_PORT:-8080}/api/actuator/health"
echo "Frontend: http://localhost:${FRONTEND_PORT:-3000}"
echo "Admin:    http://localhost:${ADMIN_PORT:-3001}"
echo ""
echo "View logs with: docker compose logs -f [service]"
echo "Stop services: docker compose down"
echo "========================================="
