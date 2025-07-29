# Tender Management System - Deployment Guide

This guide provides step-by-step instructions for deploying the Tender Management System in production.

## Prerequisites

- Docker 20.10+ and Docker Compose 1.29+
- A domain name pointed to your server's IP
- Ports 80 and 443 open on your server
- Basic knowledge of Linux server administration

## 1. Server Setup

### 1.1 Update System Packages

```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Install Required Packages

```bash
sudo apt install -y curl git python3-pip python3-venv
```

### 1.3 Install Docker and Docker Compose

Follow the official Docker installation guide for your OS:
https://docs.docker.com/engine/install/

## 2. Application Setup

### 2.1 Clone the Repository

```bash
git clone https://github.com/yourusername/tender-management-system.git
cd tender-management-system
```

### 2.2 Set Up Environment Variables

Create a `.env` file in the project root:

```bash
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=tenderdb

# Backend
SECRET_KEY=your-secret-key-here
ENVIRONMENT=production
DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
REDIS_URL=redis://redis:6379/0
BACKEND_CORS_ORIGINS=["https://yourdomain.com", "http://yourdomain.com"]

# Frontend
VITE_API_URL=https://yourdomain.com/api

# Certbot
DOMAIN=yourdomain.com
CERTBOT_EMAIL=your-email@example.com
```

## 3. SSL Certificate Setup

### 3.1 Create Diffie-Hellman Parameters

```bash
mkdir -p certs
openssl dhparam -out certs/dhparam.pem 2048
```

### 3.2 Get SSL Certificates

Run the following command to get test certificates (staging environment):

```bash
docker-compose -f docker-compose.prod.yml up certbot
```

Once you've verified everything works, get production certificates by removing the `--staging` flag in the `docker-compose.prod.yml` file and running the command again.

## 4. Start the Application

### 4.1 Start All Services

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 4.2 Initialize the Database

Run database migrations:

```bash
docker-compose -f docker-compose.prod.yml exec backend alembic upgrade head
```

## 5. Verify the Installation

Check that all services are running:

```bash
docker-compose -f docker-compose.prod.yml ps
```

Access the application at:
- Frontend: https://yourdomain.com
- API Documentation: https://yourdomain.com/api/docs

## 6. Maintenance

### 6.1 View Logs

```bash
# View all logs
docker-compose -f docker-compose.prod.yml logs -f

# View specific service logs
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
```

### 6.2 Backup Database

Create a backup:

```bash
docker-compose -f docker-compose.prod.yml exec -T db pg_dump -U postgres tenderdb > backup_$(date +%Y%m%d).sql
```

### 6.3 Update the Application

```bash
git pull
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d --force-recreate
```

## 7. Troubleshooting

### 7.1 Common Issues

- **Port already in use**: Make sure no other services are using ports 80 and 443.
- **Database connection issues**: Verify the database credentials in the `.env` file.
- **SSL certificate errors**: Ensure your domain is correctly pointed to the server's IP and ports 80/443 are open.

### 7.2 Getting Help

If you encounter any issues, please check the logs and feel free to open an issue on GitHub.

## 8. Security Considerations

- Change all default passwords
- Keep the system updated
- Regularly back up your data
- Monitor server logs
- Consider setting up a firewall (e.g., UFW)
- Use strong passwords for all services

## 9. Scaling

For production deployments with high traffic, consider:

1. Using a managed database service
2. Setting up Redis for caching
3. Using a CDN for static assets
4. Implementing horizontal scaling for backend services

## 10. Support

For additional support, please contact [Your Support Email].
