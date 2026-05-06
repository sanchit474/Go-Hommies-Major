# Backend Deployment Files - Complete Index

This directory contains everything needed to deploy the GoHomies backend to **Render**.

---

## 📁 File Structure

```
backend/
├── Dockerfile                           # Docker image for Render
├── render.yaml                          # Render infrastructure config
├── .env.example                         # Environment variables template (all platforms)
├── .env.render.example                  # Environment variables template (Render-specific)
├── RENDER_DEPLOYMENT_SUMMARY.md        # Quick overview & summary
├── RENDER_DEPLOYMENT_GUIDE.md          # Step-by-step deployment guide
├── RENDER_CHECKLIST.md                 # Pre/post-deployment checklist
├── src/
│   └── main/
│       └── resources/
│           ├── application.yml         # Spring Boot main config
│           ├── application-prod.yml    # Spring Boot production config
│           ├── application-dev.yml     # Spring Boot development config
│           └── db/
│               └── migration/          # Database migrations (if using Flyway)
├── pom.xml                             # Maven dependencies
└── .github/
    └── workflows/
        └── deploy-render.yml           # GitHub Actions CI/CD
```

---

## 📖 Documentation Files (Read These First)

### 1. **RENDER_DEPLOYMENT_SUMMARY.md** ⭐ START HERE
   - Quick overview of what's included
   - 3-step quick start
   - Key environment variables
   - Verification steps
   - Troubleshooting guide

### 2. **RENDER_DEPLOYMENT_GUIDE.md** 📚 DETAILED GUIDE
   - Prerequisites and setup
   - Step-by-step deployment instructions
   - Configuration details
   - Environment variables explained
   - Scaling and performance tips
   - Custom domain setup
   - Cost estimation

### 3. **RENDER_CHECKLIST.md** ✅ USE DURING DEPLOYMENT
   - Pre-deployment checklist
   - Step-by-step with checkboxes
   - Environment variables to set (with values)
   - Verification tests
   - Post-deployment testing
   - Troubleshooting checklist

---

## 🔧 Configuration Files

### **render.yaml**
Render's infrastructure-as-code file. Defines:
- Service name: `gohomies-backend`
- Runtime: Java
- Build command: Maven package
- Health check endpoint
- Auto-deploy settings
- Environment variables

**Usage**: Render automatically reads this file from your repository.

### **Dockerfile**
Multi-stage Docker build optimized for Render:
- Build stage: Maven compiles Java
- Runtime stage: Alpine-based JRE (small image)
- Health check: Monitors service health
- PORT support: Configurable port for Render

**Features**:
- Minimal image size (~300MB)
- Fast startup
- Health check built-in

### **.env.example**
General environment variables template for any deployment platform.
- Database configuration
- JWT settings
- Cloudinary credentials
- Email configuration
- Spring configuration

**Usage**: Reference for setting up any environment.

### **.env.render.example**
Render-specific environment variables template.
- Render-compatible format
- Comments explaining each variable
- All required variables listed

**Usage**: Copy to Render dashboard when deploying.

### **application.yml**
Main Spring Boot configuration (all profiles):
```yaml
- Application name: GoHomies
- Profile: Active profile selection
- Port: Supports PORT environment variable
- JPA configuration
- JWT expiration settings
```

### **application-prod.yml**
Production-specific Spring Boot configuration:
```yaml
- Database: Hikari connection pool with tuned settings
- JPA: Hibernate with validate-only mode (safe for production)
- JWT: Uses environment variable for secret
- Cloudinary: Image upload service
- CORS: Environment-based allowed origins
- Error messages: Disabled in production
- Logging: Minimal (WARN level)
```

**Key Setting**: `ddl-auto: validate` - Schema is read-only in production

---

## 🚀 Deployment Files

### **.github/workflows/deploy-render.yml**
GitHub Actions CI/CD pipeline:
1. **Build** - Maven compiles Java code
2. **Test** - Runs unit tests with Docker MySQL
3. **Deploy** - Triggers Render deployment hook

**Features**:
- Runs on every push to `main` branch
- Only deploys if code changes are in `backend/` directory
- Sends Slack notifications (optional)
- Automatic rollback on failure

**Setup Required**: Add `RENDER_DEPLOY_HOOK` as GitHub secret

---

## 📋 What Each File Does

| File | Purpose | When to Use |
|------|---------|-------------|
| `RENDER_DEPLOYMENT_SUMMARY.md` | Quick overview | First time deploying |
| `RENDER_DEPLOYMENT_GUIDE.md` | Detailed steps | During deployment |
| `RENDER_CHECKLIST.md` | Verification | Before/after deployment |
| `render.yaml` | Infrastructure config | Render reads automatically |
| `Dockerfile` | Container image | Render uses to build |
| `.env.render.example` | Env var template | Setting up in Render dashboard |
| `application-prod.yml` | Spring config | Production behavior |
| `.github/workflows/deploy-render.yml` | CI/CD | Auto-deploy from GitHub |

---

## 🎯 Quick Deployment Steps

### For First-Time Deployment:

1. **Read**: `RENDER_DEPLOYMENT_SUMMARY.md` (5 min)
2. **Follow**: `RENDER_DEPLOYMENT_GUIDE.md` Step 1-3 (10 min)
3. **Use**: `RENDER_CHECKLIST.md` for verification (5 min)
4. **Test**: Health endpoint responds

