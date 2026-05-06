# 🚀 GoHomies Backend - Render Deployment Summary

Everything you need to deploy the GoHomies backend on Render.

## 📦 What's Included

### Configuration Files
- ✅ `render.yaml` - Render infrastructure as code
- ✅ `.env.render.example` - Environment variables template
- ✅ `Dockerfile` - Optimized for Render deployment
- ✅ `application-prod.yml` - Production Spring configuration

### Documentation
- ✅ `RENDER_DEPLOYMENT_GUIDE.md` - Step-by-step deployment guide
- ✅ `RENDER_CHECKLIST.md` - Pre/post-deployment checklist
- ✅ `RENDER_DEPLOYMENT_SUMMARY.md` - This file

### CI/CD
- ✅ `.github/workflows/deploy-render.yml` - Auto-deploy on GitHub push

---

## ⚡ Quick Start (3 Steps)

### Step 1️⃣: Push Code to GitHub
```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### Step 2️⃣: Create Render Web Service
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select `gohomies` repo and `main` branch
5. Set name: `gohomies-backend`
6. Environment: `Docker`
7. Click "Create Web Service"

### Step 3️⃣: Add Environment Variables
Copy all variables from `.env.render.example` to Render dashboard:
- Database credentials (TiDB Cloud)
- JWT secret key
- API keys (Cloudinary, OpenAI, Gemini)
- CORS origins
- Email credentials

Done! Render automatically deploys.

---

## 📋 Render Environment Variables Needed

### Database (TiDB Cloud)
```
SPRING_DATASOURCE_URL=jdbc:mysql://host:4000/GoHommiesDB?useSSL=true&serverTimezone=UTC
SPRING_DATASOURCE_USERNAME=your_username
SPRING_DATASOURCE_PASSWORD=your_password
```

### Security
```
SPRING_PROFILES_ACTIVE=prod
JWT_SECRET_KEY=your-32-character-secret-key
JWT_EXPIRATION_MS=86400000
```

### Services
```
CLOUDINARY_CLOUD_NAME=your_account
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

OPENAI_API_KEY=sk-proj-xxxxx
GEMINI_API_KEY=your_key

APP_CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://admin.yourdomain.com
```

### Email
```
MAIL_USERNAME=your@gmail.com
MAIL_PASSWORD=app_specific_password
MAIL_FROM=your@gmail.com
```

### Spring Configuration
```
SPRING_JPA_HIBERNATE_DDL_AUTO=validate
FLYWAY_ENABLED=false
LOGGING_LEVEL_ROOT=WARN
LOGGING_LEVEL_COM_GOHOMMIES=INFO
```

---

## ✅ Deployment Verification

### Check if deployment is successful:

```bash
# Health check
curl https://gohomies-backend.onrender.com/api/actuator/health

# Response should be:
# {"status":"UP"}

# Test API
curl -X POST https://gohomies-backend.onrender.com/api/public/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123","name":"Test"}'
```

### In Render Dashboard:
1. Check "Logs" tab - should see "Application startup complete"
2. Check "Metrics" - CPU/Memory should be normal
3. Check "Overview" - Status should show "Live"

---

## 🔄 Auto-Deploy from GitHub

When you push to main branch, Render automatically:
1. Pulls latest code from GitHub
2. Builds Docker image
3. Runs tests (optional, see `.github/workflows/deploy-render.yml`)
4. Deploys to Render
5. Health check passes

No manual deployment needed!

---

## 🆘 Troubleshooting

### Build Fails
```
ERROR: BuildFailed

✓ Check: backend/Dockerfile exists
✓ Check: pom.xml syntax
✓ Run locally: mvn clean package -DskipTests
```

### Service Won't Start
```
ERROR: Container startup failed

✓ Check: All env variables set
✓ Check: Database URL is correct
✓ Check: JWT secret key is set (32+ chars)
✓ Test: curl https://url/api/actuator/health
```

### CORS Errors
```
ERROR: Access blocked by CORS

