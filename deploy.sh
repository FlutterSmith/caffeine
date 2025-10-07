#!/bin/bash

# Caffeine Coffee Shop - Vercel Deployment Script
# This script helps automate the Vercel deployment process

set -e

echo "☕ Caffeine Coffee Shop - Vercel Deployment"
echo "==========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo -e "${RED}❌ Vercel CLI not found${NC}"
    echo "📦 Install it with: npm install -g vercel"
    exit 1
fi

echo -e "${GREEN}✅ Vercel CLI found${NC}"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo -e "${YELLOW}⚠️  Git not initialized${NC}"
    read -p "Initialize git repository? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git init
        echo -e "${GREEN}✅ Git initialized${NC}"
    fi
fi

# Check if files are committed
if [[ -n $(git status -s) ]]; then
    echo -e "${YELLOW}⚠️  You have uncommitted changes${NC}"
    echo "📝 Changed files:"
    git status -s
    echo ""
    read -p "Commit changes before deploying? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        read -p "Enter commit message: " commit_msg
        git commit -m "$commit_msg"
        echo -e "${GREEN}✅ Changes committed${NC}"
    fi
fi

echo ""
echo "🚀 Deployment Options:"
echo "1. Deploy to preview (development)"
echo "2. Deploy to production"
echo "3. Setup environment variables"
echo "4. View deployment logs"
echo "5. Open Vercel dashboard"
echo "6. Cancel"
echo ""

read -p "Select option (1-6): " option

case $option in
    1)
        echo ""
        echo "🔨 Deploying to preview environment..."
        vercel
        echo ""
        echo -e "${GREEN}✅ Preview deployment complete!${NC}"
        echo "🌐 Your preview URL will be shown above"
        ;;
    2)
        echo ""
        echo -e "${YELLOW}⚠️  Deploying to PRODUCTION${NC}"
        read -p "Are you sure? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "🔨 Deploying to production..."
            vercel --prod
            echo ""
            echo -e "${GREEN}✅ Production deployment complete!${NC}"
            echo "🌐 Your production URL will be shown above"
        else
            echo "❌ Deployment cancelled"
        fi
        ;;
    3)
        echo ""
        echo "🔐 Setting up environment variables..."
        echo ""
        echo "You'll need:"
        echo "  - JWT_SECRET (generate with: openssl rand -hex 32)"
        echo "  - STRIPE_SECRET_KEY (from Stripe Dashboard)"
        echo "  - STRIPE_PUBLISHABLE_KEY (from Stripe Dashboard)"
        echo ""
        read -p "Continue? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo ""
            echo "Adding JWT_SECRET..."
            vercel env add JWT_SECRET
            echo ""
            echo "Adding STRIPE_SECRET_KEY..."
            vercel env add STRIPE_SECRET_KEY
            echo ""
            echo "Adding STRIPE_PUBLISHABLE_KEY..."
            vercel env add STRIPE_PUBLISHABLE_KEY
            echo ""
            echo -e "${GREEN}✅ Environment variables added!${NC}"
            echo "💡 Tip: You can view/edit them in the Vercel dashboard"
        fi
        ;;
    4)
        echo ""
        echo "📋 Fetching deployment logs..."
        vercel logs
        ;;
    5)
        echo ""
        echo "🌐 Opening Vercel dashboard..."
        vercel dashboard
        ;;
    6)
        echo "❌ Cancelled"
        exit 0
        ;;
    *)
        echo -e "${RED}❌ Invalid option${NC}"
        exit 1
        ;;
esac

echo ""
echo "📚 Helpful Resources:"
echo "  - Full deployment guide: DEPLOYMENT.md"
echo "  - Deployment checklist: DEPLOYMENT_CHECKLIST.md"
echo "  - Main documentation: README.md"
echo ""
echo -e "${GREEN}☕ Happy deploying!${NC}"
