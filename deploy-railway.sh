#!/bin/bash

# Caffeine Coffee Shop - Railway Deployment Script
# This script helps deploy your backend to Railway

echo "🚀 Caffeine Coffee Shop - Railway Deployment"
echo "=============================================="
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null
then
    echo "❌ Railway CLI is not installed."
    echo ""
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli

    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Railway CLI"
        echo "Please install manually: npm install -g @railway/cli"
        exit 1
    fi
    echo "✅ Railway CLI installed successfully!"
    echo ""
fi

# Check if logged in to Railway
echo "🔐 Checking Railway authentication..."
railway whoami &> /dev/null

if [ $? -ne 0 ]; then
    echo "❌ Not logged in to Railway"
    echo ""
    echo "🔑 Opening Railway login..."
    railway login

    if [ $? -ne 0 ]; then
        echo "❌ Failed to login to Railway"
        exit 1
    fi
    echo "✅ Successfully logged in!"
    echo ""
fi

# Check if Railway project is initialized
if [ ! -f ".railway" ]; then
    echo "📝 Initializing Railway project..."
    railway init

    if [ $? -ne 0 ]; then
        echo "❌ Failed to initialize Railway project"
        exit 1
    fi
    echo "✅ Railway project initialized!"
    echo ""
fi

# Display current environment variables
echo "📋 Current Environment Variables:"
railway variables
echo ""

# Ask if user wants to set environment variables
echo "⚙️  Do you want to set environment variables now? (y/n)"
read -r set_env

if [ "$set_env" = "y" ] || [ "$set_env" = "Y" ]; then
    echo ""
    echo "Setting environment variables..."
    echo "Enter JWT_SECRET (press Enter to skip):"
    read -r jwt_secret
    if [ ! -z "$jwt_secret" ]; then
        railway variables set JWT_SECRET="$jwt_secret"
    fi

    echo "Enter STRIPE_SECRET_KEY (press Enter to skip):"
    read -r stripe_key
    if [ ! -z "$stripe_key" ]; then
        railway variables set STRIPE_SECRET_KEY="$stripe_key"
    fi

    echo "Enter STRIPE_PUBLISHABLE_KEY (press Enter to skip):"
    read -r stripe_pub_key
    if [ ! -z "$stripe_pub_key" ]; then
        railway variables set STRIPE_PUBLISHABLE_KEY="$stripe_pub_key"
    fi

    echo "Enter FRONTEND_URL (press Enter to skip):"
    read -r frontend_url
    if [ ! -z "$frontend_url" ]; then
        railway variables set FRONTEND_URL="$frontend_url"
    fi

    echo ""
    echo "✅ Environment variables updated!"
fi

# Deploy to Railway
echo ""
echo "🚀 Deploying to Railway..."
railway up

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed"
    exit 1
fi

echo ""
echo "✅ Deployment successful!"
echo ""

# Get the domain
echo "🌐 Getting your API URL..."
railway domain

echo ""
echo "=============================================="
echo "🎉 Deployment Complete!"
echo ""
echo "Next steps:"
echo "1. Test your API at the URL shown above"
echo "2. Configure Stripe webhooks with your API URL"
echo "3. Update your frontend to use the new API URL"
echo ""
echo "View logs: railway logs"
echo "Open dashboard: railway open"
echo "=============================================="
