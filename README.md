# Quiz Game - Backend Setup Guide

## Overview
This is a multiplayer quiz game with a Node.js/Express backend. Players can enter their names, create game sessions, and compete in real-time with friends.

## Project Structure
```
Final Game/
├── index.html          # Main UI (updated with name entry screen)
├── script.js           # Frontend logic (updated with API calls)
├── style.css           # Styling
├── package.json        # Node.js dependencies
├── backend/
│   ├── server.js       # Express server with all API endpoints
│   └── db.js          # Database module for storing player scores
```

## Prerequisites
- **Node.js** (v14 or higher) - Download from https://nodejs.org/
- **npm** (comes with Node.js)

## Installation & Setup

### 1. Install Node.js
Download and install Node.js from https://nodejs.org/ (LTS version recommended)

### 2. Install Dependencies
Open PowerShell/Terminal in the `Final Game` folder and run:
```powershell
npm install
```

This will install Express and CORS packages needed for the backend.

### 3. Start the Backend Server
In the same terminal, run:
```powershell
npm start
```

You should see:
```
🎮 Quiz Game Backend running on http://localhost:5000/api
```

**Keep this terminal open while playing!**

### 4. Open the Game
In your browser, open:
```
file:///c:\Users\pc\OneDrive\Desktop\Final Game\index.html
```

Or you can serve it with Python for better compatibility:
```powershell
python -m http.server 8000
```
Then visit: `http://localhost:8000`

## How It Works

### Frontend Changes
- **New Name Entry Screen**: Players now enter their name first before joining/creating a game
- **Session-based Multiplayer**: Each game has a unique Session ID that other players can use to join
- **Player List**: Shows all players in the current game session
- **Automatic Player Sync**: The game polls for new players every second

### Backend API Endpoints

#### 1. Create Game Session
```
POST /api/game/create
Response: { sessionId: "session_1234567" }
```

#### 2. Join Player to Session
```
POST /api/game/:sessionId/join
Body: { playerName: "John" }
Response: { success: true, playerCount: 2, players: ["Alice", "John"] }
```

#### 3. Get Session Status
```
GET /api/game/:sessionId/status
Response: { playerCount: 2, players: [...], currentQuestion: 0, status: "waiting" }
```

#### 4. Get All Questions
```
GET /api/questions
Response: [{ text: "...", correct: true }, ...]
```

#### 5. Submit Answer
```
POST /api/game/:sessionId/answer
Body: { playerName: "John", answer: true }
Response: { isCorrect: true, feedback: "Correct!", correctAnswer: true }
```

#### 6. Move to Next Question
```
POST /api/game/:sessionId/next-question
Response: { currentQuestion: 1, totalQuestions: 12, finished: false }
```

#### 7. Get Session Leaderboard
```
GET /api/game/:sessionId/leaderboard
Response: [["John", { score: 5 }], ["Alice", { score: 4 }]]
```

#### 8. Get Global Leaderboard
```
GET /api/leaderboard/global
Response: [{ name: "John", totalScore: 45, gamesPlayed: 3, averageScore: 15 }]
```

#### 9. Get Player History
```
GET /api/player/:playerName/history
Response: { playerName: "John", scores: [5, 4, 6], averageScore: 5, totalGamesPlayed: 3 }
```

## Game Flow

1. **Player enters name** → Creates new session (or joins existing with Session ID)
2. **Waits for 3+ players** → Game shows live player list
3. **Start Game** → First question loads
4. **Answer questions** → Backend validates answers and updates scores
5. **View Leaderboard** → See final scores, global stats, and player history

## Features

✅ **Multiplayer**: Multiple players can join the same game session  
✅ **Player Names**: Each player has their own name and score  
✅ **Real-time Sync**: Player list updates automatically  
✅ **Session Sharing**: Share Session ID to invite friends  
✅ **Score Tracking**: Persistent leaderboard (all-time stats)  
✅ **Progress Bar**: Visual indication of quiz progress  
✅ **Global Leaderboard**: See top players across all games  

## Troubleshooting

### "Could not connect to server" Error
- Make sure backend is running: `npm start`
- Check that it shows: `🎮 Quiz Game Backend running on http://localhost:5000/api`

### CORS Error
- The backend has CORS enabled for localhost
- Make sure you're accessing the game from a local URL (http://localhost or file://)

### Players Not Appearing
- Check that all players are using the same Session ID
- Refresh the page to reconnect if connection drops

### Backend Won't Start
- Make sure Node.js is installed: `node --version`
- Delete `node_modules` folder and run `npm install` again

## Development Mode (Optional)
For auto-reload when editing server.js, you can use nodemon:
```powershell
npm install -g nodemon
nodemon backend/server.js
```

## Data Storage
- **In-Memory Storage**: Game data is stored in RAM while server is running
- **Future Enhancement**: Can be replaced with a database (MongoDB, MySQL, etc.)
- **data.json**: Optional persistent storage file in `backend/` folder

## Future Enhancements
- User authentication/login
- Persistent database (MongoDB/PostgreSQL)
- Timed questions
- Different difficulty levels
- Social features (friend challenges)
- Mobile app version

---

**Enjoy playing! 🎮**
