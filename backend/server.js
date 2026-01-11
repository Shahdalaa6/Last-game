const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, '../')));

// Global game state (single game for all players)
let gameState = {
    players: {},
    currentQuestion: 0,
    status: 'waiting' // waiting, in-progress, finished
};

// Global persistent scores
let globalScores = {};

// Question Bank
const questions = [
    { text: "Coffee was discovered by accident.", correct: true },
    { text: "The human brain stops developing at age 18.", correct: false },
    { text: "Drinking water can improve concentration.", correct: true },
    { text: "Multitasking increases productivity.", correct: false },
    { text: "Bananas are berries.", correct: true },
    { text: "Goldfish have a memory of only three seconds.", correct: false },
    { text: "The Great Wall of China is visible from space.", correct: false },
    { text: "Octopuses have three hearts.", correct: true },
    { text: "Sharks existed before trees.", correct: true },
    { text: "Adults have more bones than babies.", correct: false },
    { text: "An ostrich's eye is bigger than its brain.", correct: true },
    { text: "A day on Venus is longer than a year on Venus.", correct: true }
];

// Routes

// 1. Join a player
app.post('/api/join', (req, res) => {
    const { playerName } = req.body;

    if (!playerName) {
        return res.status(400).json({ error: 'Missing playerName' });
    }

    if (gameState.players[playerName]) {
        return res.status(400).json({ error: 'Player already joined' });
    }

    gameState.players[playerName] = {
        score: 0,
        answered: false
    };

    const playerCount = Object.keys(gameState.players).length;
    res.json({ 
        success: true, 
        playerCount,
        players: Object.keys(gameState.players)
    });
});

// 2. Get game status
app.get('/api/status', (req, res) => {
    res.json({
        playerCount: Object.keys(gameState.players).length,
        players: Object.keys(gameState.players),
        currentQuestion: gameState.currentQuestion,
        totalQuestions: questions.length,
        status: gameState.status
    });
});

// 3. Get questions
app.get('/api/questions', (req, res) => {
    res.json(questions);
});

// 4. Submit answer
app.post('/api/answer', (req, res) => {
    const { playerName, answer } = req.body;

    if (!gameState.players[playerName]) {
        return res.status(404).json({ error: 'Player not found' });
    }

    const question = questions[gameState.currentQuestion];
    const isCorrect = answer === question.correct;

    if (isCorrect) {
        gameState.players[playerName].score += 1;
    }

    gameState.players[playerName].answered = true;

    res.json({ 
        isCorrect,
        correctAnswer: question.correct,
        feedback: isCorrect ? 'Correct!' : 'Wrong!'
    });
});

// 5. Next question
app.post('/api/next-question', (req, res) => {
    // Reset answered flags
    Object.keys(gameState.players).forEach(player => {
        gameState.players[player].answered = false;
    });

    gameState.currentQuestion++;

    if (gameState.currentQuestion >= questions.length) {
        gameState.status = 'finished';
        // Save to global scores
        Object.keys(gameState.players).forEach(player => {
            if (!globalScores[player]) globalScores[player] = [];
            globalScores[player].push(gameState.players[player].score);
        });
    }

    res.json({ 
        currentQuestion: gameState.currentQuestion,
        totalQuestions: questions.length,
        finished: gameState.currentQuestion >= questions.length
    });
});

// 6. Get leaderboard
app.get('/api/leaderboard', (req, res) => {
    const leaderboard = Object.entries(gameState.players)
        .map(([name, data]) => ({ name, score: data.score }))
        .sort((a, b) => b.score - a.score);

    res.json(leaderboard);
});

// 7. Get global leaderboard (all-time scores)
app.get('/api/leaderboard/global', (req, res) => {
    const allTimeScores = {};
    
    Object.keys(globalScores).forEach(player => {
        const scores = globalScores[player];
        const totalScore = scores.reduce((a, b) => a + b, 0);
        const gamesPlayed = scores.length;
        const averageScore = (totalScore / gamesPlayed).toFixed(2);
        
        allTimeScores[player] = {
            totalScore,
            gamesPlayed,
            averageScore
        };
    });

    const sorted = Object.entries(allTimeScores)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.totalScore - a.totalScore)
        .slice(0, 20); // Top 20

    res.json(sorted);
});

// 8. Get player history
app.get('/api/player/:playerName/history', (req, res) => {
    const { playerName } = req.params;

    if (!globalScores[playerName]) {
        return res.json({ scores: [], playerName });
    }

    res.json({
        playerName,
        scores: globalScores[playerName],
        averageScore: (globalScores[playerName].reduce((a, b) => a + b, 0) / globalScores[playerName].length).toFixed(2),
        totalGamesPlayed: globalScores[playerName].length
    });
});

// 9. Reset game (start new game)
app.post('/api/reset', (req, res) => {
    gameState = {
        players: {},
        currentQuestion: 0,
        status: 'waiting'
    };
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`🎮 Quiz Game Backend running on http://localhost:${PORT}`);
});
