# Deployment Guide for Hetzner Server with Docker

This guide will help you deploy the Dental Second Opinion platform to your Hetzner server at **onlinezahnarzt.com**.

## Prerequisites

- Hetzner server with root/sudo access
- Domain configured in Cloudflare (onlinezahnarzt.com)
- SSH access to your server

## Step 1: Prepare Your Server

### 1.1 Connect to Your Server via SSH

```bash
ssh root@your-server-ip
# or
ssh your-username@your-server-ip
```

### 1.2 Update System Packages

```bash
sudo apt update && sudo apt upgrade -y
```

### 1.3 Install Docker and Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### 1.4 Install Git

```bash
sudo apt install git -y
```

## Step 2: Clone Your Repository

```bash
# Navigate to your preferred directory
cd /var/www  # or /home/your-user

# Clone the repository
git clone https://github.com/onemillionreasons/Dental-Second-Opinion-Platform---AI-powered-dental-case-review-system.git dental-app

cd dental-app
```

## Step 3: Configure Environment Variables

### 3.1 Create Production .env File

```bash
cp .env.example .env
nano .env  # or use vim
```

### 3.2 Update the Following Variables:

**Required:**
```bash
DATABASE_URL=postgresql://user:password@host:5432/dental_db
SESSION_SECRET=your-generated-secret-here  # Generate with: openssl rand -base64 32
FRONTEND_URL=https://onlinezahnarzt.com
NODE_ENV=production
PORT=5000
```

**Optional (but recommended):**
```bash
# Email for notifications
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@onlinezahnarzt.com

# Stripe for payments
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

**Generate a secure session secret:**
```bash
openssl rand -base64 32
```

### 3.3 Database Setup

**Option A: Use Neon.tech (Recommended - Free Tier)**
1. Go to https://neon.tech
2. Create a free account
3. Create a new project
4. Copy the connection string
5. Paste it as your `DATABASE_URL`

**Option B: Install PostgreSQL on Server**
```bash
sudo apt install postgresql postgresql-contrib -y
sudo -u postgres createdb dental_db
sudo -u postgres createuser dental_user -P
# Set password when prompted
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE dental_db TO dental_user;"
```

Then set:
```bash
DATABASE_URL=postgresql://dental_user:your_password@localhost:5432/dental_db
```

## Step 4: Build and Start the Application

### 4.1 Build the Docker Image

```bash
docker-compose build
```

### 4.2 Start the Application

```bash
docker-compose up -d
```

### 4.3 Check if Running

```bash
docker-compose ps
docker-compose logs -f app
```

You should see the app running on port 5000.

## Step 5: Configure Nginx as Reverse Proxy

### 5.1 Install Nginx

```bash
sudo apt install nginx -y
```

### 5.2 Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/onlinezahnarzt.com
```

Paste this configuration:

```nginx
server {
    listen 80;
    server_name onlinezahnarzt.com www.onlinezahnarzt.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Increase upload size for medical images
    client_max_body_size 100M;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

### 5.3 Enable Site and Restart Nginx

```bash
sudo ln -s /etc/nginx/sites-available/onlinezahnarzt.com /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

## Step 6: Configure SSL with Cloudflare

### Option A: Cloudflare Flexible SSL (Easiest)

1. Go to your Cloudflare dashboard
2. Select your domain: onlinezahnarzt.com
3. Go to SSL/TLS settings
4. Set SSL/TLS encryption mode to **"Flexible"** or **"Full"**
5. Enable **"Always Use HTTPS"**

### Option B: Let's Encrypt SSL (More Secure)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d onlinezahnarzt.com -d www.onlinezahnarzt.com

# Test auto-renewal
sudo certbot renew --dry-run
```

## Step 7: Configure Cloudflare DNS

1. Go to Cloudflare Dashboard → DNS
2. Add/Update A record:
   - **Type:** A
   - **Name:** @ (or onlinezahnarzt.com)
   - **IPv4 address:** Your Hetzner server IP
   - **Proxy status:** Proxied (orange cloud) ✓
   - **TTL:** Auto

3. Add www subdomain:
   - **Type:** CNAME
   - **Name:** www
   - **Target:** onlinezahnarzt.com
   - **Proxy status:** Proxied ✓

## Step 8: Run Database Migrations

```bash
docker-compose exec app npm run db:push
```

## Step 9: Test Your Deployment

1. Visit: https://onlinezahnarzt.com
2. Check logs: `docker-compose logs -f app`
3. Test user registration and login
4. Upload a test case

## Step 10: Set Up Automatic Backups (Optional but Recommended)

### 10.1 Create Backup Script

```bash
sudo nano /usr/local/bin/backup-dental-app.sh
```

Paste:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/dental-app"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database (if using local PostgreSQL)
docker-compose exec -T app pg_dump $DATABASE_URL > $BACKUP_DIR/db_backup_$DATE.sql

# Backup uploads
tar -czf $BACKUP_DIR/uploads_backup_$DATE.tar.gz /var/www/dental-app/uploads

# Keep only last 7 days of backups
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $DATE"
```

Make executable:
```bash
sudo chmod +x /usr/local/bin/backup-dental-app.sh
```

### 10.2 Schedule Daily Backups

```bash
sudo crontab -e
```

Add:
```
0 2 * * * /usr/local/bin/backup-dental-app.sh >> /var/log/dental-backup.log 2>&1
```

## Useful Commands

### View Logs
```bash
docker-compose logs -f app
```

### Restart Application
```bash
docker-compose restart app
```

### Stop Application
```bash
docker-compose down
```

### Update Application
```bash
git pull origin main
docker-compose build
docker-compose up -d
```

### Check Docker Resources
```bash
docker stats
```

## Troubleshooting

### App Won't Start
```bash
# Check logs
docker-compose logs app

# Check if port is already in use
sudo netstat -tulpn | grep 5000

# Rebuild from scratch
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Database Connection Issues
```bash
# Test database connection
docker-compose exec app node -e "require('pg').Client({connectionString: process.env.DATABASE_URL}).connect((err) => console.log(err || 'Connected'))"
```

### Nginx Issues
```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log
```

## Security Recommendations

1. **Firewall Configuration:**
```bash
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

2. **Disable Root Login:**
```bash
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
sudo systemctl restart sshd
```

3. **Set Up Fail2Ban:**
```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

4. **Regular Updates:**
```bash
# Add to crontab
0 3 * * * apt update && apt upgrade -y && docker system prune -f
```

## Support

If you encounter issues:
1. Check application logs: `docker-compose logs -f`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify environment variables: `docker-compose exec app env | grep DATABASE_URL`

---

**Congratulations! Your Dental Second Opinion platform should now be live at https://onlinezahnarzt.com** 🎉
