# 🚀 Quick Start: Deploy to Railway

Deploy your Caffeine Coffee Shop backend to Railway in 5 minutes!

## Method 1: One-Click Deploy (Fastest) ⚡

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Railway deployment"
   git push origin main
   ```

2. **Deploy to Railway**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your repository
   - Railway automatically detects and deploys! 🎉

3. **Set Environment Variables**
   - In Railway dashboard, go to "Variables"
   - Add these required variables:
     ```
     JWT_SECRET=your-secret-key-here
     STRIPE_SECRET_KEY=sk_live_...
     STRIPE_PUBLISHABLE_KEY=pk_live_...
     STRIPE_WEBHOOK_SECRET=whsec_...
     FRONTEND_URL=https://your-frontend.com
     ```

4. **Get Your API URL**
   - Click "Settings" → "Generate Domain"
   - Your API: `https://your-app.up.railway.app`

**Done! Your API is live! 🎉**

---

## Method 2: Using Scripts (Automated) 🤖

### For macOS/Linux:
```bash
./deploy-railway.sh
```

### For Windows:
```batch
deploy-railway.bat
```

The script will:
- Install Railway CLI if needed
- Log you in to Railway
- Initialize your project
- Prompt for environment variables
- Deploy your app
- Show your API URL

---

## Method 3: Manual CLI Deploy 🛠️

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Initialize project
railway init

# 4. Set environment variables
railway variables set JWT_SECRET=your-secret-key
railway variables set STRIPE_SECRET_KEY=sk_live_...
railway variables set STRIPE_PUBLISHABLE_KEY=pk_live_...
railway variables set STRIPE_WEBHOOK_SECRET=whsec_...
railway variables set FRONTEND_URL=https://your-frontend.com

# 5. Deploy
railway up

# 6. Get your URL
railway domain
```

---

## Testing Your Deployment ✅

```bash
# Replace with your actual Railway URL
curl https://your-app.up.railway.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Caffeine API is running"
}
```

---

## Next Steps After Deployment 📝

1. **Configure Stripe Webhooks**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
   - Add endpoint: `https://your-app.up.railway.app/api/payment/webhook`
   - Copy webhook secret and add to Railway variables

2. **Update Your Frontend**
   ```javascript
   const API_URL = 'https://your-app.up.railway.app/api';
   ```

3. **Test All Endpoints**
   - Authentication: `/api/auth/login`
   - Orders: `/api/orders`
   - Payments: `/api/payment/create-intent`

4. **Monitor Your App**
   - View logs: `railway logs`
   - Open dashboard: `railway open`

---

## Quick Commands 💻

```bash
# View status
railway status

# View logs (live)
railway logs

# Open dashboard
railway open

# View all variables
railway variables

# Deploy updates
git push origin main  # Auto-deploys!
# or
railway up

# Rollback if needed
railway rollback
```

---

## Troubleshooting 🔧

**Problem: Deployment fails**
- Check logs: `railway logs`
- Verify all environment variables are set
- Ensure package.json has correct start script

**Problem: CORS errors**
- Verify `FRONTEND_URL` is set correctly
- Check frontend is using correct API URL

**Problem: Rate limiting not working**
- Verify `trust proxy` is set in server.js (✅ already configured)

**Problem: Can't connect to API**
- Check Railway dashboard for deployment status
- Verify domain is generated
- Test health endpoint: `curl https://your-app.up.railway.app/api/health`

---

## Cost 💰

- **Free Tier**: $5 free credits/month
- **Typical Usage**: $3-8/month for low-medium traffic
- **Pro Plan**: $20/month (includes $20 credits)

---

## Security Checklist ✅

Before going live:
- [ ] Strong JWT_SECRET set (32+ characters)
- [ ] Production Stripe keys configured
- [ ] FRONTEND_URL set to actual domain
- [ ] Stripe webhooks configured
- [ ] Rate limiting tested
- [ ] All endpoints tested
- [ ] Logs monitored for errors

---

## Support & Resources 📚

- **Full Guide**: See `RAILWAY_DEPLOYMENT.md`
- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Rate Limiting**: See `api/RATE_LIMITING.md`

---

**🎉 Congratulations! Your Coffee Shop API is now live on Railway!**

Share your deployed API: `https://your-app.up.railway.app/api/health`
