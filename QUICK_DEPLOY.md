# 🚀 Quick Deployment Guide - 5 Minutes Setup

This guide will get your AI Escape Room running on a VPS in just a few steps.

---

## 📋 What You Need

1. A VPS with Ubuntu 20.04+ (minimum 2GB RAM)
2. SSH access to your VPS (IP address, username, and password or SSH key)
3. A Gemini API key (get it from: https://makersuite.google.com/app/apikey)

---

## 🎯 Option 1: Automated Deployment from Windows (EASIEST)

### Step 1: Open PowerShell
Right-click on the Start menu and select "Windows PowerShell" or "Terminal"

### Step 2: Navigate to the project
```powershell
cd C:\Users\ranja\Downloads\ai-escape-room
```

### Step 3: Run the deployment script
```powershell
# If using password authentication:
.\deploy-to-vps.ps1 -VPS_IP "your.vps.ip.address" -VPS_USER "root"

# If using SSH key:
.\deploy-to-vps.ps1 -VPS_IP "your.vps.ip.address" -VPS_USER "root" -SSH_KEY_PATH "C:\path\to\your\key.pem"
```

**Example:**
```powershell
.\deploy-to-vps.ps1 -VPS_IP "142.93.123.45" -VPS_USER "root"
```

### Step 4: Add your Gemini API key
The script will prompt you at the end. SSH into your VPS:
```powershell
ssh root@your.vps.ip.address
```

Then edit the .env file:
```bash
sudo nano /opt/ai-escape-room/.env
```

Find this line:
```
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

Replace `your_actual_gemini_api_key_here` with your actual API key.

Press `Ctrl+X`, then `Y`, then `Enter` to save.

### Step 5: Restart the application
```bash
cd /opt/ai-escape-room
sudo docker-compose restart
```

### Step 6: Access your app! 🎉
Open your browser and go to:
```
http://your.vps.ip.address:3000
```

---

## 🎯 Option 2: Manual Deployment on VPS

### Step 1: Connect to your VPS
```bash
ssh root@your.vps.ip.address
```

### Step 2: Download the project
```bash
# Install git if needed
apt install -y git

# Clone or download your project
cd /opt
git clone https://github.com/yourusername/ai-escape-room.git
# OR upload files using FileZilla/WinSCP to /opt/ai-escape-room
```

### Step 3: Run the setup script
```bash
cd /opt/ai-escape-room
chmod +x setup-vps.sh
sudo bash setup-vps.sh
```

This will automatically:
- ✅ Update system packages
- ✅ Install Docker and Docker Compose
- ✅ Configure firewall
- ✅ Create environment file
- ✅ Build and start all services (App, PostgreSQL, Redis)

**Time: ~5-10 minutes depending on your VPS speed**

### Step 4: Add your Gemini API key
```bash
sudo nano /opt/ai-escape-room/.env
```

Update this line:
```
GEMINI_API_KEY=your_actual_api_key_here
```

Get your API key from: https://makersuite.google.com/app/apikey

Press `Ctrl+X`, then `Y`, then `Enter` to save.

### Step 5: Restart the application
```bash
cd /opt/ai-escape-room
sudo docker-compose restart
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
cd /opt/ai-escape-room
sudo docker-compose logs -f app
```
Press `Ctrl+C` to exit logs.

### Restart application:
```bash
cd /opt/ai-escape-room
sudo docker-compose restart
```

### Stop application:
```bash
cd /opt/ai-escape-room
sudo docker-compose down
```

### Start application:
```bash
cd /opt/ai-escape-room
sudo docker-compose up -d
```

### Check if services are running:
```bash
cd /opt/ai-escape-room
sudo docker-compose ps
```

### Update application after code changes:
```bash
cd /opt/ai-escape-room
git pull origin main  # if using git
sudo docker-compose down
sudo docker-compose up -d --build
```

---

## 🐛 Troubleshooting

### Can't access the app?
1. Check if Docker containers are running:
   ```bash
   sudo docker-compose ps
   ```

2. Check application logs:
   ```bash
   sudo docker-compose logs app
   ```

3. Check if port 3000 is open:
   ```bash
   sudo ufw status
   ```

4. Check firewall on your VPS provider (DigitalOcean, AWS, etc.)

### API not working?
1. Verify your Gemini API key is correct:
   ```bash
   sudo nano /opt/ai-escape-room/.env
   ```

2. Restart after changing .env:
   ```bash
   sudo docker-compose restart
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

---

## 📊 Testing with Multiple Players

Once your app is running:

1. Create a room as Host
2. In Host Lobby, click **"Add 20 Test Bots"** or **"Add 50 Test Bots"**
3. Watch the leaderboard update in real-time!
4. Test with up to 500 concurrent players

---

## 🎉 That's It!

Your AI Escape Room is now live and ready for players!

**Need help?** Check the logs first:
```bash
sudo docker-compose logs -f app
```

Most issues are related to:
- Missing or incorrect Gemini API key
- Firewall blocking port 3000
- Insufficient server resources (upgrade to 4GB RAM for 500 players)

---

**Enjoy your AI Escape Room! 🧩🚀**
