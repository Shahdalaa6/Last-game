// API Configuration
let API_BASE = 'http://localhost:5000/api';

// Detect if on mobile and adjust API endpoint
if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    // If not on localhost, check if Railway backend is available
    if (window.location.hostname.includes('railway') || window.location.hostname.includes('mobile')) {
        API_BASE = 'https://web-production-6a3d.up.railway.app/api';
    }
}

// Global state
let currentPlayerName = '';
let currentQuestion = 0;
let questions = [];
let scores = {};
let players = [];

// Show screen
function showScreen(id){
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

// ========== NAME ENTRY SCREEN ==========

// Confirm player name
function confirmName(){
    const nameInput = document.getElementById("playerNameEntry");
    const name = nameInput.value.trim();

    if(name === ""){
        alert("Please enter your name!");
        return;
    }

    currentPlayerName = name;
    joinGame();
}

// Join the global game
async function joinGame(){
    try {
        const response = await fetch(`${API_BASE}/join`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playerName: currentPlayerName })
        });
        const data = await response.json();
        
        if(data.error){
            alert(data.error);
            return;
        }

        scores[currentPlayerName] = 0;
        players = data.players;
        
        // Get questions
        await loadQuestions();
        
        // Show intro screen
        document.getElementById("displayName").innerText = currentPlayerName;
        showScreen("introScreen");
        
        // Start polling for players
        pollPlayers();
    } catch (error) {
        console.error('Error joining game:', error);
        // Allow offline play - load questions locally
        console.log('Playing offline mode');
        scores[currentPlayerName] = 0;
        players = [currentPlayerName];
        
        // Use embedded questions
        initializeQuestions();
        
        // Show intro screen
        document.getElementById("displayName").innerText = currentPlayerName;
        showScreen("introScreen");
    }
}

