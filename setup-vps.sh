#!/bin/bash

# =====================================================
# AI Escape Room - VPS Setup Script
# =====================================================
# This script installs all dependencies and sets up the application
# Run on Ubuntu 20.04+ or Debian 11+

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================"
echo -e "AI Escape Room - VPS Setup"
echo -e "========================================${NC}"
echo ""

# Get current directory as project directory
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ACTUAL_USER=$USER

echo -e "${CYAN}Installing in: $PROJECT_DIR${NC}"
echo -e "${CYAN}Running as user: $ACTUAL_USER${NC}"
echo ""

echo -e "${YELLOW}[1/7] Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y
echo -e "${GREEN}✓ System updated${NC}"
echo ""

echo -e "${YELLOW}[2/7] Installing required packages...${NC}"
sudo apt install -y curl wget git nano net-tools
echo -e "${GREEN}✓ Base packages installed${NC}"
echo ""

echo -e "${YELLOW}[3/7] Installing Docker...${NC}"
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o /tmp/get-docker.sh
    sudo sh /tmp/get-docker.sh
    rm /tmp/get-docker.sh
    
    # Add user to docker group
    sudo usermod -aG docker $ACTUAL_USER
    
    # Start and enable Docker
    sudo systemctl enable docker
    sudo systemctl start docker
    
    echo -e "${GREEN}✓ Docker installed successfully${NC}"
else
    echo -e "${GREEN}✓ Docker already installed${NC}"
fi
echo ""

echo -e "${YELLOW}[4/7] Installing Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose..."
    sudo apt install -y docker-compose
    echo -e "${GREEN}✓ Docker Compose installed successfully${NC}"
else
    echo -e "${GREEN}✓ Docker Compose already installed${NC}"
fi

echo -e "${CYAN}Note: Firewall management skipped - please configure via your VPS provider's control panel${NC}"
echo ""

echo -e "${YELLOW}[5/7] Setting up environment file...${NC}"
cd $PROJECT_DIR

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    
    # Update .env with production values
    sed -i 's/NODE_ENV=development/NODE_ENV=production/' .env
    sed -i 's|DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_escape_room"|DATABASE_URL="postgresql://postgres:postgres@postgres:5432/ai_escape_room"|' .env
    sed -i 's|REDIS_URL="redis://localhost:6379"|REDIS_URL="redis://redis:6379"|' .env
    
    echo -e "${GREEN}✓ Environment file created${NC}"
    echo -e "${YELLOW}⚠ IMPORTANT: You must update GEMINI_API_KEY in $PROJECT_DIR/.env${NC}"
else
    echo -e "${GREEN}✓ Environment file already exists${NC}"
fi
echo ""

echo -e "${YELLOW}[6/7] Generating package-lock.json...${NC}"
cd $PROJECT_DIR
npm install --package-lock-only
echo -e "${GREEN}✓ package-lock.json generated${NC}"
echo ""

echo -e "${YELLOW}[7/7] Building and starting Docker containers...${NC}"
cd $PROJECT_DIR

# Stop any running containers
if [ "$(docker-compose ps -q 2>/dev/null)" ]; then
    echo "Stopping existing containers..."
    docker-compose down
fi

# Build and start containers
echo "Building application (this may take a few minutes)..."
docker-compose build

echo "Starting services..."
docker-compose up -d

# Wait for services to be healthy
echo "Waiting for services to start..."
sleep 10

# Check if containers are running
if [ "$(docker-compose ps -q 2>/dev/null)" ]; then
    echo -e "${GREEN}✓ All services started successfully${NC}"
else
    echo -e "${RED}✗ Failed to start services${NC}"
    echo "Check logs with: docker-compose logs"
    exit 1
fi
echo ""

# Get server IP
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')

echo -e "${GREEN}✓ Setup complete${NC}"
echo ""

echo -e "${CYAN}========================================"
echo -e "Installation Complete!"
echo -e "========================================${NC}"
echo ""
echo -e "${YELLOW}IMPORTANT - Next Steps:${NC}"
echo -e "${CYAN}1.${NC} Edit the environment file:"
echo -e "   ${GREEN}nano $PROJECT_DIR/.env${NC}"
echo ""
echo -e "${CYAN}2.${NC} Update these variables:"
echo -e "   ${YELLOW}GEMINI_API_KEY=${NC}your_actual_api_key_here"
echo -e "   Get your key from: ${GREEN}https://makersuite.google.com/app/apikey${NC}"
echo ""
echo -e "${CYAN}3.${NC} Restart the application:"
echo -e "   ${GREEN}cd $PROJECT_DIR && docker-compose restart${NC}"
echo ""
echo -e "${CYAN}========================================"
echo -e "Useful Commands:"
echo -e "========================================${NC}"
echo -e "View logs:           ${GREEN}docker-compose logs -f app${NC}"
echo -e "Restart services:    ${GREEN}docker-compose restart${NC}"
echo -e "Stop services:       ${GREEN}docker-compose down${NC}"
echo -e "Start services:      ${GREEN}docker-compose up -d${NC}"
echo -e "Check status:        ${GREEN}docker-compose ps${NC}"
echo ""
echo -e "${CYAN}========================================"
echo -e "Access Your Application:"
echo -e "========================================${NC}"
echo -e "Local:               ${GREEN}http://localhost:3000${NC}"
echo -e "Remote:              ${GREEN}http://$SERVER_IP:3000${NC}"
echo ""
echo -e "${YELLOW}Note:${NC} The application won't work properly until you add your Gemini API key!"
echo ""
