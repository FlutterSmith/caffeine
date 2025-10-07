# Railway Deployment Guide

This guide walks you through deploying the Caffeine Coffee Shop backend API to Railway.

## Prerequisites

1. **Railway Account**: Sign up at https://railway.app
2. **GitHub Account**: Your code should be in a GitHub repository
3. **Stripe Account**: For payment processing (get API keys from https://dashboard.stripe.com)

## Quick Deploy (Recommended)

### Option 1: Deploy from GitHub (Easiest)

1. **Push your code to GitHub** (if not already)
   ```bash
   git add .
   git commit -m "Prepare for Railway deployment"
   git push origin main
   ```

2. **Go to Railway Dashboard**
   - Visit https://railway.app
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Authorize Railway to access your GitHub
   - Select your `Caffeine` repository

3. **Railway will automatically:**
   - Detect your Node.js app
   - Install dependencies (`npm install`)
   - Start the server (`npm start`)

4. **Configure Environment Variables** (see below)

### Option 2: Deploy using Railway CLI

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Initialize Railway Project**
   ```bash
   railway init
   ```
   - Follow the prompts to create a new project
   - Link to your Railway account

4. **Deploy**
   ```bash
   railway up
   ```

5. **Add Environment Variables**
   ```bash
   railway variables set KEY=VALUE
   ```

## Environment Variables Configuration

After deployment, you must add these environment variables in Railway Dashboard:

### Required Variables

1. **Go to your Railway project**
2. **Click on "Variables" tab**
3. **Add the following variables:**

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_your_actual_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_actual_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_actual_webhook_secret

# Frontend URL (update with your actual frontend URL)
FRONTEND_URL=https://your-frontend-domain.com
```

### Optional Variables (for future features)

```env
# Database (when you add database support)
DATABASE_URL=postgresql://user:password@host:port/database

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-email-app-password
```

## Setting Environment Variables via CLI

```bash
# Set individual variables
railway variables set PORT=3000
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=your-secret-key
railway variables set STRIPE_SECRET_KEY=sk_live_...
railway variables set STRIPE_PUBLISHABLE_KEY=pk_live_...
railway variables set STRIPE_WEBHOOK_SECRET=whsec_...
railway variables set FRONTEND_URL=https://your-frontend.com

# View all variables
railway variables
```

## Generating a Secure JWT Secret

Use one of these methods:

**Method 1: OpenSSL**
```bash
openssl rand -base64 32
```

**Method 2: Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Method 3: Online** (use a trusted generator)
- https://www.grc.com/passwords.htm

## Getting Your Railway API URL

After deployment:

1. **In Railway Dashboard:**
   - Go to your project
   - Click "Settings" → "Generate Domain"
   - Your API will be available at: `https://your-app-name.up.railway.app`

2. **Via CLI:**
   ```bash
   railway domain
   ```

## Testing Your Deployment

Once deployed, test your API:

### Health Check
```bash
curl https://your-app-name.up.railway.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Caffeine API is running"
}
```

### Test Rate Limiting
```bash
# Make multiple requests quickly
for i in {1..10}; do
  curl https://your-app-name.up.railway.app/api/health
done
```

## Configure Stripe Webhooks

1. **Get your Railway URL**: `https://your-app-name.up.railway.app`

2. **Go to Stripe Dashboard**
   - Visit https://dashboard.stripe.com/webhooks
   - Click "Add endpoint"
   - Webhook endpoint URL: `https://your-app-name.up.railway.app/api/payment/webhook`

3. **Select Events to Listen to:**
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`

4. **Copy the Webhook Secret**
   - After creating, click "Reveal" under "Signing secret"
   - Add it to Railway as `STRIPE_WEBHOOK_SECRET`

## Update Frontend CORS

Update your frontend to point to the Railway URL:

```javascript
const API_URL = 'https://your-app-name.up.railway.app/api';
```

## Monitoring and Logs

### View Logs in Dashboard
1. Go to your Railway project
2. Click "Deployments" tab
3. Click on the latest deployment
4. View real-time logs

### View Logs via CLI
```bash
railway logs
```

### Continuous logs
```bash
railway logs --follow
```

## Automatic Deployments

Railway automatically deploys when you push to your GitHub repo:

```bash
git add .
git commit -m "Update API"
git push origin main
```

Railway will:
1. Detect the push
2. Build your app
3. Run tests (if configured)
4. Deploy to production
5. Keep previous version running until new one is ready (zero downtime)

## Custom Domain (Optional)

To use your own domain:

1. **In Railway Dashboard:**
   - Go to "Settings" → "Domains"
   - Click "Custom Domain"
   - Enter your domain: `api.yourdomain.com`

2. **Update DNS Records:**
   - Add a CNAME record pointing to your Railway domain
   ```
   api.yourdomain.com → your-app-name.up.railway.app
   ```

3. **Update Environment Variables:**
   ```bash
   railway variables set FRONTEND_URL=https://yourdomain.com
   ```

## Scaling

Railway automatically handles scaling:

- **Vertical Scaling**: Automatically adjusts resources based on usage
- **Horizontal Scaling**: Available on higher-tier plans

To upgrade:
1. Go to project settings
2. Click "Upgrade Plan"
3. Choose appropriate tier

## Database Setup (Future)

When you add a database:

1. **In Railway Dashboard:**
   - Click "New" → "Database"
   - Choose PostgreSQL/MySQL/MongoDB
   - Railway provides `DATABASE_URL` automatically

2. **Update your code to use the database**

3. **The URL is automatically added to environment variables**

## Troubleshooting

### Deployment Fails

**Check build logs:**
```bash
railway logs
```

**Common issues:**
- Missing dependencies in `package.json`
- Incorrect start command
- Environment variables not set

### App Crashes After Deployment

**Check if all environment variables are set:**
```bash
railway variables
```

**Verify required variables:**
- `PORT` (Railway sets this automatically)
- `JWT_SECRET`
- `STRIPE_SECRET_KEY`
- `NODE_ENV`

### Rate Limiting Not Working

**Ensure behind proxy:**
Check that `trust proxy` is set in `server.js`:
```javascript
app.set('trust proxy', 1);
```

### CORS Errors

**Update CORS configuration** in `server.js`:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));
```

## Cost Estimation

Railway offers:
- **Free Tier**: $5 free credits/month (great for development)
- **Pro Plan**: $20/month (includes $20 usage)
- **Usage-based**: $0.000231/GB-hour for memory, $0.000463/vCPU-hour

For this API:
- Estimated cost: ~$3-8/month for low-medium traffic
- Scales automatically with usage

## Rollback

If something goes wrong:

1. **Via Dashboard:**
   - Go to "Deployments"
   - Find previous successful deployment
   - Click "Redeploy"

2. **Via CLI:**
   ```bash
   railway rollback
   ```

## Security Best Practices

✅ **Implemented:**
- Rate limiting on all endpoints
- Environment variables for secrets
- HTTPS by default (Railway provides SSL)
- Input validation
- JWT authentication

🔒 **Additional Recommendations:**
- Use strong JWT secrets (32+ characters)
- Enable 2FA on Railway account
- Regularly rotate API keys
- Monitor logs for suspicious activity
- Set up alerts for high rate limit violations

## Support

**Railway Documentation:** https://docs.railway.app

**Railway Discord:** https://discord.gg/railway

**Railway Status:** https://status.railway.app

## Next Steps

After successful deployment:

1. ✅ Test all API endpoints
2. ✅ Configure Stripe webhooks
3. ✅ Update frontend API URL
4. ✅ Set up monitoring/alerts
5. ✅ Test rate limiting
6. ✅ Verify CORS configuration
7. ✅ Load test your API
8. ✅ Set up automatic backups (when database added)

## Useful Commands

```bash
# View project info
railway status

# Open Railway dashboard
railway open

# View environment variables
railway variables

# Set environment variable
railway variables set KEY=VALUE

# Remove environment variable
railway variables delete KEY

# View logs
railway logs

# Deploy
railway up

# Link to different project
railway link

# Logout
railway logout
```

---

**Deployment Checklist:**

- [ ] Code pushed to GitHub
- [ ] Railway project created
- [ ] Environment variables set
- [ ] Deployment successful
- [ ] API health check passes
- [ ] Stripe webhooks configured
- [ ] Frontend updated with new API URL
- [ ] Rate limiting tested
- [ ] CORS verified
- [ ] Custom domain configured (optional)

🚀 **Your API is now live on Railway!**