// Initialize questions locally
function initializeQuestions(){
    questions = [
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
}

// Load questions from backend
async function loadQuestions(){
    try {
        const response = await fetch(`${API_BASE}/questions`);
        questions = await response.json();
    } catch (error) {
        console.error('Error loading questions:', error);
        // Fall back to local questions
        initializeQuestions();
    }
}

// Poll for player updates
let pollingInterval;
function pollPlayers(){
    pollingInterval = setInterval(async () => {
        try {
            const response = await fetch(`${API_BASE}/status`);
            const data = await response.json();
            
            players = data.players;
            document.getElementById("playerCount").innerText = `Players: ${data.playerCount}`;
            updatePlayersList();

            const continueBtn = document.getElementById("continueBtn");
            if(data.playerCount >= 3){
                continueBtn.disabled = false;
                continueBtn.innerText = `Start Game (${data.playerCount} players ready)`;
            }
        } catch (error) {
            console.warn('Polling failed, offline mode:', error);
            // In offline mode, allow starting with just 1 player
            const continueBtn = document.getElementById("continueBtn");
            continueBtn.disabled = false;
            continueBtn.innerText = `Start Game (Offline Mode)`;
        }
    }, 1000);
}

// Update players list display
function updatePlayersList(){
    const listDiv = document.getElementById("playersList");
    if(players.length === 0){
        listDiv.innerHTML = '<p style="margin: 0; padding: 5px;">Waiting for players...</p>';
        return;
    }
    
    listDiv.innerHTML = players.map(p => `<p style="margin: 5px 0; padding: 5px; background: rgba(255,255,255,0.1); border-radius: 4px;">👤 ${p}</p>`).join('');
}

// Change player name
function backToName(){
    currentPlayerName = '';
    clearInterval(pollingInterval);
    showScreen("nameScreen");
}

// ========== GAME SCREEN ==========

// Go to game
function goToGame(){
    clearInterval(pollingInterval);
    currentQuestion = 0;
    loadQuestion();
    showScreen("gameScreen");
}

// Load question
function loadQuestion(){
    document.getElementById("feedback").innerText = "";
    document.getElementById("question").innerText = questions[currentQuestion].text;

    const buttons = document.querySelectorAll(".choice");
    buttons.forEach(btn => {
        btn.classList.remove("correct","wrong");
        btn.disabled = false;
    });

    // Hide next until user selects an answer
    document.getElementById("nextBtn").style.display = "none";

    // Update progress bar
    const progressPercent = (currentQuestion / questions.length) * 100;
    document.getElementById("progressBar").style.width = `${progressPercent}%`;
}

// Select answer
async function selectAnswer(answer) {
    const correctAnswer = questions[currentQuestion].correct;
    const buttons = document.querySelectorAll(".choice");

    // Disable both buttons so only one can be selected
    buttons.forEach(btn => btn.disabled = true);

    // Calculate if answer is correct locally first
    const isCorrect = answer === correctAnswer;
    
    // Update UI immediately (don't wait for backend)
    if (isCorrect) {
        if (answer === true) buttons[0].classList.add("correct");
        else buttons[1].classList.add("correct");
        scores[currentPlayerName] = (scores[currentPlayerName] || 0) + 1;
    } else {
        if (answer === true) buttons[0].classList.add("wrong");
        else buttons[1].classList.add("wrong");
        if (correctAnswer === true) buttons[0].classList.add("correct");
        else buttons[1].classList.add("correct");
    }

    // Show feedback text
    document.getElementById("feedback").innerText = isCorrect ? "Correct!" : "Wrong!";
    document.getElementById("nextBtn").style.display = "block";

    // Try to sync with backend (but don't block if it fails)
    try {
        const response = await fetch(`${API_BASE}/answer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                playerName: currentPlayerName, 
                answer 
            })
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Answer synced with backend');
        }
    } catch (error) {
        console.warn('Backend sync failed, continuing offline:', error);
        // Game continues even if backend fails
    }
}
    }
}

// Next question
async function nextQuestion(){
    currentQuestion++;
    
    // Check if game is finished (local calculation)
    if (currentQuestion >= questions.length) {
        showLeaderboard();
        return;
    }
    
    loadQuestion();
    
    // Try to sync with backend but don't block
    try {
        const response = await fetch(`${API_BASE}/next-question`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            console.log('Progress synced with backend');
        }
    } catch (error) {
        console.warn('Backend sync failed, continuing offline:', error);
    }
}

// ========== LEADERBOARD SCREENS ==========

// Show leaderboard
async function showLeaderboard(){
    try {
        const response = await fetch(`${API_BASE}/leaderboard`);
        const leaderboard = await response.json();

        const container = document.getElementById("leaderboardList");
        container.innerHTML = "";

        const maxScore = questions.length;

        leaderboard.forEach(([player, data], index) => {
            const card = document.createElement("div");
            card.classList.add("leader-card");

            if(index === 0) card.classList.add("gold");
            if(index === 1) card.classList.add("silver");
            if(index === 2) card.classList.add("bronze");

            const score = typeof data === 'object' ? data.score : data;
            card.innerHTML = `
                <div>
                    <strong>${index+1}. ${player}</strong>
                    <div class="score-bar">
                        <div class="score-fill" style="width:${(score/maxScore)*100}%"></div>
                    </div>
                </div>
                <div>${score} pts</div>
            `;

            container.appendChild(card);
        });

        showScreen("leaderboardScreen");
    } catch (error) {
        console.error('Error loading leaderboard:', error);
    }
}

// Play again (same session, reload scores)
async function playAgain(){
    currentQuestion = 0;
    
    // Reset scores for this session
    players.forEach(p => {
        scores[p] = 0;
    });
    
    loadQuestion();
    showScreen("gameScreen");
}

// View global stats
async function viewGlobalStats(){
    try {
        const response = await fetch(`${API_BASE}/leaderboard/global`);
        const globalLeaderboard = await response.json();

        const container = document.getElementById("globalLeaderboardList");
        container.innerHTML = "";

        globalLeaderboard.forEach(({ name, totalScore, gamesPlayed, averageScore }, index) => {
            const card = document.createElement("div");
            card.classList.add("leader-card");

            if(index === 0) card.classList.add("gold");
            if(index === 1) card.classList.add("silver");
            if(index === 2) card.classList.add("bronze");

            card.innerHTML = `
                <div style="text-align: left; width: 100%;">
                    <strong>${index+1}. ${name}</strong>
                    <div style="font-size: 12px; opacity: 0.9; margin-top: 4px;">
                        Total: ${totalScore} pts | Games: ${gamesPlayed} | Avg: ${averageScore}
                    </div>
                    <div class="score-bar">
                        <div class="score-fill" style="width:${(totalScore/(gamesPlayed*12))*100}%"></div>
                    </div>
                </div>
            `;

            container.appendChild(card);
        });

        showScreen("globalLeaderboardScreen");
    } catch (error) {
        console.error('Error loading global leaderboard:', error);
    }
}

// Back to game leaderboard
function backToGameLeaderboard(){
    showScreen("leaderboardScreen");
}

// Change player
function changePlayer(){
    currentPlayerName = '';
    showScreen("nameScreen");
}

// Back to intro (doesn't change player)
function backToIntro(){
    showScreen("introScreen");
}
