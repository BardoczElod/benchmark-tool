#!/bin/bash

# Production deployment script for GMB-ECC Dashboard
# Usage: ./deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
COMPOSE_FILE="docker-compose.yml"

echo "🚀 Deploying GMB-ECC Dashboard to ${ENVIRONMENT}..."

# Check if docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file to configure your settings"
fi

# Pull latest changes if in git repo
if [ -d .git ]; then
    echo "📦 Pulling latest changes..."
    git pull
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build new image
echo "🔨 Building new image..."
docker-compose build --no-cache

# Start containers
echo "▶️  Starting containers..."
docker-compose up -d

# Wait for health check
echo "⏳ Waiting for application to be healthy..."
sleep 5

# Check container status
if docker-compose ps | grep -q "Up"; then
    echo "✅ Deployment successful!"
    echo ""
    echo "📊 Container status:"
    docker-compose ps
    echo ""
    echo "🌐 Application is running at:"
    echo "   http://localhost:$(grep HOST_PORT .env | cut -d '=' -f2 || echo '5173')"
    echo ""
    echo "📝 View logs with: docker-compose logs -f"
    echo "🔍 Check health: curl http://localhost:5173/health"
else
    echo "❌ Deployment failed. Check logs with: docker-compose logs"
    exit 1
fi
