# GoHomies Deployment Guide

Complete guide for deploying GoHomies (Backend, Frontend, Admin Panel) to production.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Production Environment                 │
├─────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  Frontend    │  │  Admin Panel │  │   Backend    │   │
│  │  (React)     │  │   (React)    │  │ (Java/Spring)│   │
│  │  Port 80/443 │  │  Port 80/443 │  │  Port 8080   │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│                              │                             │
│  ┌────────────────────────────┴─────────────────────┐   │
│  │                   Nginx Reverse Proxy               │   │
│  │         (API routing + SSL termination)            │   │
│  └────────────────────────┬──────────────────────────┘   │
│                           │                                │
│  ┌────────────────────────┴──────────────────────────┐   │
│  │              TiDB Cloud Database                    │   │
│  │         (MySQL-compatible, Cloud Hosted)           │   │
│  └───────────────────────────────────────────────────┘   │
│                                                             │
│  ┌───────────────────────────────────────────────────┐   │
│  │          External Services (Cloudinary, AI)        │   │
│  └───────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────┘
```

---

## Pre-Deployment Checklist

- [ ] All three apps build successfully
- [ ] Environment variables are set (see below)
- [ ] Database is accessible and migrations are run
- [ ] Cloudinary, OpenAI, and Gemini credentials are valid
- [ ] SSL certificates are obtained (Let's Encrypt or CloudFlare)
- [ ] Domain names are registered and DNS is configured
- [ ] CORS origins are updated in backend config
- [ ] Backup strategy is in place for the database

---

## 1. Backend Deployment (Java/Spring Boot)

### Prerequisites
- Java 17+ installed
- Maven 3.9+
- Access to TiDB Cloud (or production MySQL instance)

### Environment Variables

Create a `.env` file or set these variables in your deployment environment:

```env
# Database Configuration
SPRING_PROFILES_ACTIVE=prod
DB_URL=jdbc:mysql://your-db-host:4000/GoHommiesDB?useSSL=true&serverTimezone=UTC
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_POOL_MAX_SIZE=20
DB_POOL_MIN_IDLE=5
DB_CONNECTION_TIMEOUT_MS=30000

# JWT Configuration
JWT_SECRET_KEY=your-secret-key-min-32-chars-recommended-256-bits
JWT_EXPIRATION_MS=86400000

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# AI Services
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-pro

# CORS Configuration (Frontend URLs)
APP_CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://admin.yourdomain.com

# Email Configuration (Optional)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_FROM=your_email@gmail.com

# JPA Configuration
SPRING_JPA_HIBERNATE_DDL_AUTO=validate
FLYWAY_ENABLED=false
```

### Build & Deploy

1. **Build the application**:
```bash
cd backend
mvn clean package -DskipTests -P prod
```

2. **Run with environment variables**:
```bash
java -jar target/QCare-0.0.1-SNAPSHOT.jar \
  --spring.profiles.active=prod \
  --spring.datasource.url="$DB_URL" \
  --spring.datasource.username="$DB_USERNAME" \
  --spring.datasource.password="$DB_PASSWORD" \
  --jwt.secret.key="$JWT_SECRET_KEY"
```

3. **Or use Docker** (see Docker section below)

### Database Migrations

The backend uses Hibernate auto-migrations. For production:

```yaml
# application-prod.yml
spring:
  jpa:
    hibernate:
      ddl-auto: validate  # Use 'validate' in production (never 'create-drop')
```

To safely migrate existing schemas:
1. Keep `ddl-auto: update` in dev/staging
2. Validate changes in staging first
3. Use `ddl-auto: validate` in production (read-only schema validation)

---

## 2. Frontend Deployment (React + Vite)

### Prerequisites
- Node.js 18+ and npm/yarn
- Build artifacts (run `npm run build`)

### Environment Setup

Create `.env` or `.env.production`:

```env
VITE_API_BASE_URL=https://api.yourdomain.com
```

### Build & Deploy

1. **Build for production**:
```bash
cd frontend
npm install
npm run build
```

2. **Output directory**: `dist/`

3. **Deploy to static hosting**:
   - Vercel: `vercel deploy`
   - Netlify: `netlify deploy --prod --dir=dist`
   - AWS S3 + CloudFront
   - Nginx/Apache static server

### Nginx Configuration (if self-hosted)

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/gohomies-frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 3. Admin Panel Deployment (React + Vite)

### Environment Setup

Create `.env` or `.env.production`:

```env
VITE_API_BASE_URL=https://api.yourdomain.com
```

### Build & Deploy

1. **Build for production**:
```bash
cd admin
npm install
npm run build
```

2. **Deploy similarly to frontend** (use separate subdomain)

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name admin.yourdomain.com;
    root /var/www/gohomies-admin/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 4. Docker Deployment

### Docker Setup

Create `Dockerfile` for backend:

```dockerfile
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=builder /app/target/QCare-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
```

### Docker Compose (Production)

```yaml
version: '3.8'

