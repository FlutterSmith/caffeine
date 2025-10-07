@echo off
REM Caffeine Coffee Shop - Railway Deployment Script (Windows)
REM This script helps deploy your backend to Railway

echo ================================================
echo Caffeine Coffee Shop - Railway Deployment
echo ================================================
echo.

REM Check if Railway CLI is installed
where railway >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Railway CLI is not installed.
    echo.
    echo Installing Railway CLI...
    call npm install -g @railway/cli
    if %ERRORLEVEL% NEQ 0 (
        echo Failed to install Railway CLI
        echo Please install manually: npm install -g @railway/cli
        exit /b 1
    )
    echo Railway CLI installed successfully!
    echo.
)

REM Check if logged in to Railway
echo Checking Railway authentication...
railway whoami >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Not logged in to Railway
    echo.
    echo Opening Railway login...
    railway login
    if %ERRORLEVEL% NEQ 0 (
        echo Failed to login to Railway
        exit /b 1
    )
    echo Successfully logged in!
    echo.
)

REM Check if Railway project is initialized
if not exist ".railway" (
    echo Initializing Railway project...
    railway init
    if %ERRORLEVEL% NEQ 0 (
        echo Failed to initialize Railway project
        exit /b 1
    )
    echo Railway project initialized!
    echo.
)

REM Deploy to Railway
echo.
echo Deploying to Railway...
railway up

if %ERRORLEVEL% NEQ 0 (
    echo Deployment failed
    exit /b 1
)

echo.
echo Deployment successful!
echo.

REM Get the domain
echo Getting your API URL...
railway domain

echo.
echo ================================================
echo Deployment Complete!
echo.
echo Next steps:
echo 1. Test your API at the URL shown above
echo 2. Configure Stripe webhooks with your API URL
echo 3. Update your frontend to use the new API URL
echo.
echo View logs: railway logs
echo Open dashboard: railway open
echo ================================================
pause
