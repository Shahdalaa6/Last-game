# Deploy to GitHub & Railway

## Step 1: Install Git
Download Git from: https://git-scm.com/download/win

## Step 2: Create GitHub Account
Go to https://github.com and sign up (if you don't have an account)

## Step 3: Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `quiz-game`
3. Select "Public"
4. Click "Create repository"

## Step 4: Setup Git in Your Game Folder

Open PowerShell in your game folder and run:

```powershell
cd "c:\Users\pc\OneDrive\Desktop\Final Game"
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Replace with your actual name and email.

## Step 5: Initialize Repository and Push

```powershell
git init
git add .
git commit -m "Initial commit - Quiz game with multiplayer backend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/quiz-game.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

**Note:** You may be asked to login. Use your GitHub credentials.

## Step 6: Deploy on Railway

1. Go to https://railway.app/
2. Click "Login with GitHub" and authorize
3. Click "Create New Project"
4. Select "Deploy from GitHub repo"
5. Select your `quiz-game` repository
6. Railway will automatically detect it's a Node.js app
7. Wait for deployment (2-3 minutes)

## Step 7: Get Your Live URL

After deployment:
1. Click on your project in Railway
2. Go to "Settings"
3. Copy the "Public Domain" URL (looks like: `quiz-game-production.up.railway.app`)

## Step 8: Update Frontend to Use Railway URL

Edit `script.js` and change:

```javascript
// OLD:
const API_BASE = 'http://localhost:5000/api';

// NEW (use your Railway URL):
const API_BASE = 'https://quiz-game-production.up.railway.app/api';
```

Replace with your actual Railway domain.

## Step 9: Push the Change

```powershell
git add .
git commit -m "Update API URL for Railway deployment"
git push
```

Railway will automatically redeploy!

## Step 10: Share Your Game

Your live game URL:
```
https://YOUR-RAILWAY-URL.up.railway.app
```

Share this link with anyone to play!

---

## Troubleshooting

**Git command not found?**
- Install Git from https://git-scm.com/download/win
- Restart PowerShell

**Push rejected?**
- Make sure you're using your correct GitHub username
- Check that the repository exists at github.com/YOUR_USERNAME/quiz-game

**Railway deployment failed?**
- Check that `Procfile` exists in your game folder
- Check that `package.json` has the correct scripts

**Frontend can't connect to backend?**
- Make sure API_BASE URL in script.js is correct
- Check that the URL ends with `/api`

---

## Making Updates

After you make changes to your code:

```powershell
git add .
git commit -m "Description of changes"
git push
```

Railway will automatically redeploy within 1-2 minutes!

