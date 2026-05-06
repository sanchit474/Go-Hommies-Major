# GoHomies Backend - Render Deployment Checklist

Complete this checklist before deploying to Render.

## Prerequisites

- [ ] Render account created (https://render.com)
- [ ] GitHub repository created and code pushed
- [ ] TiDB Cloud database created and accessible
- [ ] All API keys generated

## Step 1: Prepare Code

- [ ] Run `mvn clean package -DskipTests` locally - builds successfully
- [ ] Dockerfile exists in `backend/` directory
- [ ] `render.yaml` exists in `backend/` directory
- [ ] `.env.render.example` exists
- [ ] All config files use environment variables (no hardcoded secrets)
- [ ] Code pushed to GitHub main branch

## Step 2: Create Render Web Service

- [ ] Go to https://render.com/dashboard
- [ ] Click "New +" → "Web Service"
- [ ] Select GitHub repository
- [ ] Repository name: `gohomies`
- [ ] Branch: `main`
- [ ] Service name: `gohomies-backend`
- [ ] Environment: `Docker`
- [ ] Region: Choose closest to your users
- [ ] Instance type: `Standard` ($7/month) for production
- [ ] Auto-deploy: Enabled

## Step 3: Configure Build Settings

- [ ] Root directory: leave blank (auto-detect)
- [ ] Dockerfile path: `backend/Dockerfile`
- [ ] Build command: auto-detected from Dockerfile
- [ ] Start command: auto-detected from Dockerfile
- [ ] Plan: Standard (minimum for production)

## Step 4: Set All Environment Variables

Copy from `.env.render.example` and fill in actual values:

### Database
- [ ] `SPRING_DATASOURCE_URL` = TiDB Cloud connection string
- [ ] `SPRING_DATASOURCE_USERNAME` = TiDB username
- [ ] `SPRING_DATASOURCE_PASSWORD` = TiDB password

### JWT & Security
- [ ] `SPRING_PROFILES_ACTIVE` = `prod`
- [ ] `JWT_SECRET_KEY` = 32+ character secret (use `openssl rand -base64 32`)
- [ ] `JWT_EXPIRATION_MS` = `86400000`

### Cloudinary
- [ ] `CLOUDINARY_CLOUD_NAME` = your account name
- [ ] `CLOUDINARY_API_KEY` = your API key
- [ ] `CLOUDINARY_API_SECRET` = your API secret

### AI Services
- [ ] `OPENAI_API_KEY` = sk-proj-xxxxx
- [ ] `GEMINI_API_KEY` = your gemini key

### CORS & Email
- [ ] `APP_CORS_ALLOWED_ORIGINS` = your frontend URLs (comma-separated, no trailing /)
- [ ] `MAIL_USERNAME` = your gmail
- [ ] `MAIL_PASSWORD` = gmail app password (not regular password)
- [ ] `MAIL_FROM` = your gmail

### Spring Configuration
- [ ] `SPRING_JPA_HIBERNATE_DDL_AUTO` = `validate`
- [ ] `FLYWAY_ENABLED` = `false`
- [ ] `LOGGING_LEVEL_ROOT` = `WARN`
- [ ] `LOGGING_LEVEL_COM_GOHOMMIES` = `INFO`

## Step 5: Deploy & Monitor

- [ ] Click "Create Web Service"
- [ ] Wait for build to start (watch "Logs" tab)
- [ ] Build completes successfully
- [ ] Service shows "Live" status
- [ ] Check deployment URL in Service Overview

## Step 6: Verify Deployment

### Health Check
- [ ] Run: `curl https://gohomies-backend.onrender.com/api/actuator/health`
- [ ] Response: `{"status":"UP"}`

### Check Logs
- [ ] Go to Render dashboard → "Logs" tab
- [ ] Look for "Application startup complete"
- [ ] No "ERROR" messages visible

### Database Connection
- [ ] Check log: "Connection pool initialized"
- [ ] If error: verify database URL and credentials

### API Test
```bash
curl -X POST https://gohomies-backend.onrender.com/api/public/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123",
    "name": "Test User"
  }'
```
- [ ] Response includes token or success message

## Step 7: Troubleshooting

### Build Fails
- [ ] Check Java version: should be 17
- [ ] Run locally: `mvn clean package -DskipTests`
- [ ] Check pom.xml syntax
- [ ] Check Render logs for specific error

### Service Crashes After Deploy
- [ ] Check all environment variables are set
- [ ] Verify database is accessible
- [ ] Check JWT secret key is set
- [ ] Run health check to see error details

### CORS Errors on Frontend
- [ ] Check `APP_CORS_ALLOWED_ORIGINS` includes frontend domain
- [ ] No trailing slashes: `https://domain.com` not `https://domain.com/`
- [ ] Multiple domains: separate with commas
- [ ] Restart service after changing env var

### Database Connection Timeout
- [ ] Verify TiDB Cloud database is running
- [ ] Check TiDB IP whitelist: allow all IPs (0.0.0.0/0)
- [ ] Test locally with same connection string
- [ ] Check network: `mysql -h host -u user -p`

## Step 8: Post-Deployment

- [ ] Test user signup/login
- [ ] Test image upload (Cloudinary)
- [ ] Test email sending
- [ ] Update frontend API URL to new Render URL
- [ ] Add custom domain (optional)
  - [ ] Add CNAME record in DNS
  - [ ] Configure in Render dashboard

## Step 9: Monitoring & Maintenance

- [ ] Set up Render email notifications for failures
- [ ] Check logs regularly for errors
- [ ] Monitor CPU/Memory usage
- [ ] Test health endpoint weekly
- [ ] Rotate API keys monthly
- [ ] Update dependencies regularly

## Step 10: Custom Domain (Optional)

- [ ] Domain registered and accessible
- [ ] Go to Service Settings → Custom Domain
- [ ] Enter domain: `api.yourdomain.com`
- [ ] Add CNAME record to DNS registrar:
  - [ ] Name: `api`
  - [ ] Type: `CNAME`
  - [ ] Value: `gohomies-backend.onrender.com`
- [ ] Wait for DNS propagation (5-30 minutes)
- [ ] Test: `curl https://api.yourdomain.com/api/actuator/health`

## Deployment Summary

| Item | Status |
|------|--------|
| Code pushed to GitHub | [ ] |
| Render account created | [ ] |
| Web Service created | [ ] |
| Environment variables set | [ ] |
| Build successful | [ ] |
| Service live | [ ] |
| Health check passing | [ ] |
| Database connected | [ ] |
| API responding | [ ] |
| Frontend can reach API | [ ] |

## Useful Render Commands

```bash
# View service status
curl https://gohomies-backend.onrender.com/api/actuator/health

# Manual redeploy (in Render dashboard)
Click "Manual Deploy" → "Deploy latest"

# Check logs (in Render dashboard)
Click "Logs" tab and scroll through output

# Stop service (temporary)
Click "Suspend" in Settings tab

# Delete service (permanent)
Click "Delete Service" in Settings tab
```

## Render Dashboard Navigation

- **Overview** - Service URL, status, deployment info
- **Logs** - Real-time application logs
- **Metrics** - CPU, Memory, Bandwidth usage
- **Environment** - Environment variables management
- **Settings** - Service configuration, custom domain, auto-deploy
- **Deployments** - Deployment history, rollback option
- **Health Checks** - Health endpoint status

## Support

- **Render Status**: https://status.render.com
- **Render Support**: support@render.com
- **Documentation**: https://render.com/docs
- **Community**: https://community.render.com

---

**Deployment Date**: _______________
**Deployed By**: _______________
**Issues Found**: _______________
**Resolution**: _______________
