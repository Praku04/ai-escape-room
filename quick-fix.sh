#!/bin/bash

# Quick fix script for AI Escape Room deployment issues

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}AI Escape Room - Quick Fix${NC}"
echo ""

# Get current directory
PROJECT_DIR="$(pwd)"

echo -e "${YELLOW}Working in: $PROJECT_DIR${NC}"
echo ""

# Step 1: Disable firewall if enabled
echo -e "${YELLOW}[1/5] Disabling firewall...${NC}"
sudo ufw disable || true
echo -e "${GREEN}✓ Firewall disabled${NC}"
echo ""

# Step 2: Create .env file
echo -e "${YELLOW}[2/5] Setting up .env file...${NC}"
if [ ! -f .env ]; then
    cp .env.example .env
    sed -i 's/NODE_ENV=development/NODE_ENV=production/' .env
    sed -i 's|DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_escape_room"|DATABASE_URL="postgresql://postgres:postgres@postgres:5432/ai_escape_room"|' .env
    sed -i 's|REDIS_URL="redis://localhost:6379"|REDIS_URL="redis://redis:6379"|' .env
    echo -e "${GREEN}✓ .env file created${NC}"
else
    echo -e "${GREEN}✓ .env file exists${NC}"
fi
echo ""

# Step 3: Install Node.js if not installed
echo -e "${YELLOW}[3/5] Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
    echo -e "${GREEN}✓ Node.js installed${NC}"
else
    echo -e "${GREEN}✓ Node.js already installed${NC}"
fi
echo ""

# Step 4: Generate package-lock.json
echo -e "${YELLOW}[4/5] Generating package-lock.json...${NC}"
npm install --package-lock-only
echo -e "${GREEN}✓ package-lock.json generated${NC}"
echo ""

# Step 5: Build and start with Docker
echo -e "${YELLOW}[5/5] Building and starting application...${NC}"

# Stop any running containers
docker-compose down 2>/dev/null || true

# Build and start
docker-compose build
docker-compose up -d

# Wait for services
sleep 10

# Check status
if [ "$(docker-compose ps -q 2>/dev/null)" ]; then
    echo -e "${GREEN}✓ Application started successfully!${NC}"
else
    echo -e "${RED}✗ Failed to start application${NC}"
    echo "Check logs with: docker-compose logs"
    exit 1
fi

echo ""
echo -e "${CYAN}========================================${NC}"
echo -e "${GREEN}Setup Complete!${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "1. Edit .env file: ${GREEN}nano .env${NC}"
echo -e "2. Update ${YELLOW}GEMINI_API_KEY${NC} with your API key"
echo -e "3. Restart: ${GREEN}docker-compose restart${NC}"
echo ""

# Get server IP
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')
echo -e "Access your app at: ${GREEN}http://$SERVER_IP:3000${NC}"
echo ""
