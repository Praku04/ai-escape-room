# =====================================================
# AI Escape Room - Windows to VPS Deployment Script
# =====================================================
# This script uploads your project to VPS and initiates deployment
# Run from Windows PowerShell

param(
    [Parameter(Mandatory=$true)]
    [string]$VPS_IP,
    
    [Parameter(Mandatory=$true)]
    [string]$VPS_USER,
    
    [Parameter(Mandatory=$false)]
    [string]$SSH_KEY_PATH = ""
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "AI Escape Room - VPS Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get the script directory (project root)
$PROJECT_ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "[1/5] Checking prerequisites..." -ForegroundColor Yellow

# Check if SCP is available (comes with Windows 10+)
try {
    $null = Get-Command scp -ErrorAction Stop
    Write-Host "✓ SCP found" -ForegroundColor Green
} catch {
    Write-Host "✗ SCP not found. Please enable OpenSSH Client in Windows." -ForegroundColor Red
    Write-Host "  Go to: Settings > Apps > Optional Features > Add OpenSSH Client" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[2/5] Preparing files for upload..." -ForegroundColor Yellow

# Create temporary directory for deployment files
$TEMP_DEPLOY = Join-Path $env:TEMP "ai-escape-room-deploy"
if (Test-Path $TEMP_DEPLOY) {
    Remove-Item -Recurse -Force $TEMP_DEPLOY
}
New-Item -ItemType Directory -Path $TEMP_DEPLOY | Out-Null

# Copy necessary files (exclude node_modules, dist, etc.)
$excludeDirs = @('node_modules', 'dist', '.git', 'bun.lock')
Get-ChildItem $PROJECT_ROOT | Where-Object {
    $_.Name -notin $excludeDirs
} | Copy-Item -Destination $TEMP_DEPLOY -Recurse -Force

Write-Host "✓ Files prepared" -ForegroundColor Green

Write-Host ""
Write-Host "[3/5] Uploading files to VPS..." -ForegroundColor Yellow
Write-Host "Target: $VPS_USER@$VPS_IP:/opt/ai-escape-room" -ForegroundColor Gray

# Build SCP command
$scpArgs = @()
if ($SSH_KEY_PATH) {
    $scpArgs += @("-i", $SSH_KEY_PATH)
}
$scpArgs += @("-r", "$TEMP_DEPLOY\*", "${VPS_USER}@${VPS_IP}:/tmp/ai-escape-room-upload")

try {
    # Upload to temp location first
    & scp $scpArgs
    
    if ($LASTEXITCODE -ne 0) {
        throw "SCP failed with exit code $LASTEXITCODE"
    }
    
    Write-Host "✓ Files uploaded successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Upload failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[4/5] Moving files and setting permissions on VPS..." -ForegroundColor Yellow

# Build SSH command
$sshArgs = @()
if ($SSH_KEY_PATH) {
    $sshArgs += @("-i", $SSH_KEY_PATH)
}
$sshArgs += @("${VPS_USER}@${VPS_IP}")

$setupCommands = @"
sudo mkdir -p /opt/ai-escape-room && \
sudo rm -rf /opt/ai-escape-room/* && \
sudo mv /tmp/ai-escape-room-upload/* /opt/ai-escape-room/ && \
sudo chown -R $VPS_USER:$VPS_USER /opt/ai-escape-room && \
sudo chmod +x /opt/ai-escape-room/setup-vps.sh && \
rm -rf /tmp/ai-escape-room-upload
"@

& ssh $sshArgs $setupCommands

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to setup files on VPS" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Files moved to /opt/ai-escape-room" -ForegroundColor Green

Write-Host ""
Write-Host "[5/5] Running installation script on VPS..." -ForegroundColor Yellow
Write-Host ""

# Run the setup script on VPS
& ssh $sshArgs "cd /opt/ai-escape-room && sudo bash setup-vps.sh"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. SSH into your VPS: ssh $VPS_USER@$VPS_IP" -ForegroundColor White
Write-Host "2. Edit the .env file: sudo nano /opt/ai-escape-room/.env" -ForegroundColor White
Write-Host "3. Add your Gemini API key to GEMINI_API_KEY variable" -ForegroundColor White
Write-Host "4. Restart the application: cd /opt/ai-escape-room && sudo docker-compose restart" -ForegroundColor White
Write-Host ""
Write-Host "Access your app at: http://$VPS_IP:3000" -ForegroundColor Cyan
Write-Host ""

# Cleanup
Remove-Item -Recurse -Force $TEMP_DEPLOY