**Total time**: ~20 minutes

### For Subsequent Deployments:

1. Make code changes
2. `git push origin main`
3. Render automatically deploys (GitHub Actions + render.yaml)
4. Check Render dashboard for status

**Total time**: ~2 minutes (automatic)

---

## 🔐 Environment Variables Setup

### Where to Get Values

| Variable | Source | Example |
|----------|--------|---------|
| `SPRING_DATASOURCE_URL` | TiDB Cloud Console | `jdbc:mysql://host:4000/db` |
| `SPRING_DATASOURCE_USERNAME` | TiDB Cloud Console | `root` |
| `SPRING_DATASOURCE_PASSWORD` | TiDB Cloud Console | `password123` |
| `JWT_SECRET_KEY` | Generate: `openssl rand -base64 32` | `abc123...` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Dashboard | `myaccount` |
| `CLOUDINARY_API_KEY` | Cloudinary Dashboard | `12345...` |
| `CLOUDINARY_API_SECRET` | Cloudinary Dashboard | `secret...` |
| `OPENAI_API_KEY` | OpenAI Platform | `sk-proj-...` |
| `GEMINI_API_KEY` | Google AI Studio | `api-key...` |
| `APP_CORS_ALLOWED_ORIGINS` | Your domains | `https://yourdomain.com` |
| `MAIL_USERNAME` | Gmail account | `your@gmail.com` |
| `MAIL_PASSWORD` | Gmail app password | `xyz123...` |

### How to Set in Render

1. Render Dashboard → Your Service
2. Settings tab → Environment
3. Click "+ Add Environment Variable"
4. Paste key from `.env.render.example`
5. Paste value you gathered
6. Repeat for all variables
7. Service automatically redeploys

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] **Health Check**: `curl https://url/api/actuator/health` returns `{"status":"UP"}`
- [ ] **Database**: Render logs show "connection pool initialized"
- [ ] **API**: Can register new user via `/api/public/auth/register`
- [ ] **Images**: Image upload to Cloudinary works
- [ ] **Logs**: No ERROR messages in Render logs
- [ ] **Response Time**: API responds in < 500ms

---

## 🆘 Common Issues

### Service Won't Start
```
✓ Check: All 15 environment variables are set
✓ Check: Database is accessible
✓ Check: JWT secret key is 32+ characters
```

### Build Fails
```
✓ Check: pom.xml syntax is valid
✓ Check: Java 17 is available
✓ Check: Run locally: mvn clean package -DskipTests
```

### CORS Errors
```
✓ Check: APP_CORS_ALLOWED_ORIGINS includes frontend domain
✓ Check: No trailing slashes: https://domain.com not https://domain.com/
✓ Action: Restart service after changing variable
```

---

## 📞 Getting Help

### For Deployment Questions
- Read: `RENDER_DEPLOYMENT_GUIDE.md` troubleshooting section
- Check: `RENDER_CHECKLIST.md` for common issues
- Visit: https://community.render.com

### For Spring Boot Questions
- Docs: https://spring.io/projects/spring-boot
- Guides: https://spring.io/guides

### For Database Questions
- TiDB Docs: https://docs.tidbcloud.com
- MySQL Docs: https://dev.mysql.com

---

## 🎓 File Dependencies

```
RENDER_DEPLOYMENT_SUMMARY.md
    ↓ (explains)
    render.yaml + Dockerfile + .env.render.example
    ↓
RENDER_DEPLOYMENT_GUIDE.md
    ↓ (steps reference)
    Render Dashboard + GitHub + TiDB Cloud
    ↓
RENDER_CHECKLIST.md
    ↓ (verifies)
    Health endpoints + Logs
```

---

## 🚀 Next Steps After Deployment

1. **Deploy Frontend** to Render
   - Use same pattern
   - Set `VITE_API_BASE_URL` to your backend URL

2. **Deploy Admin Panel** to Render
   - Use same pattern
   - Set `VITE_API_BASE_URL` to your backend URL

3. **Set Custom Domain** (optional)
   - Configure in Render dashboard
   - Add CNAME record in DNS

4. **Monitor Application**
   - Check logs regularly
   - Set up email alerts
   - Monitor metrics

5. **Regular Maintenance**
   - Update dependencies monthly
   - Rotate API keys quarterly
   - Review database backups
   - Test disaster recovery

---

## 📊 File Sizes & Performance

| File | Size | Load Time |
|------|------|-----------|
| `Dockerfile` | 400 bytes | N/A |
| `render.yaml` | 2 KB | N/A |
| Docker image | ~300 MB | 30-60 sec startup |
| Startup time | N/A | 40-60 seconds |
| Health check | N/A | < 100ms response |

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | May 7, 2026 | Initial release |

---

## 🎯 Success Criteria

Your deployment is successful when:
- ✅ Service status is "Live" in Render dashboard
- ✅ Health endpoint returns `{"status":"UP"}`
- ✅ Database connection established
- ✅ No ERROR in logs
- ✅ API accepts requests
- ✅ Frontend can reach backend

---

**You now have a production-ready backend ready to deploy on Render!** 🚀

For questions, see the detailed guides above.
