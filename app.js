// Game State
let selectedNumbers = [5]; // Array to store multiple selected numbers
let currentNumber = 5; // The number being used in current question
let secondNumber = 1;
let score = 0;
let timeLeft = 30;
let timerInterval = null;
let isTimerMode = false;

// Sound effects (using Web Audio API for cross-browser compatibility)
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

// Play correct answer sound
function playCorrectSound() {
    try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 523.25; // C5
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
        
        // Second note
        const oscillator2 = audioContext.createOscillator();
        const gainNode2 = audioContext.createGain();
        
        oscillator2.connect(gainNode2);
        gainNode2.connect(audioContext.destination);
        
        oscillator2.frequency.value = 659.25; // E5
        oscillator2.type = 'sine';
        
        gainNode2.gain.setValueAtTime(0.3, audioContext.currentTime + 0.1);
        gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
        
        oscillator2.start(audioContext.currentTime + 0.1);
        oscillator2.stop(audioContext.currentTime + 0.6);
    } catch (e) {
        console.log('Sound not available');
    }
}

// Play wrong answer sound
function playWrongSound() {
    try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 200;
        oscillator.type = 'sawtooth';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        console.log('Sound not available');
    }
}

// Select a times table number (toggle selection)
function selectNumber(num) {
    const index = selectedNumbers.indexOf(num);
    
    if (index > -1) {
        // Number is already selected, remove it (unless it's the last one)
        if (selectedNumbers.length > 1) {
            selectedNumbers.splice(index, 1);
            event.target.classList.remove('active');
        }
    } else {
        // Number not selected, add it
        selectedNumbers.push(num);
        event.target.classList.add('active');
    }
    
    // Sort for consistent display
    selectedNumbers.sort((a, b) => a - b);
    
    // Generate new question with updated selection
    generateQuestion();
}

// Generate a new question
function generateQuestion() {
    // Pick a random number from the selected numbers
    currentNumber = selectedNumbers[Math.floor(Math.random() * selectedNumbers.length)];
    secondNumber = Math.floor(Math.random() * 10) + 1;
    
    document.getElementById("question").innerText = 
        `${currentNumber} × ${secondNumber} = ?`;
    document.getElementById("answer").value = "";
    document.getElementById("hint").innerText = "";
    
    // Clear previous result styling
    const resultElement = document.getElementById("result");
    resultElement.className = "result";
    resultElement.innerText = "";
    
    // Focus on answer input
    document.getElementById("answer").focus();
}

// Check the user's answer
function checkAnswer() {
    const userAnswer = Number(document.getElementById("answer").value);
    const correctAnswer = currentNumber * secondNumber;
    const resultElement = document.getElementById("result");
    
    // Ignore empty answers
    if (document.getElementById("answer").value === "") {
        return;
    }
    
    if (userAnswer === correctAnswer) {
        // Correct answer!
        score++;
        playCorrectSound();
        
        resultElement.innerText = "🎉 Correct! Great job!";
        resultElement.className = "result correct celebrate";
        
        updateScore();
        
        // Generate new question after short delay
        setTimeout(() => {
            generateQuestion();
        }, 1500);
        
    } else {
        // Wrong answer
        playWrongSound();
        
        resultElement.innerText = "❌ Try again!";
        resultElement.className = "result wrong shake";
        
        showHint();
    }
}

// Update score display
function updateScore() {
    document.getElementById("score").innerText = `Score: ${score}`;
    
    // Add star every 5 points
    if (score > 0 && score % 5 === 0) {
        const starsElement = document.getElementById("stars");
        starsElement.innerText += " ⭐";
        
        // Celebrate animation
        starsElement.classList.add('celebrate');
        setTimeout(() => {
            starsElement.classList.remove('celebrate');
        }, 500);
    }
}

// Show hint for wrong answer
function showHint() {
    let hint = "";
    for (let i = 0; i < secondNumber; i++) {
        hint += currentNumber;
        if (i < secondNumber - 1) {
            hint += " + ";
        }
    }
    
    const totalHint = hint.split(" + ").reduce((sum, num) => sum + Number(num), 0);
    
    document.getElementById("hint").innerText = 
        `💡 Hint: ${currentNumber} × ${secondNumber} means ${secondNumber} groups of ${currentNumber}\n` +
        `That's: ${hint} = ${totalHint}`;
}

// Start timer mode
function startTimer() {
    if (isTimerMode) {
        stopTimer();
        return;
    }
    
    isTimerMode = true;
    timeLeft = 30;
    score = 0;
    
    document.getElementById("timer").innerText = `⏱️ ${timeLeft}s`;
    document.getElementById("stars").innerText = "";
    updateScore();
    generateQuestion();
    
    // Update button text
    const timerBtn = document.querySelector('.timer-btn');
    timerBtn.innerText = "⏸️ Stop Timer";
    timerBtn.style.background = "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)";
    
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = `⏱️ ${timeLeft}s`;
        
        // Visual warning at 10 seconds
        if (timeLeft <= 10) {
            document.querySelector('.timer-box').style.background = 
                "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)";
        }
        
        if (timeLeft === 0) {
            stopTimer();
            
            // Show final score
            const resultElement = document.getElementById("result");
            resultElement.innerText = `⏰ Time's up! Final score: ${score} 🎯`;
            resultElement.className = "result";
            resultElement.style.background = "#fff3cd";
            resultElement.style.color = "#856404";
            
            // Play completion sound
            playCorrectSound();
        }
    }, 1000);
}

// Stop timer
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    isTimerMode = false;
    document.getElementById("timer").innerText = "";
    
    // Reset timer box styling
    document.querySelector('.timer-box').style.background = 
        "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)";
    
    // Update button
    const timerBtn = document.querySelector('.timer-btn');
    timerBtn.innerText = "⏱️ Timer Mode (30s)";
    timerBtn.style.background = "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)";
}

// Reset game
function resetGame() {
    stopTimer();
    score = 0;
    document.getElementById("stars").innerText = "";
    document.getElementById("result").innerText = "";
    document.getElementById("hint").innerText = "";
    updateScore();
    generateQuestion();
}

// Initialize game on page load
window.onload = function() {
    generateQuestion();
    
    // Enable audio context on first user interaction
    document.addEventListener('click', function initAudio() {
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        document.removeEventListener('click', initAudio);
    }, { once: true });
};

// Allow Enter key to submit answer
document.addEventListener('DOMContentLoaded', function() {
    const answerInput = document.getElementById('answer');
    if (answerInput) {
        answerInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                checkAnswer();
            }
        });
    }
});
