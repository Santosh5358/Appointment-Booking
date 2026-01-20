# Deployment Guide

## Overview

This guide covers deploying both backend and frontend to production.

---

## Backend Deployment (Node.js/Express)

### Option 1: Heroku (Free Tier Available)

#### Prerequisites
- Heroku CLI installed
- GitHub account

#### Steps
1. **Create Heroku account** at https://www.heroku.com
2. **Login to Heroku CLI**:
```bash
heroku login
```

3. **Create app**:
```bash
cd doctor-website/backend
heroku create your-app-name
```

4. **Add MongoDB**:
```bash
heroku addons:create mongolab:sandbox
```

5. **Set environment variables**:
```bash
heroku config:set DOCTOR_NAME="Your Name"
heroku config:set DOCTOR_EMAIL="your@email.com"
heroku config:set DOCTOR_PHONE="+91-1234567890"
heroku config:set DOCTOR_ADDRESS="Your Address"
heroku config:set JWT_SECRET="your-secret-key"
heroku config:set NODE_ENV="production"
```

6. **Deploy**:
```bash
git push heroku main
```

7. **View logs**:
```bash
heroku logs --tail
```

### Option 2: Railway.app (Modern Alternative)

1. **Visit** https://railway.app
2. **Connect GitHub repo**
3. **Select backend directory**
4. **Add MongoDB plugin**
5. **Set environment variables**
6. **Deploy automatically**

### Option 3: Render.com

1. **Create account** at https://render.com
2. **New Web Service**
3. **Connect GitHub**
4. **Select repository**
5. **Configure:**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variables
6. **Deploy**

---

## Frontend Deployment (Angular)

### Option 1: Vercel (Recommended)

#### Prerequisites
- GitHub repository
- Vercel account

#### Steps
1. **Visit** https://vercel.com
2. **Import project**
3. **Select your repository**
4. **Configure build:**
   - Framework: Angular
   - Build Command: `ng build --configuration production`
   - Output Directory: `dist/doctor-website-frontend`
5. **Add environment variables:**
   - `API_URL`: Your backend URL
6. **Deploy** (automatic)

#### Update API URL
Edit `frontend/src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-domain.com/api'
};
```

### Option 2: Netlify

1. **Visit** https://netlify.com
2. **New site from Git**
3. **Connect GitHub**
4. **Configure build settings:**
   - Build command: `ng build --configuration production`
   - Publish directory: `dist/doctor-website-frontend`
5. **Add environment variables**
6. **Deploy**

### Option 3: AWS Amplify

1. **Visit AWS Amplify Console**
2. **New app**
3. **Connect GitHub**
4. **Select repository**
5. **Review build settings**
6. **Deploy**

---

## MongoDB Cloud Setup (MongoDB Atlas)

1. **Create account** at https://mongodb.com/cloud/atlas
2. **Create cluster** (free tier available)
3. **Create database user**
4. **Get connection string**
5. **Update backend `.env`**:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/doctor-website?retryWrites=true&w=majority
```

---

## Post-Deployment Checklist

### Backend
- [ ] Test all API endpoints
- [ ] Verify database connection
- [ ] Check environment variables
- [ ] Test CORS settings
- [ ] Monitor logs for errors
- [ ] Test booking creation
- [ ] Verify email (if configured)

### Frontend
- [ ] Test all pages load
- [ ] Verify API calls work
- [ ] Check responsive design
- [ ] Test booking form
- [ ] Check images load
- [ ] Verify navigation
- [ ] Test contact form

### Security
- [ ] Use HTTPS everywhere
- [ ] Change default passwords
- [ ] Update CORS for production
- [ ] Enable HTTPS redirects
- [ ] Add security headers
- [ ] Enable rate limiting
- [ ] Backup database

---

## Domain Setup (Custom Domain)

### DNS Configuration
For your custom domain (e.g., www.doctorname.com):

1. **Update DNS records:**
   - A Record for backend
   - CNAME for frontend (www)

2. **SSL Certificate:**
   - Most platforms provide free SSL
   - Enable auto-renewal

3. **Email Domain** (Optional):
   - Configure MX records
   - Setup email forwarding

---

## Continuous Integration/Deployment (CI/CD)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: npm test

  deploy:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        run: |
          git push https://heroku:${{ secrets.HEROKU_API_KEY }}@git.heroku.com/${{ secrets.HEROKU_APP_NAME }}.git main
```

---

## Monitoring & Maintenance

### Logging
- Check server logs regularly
- Monitor error rates
- Track API response times

### Backups
- Backup MongoDB daily
- Store backups securely
- Test restore procedures

### Updates
- Keep dependencies updated
- Monitor security advisories
- Update packages regularly

### Performance
- Monitor database queries
- Check API response times
- Optimize images
- Cache static assets

---

## Troubleshooting

### Backend Won't Start
```bash
# Check logs
heroku logs --tail

# Verify environment variables
heroku config

# Verify MongoDB connection
# Test local first: mongod
```

### Frontend Shows Blank
- Check browser console for errors
- Verify API URL in environment
- Clear browser cache
- Check CORS settings

### Booking Not Working
- Verify backend is running
- Check API endpoint
- Verify database connection
- Check browser network tab

### Slow Performance
- Optimize database queries
- Enable caching
- Compress images
- Use CDN for static files

---

## Cost Estimation

### Free Tier Options
- **Heroku**: Free tier available (limited)
- **Vercel**: Free tier for frontend
- **MongoDB Atlas**: Free tier (512MB)
- **Netlify**: Free tier
- **Railway**: $5/month free credit

### Paid Options (Estimated Monthly)
- Basic: $20-50/month
- Professional: $50-100/month
- Enterprise: $100+/month

---

## Migration Guide

### From Development to Production

1. **Update URLs**
   - Backend API URL
   - Frontend API endpoint
   - Google Maps link

2. **Configure Database**
   - Use production MongoDB
   - Setup backups
   - Enable monitoring

3. **Setup Email** (Optional)
   - Configure SMTP
   - Create email templates
   - Test email sending

4. **Enable Security**
   - HTTPS everywhere
   - Update CORS
   - Add rate limiting
   - Implement JWT

5. **Monitor**
   - Setup error logging
   - Performance monitoring
   - Uptime monitoring

---

## Rollback Procedure

### If Something Goes Wrong

```bash
# Heroku
heroku releases
heroku rollback v10

# Vercel
# Dashboard > Deployments > Rollback

# Netlify
# Dashboard > Deploys > Publish deploy
```

---

## Contact Support

### Deployment Issues
- Check platform documentation
- Review logs carefully
- Test locally first
- Contact platform support

---

## Next Steps After Deployment

1. ✅ Test all features in production
2. ✅ Get feedback from users
3. ✅ Monitor performance
4. ✅ Plan improvements
5. ✅ Add features gradually

---

**Deployment Complete! 🚀**

Your doctor website is now live and accessible to patients!
