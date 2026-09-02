# Nexgen Academy ERP & Website - Production Hosting & Deployment Guide

This guide details how to run, configure, and secure this application on your live domain and hosting server (cPanel, VPS / Ubuntu, Cloud Run, DigitalOcean, or Railway).

---

## 1. Environment Configuration (.env)

On your production server, create a `.env` file in the root directory:

```env
NODE_ENV=production
PORT=3000

# Server / Domain URL (your custom domain)
APP_URL=https://yourdomain.com

# Gemini AI Secret Key (Server-side only, never expose to browser)
GEMINI_API_KEY=AIzaSy...your_gemini_key_here

# (Optional) Allowed origins for CORS (default allows your origin)
ALLOWED_ORIGIN=https://yourdomain.com
```

---

## 2. Production Build Commands

Before starting in production, compile both Vite frontend assets and the backend bundle:

```bash
# 1. Install dependencies
npm install --production=false

# 2. Build frontend (dist/) and compile server (dist/server.cjs)
npm run build

# 3. Test production launch locally
npm start
```

---

## 3. Deployment Options

### Option A: Ubuntu / Debian VPS (Recommended: DigitalOcean, Linode, AWS EC2)

1. **Install Node.js 20+ & PM2**:
   ```bash
   sudo apt update && sudo apt install -y curl git nginx
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   sudo npm install -g pm2
   ```

2. **Clone & Build App**:
   ```bash
   git clone <your-repo-url> /var/www/nexgen-erp
   cd /var/www/nexgen-erp
   npm install
   npm run build
   ```

3. **Start with PM2 (Auto-restart on reboot or crash)**:
   ```bash
   pm2 start dist/server.cjs --name "nexgen-erp"
   pm2 save
   pm2 startup
   ```

4. **Nginx Reverse Proxy & SSL (Let's Encrypt)**:
   Create `/etc/nginx/sites-available/nexgen.conf`:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
           client_max_body_size 50M;
       }
   }
   ```
   Enable site and install free SSL certificate:
   ```bash
   sudo ln -s /etc/nginx/sites-available/nexgen.conf /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

---

### Option B: cPanel with "Setup Node.js App"

1. In cPanel, click **"Setup Node.js App"** -> **Create Application**.
2. Select **Node.js 20.x**.
3. Application root: `nexgen-erp`.
4. Application startup file: `dist/server.cjs`.
5. Run build on your local machine and upload the `dist/`, `data/`, `node_modules/`, and `package.json` to the folder (or run `npm run build` in cPanel terminal).
6. Click **Restart**.

---

## 4. Pre-Launch Security Checklist

- [ ] **Change Default Admin Password**: Log in as Super Admin and change password in Settings -> User Profiles.
- [ ] **Set Certificate Verification Base URL**: Go to ERP Settings -> Institute Profile -> Set Certificate URL to `https://yourdomain.com/#verify-certificate?cert=`.
- [ ] **Persistent Storage**: Ensure `/data` folder permissions allow read/write (`chmod -R 755 data`).
- [ ] **SSL (HTTPS)**: Ensure Cloudflare or Let's Encrypt SSL is active (Green Padlock in browser).
- [ ] **Automated Backup**: Go to ERP Reports -> Run JSON/Excel full backup monthly or weekly.
