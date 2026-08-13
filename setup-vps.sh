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

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run with sudo: sudo bash setup-vps.sh${NC}"
    exit 1
fi

# Get the actual user (not root when using sudo)
ACTUAL_USER=${SUDO_USER:-$USER}
PROJECT_DIR="/opt/ai-escape-room"

echo -e "${YELLOW}[1/8] Updating system packages...${NC}"
apt update && apt upgrade -y
echo -e "${GREEN}✓ System updated${NC}"
echo ""

echo -e "${YELLOW}[2/8] Installing required packages...${NC}"
apt install -y curl wget git ufw nano net-tools
echo -e "${GREEN}✓ Base packages installed${NC}"
echo ""

echo -e "${YELLOW}[3/8] Installing Docker...${NC}"
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o /tmp/get-docker.sh
    sh /tmp/get-docker.sh
    rm /tmp/get-docker.sh
    
    # Add user to docker group
    usermod -aG docker $ACTUAL_USER
    
    # Start and enable Docker
    systemctl enable docker
    systemctl start docker
    
    echo -e "${GREEN}✓ Docker installed successfully${NC}"
else
    echo -e "${GREEN}✓ Docker already installed${NC}"
fi
echo ""

echo -e "${YELLOW}[4/8] Installing Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose..."
    apt install -y docker-compose
    echo -e "${GREEN}✓ Docker Compose installed successfully${NC}"
else
    echo -e "${GREEN}✓ Docker Compose already installed${NC}"
fi
echo ""

echo -e "${YELLOW}[5/8] Setting up firewall (UFW)...${NC}"
# Configure firewall
ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw allow 3000/tcp comment 'AI Escape Room'
echo -e "${GREEN}✓ Firewall configured${NC}"
echo ""

echo -e "${YELLOW}[6/8] Setting up environment file...${NC}"
cd $PROJECT_DIR

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    
    # Update .env with production values
    sed -i 's/NODE_ENV=development/NODE_ENV=production/' .env
    sed -i 's|DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_escape_room"|DATABASE_URL="postgresql://postgres:postgres@postgres:5432/ai_escape_room"|' .env
    sed -i 's|REDIS_URL="redis://localhost:6379"|REDIS_URL="redis://redis:6379"|' .env
    
    echo -e "${GREEN}✓ Environment file created${NC}"
    echo -e "${YELLOW}⚠ IMPORTANT: You must update GEMINI_API_KEY in /opt/ai-escape-room/.env${NC}"
else
    echo -e "${GREEN}✓ Environment file already exists${NC}"
fi
echo ""

echo -e "${YELLOW}[7/8] Building and starting Docker containers...${NC}"
cd $PROJECT_DIR

# Stop any running containers
if [ "$(docker-compose ps -q)" ]; then
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
if [ "$(docker-compose ps -q)" ]; then
    echo -e "${GREEN}✓ All services started successfully${NC}"
else
    echo -e "${RED}✗ Failed to start services${NC}"
    echo "Check logs with: docker-compose logs"
    exit 1
fi
echo ""

echo -e "${YELLOW}[8/8] Final setup steps...${NC}"

# Set correct permissions
chown -R $ACTUAL_USER:$ACTUAL_USER $PROJECT_DIR

# Get server IP
SERVER_IP=$(curl -s ifconfig.me || hostname -I | awk '{print $1}')

echo -e "${GREEN}✓ Setup complete${NC}"
echo ""

echo -e "${CYAN}========================================"
echo -e "Installation Complete!"
echo -e "========================================${NC}"
echo ""
echo -e "${YELLOW}IMPORTANT - Next Steps:${NC}"
echo -e "${CYAN}1.${NC} Edit the environment file:"
echo -e "   ${GREEN}sudo nano /opt/ai-escape-room/.env${NC}"
echo ""
echo -e "${CYAN}2.${NC} Update these variables:"
echo -e "   ${YELLOW}GEMINI_API_KEY=${NC}your_actual_api_key_here"
echo -e "   Get your key from: ${GREEN}https://makersuite.google.com/app/apikey${NC}"
echo ""
echo -e "${CYAN}3.${NC} Restart the application:"
echo -e "   ${GREEN}cd /opt/ai-escape-room && sudo docker-compose restart${NC}"
echo ""
echo -e "${CYAN}========================================"
echo -e "Useful Commands:"
echo -e "========================================${NC}"
echo -e "View logs:           ${GREEN}sudo docker-compose logs -f app${NC}"
echo -e "Restart services:    ${GREEN}sudo docker-compose restart${NC}"
echo -e "Stop services:       ${GREEN}sudo docker-compose down${NC}"
echo -e "Start services:      ${GREEN}sudo docker-compose up -d${NC}"
echo -e "Check status:        ${GREEN}sudo docker-compose ps${NC}"
echo ""
echo -e "${CYAN}========================================"
echo -e "Access Your Application:"
echo -e "========================================${NC}"
echo -e "Local:               ${GREEN}http://localhost:3000${NC}"
echo -e "Remote:              ${GREEN}http://$SERVER_IP:3000${NC}"
echo ""
echo -e "${YELLOW}Note:${NC} The application won't work properly until you add your Gemini API key!"
echo ""
