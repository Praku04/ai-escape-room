# 🚀 VPS Deployment Guide - AI Escape Room

This guide will walk you through deploying the AI Escape Room application on a Virtual Private Server (VPS).

---

## 📋 Prerequisites

### What You Need:
- A VPS with at least **2GB RAM** and **20GB storage** (recommended: 4GB RAM for 500 players)
- Ubuntu 20.04+ or Debian 11+ (this guide uses Ubuntu)
- SSH access to your VPS
- A domain name (optional but recommended)
- Gemini API key (from [Google AI Studio](https://makersuite.google.com/app/apikey))

---

## 🛠️ Method 1: Docker Deployment (Recommended - Easiest)

### Step 1: Connect to Your VPS
```bash
ssh root@your-vps-ip
# or
ssh username@your-vps-ip
```

### Step 2: Install Docker and Docker Compose
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose -y

# Verify installations
docker --version
docker-compose --version

# Add your user to docker group (optional, avoids using sudo)
sudo usermod -aG docker $USER
# Log out and back in for this to take effect
```

### Step 3: Upload Your Application
Choose one of these methods:

#### Option A: Using Git (Recommended)
```bash
# Install git if not already installed
sudo apt install git -y

# Clone your repository
cd /opt
sudo git clone https://github.com/yourusername/ai-escape-room.git
cd ai-escape-room
```

#### Option B: Using SCP from your local machine
```bash
# From your local Windows machine (PowerShell)
cd C:\Users\ranja\Downloads\ai-escape-room
scp -r . username@your-vps-ip:/opt/ai-escape-room
```

#### Option C: Using SFTP client (FileZilla, WinSCP)
- Use FileZilla or WinSCP to upload the folder to `/opt/ai-escape-room`

### Step 4: Configure Environment Variables
```bash
cd /opt/ai-escape-room

# Create .env file from example
cp .env.example .env

# Edit the .env file
nano .env
```

**Important: Update these values in `.env`:**
```env
NODE_ENV=production
PORT=3000

# Database & Cache (keep these as is for Docker)
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/ai_escape_room"
REDIS_URL="redis://redis:6379"

# AI Provider - ADD YOUR ACTUAL API KEY HERE
AI_PROVIDER=gemini
GEMINI_API_KEY=your_actual_gemini_api_key_here
OPENAI_API_KEY=

# Game Configuration
MAX_PLAYERS_PER_ROOM=500
DEFAULT_STORIES=3
DEFAULT_STORY_TIME_SECONDS=120
DEFAULT_DIFFICULTY=medium
RATE_LIMIT_PROMPTS=10
```

**To get a Gemini API Key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key and paste it in your `.env` file

Press `Ctrl+X`, then `Y`, then `Enter` to save and exit nano.

### Step 5: Build and Start the Application
```bash
# Build and start all services
sudo docker-compose up -d --build

# Check if containers are running
sudo docker-compose ps

# View logs (optional)
sudo docker-compose logs -f app
```

### Step 6: Configure Firewall
```bash
# Allow SSH (if not already allowed)
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow port 3000 (or use nginx reverse proxy - see below)
sudo ufw allow 3000/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### Step 7: Test Your Deployment
Open your browser and visit:
- `http://your-vps-ip:3000`

You should see the AI Escape Room application!

---

## 🌐 Method 2: Setting Up with Nginx Reverse Proxy (Production Setup)

This allows you to access the app via a domain name with SSL (HTTPS).

### Step 1: Install Nginx
```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

### Step 2: Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/ai-escape-room
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket support for Socket.IO
    location /socket.io/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/ai-escape-room /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 3: Install SSL Certificate (Free with Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Follow the prompts and choose to redirect HTTP to HTTPS
```

Now access your app at: `https://your-domain.com`

---

## 🔧 Method 3: Manual Deployment (Without Docker)

If you prefer not to use Docker:

### Step 1: Install Node.js
```bash
# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

### Step 2: Install PostgreSQL
```bash
sudo apt install postgresql postgresql-contrib -y
sudo systemctl enable postgresql
sudo systemctl start postgresql

# Create database
sudo -u postgres psql
```

In PostgreSQL shell:
```sql
CREATE DATABASE ai_escape_room;
CREATE USER postgres WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE ai_escape_room TO postgres;
\q
```

### Step 3: Install Redis
```bash
sudo apt install redis-server -y
sudo systemctl enable redis-server
sudo systemctl start redis-server
```

### Step 4: Setup Application
```bash
cd /opt/ai-escape-room

# Install dependencies (choose one)
npm install
# or if you have Bun installed
bun install

# Create .env file
cp .env.example .env
nano .env
```

Update `.env`:
```env
NODE_ENV=production
PORT=3000
DATABASE_URL="postgresql://postgres:your_secure_password@localhost:5432/ai_escape_room"
REDIS_URL="redis://localhost:6379"
GEMINI_API_KEY=your_actual_api_key_here
AI_PROVIDER=gemini
```

### Step 5: Build and Start
```bash
# Build the application
npm run build

# Start the application
npm start
```

### Step 6: Setup PM2 for Process Management
```bash
# Install PM2
sudo npm install -g pm2

# Start application with PM2
pm2 start dist/server.cjs --name ai-escape-room

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Run the command that PM2 outputs

# Monitor application
pm2 monit
pm2 logs ai-escape-room
```

---

## 📊 Useful Commands

### Docker Commands:
```bash
# View logs
sudo docker-compose logs -f app

# Restart services
sudo docker-compose restart

# Stop services
sudo docker-compose down

# Rebuild after code changes
sudo docker-compose up -d --build

# Check resource usage
sudo docker stats

# Access database
sudo docker-compose exec postgres psql -U postgres -d ai_escape_room
```

### PM2 Commands (Manual deployment):
```bash
# View logs
pm2 logs ai-escape-room

# Restart application
pm2 restart ai-escape-room

# Stop application
pm2 stop ai-escape-room

# Monitor resources
pm2 monit

# View process list
pm2 list
```

---

## 🔒 Security Best Practices

### 1. Change Default Passwords
Update PostgreSQL password in production:
```bash
sudo docker-compose down
# Update DATABASE_URL in .env with a strong password
# Update docker-compose.yml postgres password
sudo docker-compose up -d
```

### 2. Setup Firewall (UFW)
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 3. Keep System Updated
```bash
sudo apt update && sudo apt upgrade -y
```

### 4. Secure SSH
```bash
sudo nano /etc/ssh/sshd_config
```
Set:
- `PermitRootLogin no`
- `PasswordAuthentication no` (after setting up SSH keys)

---

## 🐛 Troubleshooting

### Application won't start:
```bash
# Check logs
sudo docker-compose logs app

# Check if ports are in use
sudo netstat -tulpn | grep 3000
```

### Database connection issues:
```bash
# Check if PostgreSQL is running
sudo docker-compose ps postgres

# Check database logs
sudo docker-compose logs postgres
```

### Out of memory:
```bash
# Check memory usage
free -h

# Add swap space (if needed)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Can't access from browser:
1. Check firewall: `sudo ufw status`
2. Check if app is listening: `sudo netstat -tulpn | grep 3000`
3. Check Docker logs: `sudo docker-compose logs app`

---

## 📈 Performance Optimization for 500 Players

### 1. Increase System Resources
- Minimum: 4GB RAM, 2 CPU cores
- Recommended: 8GB RAM, 4 CPU cores for 500 concurrent players

### 2. Database Optimization
Add to `docker-compose.yml` under postgres service:
```yaml
command: postgres -c max_connections=500 -c shared_buffers=256MB
```

### 3. Redis Optimization
Add to `docker-compose.yml` under redis service:
```yaml
command: redis-server --maxmemory 512mb --maxmemory-policy allkeys-lru
```

### 4. Node.js Optimization
Update `.env`:
```env
NODE_OPTIONS="--max-old-space-size=4096"
```

---

## 🔄 Updating Your Application

### With Docker:
```bash
cd /opt/ai-escape-room
git pull origin main  # or your branch
sudo docker-compose down
sudo docker-compose up -d --build
```

### With PM2:
```bash
cd /opt/ai-escape-room
git pull origin main
npm run build
pm2 restart ai-escape-room
```

---

## 📞 Support

If you encounter issues:
1. Check the logs first
2. Verify environment variables are correct
3. Ensure all services are running
4. Check firewall settings
5. Verify API keys are valid

---

**That's it! Your AI Escape Room should now be running on your VPS! 🎉**
