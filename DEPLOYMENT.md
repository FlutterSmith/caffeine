# 🚀 Deploying Caffeine to Vercel

Complete guide to deploy your Caffeine Coffee Shop website to Vercel.

---

## 📋 Prerequisites

- [Vercel Account](https://vercel.com/signup) (free)
- [GitHub Account](https://github.com) (optional, for automatic deployments)
- [Vercel CLI](https://vercel.com/cli) installed (optional)
- Stripe Account with API keys

---

## 🎯 Deployment Methods

Choose one of these methods to deploy:

### Method 1: Deploy via Vercel Dashboard (Recommended)

**Step 1: Prepare Your Repository**

1. Initialize Git repository (if not already done):
```bash
git init
git add .
git commit -m "Initial commit: Caffeine Coffee Shop"
```

2. Create a new repository on GitHub and push:
```bash
git remote add origin https://github.com/yourusername/caffeine-coffee-shop.git
git branch -M main
git push -u origin main
```

**Step 2: Import to Vercel**

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)

**Step 3: Add Environment Variables**

In the Vercel project settings, add these environment variables:

```
JWT_SECRET=your-super-secret-jwt-key-here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
NODE_ENV=production
```

**Step 4: Deploy**

Click **"Deploy"** and wait for deployment to complete!

---

### Method 2: Deploy via Vercel CLI

**Step 1: Install Vercel CLI**

```bash
npm install -g vercel
```

**Step 2: Login to Vercel**

```bash
vercel login
```

**Step 3: Deploy**

From the project root directory:

```bash
# First deployment
vercel

# Follow the prompts:
# Set up and deploy? [Y/n] y
# Which scope? Select your account
# Link to existing project? [y/N] n
# What's your project's name? caffeine-coffee-shop
# In which directory is your code located? ./
```

**Step 4: Add Environment Variables**

```bash
vercel env add JWT_SECRET
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_PUBLISHABLE_KEY
```

Enter values when prompted.

**Step 5: Deploy to Production**

```bash
vercel --prod
```

---

## 🔧 Configuration Details

### vercel.json

The `vercel.json` file is already configured with:

- **API Routes**: `/api/*` routes to serverless functions
- **Static Files**: All other routes serve static HTML/CSS/JS
- **CORS Headers**: Configured for API access
- **Node.js Runtime**: Using `@vercel/node` builder

### Project Structure for Vercel

```
Caffeine/
├── api/
│   ├── server.js          # Main Express server (becomes serverless)
│   ├── routes/            # API routes
│   └── middleware/        # Middleware functions
├── css/                   # Static CSS files
├── js/                    # Static JavaScript files
├── *.html                 # Static HTML pages
├── vercel.json            # Vercel configuration
└── package.json           # Dependencies
```

---

## 🔐 Environment Variables Setup

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `JWT_SECRET` | Secret key for JWT tokens | `your-super-secret-key-min-32-chars` |
| `STRIPE_SECRET_KEY` | Stripe secret API key | `sk_test_51...` |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_test_...` |
| `NODE_ENV` | Environment mode | `production` |

### How to Generate JWT_SECRET

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or using OpenSSL
openssl rand -hex 32
```

### Getting Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **API Keys**
3. Copy **Publishable key** and **Secret key**
4. Use **test keys** for testing, **live keys** for production

---

## 📝 Post-Deployment Steps

### 1. Update Frontend API URLs

After deployment, update the API endpoint in your JavaScript files to use your Vercel domain.

**File: `js/checkout.js`**

Find and update:
```javascript
// Change from localhost
const API_URL = 'http://localhost:3000/api';

// To your Vercel domain
const API_URL = 'https://your-project.vercel.app/api';
```

**Files to update:**
- `js/checkout.js`
- `js/auth.js`
- Any other files making API calls

Or use relative URLs:
```javascript
const API_URL = '/api';  // Works on any domain
```

### 2. Update Stripe Publishable Key

**File: `js/checkout.js`**

Update the Stripe initialization:
```javascript
const stripe = Stripe('pk_test_YOUR_ACTUAL_PUBLISHABLE_KEY');
```

### 3. Configure Custom Domain (Optional)

1. Go to Vercel project settings
2. Navigate to **Domains**
3. Click **"Add"**
4. Enter your custom domain
5. Follow DNS configuration instructions

### 4. Test the Deployment

Visit your Vercel URL and test:
- ✅ Homepage loads correctly
- ✅ Navigation works
- ✅ Animations and swipe gestures work
- ✅ Cart functionality works
- ✅ User registration/login works
- ✅ Checkout process works
- ✅ Stripe payment works (use test card)

**Test Card Numbers:**
```
Success: 4242 4242 4242 4242
Declined: 4000 0000 0000 0002
Expiry: Any future date
CVC: Any 3 digits
```

---

## 🔄 Continuous Deployment

Once connected to GitHub, Vercel automatically deploys:

- **Production**: Every push to `main` branch
- **Preview**: Every pull request

To disable auto-deployment:
1. Project Settings → Git
2. Toggle **"Automatically expose System Environment Variables"**

---

## 🐛 Troubleshooting

### Issue: API Routes Return 404

**Solution**: Ensure `vercel.json` is in the root directory and properly configured.

```bash
# Check vercel.json exists
ls -la vercel.json

# Redeploy
vercel --prod
```

### Issue: Environment Variables Not Working

**Solution**:
1. Verify variables are set in Vercel dashboard
2. Redeploy after adding variables:
```bash
vercel --prod
```

### Issue: CORS Errors

**Solution**: Check `vercel.json` has CORS headers configured:
```json
"headers": [
  {
    "source": "/api/(.*)",
    "headers": [
      { "key": "Access-Control-Allow-Origin", "value": "*" }
    ]
  }
]
```

### Issue: Stripe Payments Failing

**Solution**:
1. Verify Stripe keys are correct
2. Check browser console for errors
3. Ensure webhook endpoint is configured (if using webhooks)
4. Check Stripe Dashboard logs

### Issue: Build Fails

**Solution**:
1. Check Node.js version compatibility
2. Verify all dependencies are in `package.json`
3. Review build logs in Vercel dashboard

---

## 📊 Monitoring & Analytics

### Vercel Analytics

Enable Vercel Analytics for free:
1. Project Settings → Analytics
2. Enable **"Audience"** and **"Web Vitals"**

### Stripe Dashboard

Monitor payments at:
- [Stripe Dashboard](https://dashboard.stripe.com)
- View transactions, customers, and analytics

---

## 🔒 Security Checklist

Before going live:

- ✅ Use **live** Stripe keys (not test keys)
- ✅ Set strong `JWT_SECRET` (min 32 characters)
- ✅ Enable HTTPS (automatic on Vercel)
- ✅ Review CORS settings
- ✅ Test authentication flow
- ✅ Test payment processing
- ✅ Set up error monitoring
- ✅ Configure rate limiting (if needed)
- ✅ Review environment variables
- ✅ Test on multiple devices/browsers

---

## 📈 Performance Optimization

Vercel automatically provides:
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Compression (gzip/brotli)
- ✅ HTTP/2 support
- ✅ Edge caching

Additional optimizations:
- Use Vercel Image Optimization for product images
- Enable Analytics to track performance
- Monitor Web Vitals

---

## 💡 Useful Commands

```bash
# View deployment logs
vercel logs

# List all deployments
vercel ls

# Remove deployment
vercel rm deployment-url

# View environment variables
vercel env ls

# Pull environment variables locally
vercel env pull

# Open project in dashboard
vercel dashboard
```

---

## 🔗 Important URLs

After deployment, you'll have:

- **Production URL**: `https://your-project.vercel.app`
- **API Endpoint**: `https://your-project.vercel.app/api`
- **Dashboard**: `https://vercel.com/your-username/your-project`

---

## 📞 Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Stripe Documentation](https://stripe.com/docs)
- [Express.js on Vercel](https://vercel.com/guides/using-express-with-vercel)

---

## 🎉 Success!

Your Caffeine Coffee Shop is now live on Vercel!

**Next Steps:**
1. Share your URL with users
2. Set up custom domain
3. Monitor analytics and payments
4. Collect user feedback
5. Iterate and improve

**Your deployment includes:**
- ☕ Complete coffee shop website
- 🛒 Shopping cart functionality
- 💳 Stripe payment processing
- 🔐 User authentication
- 🎨 Advanced animations & gestures
- 📱 Mobile-responsive design
- ⚡ Lightning-fast performance

---

**Deployed with ☕ and ❤️ using Vercel**
