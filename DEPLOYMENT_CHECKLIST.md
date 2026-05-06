# GoHomies - Production Deployment Checklist

## Pre-Deployment Verification

- [ ] All three applications build successfully
- [ ] No hardcoded secrets in source code
- [ ] Database backups are configured
- [ ] SSL certificates are obtained and ready
- [ ] Domain names point to correct servers
- [ ] All team members have access to production credentials (in secure vault)

## Environment Setup

- [ ] `.env.production` file created with all values filled
- [ ] JWT secret key generated (min 32 characters)
- [ ] TiDB Cloud database accessible and tested
- [ ] Cloudinary account active and credentials verified
- [ ] OpenAI and Gemini API keys tested
- [ ] Email service configured and tested

## Security Checks

- [ ] JWT secret is cryptographically secure (use `openssl rand -base64 32`)
- [ ] Database passwords are strong (min 16 characters, mixed case/numbers/symbols)
- [ ] API keys are rotated from development values
- [ ] CORS origins only include production domains
- [ ] No environment variables logged in production
- [ ] Rate limiting is enabled on API endpoints
- [ ] HTTPS is enforced (redirect http to https)

## Infrastructure Setup

- [ ] Docker and Docker Compose installed
- [ ] Sufficient disk space (min 20GB recommended)
- [ ] Nginx configured as reverse proxy
- [ ] SSL certificates installed (Let's Encrypt recommended)
- [ ] Firewall rules configured (allow 80, 443, restrict 8080)
- [ ] System monitoring tools configured (optional but recommended)

## Deployment

### Build and Deploy with Docker
```bash
cd /path/to/gohomies
chmod +x deploy.sh
./deploy.sh production
```

Or on Windows:
```cmd
deploy.bat production
```

### Verify Services
```bash
# Check health
curl https://yourdomain.com/api/actuator/health

# Check frontend
curl https://yourdomain.com/

# Check admin
curl https://admin.yourdomain.com/

# View logs
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f admin
```

## Post-Deployment Testing

### Functional Tests
- [ ] User can signup/login
- [ ] Profile image upload works
- [ ] Hotel booking flow works
- [ ] Trip planning works
- [ ] Admin dashboard loads
- [ ] Email notifications are sent (if enabled)

### Performance Tests
- [ ] API response time < 500ms
- [ ] Frontend loads in < 3s
- [ ] Image uploads complete in < 5s
- [ ] Database queries are efficient

### Security Tests
- [ ] HTTPS is enforced (http → https redirect)
- [ ] CORS headers are correct
- [ ] JWT tokens expire properly
- [ ] Unauthorized requests return 401/403
- [ ] SQL injection is not possible
- [ ] XSS protection headers are present

## Monitoring Setup

- [ ] Application logs are centralized
- [ ] Error alerts are configured
- [ ] Database connection pool monitored
- [ ] Disk space monitored
- [ ] API latency monitored
- [ ] Error rate monitored (alert > 1% errors)

## Backup & Recovery

- [ ] Database backups automated and tested
- [ ] Backup retention: 30 days minimum
- [ ] Disaster recovery plan documented
- [ ] Point-in-time recovery tested
- [ ] Rollback procedure documented

## Documentation

- [ ] Deployment documentation updated
- [ ] Runbook created for common tasks
- [ ] Incident response procedure documented
- [ ] Escalation contacts documented
- [ ] Access management documented

## Production Support

- [ ] Support team trained
- [ ] On-call rotation established
- [ ] Incident communication plan ready
- [ ] Customer support contacts prepared
- [ ] Known issues documented

## Database Migrations

- [ ] Schema validated in production (`ddl-auto: validate`)
- [ ] Migration scripts tested in staging
- [ ] Rollback plan for migrations
- [ ] Data integrity checks passed
- [ ] Indexing optimized for production data

## Performance Optimization

- [ ] Static assets cached with long TTL
- [ ] Gzip compression enabled
- [ ] Database connection pool tuned
- [ ] Image optimization configured
- [ ] CDN configured (optional)

## Go-Live

- [ ] All checklist items completed
- [ ] Team briefed on deployment
- [ ] Customer communication ready
- [ ] 24/7 support coverage arranged
- [ ] Monitoring alerts active
- [ ] DEPLOY TO PRODUCTION

## Post-Deployment (24 Hours)

- [ ] Monitor error rates and latency
- [ ] Review user feedback
- [ ] Monitor database performance
- [ ] Check backup completion
- [ ] Review security logs
- [ ] Document any issues found
- [ ] Plan follow-up optimizations

---

**Deployment Date**: _____________
**Deployed by**: _____________
**Reviewed by**: _____________
**Issues Found**: _____________
