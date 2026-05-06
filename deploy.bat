@echo off
REM Production Deployment Script for GoHomies (Windows)
REM Usage: deploy.bat production

setlocal enabledelayedexpansion

set ENVIRONMENT=%1
if "%ENVIRONMENT%"=="" set ENVIRONMENT=staging

echo.
echo =========================================
echo Deploying GoHomies to %ENVIRONMENT%
echo =========================================
echo.

REM Check if .env exists
if not exist ".env.%ENVIRONMENT%" (
    echo ERROR: .env.%ENVIRONMENT% file not found!
    echo Please copy .env.example to .env.%ENVIRONMENT% and fill in values
    exit /b 1
)

echo Building Docker images...
docker compose build --no-cache

if errorlevel 1 (
    echo ERROR: Docker build failed
    exit /b 1
)

echo.
echo Stopping existing containers...
docker compose down --remove-orphans 2>nul

echo.
echo Starting services...
docker compose --env-file ".env.%ENVIRONMENT%" up -d

echo.
echo Waiting for services to be healthy...
timeout /t 10

echo.
echo =========================================
echo Deployment Complete!
echo =========================================
echo.
echo To view logs: docker compose logs -f
echo To stop: docker compose down
echo =========================================
echo.

endlocal
