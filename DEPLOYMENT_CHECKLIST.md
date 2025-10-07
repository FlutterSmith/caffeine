# ✅ Vercel Deployment Checklist

Use this checklist to ensure successful deployment of your Caffeine Coffee Shop.

---

## 📋 Pre-Deployment

### Code Preparation
- [ ] All files committed to Git
- [ ] `.env` file is **NOT** committed (check `.gitignore`)
- [ ] `vercel.json` exists in root directory
- [ ] `.vercelignore` exists in root directory
- [ ] `package.json` has all required dependencies
- [ ] Code tested locally and working

### Accounts & Keys
- [ ] Vercel account created ([vercel.com/signup](https://vercel.com/signup))
- [ ] Stripe account created ([stripe.com](https://stripe.com))
- [ ] Stripe API keys obtained (Publishable + Secret)
- [ ] JWT Secret generated (min 32 characters)
- [ ] GitHub repository created (optional, but recommended)

---

## 🚀 Deployment Steps

### Repository Setup
- [ ] Git initialized: `git init`
- [ ] Files added: `git add .`
- [ ] Initial commit: `git commit -m "Initial commit"`
- [ ] GitHub remote added (if using GitHub deployment)
- [ ] Code pushed to GitHub: `git push -u origin main`

### Vercel Configuration
- [ ] Logged into Vercel dashboard
- [ ] New project created/imported
- [ ] Framework preset: **Other**
- [ ] Root directory: **`./`**
- [ ] Build command: **(leave empty)**
- [ ] Output directory: **(leave empty)**

### Environment Variables
Add these in Vercel Dashboard → Settings → Environment Variables:

- [ ] `JWT_SECRET` = `[your-32-char-secret]`
- [ ] `STRIPE_SECRET_KEY` = `sk_test_...` or `sk_live_...`
- [ ] `STRIPE_PUBLISHABLE_KEY` = `pk_test_...` or `pk_live_...`
- [ ] `NODE_ENV` = `production`

### Deployment
- [ ] Click **"Deploy"** button
- [ ] Wait for build to complete
- [ ] Check deployment logs for errors
- [ ] Note your deployment URL: `https://your-project.vercel.app`

---

## 🔧 Post-Deployment Configuration

### Frontend Updates
- [ ] Update API URLs in JavaScript files
  - [ ] `js/checkout.js` - Change API_URL to Vercel domain
  - [ ] `js/auth.js` - Change API_URL to Vercel domain
  - [ ] Or use relative URLs: `const API_URL = '/api'`

- [ ] Update Stripe Publishable Key in `js/checkout.js`
  ```javascript
  const stripe = Stripe('pk_test_YOUR_ACTUAL_KEY');
  ```

- [ ] Commit and redeploy if changes made:
  ```bash
  git add .
  git commit -m "Update API URLs for production"
  git push
  ```

### Custom Domain (Optional)
- [ ] Custom domain purchased
- [ ] Domain added in Vercel Dashboard
- [ ] DNS records configured
- [ ] SSL certificate active (automatic)

---

## 🧪 Testing

### Basic Functionality
- [ ] Homepage loads correctly
- [ ] All pages accessible (Menu, About, Contact, Gallery)
- [ ] Navigation works
- [ ] Images load properly
- [ ] Responsive design works on mobile

### Animations & Interactions
- [ ] Scroll animations trigger correctly
- [ ] Hover effects work (desktop)
- [ ] Swipe gestures work (mobile)
- [ ] Loading states display properly
- [ ] Smooth transitions present

### Shopping Cart
- [ ] Can add items to cart
- [ ] Cart count updates
- [ ] Cart page displays items
- [ ] Can update quantities
- [ ] Can remove items
- [ ] Cart persists on refresh (localStorage)

### Authentication
- [ ] Registration form works
- [ ] Can create new account
- [ ] Login form works
- [ ] JWT tokens issued correctly
- [ ] Protected routes work
- [ ] Logout works

### Checkout & Payments
- [ ] Checkout modal opens
- [ ] Order summary displays
- [ ] Stripe Elements loads
- [ ] Test payment succeeds
  - Card: `4242 4242 4242 4242`
  - Expiry: Any future date
  - CVC: Any 3 digits
- [ ] Order confirmation displays
- [ ] Payment appears in Stripe Dashboard

### API Endpoints
Test these API endpoints:
- [ ] `GET /api/auth/me` - Returns user data
- [ ] `POST /api/auth/register` - Creates new user
- [ ] `POST /api/auth/login` - Returns JWT token
- [ ] `POST /api/orders` - Creates order
- [ ] `POST /api/payment/create-intent` - Creates payment intent

### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## 🔒 Security Review

### Production Security
- [ ] Using **LIVE** Stripe keys (not test keys)
- [ ] `JWT_SECRET` is strong (min 32 characters)
- [ ] `JWT_SECRET` is unique (not default value)
- [ ] `.env` file not committed to repository
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] CORS headers configured correctly
- [ ] No sensitive data in client-side code
- [ ] API routes protected with authentication

### Stripe Configuration
- [ ] Test mode disabled for production
- [ ] Webhook endpoint configured (if using webhooks)
- [ ] Webhook signing secret added to environment variables
- [ ] Payment confirmation flow tested
- [ ] Refund process tested (if applicable)

---

## 📊 Monitoring Setup

### Vercel Analytics
- [ ] Vercel Analytics enabled
- [ ] Web Vitals tracking enabled
- [ ] Error tracking configured

### Stripe Monitoring
- [ ] Stripe Dashboard bookmarked
- [ ] Email notifications enabled
- [ ] Fraud detection reviewed
- [ ] Dispute notifications enabled

### Performance
- [ ] Lighthouse score checked (>90 recommended)
- [ ] Core Web Vitals passing
- [ ] Mobile performance acceptable
- [ ] API response times < 1s

---

## 📱 Mobile Testing

### iOS Testing
- [ ] Safari browser tested
- [ ] Swipe gestures work
- [ ] Touch interactions smooth
- [ ] Payment form works
- [ ] No layout issues

### Android Testing
- [ ] Chrome browser tested
- [ ] Swipe gestures work
- [ ] Touch interactions smooth
- [ ] Payment form works
- [ ] No layout issues

---

## 🎯 Launch Readiness

### Content Review
- [ ] All product prices correct
- [ ] Product descriptions accurate
- [ ] Contact information updated
- [ ] Business hours correct
- [ ] Location/address accurate
- [ ] Social media links correct

### Legal & Compliance
- [ ] Privacy policy added (if collecting user data)
- [ ] Terms of service added
- [ ] Cookie consent (if required in your region)
- [ ] Accessibility compliance (WCAG 2.1)

### Marketing
- [ ] Meta tags for SEO configured
- [ ] Open Graph tags for social sharing
- [ ] Favicon present
- [ ] Google Analytics added (optional)
- [ ] Social media profiles ready

---

## 🚨 Troubleshooting

If issues occur, check:

### Deployment Failed
- [ ] Check Vercel build logs
- [ ] Verify `package.json` syntax
- [ ] Ensure Node.js version compatibility
- [ ] Check for missing dependencies

### API Not Working
- [ ] Verify `vercel.json` routing configuration
- [ ] Check environment variables are set
- [ ] Review CORS headers
- [ ] Check API endpoint paths

### Stripe Errors
- [ ] Verify Stripe keys are correct
- [ ] Check browser console for errors
- [ ] Review Stripe Dashboard logs
- [ ] Ensure using correct mode (test/live)

### Performance Issues
- [ ] Check image file sizes
- [ ] Review animation complexity
- [ ] Monitor Vercel Analytics
- [ ] Check for JavaScript errors

---

## ✅ Final Sign-Off

Before announcing launch:

- [ ] All checklist items completed
- [ ] Full end-to-end test passed
- [ ] No critical errors in console
- [ ] No broken links
- [ ] Mobile experience excellent
- [ ] Payment flow works perfectly
- [ ] Backup plan ready (if issues occur)
- [ ] Support contact available

---

## 🎉 Post-Launch

### Week 1
- [ ] Monitor error logs daily
- [ ] Check Stripe transactions
- [ ] Review user feedback
- [ ] Fix any critical bugs
- [ ] Monitor performance metrics

### Ongoing
- [ ] Weekly security updates
- [ ] Monthly dependency updates
- [ ] Quarterly feature reviews
- [ ] Regular backup verification
- [ ] User feedback implementation

---

**🚀 Ready to Launch!**

Your Caffeine Coffee Shop is ready for the world!

**Useful Links:**
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Stripe Dashboard](https://dashboard.stripe.com)
- [Deployment Guide](DEPLOYMENT.md)
- [Main README](README.md)

---

**Deployed with ☕ and care!**
