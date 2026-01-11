const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ players: {}, sessions: {} }, null, 2));
}

const db = {
    // Save player score
    savePlayerScore: (playerName, score) => {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        
        if (!data.players[playerName]) {
            data.players[playerName] = {
                scores: [],
                totalScore: 0,
                gamesPlayed: 0
            };
        }

        data.players[playerName].scores.push(score);
        data.players[playerName].totalScore += score;
        data.players[playerName].gamesPlayed += 1;

        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    },

    // Get all scores
    getAllScores: () => {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        return data.players;
    },

    // Get player history
    getPlayerHistory: (playerName) => {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        return data.players[playerName] || null;
    }
};

module.exports = db;
