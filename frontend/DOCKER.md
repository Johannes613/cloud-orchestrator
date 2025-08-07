# Docker Setup for Frontend

This document provides instructions for building and running the frontend application using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose (usually comes with Docker Desktop)

## Quick Start

**Important:** Make sure you're in the `frontend` directory when running these commands:

```bash
cd frontend
```

### Production Build

1. **Build and run the production container:**
   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   - Open your browser and navigate to `http://localhost:3000`

### Development Build

1. **Run the development container with hot reloading:**
   ```bash
   docker-compose --profile dev up --build
   ```

2. **Access the development server:**
   - Open your browser and navigate to `http://localhost:3001`

## Manual Docker Commands

**Note:** All commands should be run from the `frontend` directory.

### Production Build

```bash
# Navigate to frontend directory
cd frontend

# Build the production image
docker build -t frontend:latest .

# Run the container
docker run -p 3000:80 frontend:latest
```

### Development Build

```bash
# Navigate to frontend directory
cd frontend

# Build the development image
docker build -f Dockerfile.dev -t frontend:dev .

# Run the development container
docker run -p 3001:3000 -v $(pwd):/app -v /app/node_modules frontend:dev
```

## Docker Compose Commands

**Note:** All commands should be run from the `frontend` directory.

```bash
# Navigate to frontend directory
cd frontend

# Start production services
docker-compose up

# Start development services
docker-compose --profile dev up

# Build and start in detached mode
docker-compose up -d --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f frontend

# Rebuild without cache
docker-compose build --no-cache
```

## Environment Variables

The application uses the following environment variables:

- `NODE_ENV`: Set to `production` or `development`
- `VITE_API_URL`: Backend API URL (if needed)

## Health Checks

The production container includes health checks that verify the application is running:

- **Endpoint:** `http://localhost:3000/health`
- **Interval:** 30 seconds
- **Timeout:** 3 seconds
- **Retries:** 3

## Security Features

The Docker setup includes several security measures:

1. **Non-root user:** The application runs as a non-root user (`nextjs`)
2. **Security headers:** Nginx is configured with security headers
3. **Minimal base image:** Uses Alpine Linux for smaller attack surface
4. **Multi-stage build:** Reduces final image size

## Performance Optimizations

1. **Layer caching:** Package.json is copied first for better caching
2. **Gzip compression:** Enabled for static assets
3. **Static asset caching:** Long-term caching for static files
4. **Nginx optimization:** Configured for high performance

## Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Check what's using the port
   lsof -i :3000
   
   # Use a different port
   docker run -p 3001:80 frontend:latest
   ```

2. **Build fails:**
   ```bash
   # Clean Docker cache
   docker system prune -a
   
   # Rebuild without cache
   docker-compose build --no-cache
   ```

3. **Permission issues:**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

### Logs and Debugging

```bash
# View container logs
docker-compose logs frontend

# Access container shell
docker-compose exec frontend sh

# Check nginx configuration
docker-compose exec frontend nginx -t
```

## Production Deployment

For production deployment, consider:

1. **Using a reverse proxy** (like Traefik or Nginx)
2. **Setting up SSL/TLS certificates**
3. **Configuring proper logging**
4. **Setting up monitoring and alerting**

### Example with Traefik

```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  frontend:
    build: .
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.frontend.rule=Host(`yourdomain.com`)"
      - "traefik.http.routers.frontend.tls.certresolver=letsencrypt"
    networks:
      - traefik
      - frontend-network

networks:
  traefik:
    external: true
  frontend-network:
    driver: bridge
```

## File Structure

This Docker setup is specifically for the frontend directory in a monorepo structure:

```
repository/
├── frontend/              # This directory
│   ├── Dockerfile         # Production Dockerfile
│   ├── Dockerfile.dev     # Development Dockerfile
│   ├── docker-compose.yml # Docker Compose configuration
│   ├── nginx.conf        # Nginx configuration
│   ├── .dockerignore     # Docker ignore file
│   ├── package.json      # Frontend dependencies
│   ├── src/              # Frontend source code
│   └── DOCKER.md        # This documentation
└── backend/              # Backend directory (not included in this setup)
    └── ...
```