services:
  backend:
    image: gohomies-backend:latest
    container_name: gohomies-backend
    ports:
      - "8080:8080"
    environment:
      SPRING_PROFILES_ACTIVE: prod
      SPRING_DATASOURCE_URL: ${DB_URL}
      SPRING_DATASOURCE_USERNAME: ${DB_USERNAME}
      SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET_KEY: ${JWT_SECRET_KEY}
      CLOUDINARY_CLOUD_NAME: ${CLOUDINARY_CLOUD_NAME}
      CLOUDINARY_API_KEY: ${CLOUDINARY_API_KEY}
      CLOUDINARY_API_SECRET: ${CLOUDINARY_API_SECRET}
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      GEMINI_API_KEY: ${GEMINI_API_KEY}
      APP_CORS_ALLOWED_ORIGINS: ${APP_CORS_ALLOWED_ORIGINS}
    restart: unless-stopped
    networks:
      - gohomies-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/api/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  frontend:
    image: gohomies-frontend:latest
    container_name: gohomies-frontend
    ports:
      - "3000:80"
    environment:
      VITE_API_BASE_URL: https://api.yourdomain.com
    restart: unless-stopped
    networks:
      - gohomies-network

  admin:
    image: gohomies-admin:latest
    container_name: gohomies-admin
    ports:
      - "3001:80"
    environment:
      VITE_API_BASE_URL: https://api.yourdomain.com
    restart: unless-stopped
    networks:
      - gohomies-network

networks:
  gohomies-network:
    driver: bridge
```

Build and run:
```bash
docker compose build
docker compose up -d
```

---

## 5. SSL/TLS Setup (HTTPS)

### Using Let's Encrypt with Certbot

```bash
sudo apt-get install certbot python3-certbot-nginx

# For yourdomain.com
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com

# For admin.yourdomain.com
sudo certbot certonly --nginx -d admin.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Update Nginx Config

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # ... rest of config
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 6. Health Checks & Monitoring

### Backend Health Endpoint

```
GET /api/actuator/health
```

Response:
```json
{
  "status": "UP",
  "components": {
    "db": {"status": "UP"},
    "diskSpace": {"status": "UP"},
    "livenessState": {"status": "UP"},
    "readinessState": {"status": "UP"}
  }
}
```

### Monitor these in production:
- Database connection pool health
- API response times
- Error rates
- Disk space (for file uploads)
- Memory usage
- JWT token validation failures

---

## 7. Database Backup Strategy

### TiDB Cloud Automatic Backups
- Enable automated backups in TiDB Cloud console
- Retention period: 30 days recommended
- Test restore procedures monthly

### Manual Backup (if needed)
```bash
# Using mysqldump
mysqldump -h your-host -u your-user -p GoHommiesDB > backup_$(date +%Y%m%d).sql

# Restore from backup
mysql -h your-host -u your-user -p GoHommiesDB < backup_$(date +%Y%m%d).sql
```

---

## 8. Post-Deployment Steps

1. **Verify all services are running**:
   ```bash
   curl https://yourdomain.com/api/actuator/health
   curl https://yourdomain.com/
   curl https://admin.yourdomain.com/
   ```

2. **Test critical flows**:
   - User signup/login
   - Profile creation and image upload
   - Hotel booking
   - Trip planning

3. **Monitor logs**:
   ```bash
   docker logs -f gohomies-backend
   ```

4. **Set up log aggregation** (optional but recommended):
   - ELK Stack (Elasticsearch, Logstash, Kibana)
   - Datadog
   - New Relic
   - CloudWatch (if on AWS)

5. **Set up alerts** for:
   - API errors (500+ status codes)
   - High response times (> 2s)
   - Database connection failures
   - Disk space usage > 80%

---

## 9. Scaling Considerations

### Horizontal Scaling
- Use load balancer (AWS ELB, Nginx, HAProxy)
- Run multiple backend instances
- Use sticky sessions if needed for session affinity

### Database Scaling
- TiDB Cloud handles horizontal scaling automatically
- Increase connection pool size if running multiple instances
- Monitor slow query logs

### Frontend/Admin CDN
- Use Cloudflare or AWS CloudFront for global distribution
- Cache static assets with long TTL
- Invalidate cache on deployments

---

## 10. Troubleshooting

### Backend won't start
- Check: `SPRING_PROFILES_ACTIVE=prod`
- Check: All required env variables are set
- Check: Database is accessible
- Check: Port 8080 is not in use

### CORS errors
- Verify `APP_CORS_ALLOWED_ORIGINS` includes frontend domains
- No trailing slashes in origin URLs
- Check browser console for exact rejected origin

### Image uploads fail
- Verify Cloudinary credentials
- Check upload folder exists in Cloudinary
- Monitor Cloudinary API usage quota

### Database connection pool exhausted
- Increase `DB_POOL_MAX_SIZE`
- Close inactive connections faster: `DB_KEEPALIVE_TIME_MS`
- Monitor active connections in TiDB Cloud console

---

## 11. Rollback Plan

If something goes wrong in production:

1. **Database**: Keep previous backups for 30 days
2. **Backend**: Tag Docker images with version numbers
   ```bash
   docker tag gohomies-backend:latest gohomies-backend:v1.0.0
   docker push gohomies-backend:v1.0.0
   ```
3. **Frontend/Admin**: Keep previous builds in CDN
4. **Communication**: Notify users of any downtime

---

## Support & Maintenance

- Review logs daily for first month
- Weekly: Check error rates, response times, storage usage
- Monthly: Review security updates, test backups, performance tune
- Quarterly: Full system audit, capacity planning

---

**Last Updated**: May 7, 2026
**Maintained by**: DevOps Team
