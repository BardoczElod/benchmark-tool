# Server Deployment Guide

This guide covers deploying the GMB-ECC Energy Efficiency Analysis Dashboard to a production server.

## Prerequisites

- Docker and Docker Compose installed on your server
- SSH access to your server
- Domain name (optional, for HTTPS setup)

## Quick Start

### 1. Clone or Transfer Files to Server

```bash
# SSH into your server
ssh user@your-server.com

# Clone repository or transfer files
git clone <your-repo-url> gmb-ecc-dashboard
cd gmb-ecc-dashboard
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env to set your preferred port
nano .env
```

### 3. Build and Run

```bash
# Build and start the container
docker-compose up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

The application will be available at `http://your-server-ip:5173`

## Production Deployment Options

### Option 1: Direct Docker Deployment (Port 80)

Edit `.env`:
```bash
HOST_PORT=80
```

Then run:
```bash
docker-compose up -d --build
```

Access at: `http://your-server-ip`

### Option 2: Behind Reverse Proxy (Recommended)

If using Nginx or Traefik as a reverse proxy, keep the default port (5173) and configure your proxy.

#### Example Nginx Reverse Proxy Config:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### With SSL (Let's Encrypt):

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Certbot will automatically configure HTTPS
```

### Option 3: Docker Compose with Traefik

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  web:
    build: .
    container_name: gmb-ecc-dashboard
    restart: unless-stopped
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.gmb-ecc.rule=Host(`your-domain.com`)"
      - "traefik.http.routers.gmb-ecc.entrypoints=websecure"
      - "traefik.http.routers.gmb-ecc.tls.certresolver=letsencrypt"
      - "traefik.http.services.gmb-ecc.loadbalancer.server.port=80"
    networks:
      - traefik-network

networks:
  traefik-network:
    external: true
```

Run with:
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

## Management Commands

### Start/Stop/Restart

```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# Restart
docker-compose restart

# Rebuild and restart
docker-compose up -d --build --force-recreate
```

### View Logs

```bash
# Follow logs
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100

# Specific service logs
docker-compose logs -f web
```

### Health Check

```bash
# Check container health
docker-compose ps

# Manual health check
curl http://localhost:5173/health

# Container stats
docker stats gmb-ecc-dashboard
```

### Update Deployment

```bash
# Pull latest changes
git pull

# Rebuild and deploy
docker-compose down
docker-compose up -d --build

# Or zero-downtime update (if using orchestration)
docker-compose up -d --no-deps --build web
```

## Load Multiple Data Files

To serve different analysis reports:

1. Place your JSON files in the `public/` directory
2. Rebuild the container:
```bash
docker-compose up -d --build
```

3. Access reports at:
   - `http://your-server/` (default view)
   - Update `App.tsx` to load different JSON files or add a file selector

## Backup and Restore

### Backup Container Image

```bash
# Save image
docker save gmb-ecc-dashboard:latest | gzip > gmb-ecc-backup.tar.gz

# Load image on another server
docker load < gmb-ecc-backup.tar.gz
```

### Backup Data Files

```bash
# Backup public directory with JSON data
tar -czf data-backup.tar.gz public/
```

## Monitoring

### Basic Monitoring with Docker

```bash
# Container resource usage
docker stats gmb-ecc-dashboard

# Container logs
docker logs -f gmb-ecc-dashboard
```

### Health Check Endpoint

The application exposes a `/health` endpoint:
```bash
curl http://localhost:5173/health
```

Returns: `OK` with HTTP 200

## Security Best Practices

1. **Firewall Configuration**
   ```bash
   # Allow only necessary ports
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

2. **Use HTTPS** (always use SSL in production)

3. **Regular Updates**
   ```bash
   # Update base images
   docker-compose pull
   docker-compose up -d --build
   ```

4. **Limit Resources** (optional)
   
   Add to `docker-compose.yml`:
   ```yaml
   services:
     web:
       deploy:
         resources:
           limits:
             cpus: '1.0'
             memory: 512M
           reservations:
             cpus: '0.5'
             memory: 256M
   ```

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs

# Verify port availability
sudo netstat -tlnp | grep 5173

# Remove and recreate
docker-compose down -v
docker-compose up -d --build
```

### Application Not Accessible

```bash
# Check if container is running
docker-compose ps

# Test internally
docker exec gmb-ecc-dashboard wget -O- http://localhost/health

# Check firewall
sudo ufw status
```

### High Memory Usage

```bash
# Check resource usage
docker stats gmb-ecc-dashboard

# Restart container
docker-compose restart
```

## Automated Deployment (CI/CD)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /path/to/gmb-ecc-dashboard
            git pull
            docker-compose down
            docker-compose up -d --build
```

## Support

For issues or questions:
- Check logs: `docker-compose logs -f`
- Verify health: `curl http://localhost:5173/health`
- Review this guide and README.md