✓ Check: APP_CORS_ALLOWED_ORIGINS includes frontend domain
✓ Check: No trailing slashes in origins
✓ Action: Restart service after updating
```

---

## 📊 Monitoring

### View Logs
```bash
# Via Render Dashboard
Service → Logs tab

# Watch in real-time
Click "Live logs" in dashboard
```

### Key Things to Monitor
- Startup time (should be < 60 seconds)
- Error count (should be 0)
- Database connections (should connect)
- API response time (should be < 500ms)

### Alerts
Enable notifications in Render dashboard for:
- Build failures
- Service crashes
- Health check failures

---

## 💰 Cost

| Plan | Cost | Best For |
|------|------|----------|
| **Starter** | Free | Development, testing |
| **Standard** | $7/month | Production |
| **Pro** | $12/month | High traffic production |

With TiDB Cloud: ~$15-50/month depending on usage

---

## 🌍 Custom Domain

To use your own domain (e.g., `api.yourdomain.com`):

1. In Render dashboard → Settings
2. Scroll to "Custom Domain"
3. Enter domain: `api.yourdomain.com`
4. In your DNS registrar, add CNAME:
   ```
   Name: api
   Type: CNAME
   Value: gohomies-backend.onrender.com
   ```
5. Wait 5-30 minutes for DNS propagation
6. Test: `curl https://api.yourdomain.com/api/actuator/health`

---

## 📚 Files Reference

| File | Purpose |
|------|---------|
| `render.yaml` | Render infrastructure definition |
| `.env.render.example` | Environment variables template |
| `Dockerfile` | Docker build configuration |
| `application-prod.yml` | Spring Boot production config |
| `RENDER_DEPLOYMENT_GUIDE.md` | Detailed step-by-step guide |
| `RENDER_CHECKLIST.md` | Pre/post-deployment checklist |
| `.github/workflows/deploy-render.yml` | GitHub Actions CI/CD |

---

## 🚀 Deployment Checklist

Before deploying:
- [ ] All code committed and pushed to GitHub
- [ ] Render account created
- [ ] TiDB Cloud database accessible
- [ ] All API keys ready
- [ ] Environment variables prepared

During deployment:
- [ ] Web Service created
- [ ] Dockerfile detected
- [ ] Build starts automatically
- [ ] Build completes successfully
- [ ] Service shows "Live" status

After deployment:
- [ ] Health endpoint responds
- [ ] Database connected
- [ ] Logs show no errors
- [ ] API accepting requests
- [ ] Frontend can reach backend

---

## 🔗 Useful Links

- **Render Dashboard**: https://dashboard.render.com
- **Render Documentation**: https://render.com/docs
- **TiDB Cloud Console**: https://tidbcloud.com
- **GitHub Repository**: Your repo URL
- **Deployed Backend**: https://gohomies-backend.onrender.com

---

## 📞 Support

### If deployment fails:
1. Check Render logs for error message
2. Verify all environment variables are set
3. Check TiDB Cloud database is running
4. Read `RENDER_DEPLOYMENT_GUIDE.md` troubleshooting section

### For more help:
- Render Support: https://community.render.com
- Spring Boot Docs: https://spring.io
- GitHub Issues: Create in your repository

---

## Next Steps

### Frontend Deployment
Deploy frontend to Render too:
```bash
# Create new Web Service
# Select frontend directory
# Build: npm run build
# Start: npm run preview
# Add environment variable: VITE_API_BASE_URL=https://gohomies-backend.onrender.com
```

### Admin Panel Deployment
Same as frontend, but for the `admin` directory.

### Custom Domain Setup
Configure your domain to point to Render services.

### Monitoring Setup
Enable Slack/email notifications in Render.

---

## Summary

You now have:
- ✅ Backend ready for Render deployment
- ✅ Docker container optimized
- ✅ All environment variables documented
- ✅ Auto-deployment from GitHub configured
- ✅ Comprehensive deployment guides
- ✅ Pre/post-deployment checklists

**Your backend is production-ready for Render!** 🎉

---

**Deployment Guide Version**: 1.0
**Last Updated**: May 7, 2026
**Created For**: GoHomies Project
