@echo off
REM Quiz Game - Quick Git Setup Script

echo.
echo ===================================
echo Quiz Game - GitHub Setup
echo ===================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed!
    echo Download from: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo Git is installed: 
git --version

echo.
echo Enter your GitHub username:
set /p github_username=

echo Enter your GitHub email:
set /p github_email=

echo.
echo Setting up Git configuration...
git config --global user.name "%github_username%"
git config --global user.email "%github_email%"

echo.
echo Initializing repository...
git init
git add .
git commit -m "Initial commit - Quiz game with multiplayer backend"
git branch -M main

echo.
echo.
echo ===================================
echo NEXT STEPS:
echo ===================================
echo.
echo 1. Create a new repository on GitHub:
echo    https://github.com/new
echo    Name it: quiz-game
echo.
echo 2. After creating the repo, run this command:
echo    git remote add origin https://github.com/%github_username%/quiz-game.git
echo    git push -u origin main
echo.
echo 3. Then deploy on Railway:
echo    https://railway.app
echo.
echo Your username: %github_username%
echo.

pause
