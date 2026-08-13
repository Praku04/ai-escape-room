#!/bin/bash

# =====================================================
# AI Escape Room - Deploy to VPS Script (Bash)
# =====================================================
# This script uploads your project to VPS and initiates deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Check arguments
if [ $# -lt 2 ]; then
    echo -e "${RED}Usage: $0 <VPS_IP> <VPS_USER> [SSH_KEY_PATH] [INSTALL_DIR]${NC}"
    echo ""
    echo "Examples:"
    echo "  $0 142.93.123.45 root"
    echo "  $0 142.93.123.45 ubuntu ~/.ssh/my-key.pem"
    echo "  $0 142.93.123.45 root \"\" ~/my-app"
    exit 1
fi

VPS_IP=$1
VPS_USER=$2
SSH_KEY_PATH=${3:-""}
INSTALL_DIR=${4:-"/home/$VPS_USER/ai-escape-room"}

echo -e "${CYAN}========================================"
echo -e "AI Escape Room - VPS Deployment"
echo -e "========================================${NC}"
echo ""

# Get the script directory (project root)
PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo -e "${YELLOW}[1/5] Checking prerequisites...${NC}"

# Check if SCP is available
if ! command -v scp &> /dev/null; then
    echo -e "${RED}✗ SCP not found. Please install openssh-client.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ SCP found${NC}"

# Check if SSH is available
if ! command -v ssh &> /dev/null; then
    echo -e "${RED}✗ SSH not found. Please install openssh-client.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ SSH found${NC}"

echo ""
echo -e "${YELLOW}[2/5] Preparing files for upload...${NC}"

# Create temporary directory for deployment files
TEMP_DEPLOY="/tmp/ai-escape-room-deploy-$$"
mkdir -p "$TEMP_DEPLOY"

# Copy necessary files (exclude node_modules, dist, etc.)
rsync -a --exclude='node_modules' \
         --exclude='dist' \
         --exclude='.git' \
         --exclude='bun.lock' \
         "$PROJECT_ROOT/" "$TEMP_DEPLOY/"

echo -e "${GREEN}✓ Files prepared${NC}"

echo ""
echo -e "${YELLOW}[3/5] Uploading files to VPS...${NC}"
echo -e "${CYAN}Target: $VPS_USER@$VPS_IP:$INSTALL_DIR${NC}"

# Build SSH/SCP options
SSH_OPTS="-o StrictHostKeyChecking=no"
if [ -n "$SSH_KEY_PATH" ]; then
    SSH_OPTS="$SSH_OPTS -i $SSH_KEY_PATH"
fi

# Upload to temp location first
scp $SSH_OPTS -r "$TEMP_DEPLOY"/* "$VPS_USER@$VPS_IP:/tmp/ai-escape-room-upload"

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Upload failed${NC}"
    rm -rf "$TEMP_DEPLOY"
    exit 1
fi

echo -e "${GREEN}✓ Files uploaded successfully${NC}"

echo ""
echo -e "${YELLOW}[4/5] Moving files and setting permissions on VPS...${NC}"

# Move files to installation directory
ssh $SSH_OPTS "$VPS_USER@$VPS_IP" << EOF
    mkdir -p $INSTALL_DIR
    rm -rf $INSTALL_DIR/*
    mv /tmp/ai-escape-room-upload/* $INSTALL_DIR/
    chmod +x $INSTALL_DIR/setup-vps.sh
    rm -rf /tmp/ai-escape-room-upload
EOF

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Failed to setup files on VPS${NC}"
    rm -rf "$TEMP_DEPLOY"
    exit 1
fi

echo -e "${GREEN}✓ Files moved to $INSTALL_DIR${NC}"

echo ""
echo -e "${YELLOW}[5/5] Running installation script on VPS...${NC}"
echo ""

# Run the setup script on VPS
ssh $SSH_OPTS "$VPS_USER@$VPS_IP" "cd $INSTALL_DIR && bash setup-vps.sh"

echo ""
echo -e "${CYAN}========================================"
echo -e "Deployment Complete!"
echo -e "========================================${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "${CYAN}1.${NC} SSH into your VPS: ${GREEN}ssh $VPS_USER@$VPS_IP${NC}"
echo -e "${CYAN}2.${NC} Edit the .env file: ${GREEN}nano $INSTALL_DIR/.env${NC}"
echo -e "${CYAN}3.${NC} Add your Gemini API key to ${YELLOW}GEMINI_API_KEY${NC} variable"
echo -e "${CYAN}4.${NC} Restart the application: ${GREEN}cd $INSTALL_DIR && docker-compose restart${NC}"
echo ""
echo -e "${CYAN}Access your app at: ${GREEN}http://$VPS_IP:3000${NC}"
echo ""

# Cleanup
rm -rf "$TEMP_DEPLOY"
