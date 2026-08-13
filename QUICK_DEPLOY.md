# 🚀 Quick Deployment Guide - 5 Minutes Setup

This guide will get your AI Escape Room running on a VPS in just a few steps.

---

## 📋 What You Need

1. A VPS with Ubuntu 20.04+ (minimum 2GB RAM)
2. SSH access to your VPS (IP address, username, and password or SSH key)
3. A Gemini API key (get it from: https://makersuite.google.com/app/apikey)

---

## 🎯 Automated Deployment with Bash Script (EASIEST)

### Step 1: Make the script executable
```bash
chmod +x deploy-to-vps.sh
```

### Step 2: Run the deployment script
```bash
# Basic usage (password authentication):
./deploy-to-vps.sh your.vps.ip.address root

# With SSH key:
./deploy-to-vps.sh your.vps.ip.address root ~/.ssh/my-key.pem

# With custom installation directory:
./deploy-to-vps.sh your.vps.ip.address ubuntu ~/.ssh/my-key.pem /home/ubuntu/my-app
```

**Example:**
```bash
./deploy-to-vps.sh 142.93.123.45 root
```

The script will:
- ✅ Upload all files to your VPS
- ✅ Install Docker and Docker Compose
- ✅ Create environment file
- ✅ Build and start all services (App, PostgreSQL, Redis)

**Time: ~5-10 minutes depending on your VPS speed**

### Step 3: Add your Gemini API key
SSH into your VPS:
```bash
ssh root@your.vps.ip.address
```

Edit the .env file:
```bash
nano ~/ai-escape-room/.env
```

Find this line:
```
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

Replace `your_actual_gemini_api_key_here` with your actual API key from https://makersuite.google.com/app/apikey

Press `Ctrl+X`, then `Y`, then `Enter` to save.

### Step 4: Restart the application
```bash
cd ~/ai-escape-room
docker-compose restart
```

### Step 5: Access your app! 🎉
Open your browser and go to:
```
http://your.vps.ip.address:3000
```

---

## 🎯 Manual Deployment on VPS

If you prefer to do it manually:

### Step 1: Connect to your VPS
```bash
ssh root@your.vps.ip.address
```

### Step 2: Upload the project
Use one of these methods:

**Option A: Using Git**
```bash
git clone https://github.com/yourusername/ai-escape-room.git ~/ai-escape-room
cd ~/ai-escape-room
```

**Option B: Using SCP from your local machine**
```bash
# From your local machine
scp -r /path/to/ai-escape-room root@your.vps.ip:/root/ai-escape-room
```

**Option C: Using rsync (recommended)**
```bash
# From your local machine
rsync -avz --exclude='node_modules' --exclude='.git' --exclude='dist' \
    /path/to/ai-escape-room/ root@your.vps.ip:~/ai-escape-room/
```

### Step 3: Run the setup script
```bash
cd ~/ai-escape-room
chmod +x setup-vps.sh
bash setup-vps.sh
```

This will automatically:
- ✅ Update system packages
- ✅ Install Docker and Docker Compose
- ✅ Create environment file
- ✅ Build and start all services

### Step 4: Add your Gemini API key
```bash
nano ~/ai-escape-room/.env
```

Update this line:
```
GEMINI_API_KEY=your_actual_api_key_here
```

Get your API key from: https://makersuite.google.com/app/apikey

Press `Ctrl+X`, then `Y`, then `Enter` to save.

### Step 5: Restart the application
```bash
cd ~/ai-escape-room
docker-compose restart
```

### Step 6: Done! 🎉
Visit: `http://your.vps.ip.address:3000`

---

## 🌐 (Optional) Setup Domain Name with SSL

If you have a domain name and want HTTPS:

### Step 1: Point your domain to VPS
In your domain registrar (GoDaddy, Namecheap, etc.), add an A record:
```
Type: A
Name: @
Value: your.vps.ip.address
TTL: 3600
```

Wait 5-10 minutes for DNS to propagate.

### Step 2: Install Nginx and SSL
SSH into your VPS and run:

```bash
# Install Nginx
sudo apt install -y nginx

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/ai-escape-room
```

Paste this configuration (replace `your-domain.com`):

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

Save with `Ctrl+X`, `Y`, `Enter`.

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/ai-escape-room /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Get free SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Follow the prompts and choose to redirect HTTP to HTTPS.

Now access your app at: `https://your-domain.com`

---

## 🔧 Useful Commands

### View application logs:
```bash
cd ~/ai-escape-room
docker-compose logs -f app
```
Press `Ctrl+C` to exit logs.

### Restart application:
```bash
cd ~/ai-escape-room
docker-compose restart
```

### Stop application:
```bash
cd ~/ai-escape-room
docker-compose down
```

### Start application:
```bash
cd ~/ai-escape-room
docker-compose up -d
```

### Check if services are running:
```bash
cd ~/ai-escape-room
docker-compose ps
```

### Update application after code changes:
```bash
cd ~/ai-escape-room
git pull origin main  # if using git
docker-compose down
docker-compose up -d --build
```

---

## 🐛 Troubleshooting

### Can't access the app?
1. Check if Docker containers are running:
   ```bash
   docker-compose ps
   ```

2. Check application logs:
   ```bash
   docker-compose logs app
   ```

3. Check if port 3000 is listening:
   ```bash
   netstat -tulpn | grep 3000
   ```

4. Check if your VPS provider has a firewall (Security Groups in AWS/DigitalOcean)
   - Make sure port 3000 is open in your VPS provider's control panel

### API not working?
1. Verify your Gemini API key is correct:
   ```bash
   nano ~/ai-escape-room/.env
   ```

2. Restart after changing .env:
   ```bash
   cd ~/ai-escape-room
   docker-compose restart
   ```

### Out of memory?
1. Check memory usage:
   ```bash
   free -h
   ```

2. Add swap space:
   ```bash
   sudo fallocate -l 2G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
   ```

### Docker permission denied?
If you get "permission denied" errors:
```bash
# Log out and log back in after setup to apply docker group membership
exit
# Then SSH back in
ssh root@your.vps.ip.address
```

---

## 📊 Testing with Multiple Players

Once your app is running:

1. Create a room as Host
2. In Host Lobby, click **"Add 20 Test Bots"** or **"Add 50 Test Bots"**
3. Watch the leaderboard update in real-time!
4. Test with up to 500 concurrent players

---

## 💡 Installation Directory Options

By default, the app installs to `~/ai-escape-room` (your home directory).

You can customize the installation directory:

```bash
# Install to a different location
./deploy-to-vps.sh your.vps.ip username ssh-key /custom/path
```

Examples:
```bash
# Install to /var/www/ai-escape-room
./deploy-to-vps.sh 142.93.123.45 root "" /var/www/ai-escape-room

# Install to user's home directory
./deploy-to-vps.sh 142.93.123.45 ubuntu ~/.ssh/key.pem /home/ubuntu/apps/ai-escape-room
```

---

## 🎉 That's It!

Your AI Escape Room is now live and ready for players!

**Need help?** Check the logs first:
```bash
docker-compose logs -f app
```

Most issues are related to:
- Missing or incorrect Gemini API key
- VPS provider firewall blocking port 3000
- Insufficient server resources (upgrade to 4GB RAM for 500 players)

---

**Enjoy your AI Escape Room! 🧩🚀**
