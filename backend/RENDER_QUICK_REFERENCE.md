# 🚀 Render Deployment - Quick Reference Card

**Print this page or bookmark it for quick reference during deployment.**

---

## Step 1️⃣: Code Preparation

```bash
# Ensure all code is committed
git add .
git commit -m "Deployment to Render"
git push origin main

# Verify local build works
cd backend
mvn clean package -DskipTests
```

✅ Check: `target/QCare-0.0.1-SNAPSHOT.jar` exists

---

## Step 2️⃣: Render Account Setup

1. Go to https://render.com
2. Sign up (free account)
3. Verify email
4. Connect GitHub account

---

## Step 3️⃣: Create Web Service

| Setting | Value |
|---------|-------|
| Click | "New +" → "Web Service" |
| Repository | Select `gohomies` |
| Branch | `main` |
| Service Name | `gohomies-backend` |
| Environment | `Docker` |
| Region | Closest to you |
| Instance Type | `Standard` ($7/month) |
| Auto-deploy | Enable ✓ |

---

## Step 4️⃣: Add Environment Variables

Copy each variable from `.env.render.example` to Render dashboard:

### Database (Required)
```
SPRING_DATASOURCE_URL: jdbc:mysql://host:4000/GoHommiesDB...
SPRING_DATASOURCE_USERNAME: your_user
SPRING_DATASOURCE_PASSWORD: your_pass
```

### JWT (Required)
```
SPRING_PROFILES_ACTIVE: prod
JWT_SECRET_KEY: [32 char secret - use: openssl rand -base64 32]
JWT_EXPIRATION_MS: 86400000
```

### Cloudinary (Required)
```
CLOUDINARY_CLOUD_NAME: your_account
CLOUDINARY_API_KEY: your_key
CLOUDINARY_API_SECRET: your_secret
```

### AI Services (Required)
```
OPENAI_API_KEY: sk-proj-...
GEMINI_API_KEY: your_key
```

### CORS (Required)
```
APP_CORS_ALLOWED_ORIGINS: https://yourdomain.com,https://admin.yourdomain.com
```

### Email (Required)
```
MAIL_USERNAME: your@gmail.com
MAIL_PASSWORD: gmail_app_password
MAIL_FROM: your@gmail.com
```

### Spring Config (Copy as-is)
```
SPRING_JPA_HIBERNATE_DDL_AUTO: validate
FLYWAY_ENABLED: false
LOGGING_LEVEL_ROOT: WARN
LOGGING_LEVEL_COM_GOHOMMIES: INFO
```

---

## Step 5️⃣: Deploy

1. Click **"Create Web Service"**
2. Wait for build to start
3. Monitor progress in **"Logs"** tab
4. Wait for status to change to **"Live"**

⏱️ Typical build time: 3-5 minutes

---

## Step 6️⃣: Verify Deployment ✅

### Health Check
```bash
curl https://gohomies-backend.onrender.com/api/actuator/health
```

Expected: `{"status":"UP"}`

### Check Logs
1. Go to Render dashboard
2. Click "Logs" tab
3. Look for: "Application startup complete"
4. No "ERROR" messages should appear

### Test API
```bash
curl -X POST https://gohomies-backend.onrender.com/api/public/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "name": "Test User"
  }'
```

Expected: Token or success message

---

## 🆘 Emergency Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails | Check Java version, pom.xml syntax |
| Service crashes | Missing env variables, database issue |
| Can't connect to DB | Check DB URL, IP whitelist, credentials |
| CORS errors | Add domain to `APP_CORS_ALLOWED_ORIGINS` |
| Health check fails | Wait 60 seconds, check logs |
| Port conflicts | Render assigns port automatically |

---

## 📞 Quick Links

- **Render Dashboard**: https://dashboard.render.com
- **Service Health**: https://gohomies-backend.onrender.com/api/actuator/health
- **Render Docs**: https://render.com/docs
- **This Guide**: backend/RENDER_DEPLOYMENT_GUIDE.md
- **Checklist**: backend/RENDER_CHECKLIST.md

---

## 💾 Important Environment Variables

Generate JWT Secret:
```bash
openssl rand -base64 32
```

Gmail App Password:
1. Go to Google Account Security
2. Enable 2FA
3. Create App Password
4. Use that password (not your Gmail password)

---

## 📊 Deployment Timeline

| Step | Duration | Status |
|------|----------|--------|
| Code push | Instant | ✓ |
| Render detection | < 1 min | ✓ |
| Docker build | 2-3 min | ⏳ |
| Application startup | 1-2 min | ⏳ |
| Health check pass | 1 min | ✓ |
| **Total** | **~5-7 min** | ✓ |

---

## ✅ Success Indicators

- Service shows **"Live"** status
- Health check returns **200 OK**
- Logs show **"Application startup complete"**
- No **ERROR** messages in logs
- Can create user via API
- Can upload image to Cloudinary
- Frontend connects successfully

---

## 🚀 After Deployment

1. Update frontend API URL:
   ```
   VITE_API_BASE_URL=https://gohomies-backend.onrender.com
   ```

2. Deploy frontend to Render (same process)

3. Deploy admin panel to Render (same process)

4. Monitor logs daily for first week

5. Set up custom domain (optional)

---

## 📋 Pre-Deployment Checklist

- [ ] Code committed and pushed
- [ ] Render account created
- [ ] GitHub connected to Render
- [ ] TiDB Cloud database accessible
- [ ] All API keys ready
- [ ] Environment variables prepared
- [ ] Dockerfile exists in `backend/`
- [ ] render.yaml exists in `backend/`

---

## 🔐 Keep These Secure

🔒 **Never share**:
- JWT_SECRET_KEY
- Database password
- API keys
- Email passwords
- Gmail app password

💾 **Store in**: GitHub Secrets or secure vault

📝 **Document in**: `.env` files (git-ignored)

---

## 🎯 One-Command Reference

```bash
# After setting env variables in Render, just push:
git add .
git commit -m "Deploy to Render"
git push origin main

# That's it! Render handles the rest automatically.
```

---

## 📚 More Information

- Full guide: `backend/RENDER_DEPLOYMENT_GUIDE.md`
- Detailed checklist: `backend/RENDER_CHECKLIST.md`
- File index: `backend/RENDER_FILES_INDEX.md`
- Summary: `backend/RENDER_DEPLOYMENT_SUMMARY.md`

---

**Deployment is successful when you see: "Application startup complete" in logs!** 🎉
