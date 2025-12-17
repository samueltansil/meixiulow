# WhyPals Deployment Guide

This guide explains how to deploy WhyPals on any standard VPS, local machine, or cloud platform.

## Prerequisites

- **Node.js 20+** (LTS recommended)
- **PostgreSQL database** (Neon, Supabase, or self-hosted)
- **Cloudflare R2** account for image/file storage
- **ElevenLabs API key** for text-to-speech feature

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/your-username/whypals.git
cd whypals

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Edit .env with your credentials (see below)
nano .env

# 5. Push database schema
npm run db:push

# 6. Build for production
npm run build

# 7. Start the server
npm run start
```

The app will be available at `http://localhost:5000`

## Environment Variables

Create a `.env` file with the following variables:

### Required Variables

| Variable | Description | Where to Get It |
|----------|-------------|-----------------|
| `DATABASE_URL` | PostgreSQL connection string | Your database provider (Neon, Supabase, etc.) |
| `SESSION_SECRET` | Random string for session encryption | Generate: any random 32+ character string |
| `R2_ACCOUNT_ID` | Cloudflare account ID | Cloudflare Dashboard > R2 > Overview |
| `R2_ACCESS_KEY_ID` | R2 API access key | Cloudflare Dashboard > R2 > Manage R2 API Tokens |
| `R2_SECRET_ACCESS_KEY` | R2 API secret key | Same as above |
| `R2_BUCKET_NAME` | Your R2 bucket name | The name you gave your bucket |
| `ELEVENLABS_API_KEY` | ElevenLabs API key | ElevenLabs Dashboard > API Keys |
| `ADMIN_PASSWORD` | Password for /admin pages | Choose your own secure password |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `NEON_DATABASE_URL` | Alternative to DATABASE_URL | - |

### Example .env File

```env
# Database (use your actual Neon/Supabase connection string)
DATABASE_URL=postgresql://username:password@host.neon.tech:5432/database?sslmode=require

# Session (make up a random string)
SESSION_SECRET=my-super-secret-random-string-2025-xyz

# Cloudflare R2 Storage
R2_ACCOUNT_ID=abc123def456
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=whypals

# ElevenLabs API
ELEVENLABS_API_KEY=sk_xxxxxxxxx

# Admin Access
ADMIN_PASSWORD=your-secure-admin-password

# Runtime
NODE_ENV=production
PORT=5000
```

## NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build both client and server for production |
| `npm run start` | Start production server |
| `npm run db:push` | Push database schema changes |

## Deploying to a VPS

### Step 1: Prepare Your Server

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Git
sudo apt install -y git
```

### Step 2: Clone and Setup

```bash
# Clone repository
cd /var/www
git clone https://github.com/your-username/whypals.git
cd whypals

# Install dependencies
npm install

# Create .env file
cp .env.example .env
nano .env  # Add your credentials

# Push database schema
npm run db:push

# Build application
npm run build
```

### Step 3: Start with PM2

```bash
# Start the application (pure Node.js, no Vite dependencies)
pm2 start server/dist/index.cjs --name "whypals"

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

> **Note:** The production bundle `server/dist/index.cjs` is pure Node.js code with no Vite dependencies. It can be run directly with `node` or `pm2`.

### Step 4: Setup Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt install -y nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/whypals
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name whypals.com www.whypals.com;

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
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/whypals /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 5: Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d whypals.com -d www.whypals.com

# Auto-renewal is set up automatically
```

### Step 6: Point Your Domain

In your domain registrar (Hostinger), update DNS:

1. Add an **A record**: `@` → Your VPS IP address
2. Add an **A record**: `www` → Your VPS IP address

Wait 5-30 minutes for DNS propagation.

## Updating the Application

```bash
cd /var/www/whypals
git pull
npm install
npm run build
pm2 restart whypals
```

## Direct Server Execution

If you prefer not to use PM2, you can run the server directly:

```bash
# Using npm script
NODE_ENV=production npm run start

# Or run the bundle directly
NODE_ENV=production node server/dist/index.cjs
```

## Project Structure

```
whypals/
├── client/                 # Frontend React application
│   ├── src/               # Source files
│   ├── dist/              # Built frontend (after npm run build)
│   └── index.html         # HTML entry point
├── server/                # Backend Express server
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── auth.ts           # Authentication setup
│   ├── db.ts             # Database connection
│   ├── storage.ts        # Database operations
│   ├── r2.ts             # R2 storage operations
│   └── dist/             # Built server (after npm run build)
├── shared/               # Shared types between client/server
├── .env.example          # Environment variables template
├── package.json          # Dependencies and scripts
└── vite.config.ts        # Vite configuration
```

## Terminology Reference

For developers or AI agents working on this project:

| Term | Description |
|------|-------------|
| `attached_assets/` | Directory for user-uploaded assets (images, files) |
| `replit.md` | Project documentation file (can be renamed or kept) |
| `client/dist/` | Built frontend static files served by Express |
| `server/dist/` | Built backend JavaScript file |
| `connect-pg-simple` | PostgreSQL session store for Express |
| `drizzle` | TypeScript ORM for database operations |
| `R2` | Cloudflare's S3-compatible object storage |

## Troubleshooting

### Database Connection Issues
- Verify your DATABASE_URL is correct
- Ensure SSL mode is enabled for cloud databases: `?sslmode=require`
- Check if your IP is whitelisted in your database provider

### R2 Upload Issues
- Verify all R2 credentials are correct
- Check CORS settings in Cloudflare R2 bucket
- Ensure bucket permissions allow uploads

### Session Issues
- Make sure SESSION_SECRET is set
- For production, ensure `NODE_ENV=production` for secure cookies
- If behind a proxy, the app already sets `trust proxy`

### Port Already in Use
```bash
# Find what's using port 5000
sudo lsof -i :5000
# Kill the process or change PORT in .env
```

## Support

This project is fully portable and can run on:
- Any Linux VPS (Ubuntu, Debian, CentOS)
- Windows Server with Node.js
- macOS for local development
- Docker containers
- Cloud platforms (Railway, Render, Fly.io, etc.)

No Replit-specific dependencies are required.
