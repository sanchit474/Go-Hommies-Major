# GoHomies Deployment Quick Start

This guide helps you quickly deploy GoHomies to production.

## 📋 Prerequisites

1. **Docker & Docker Compose** installed
   ```bash
   # Check versions
   docker --version
   docker compose --version
   ```

2. **TiDB Cloud Database** (or MySQL 5.7+)
   - Database URL, username, password ready

3. **Cloudinary Account** (for image uploads)
   - Cloud name, API key, API secret ready

4. **API Keys**
   - OpenAI API key
   - Gemini API key

5. **Domain & SSL**
   - Domain name registered
   - SSL certificate (Let's Encrypt recommended)

---

## 🚀 Quick Deploy (5 minutes)

### Step 1: Create Production Environment File

```bash
cp .env.production.example .env.production
```

Then edit `.env.production` and fill in:
- Database credentials
- API keys
- JWT secret (generate with: `openssl rand -base64 32`)
- CORS origins (your frontend domains)
- Cloudinary credentials

### Step 2: Build & Deploy

**On Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh production
```

**On Windows:**
```cmd
deploy.bat production
```

### Step 3: Verify Deployment

```bash
# Check backend health
curl http://localhost:8080/api/actuator/health

# Check frontend
curl http://localhost:3000

# View logs
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f admin
```

---

## 🔧 Configuration

All configuration is environment-based. No hardcoded secrets!

### Backend Environment Variables
See `backend/.env.example` for complete list.

Key variables:
- `DB_URL` - Database connection string
- `JWT_SECRET_KEY` - JWT signing key (min 32 chars)
- `CLOUDINARY_*` - Image upload service
- `OPENAI_API_KEY` - AI service
- `APP_CORS_ALLOWED_ORIGINS` - Frontend domains

### Frontend Environment Variables
See `frontend/.env.example`

Key variables:
- `VITE_API_BASE_URL` - Backend API URL

### Admin Environment Variables
See `admin/.env.example`

Key variables:
- `VITE_API_BASE_URL` - Backend API URL

---

## 🐳 Docker Commands

```bash
# Start services
docker compose up -d

# View logs
docker compose logs -f [backend|frontend|admin]

# Stop services
docker compose down

# Rebuild images
docker compose build --no-cache

# Run health check
bash health-check.sh
```

---

## 📊 Monitoring

### Health Endpoints
- Backend: `http://localhost:8080/api/actuator/health`
- Frontend: `http://localhost:3000/`
- Admin: `http://localhost:3001/`

### View Logs
```bash
# Backend logs
docker compose logs backend -f

# Frontend logs
docker compose logs frontend -f

# All services
docker compose logs -f
```

### Database Connection
```bash
# Test database connection
mysql -h $DB_HOST -u $DB_USER -p $DB_PASSWORD -e "SELECT 1"
```

---

## 🔒 Security

- [ ] JWT secret is cryptographically secure
- [ ] Database credentials are strong
- [ ] No environment variables in code
- [ ] HTTPS is enforced
- [ ] CORS is restricted to specific origins
- [ ] Rate limiting is enabled (Nginx)

---

## 📱 Testing After Deployment

### Manual Tests
1. **Signup/Login**: Create new account, login
2. **Profile**: Update profile, upload image
3. **Hotels**: Browse and book hotels
4. **Trips**: Create trip, add photos
5. **Admin**: Login to admin panel, view analytics

### API Tests
```bash
# Get JWT token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Use token in requests
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8080/api/traveller/profile
```

---

## 🆘 Troubleshooting

### Services won't start
```bash
# Check logs
docker compose logs

# Check ports are available
lsof -i :8080
lsof -i :3000
lsof -i :3001
```

### Database connection fails
```bash
# Test connection
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD

# Check network
docker exec gohomies-backend ping database-host
```

### CORS errors in browser
- Check `APP_CORS_ALLOWED_ORIGINS` includes your frontend domain
- No trailing slashes in origins
- Restart backend: `docker compose restart backend`

### Image uploads fail
- Verify Cloudinary credentials
- Check Cloudinary API quota
- Verify upload folder permissions

---

## 📈 Scaling for Production

### Vertical Scaling
- Increase database connection pool: `DB_POOL_MAX_SIZE`
- Increase JVM heap: `JAVA_OPTS=-Xmx2g`

### Horizontal Scaling
Use a load balancer (Nginx, HAProxy) in front of multiple backend instances:
```docker-compose
backend-1:
  image: gohomies-backend:latest
  # ...
backend-2:
  image: gohomies-backend:latest
  # ...
```

---

## 📚 Full Documentation

For detailed deployment guide, see `DEPLOYMENT_GUIDE.md`

For deployment checklist, see `DEPLOYMENT_CHECKLIST.md`

---

## 🆘 Support

**Issues?** Check:
1. `DEPLOYMENT_GUIDE.md` - Comprehensive guide
2. `DEPLOYMENT_CHECKLIST.md` - Full checklist
3. Docker logs - `docker compose logs`
4. Health check - `bash health-check.sh`

**Emergency Rollback:**
```bash
# Kill current deployment
docker compose down

# Restore from backup (if configured)
docker compose up -d
```

---

**Last Updated**: May 7, 2026
