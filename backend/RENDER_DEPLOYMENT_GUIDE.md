# GoHomies Backend - Render Deployment Guide

This guide walks you through deploying the GoHomies backend on [Render](https://render.com), a modern cloud platform.

## Prerequisites

1. **Render Account** - Sign up at https://render.com
2. **GitHub Repository** - Code pushed to GitHub
3. **TiDB Cloud Database** - Or any MySQL 5.7+ database
4. **API Keys Ready**:
   - JWT Secret (generate with: `openssl rand -base64 32`)
   - Cloudinary credentials
   - OpenAI API key
   - Gemini API key
   - Email credentials (Gmail app password)

---

## Step 1: Push Code to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Add Render deployment configuration"
git branch -M main
git remote add origin https://github.com/yourusername/gohomies.git
git push -u origin main
```

---

## Step 2: Connect Repository to Render

1. Go to [render.com](https://render.com) and login
2. Click **"New +"** → **"Web Service"**
3. Select **"Build and deploy from a Git repository"**
4. Click **"Connect GitHub account"** (authorize Render)
5. Find and select `gohomies` repository
6. Click **"Connect"**

---

## Step 3: Configure Web Service

### Basic Configuration

| Field | Value |
|-------|-------|
| **Name** | `gohomies-backend` |
| **Environment** | `Docker` |
| **Region** | Choose nearest region (us-east, eu-west, etc.) |
| **Branch** | `main` |
| **Dockerfile Path** | `backend/Dockerfile` |

### Instance Type & Scaling

| Field | Value |
|-------|-------|
| **Instance Type** | Starter (free) or Standard ($7/month) |
| **Auto Scaling** | Enable (optional) |
| **Min Instances** | 1 |
| **Max Instances** | 3 |

---

## Step 4: Set Environment Variables

In Render dashboard, go to **"Environment"** tab and add each variable:

### Database (TiDB Cloud)
```
SPRING_DATASOURCE_URL: jdbc:mysql://your-tidb-host:4000/GoHommiesDB?useSSL=true&serverTimezone=UTC
SPRING_DATASOURCE_USERNAME: your_tidb_user
SPRING_DATASOURCE_PASSWORD: your_tidb_password
```

### JWT Configuration
```
JWT_SECRET_KEY: [generate with: openssl rand -base64 32]
JWT_EXPIRATION_MS: 86400000
```

### Cloudinary (Image Upload)
```
CLOUDINARY_CLOUD_NAME: your_cloudinary_cloud_name
CLOUDINARY_API_KEY: your_cloudinary_api_key
CLOUDINARY_API_SECRET: your_cloudinary_api_secret
```

### AI Services
```
OPENAI_API_KEY: sk-proj-your-openai-key
GEMINI_API_KEY: your-gemini-api-key
```

### Email Configuration
```
MAIL_USERNAME: your_email@gmail.com
MAIL_PASSWORD: your_gmail_app_password
MAIL_FROM: your_email@gmail.com
```

### CORS Configuration
```
APP_CORS_ALLOWED_ORIGINS: https://yourdomain.com,https://admin.yourdomain.com
```

### Spring Configuration
```
SPRING_PROFILES_ACTIVE: prod
SPRING_JPA_HIBERNATE_DDL_AUTO: validate
FLYWAY_ENABLED: false
LOGGING_LEVEL_ROOT: WARN
LOGGING_LEVEL_COM_GOHOMMIES: INFO
```

---

## Step 5: Deploy

1. Click **"Create Web Service"**
2. Render will automatically:
   - Build the Docker image
   - Deploy to their servers
   - Assign you a URL like `https://gohomies-backend.onrender.com`

3. Monitor deployment in the **"Logs"** tab

---

## Step 6: Verify Deployment

### Check Health
```bash
curl https://gohomies-backend.onrender.com/api/actuator/health
```

Expected response:
```json
{
  "status": "UP"
}
```

### Check Logs
In Render dashboard, click **"Logs"** to view:
- Application startup logs
- Any errors or warnings
- Database connection status

---

## Troubleshooting

### Build Fails
**Error**: `BUILD FAILED`

**Solutions**:
1. Check Java version: Render uses Java 17 by default
2. Check `backend/Dockerfile` exists
3. Verify Maven dependencies: `mvn clean install -DskipTests`
4. Check build logs in Render dashboard

### Application Won't Start

**Error**: `Unable to start web server`

**Solutions**:
1. Check database connection: `SPRING_DATASOURCE_URL` is correct
2. Check JWT secret key is set
3. Verify environment variables are all set
4. Check logs for specific error message

### CORS Errors

**Error**: `Access to XMLHttpRequest blocked by CORS`

**Solutions**:
1. Add frontend URL to `APP_CORS_ALLOWED_ORIGINS`
2. No trailing slashes in origins
3. Restart web service after changing env variables

### Database Connection Timeout

**Error**: `Communication link failure`

**Solutions**:
1. Verify TiDB Cloud instance is running
2. Check IP whitelist in TiDB: allow `0.0.0.0/0` for Render
3. Test connection: `mysql -h your-host -u user -p`

---

## Using Render Database (PostgreSQL)

Instead of external TiDB, you can use Render's managed PostgreSQL:

### Option 1: Use Render Dashboard
1. Create new **PostgreSQL** database in Render
2. Copy connection string
3. Set `SPRING_DATASOURCE_URL` to connection string
4. Update driver: `org.postgresql.Driver`

### Option 2: Use render.yaml
Uncomment the `databases` section in `render.yaml`:

```yaml
databases:
  - name: gohomies-db
    engine: postgres
    version: "15"
    plan: free
```

**Note**: Requires updates to POM.xml to include PostgreSQL driver:
```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <version>42.7.1</version>
</dependency>
```

---

## Auto-Deploy from Git

Render automatically redeploys when you push to GitHub:

1. Make changes to code
2. Push to main branch:
   ```bash
   git add .
   git commit -m "Your message"
   git push origin main
   ```
3. Render automatically rebuilds and deploys
4. Check status in Render dashboard

To disable auto-deploy: Go to **Settings** → Toggle **"Auto-deploy"** off

---

## Monitoring & Logs

### View Logs
```bash
# From Render Dashboard
Click Service → Logs tab

# Or via Render CLI
render logs --service gohomies-backend
```

### Check Resource Usage
- CPU & Memory: Dashboard → Metrics tab
- Database queries: Your TiDB Cloud console

### Set Up Alerts
In Render, go to **Notifications** to alert on:
- Build failures
- Service crashes
- Health check failures

---

## Scaling & Performance

### Free Tier (Starter)
- 0.5 CPU, 512MB RAM
- Spins down after 15 min of inactivity
- Good for development/testing

### Paid Tier (Standard)
- 1 CPU, 1GB RAM (or higher)
- Always running
- Better for production

### Auto-Scaling
Enable in Render dashboard for:
- Automatic instance creation under load
- Max 3 instances by default

---

## Custom Domain

1. In Render dashboard, go to **Settings**
2. Scroll to **"Custom Domain"**
3. Enter your domain: `api.yourdomain.com`
4. Add DNS CNAME record to your domain registrar:
   ```
   Name: api
   Type: CNAME
   Value: gohomies-backend.onrender.com
   ```
5. Wait for DNS propagation (5-30 minutes)

---

## Cron Jobs (Optional)

To run scheduled tasks (e.g., database cleanup), add to `render.yaml`:

```yaml
crons:
  - id: database-cleanup
    schedule: "0 2 * * *"  # 2 AM daily
    command: curl https://gohomies-backend.onrender.com/api/admin/cleanup
```

---

## Environment Variables Management

### Use Render's Secret Management
For sensitive data, use **Environment** tab with **"Secret"** option instead of plain text.

### Rotate Secrets
1. Change value in Render dashboard
2. Service automatically redeploys
3. Old connections use new credentials immediately

---

## Cost Estimation

| Component | Cost |
|-----------|------|
| Backend (Starter) | Free |
| Backend (Standard) | $7/month |
| PostgreSQL Database | Free (100MB) or $15/month |
| Bandwidth | $0.10 per GB |
| **Total (Starter)** | **Free** |
| **Total (Production)** | **~$22-50/month** |

---

## Connecting Frontend

### Update Frontend Environment
In your frontend `.env.production`:
```env
VITE_API_BASE_URL=https://gohomies-backend.onrender.com
```

### Deploy Frontend to Render
1. Create new Web Service
2. Select frontend directory
3. Build: `npm run build`
4. Start: `npm run preview`
5. Set `VITE_API_BASE_URL` environment variable

---

## Database Migrations

### Auto-Run Migrations
Render runs `Dockerfile` commands automatically:

```dockerfile
# In Dockerfile, migrations run on startup
RUN mvn db:migrate  # If using Flyway/Liquibase
```

### Manual Migrations
```bash
# SSH into Render service (if enabled)
render exec -s gohomies-backend -- bash

# Run migration
mvn db:migrate
```

---

## Troubleshooting Checklist

- [ ] Database is accessible from Render
- [ ] All environment variables are set
- [ ] JWT secret key is 32+ characters
- [ ] CORS origins include frontend domain
- [ ] Health endpoint responds: `/api/actuator/health`
- [ ] Logs show no errors
- [ ] Database connection pool initialized
- [ ] Image upload service (Cloudinary) working
- [ ] Email service (Gmail) working
- [ ] Frontend can reach API

---

## Need Help?

- **Render Docs**: https://render.com/docs
- **Spring Boot Docs**: https://spring.io/projects/spring-boot
- **GitHub Issues**: Create issue in your repository
- **Community**: Render Slack community

---

## Summary

You now have:
- ✅ Backend deployed on Render
- ✅ Auto-deploy from GitHub
- ✅ Production database (TiDB Cloud)
- ✅ Health monitoring
- ✅ Environment-based configuration
- ✅ Scalable infrastructure

**Deployment URL**: `https://gohomies-backend.onrender.com`

---

**Last Updated**: May 7, 2026
