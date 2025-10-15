# BurnMate Docker Setup

This guide will help you run BurnMate using Docker containers.

## Prerequisites

- [Docker](https://www.docker.com/get-started) installed on your machine
- [Docker Compose](https://docs.docker.com/compose/install/) installed

## Quick Start

### Run All Services with Docker Compose

```bash
# Build and start all services (MongoDB, Backend, Frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v
```

The application will be available at:
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:5050
- **MongoDB**: localhost:27017

### Build Individual Services

#### Backend Only
```bash
cd backend
docker build -t burnmate-backend .
docker run -p 5050:5050 --env-file .env burnmate-backend
```

#### Frontend Only
```bash
cd frontend
docker build -t burnmate-frontend .
docker run -p 8080:80 burnmate-frontend
```

## Environment Variables

Before running with docker-compose, make sure to update the following in `docker-compose.yml`:

1. **MongoDB Credentials**: Change default username/password
   ```yaml
   MONGO_INITDB_ROOT_USERNAME: your_username
   MONGO_INITDB_ROOT_PASSWORD: your_secure_password
   ```

2. **JWT Secret**: Update the JWT secret key
   ```yaml
   JWT_SECRET: your_secure_jwt_secret_key
   ```

3. **MongoDB URI**: Update if you changed MongoDB credentials
   ```yaml
   MONGO_URI: mongodb://your_username:your_password@mongodb:27017/burnmate?authSource=admin
   ```

## Production Deployment

For production deployment, consider:

1. Using environment variables from a `.env` file
2. Setting up proper MongoDB authentication
3. Using Docker secrets for sensitive data
4. Setting up SSL/TLS certificates
5. Using a reverse proxy like Nginx or Traefik

### Using Environment File

Create a `.env` file:
```env
MONGO_USERNAME=admin
MONGO_PASSWORD=secure_password
JWT_SECRET=your_jwt_secret
NODE_ENV=production
```

Update `docker-compose.yml` to use env_file:
```yaml
services:
  backend:
    env_file:
      - .env
```

## Useful Commands

```bash
# View running containers
docker ps

# View all containers (including stopped)
docker ps -a

# View logs for specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb

# Restart a specific service
docker-compose restart backend

# Rebuild and restart
docker-compose up -d --build

# Execute commands in running container
docker exec -it burnmate-backend sh
docker exec -it burnmate-mongodb mongosh

# Remove all stopped containers and images
docker system prune -a
```

## Troubleshooting

### Backend can't connect to MongoDB
- Ensure MongoDB container is running: `docker ps`
- Check MongoDB logs: `docker-compose logs mongodb`
- Verify MONGO_URI has correct credentials

### Frontend can't reach Backend
- Check if backend is running: `docker ps`
- Verify backend logs: `docker-compose logs backend`
- Ensure ports are not already in use

### Port already in use
```bash
# Find process using port
netstat -ano | findstr :5050
netstat -ano | findstr :8080

# Kill the process or use different ports in docker-compose.yml
```

## Development Mode

For development with hot-reload, you can mount volumes:

```yaml
backend:
  volumes:
    - ./backend:/app
    - /app/node_modules
  command: npm run dev
```

## Database Management

### Backup MongoDB
```bash
docker exec burnmate-mongodb mongodump --out /backup --authenticationDatabase admin -u admin -p password123
docker cp burnmate-mongodb:/backup ./mongodb-backup
```

### Restore MongoDB
```bash
docker cp ./mongodb-backup burnmate-mongodb:/backup
docker exec burnmate-mongodb mongorestore /backup --authenticationDatabase admin -u admin -p password123
```

## Security Notes

⚠️ **Important**: 
- Change default MongoDB credentials before deploying
- Use strong JWT secret keys
- Never commit `.env` files with sensitive data
- Use Docker secrets for production deployments
- Keep Docker images updated regularly
