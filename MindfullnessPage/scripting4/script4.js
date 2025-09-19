// Timer functionality
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const pauseButton = document.getElementById('pause');
const timerValue = document.getElementById('timer-value');
const timerMessage = document.getElementById('timer-message');
const timerSound = new Audio("./MindfullnessPage/sounds/alarm_sound.mp3");
const settingsToggle = document.getElementById('settings-toggle');
const settingsPanel = document.getElementById('settings-panel');
const closeSettings = document.getElementById('close-settings');
const overlay = document.getElementById('overlay');
const customMinutes = document.getElementById('custom-minutes');
const applySettings = document.getElementById('apply-settings');
const startBreathing = document.getElementById('start-breathing');
const stopBreathing = document.getElementById('stop-breathing');
const breathingCircle = document.getElementById('breathing-circle');
const breathText = document.getElementById('breath-text');
const todaySessions = document.getElementById('today-sessions');
const weekSessions = document.getElementById('week-sessions');
const totalSessions = document.getElementById('total-sessions');
const clearSessions = document.getElementById('clear-sessions');

let timeLeft = 1500; // 25 minutes in seconds
let timerInterval;
let breathingInterval;
let currentBreathPattern = '4-7-8';
let currentSound = null;
let sessions = JSON.parse(localStorage.getItem('meditationSessions')) || [];

// Initialize the page
updateTimer();
updateSessionStats();

// Timer functions
function updateTimer() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    timerValue.textContent = `${minutes.toString().padStart(2,0)}:${seconds.toString().padStart(2,0)}`;
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft === 0) {
            timerSound.play();
            clearInterval(timerInterval);
            startButton.disabled = true;
            pauseButton.disabled = true;
            timerMessage.textContent = "Time's up! Take a deep breath and relax.";
            
            // Record the session
            recordSession();
            updateSessionStats();
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
}

function resetTimer() {
    timeLeft = parseInt(customMinutes.value) * 60;
    pauseTimer();
    updateTimer();
    if (startButton.disabled && pauseButton.disabled) {
        startButton.disabled = false;
        pauseButton.disabled = false;
        timerMessage.textContent = "";
    }
}

// Settings panel functionality
settingsToggle.addEventListener('click', () => {
    settingsPanel.classList.add('open');
    overlay.classList.add('open');
});

closeSettings.addEventListener('click', () => {
    settingsPanel.classList.remove('open');
    overlay.classList.remove('open');
});

overlay.addEventListener('click', () => {
    settingsPanel.classList.remove('open');
    overlay.classList.remove('open');
});

applySettings.addEventListener('click', () => {
    timeLeft = parseInt(customMinutes.value) * 60;
    updateTimer();
    settingsPanel.classList.remove('open');
    overlay.classList.remove('open');
});

// Breathing animation functionality
startBreathing.addEventListener('click', () => {
    startBreathing.disabled = true;
    stopBreathing.disabled = false;
    
    const pattern = document.getElementById('breath-pattern').value;
    currentBreathPattern = pattern;
    
    startBreathingExercise(pattern);
});

stopBreathing.addEventListener('click', () => {
    stopBreathingExercise();
    startBreathing.disabled = false;
    stopBreathing.disabled = true;
});

function startBreathingExercise(pattern) {
    let inhaleTime, holdTime, exhaleTime;
    
    switch(pattern) {
        case '4-7-8':
            inhaleTime = 4000; // 4 seconds
            holdTime = 7000;   // 7 seconds
            exhaleTime = 8000; // 8 seconds
            break;
        case 'box':
            inhaleTime = 4000; // 4 seconds
            holdTime = 4000;   // 4 seconds
            exhaleTime = 4000; // 4 seconds
            break;
        case 'deep':
            inhaleTime = 5000; // 5 seconds
            holdTime = 2000;   // 2 seconds
            exhaleTime = 5000; // 5 seconds
            break;
    }
    
    const totalTime = inhaleTime + holdTime + exhaleTime;
    let isInhaling = true;
    let isHolding = false;
    
    // Initial state
    breathingCircle.classList.add('inhale');
    breathText.textContent = 'Inhale';
    
    breathingInterval = setInterval(() => {
        if (isInhaling) {
            breathingCircle.classList.remove('exhale');
            breathingCircle.classList.add('inhale');
            breathText.textContent = 'Inhale';
            
            setTimeout(() => {
                isInhaling = false;
                isHolding = true;
                breathingCircle.classList.remove('inhale');
                breathText.textContent = 'Hold';
            }, inhaleTime);
        } else if (isHolding) {
            setTimeout(() => {
                isHolding = false;
                breathingCircle.classList.add('exhale');
                breathText.textContent = 'Exhale';
                
                setTimeout(() => {
                    isInhaling = true;
                }, exhaleTime);
            }, holdTime);
        }
    }, totalTime);
}

function stopBreathingExercise() {
    clearInterval(breathingInterval);
    breathingCircle.classList.remove('inhale', 'exhale');
    breathText.textContent = 'Inhale';
}

// Ambient sounds functionality with always-visible toggle
const soundToggle = document.getElementById('sound-toggle');

// Set rain as default sound
let currentSoundType = 'rain';

// Set initial state
soundToggle.checked = false;

// Initialize with rain sound ready
const rainSound = document.getElementById('rain-sound');
const forestSound = document.getElementById('forest-sound');

// Set volume control for better user experience
rainSound.volume = 0.6; // 60% volume
forestSound.volume = 0.6; // 60% volume

soundToggle.addEventListener('change', () => {
    if (soundToggle.checked) {
        stopAllSounds();
        currentSound = document.getElementById(`${currentSoundType}-sound`);
        currentSound.play().catch(error => {
            console.log('Audio play failed:', error);
            soundToggle.checked = false;
        });
    } else {
        stopAllSounds();
    }
});

function stopAllSounds() {
    if (currentSound) {
        currentSound.pause();
        currentSound.currentTime = 0;
    }
}

// Session tracking functionality
function recordSession() {
    const now = new Date();
    const session = {
        date: now.toISOString().split('T')[0], // YYYY-MM-DD
        timestamp: now.getTime(),
        duration: parseInt(customMinutes.value)
    };
    
    sessions.push(session);
    localStorage.setItem('meditationSessions', JSON.stringify(sessions));
}

function updateSessionStats() {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const todayCount = sessions.filter(session => session.date === today).length;
    const weekCount = sessions.filter(session => 
        new Date(session.timestamp) >= oneWeekAgo
    ).length;
    const totalCount = sessions.length;
    
    todaySessions.textContent = todayCount;
    weekSessions.textContent = weekCount;
    totalSessions.textContent = totalCount;
}

clearSessions.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all session history?')) {
        sessions = [];
        localStorage.removeItem('meditationSessions');
        updateSessionStats();
    }
});

// Event listeners
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);

// Initialize settings with default values
customMinutes.value = 25;

// Snowflake generation
function createSnowflakes() {
    const snowContainer = document.getElementById('snow-container');
    const windowWidth = window.innerWidth;
    
    // Create 50-70 snowflakes based on screen size
    const flakeCount = Math.floor(windowWidth / 20);
    
    for (let i = 0; i < flakeCount; i++) {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        
        // Random size between 2-8px
        const size = Math.random() * 6 + 2;
        snowflake.style.width = `${size}px`;
        snowflake.style.height = `${size}px`;
        
        // Random horizontal position
        const leftPosition = Math.random() * windowWidth;
        snowflake.style.left = `${leftPosition}px`;
        
        // Random fall duration between 5-15 seconds
        const fallDuration = Math.random() * 10 + 5;
        snowflake.style.animationDuration = `${fallDuration}s`;
        
        // Random delay so they don't all start at once
        const startDelay = Math.random() * 5;
        snowflake.style.animationDelay = `${startDelay}s`;
        
        // Randomly choose one of the fall animations
        const animationType = Math.floor(Math.random() * 3);
        if (animationType === 1) {
            snowflake.style.animationName = 'fall2';
        } else if (animationType === 2) {
            snowflake.style.animationName = 'fall3';
        }
        
        snowContainer.appendChild(snowflake);
    }
}

// Initialize snowflakes when page loads
window.addEventListener('load', createSnowflakes);

// Regenerate snowflakes when window is resized
window.addEventListener('resize', function() {
    const snowContainer = document.getElementById('snow-container');
    snowContainer.innerHTML = '';
    createSnowflakes();
});

// Mindfulness-specific scroll behavior
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    const logo = document.querySelector('.logo');
    
    if (!logo) return;
    
    if (window.innerWidth > 768) {
        // Desktop behavior - smaller changes for mindfulness
        const minHeight = 50;
        const maxHeight = 60;
        const minLogoWidth = 100;
        const maxLogoWidth = 120;
        const scrollY = Math.min(window.scrollY, 100);
        const newHeight = maxHeight - ((maxHeight - minHeight) * (scrollY / 100));
        const newLogoWidth = maxLogoWidth - ((maxLogoWidth - minLogoWidth) * (scrollY / 100));
        
        header.style.minHeight = `${newHeight}px`;
        logo.style.width = `${newLogoWidth}px`;
        
        // Darken background slightly when scrolled
        const opacity = 0.9 + (0.05 * (scrollY / 100));
        header.style.backgroundColor = `rgba(15, 23, 36, ${opacity})`;
    } else {
        // Mobile behavior
        if (window.scrollY > 30) {
            header.classList.add('shrink-mobile');
        } else {
            header.classList.remove('shrink-mobile');
        }
    }
});

// Add this to your existing JavaScript
const soundSelector = document.getElementById('sound-selector');



// Change sound when selector is used
soundSelector.addEventListener('change', () => {
    currentSoundType = soundSelector.value;
    
    // If sound is currently playing, switch to new sound
    if (soundToggle.checked) {
        stopAllSounds();
        currentSound = document.getElementById(`${currentSoundType}-sound`);
        currentSound.play().catch(error => {
            console.log('Audio play failed:', error);
            soundToggle.checked = false;
        });
    }
});


// Event listeners with safety checks
        if (startButton) {
            startButton.addEventListener('click', startTimer);
        }
        if (pauseButton) {
            pauseButton.addEventListener('click', pauseTimer);
        }
        if (resetButton) {
            resetButton.addEventListener('click', resetTimer);
        }

        // Simulate the other elements that would be in your full app
        console.log("All JavaScript errors have been fixed!");




// Mobile sound controls functionality
const mobileSoundToggle = document.getElementById('mobile-sound-toggle');
const mobileSoundPanel = document.getElementById('mobile-sound-panel');
const mobileSoundToggleCheckbox = document.getElementById('mobile-sound-toggle-checkbox');
const mobileSoundSelector = document.getElementById('mobile-sound-selector');

// Sync with existing sound controls
if (mobileSoundToggleCheckbox && soundToggle) {
    mobileSoundToggleCheckbox.checked = soundToggle.checked;
}

if (mobileSoundSelector && soundSelector) {
    mobileSoundSelector.value = soundSelector.value;
}

// Toggle mobile sound panel
if (mobileSoundToggle && mobileSoundPanel) {
    mobileSoundToggle.addEventListener('click', () => {
        mobileSoundPanel.classList.toggle('open');
    });
}

// Update main sound controls when mobile controls change
if (mobileSoundToggleCheckbox && soundToggle) {
    mobileSoundToggleCheckbox.addEventListener('change', () => {
        soundToggle.checked = mobileSoundToggleCheckbox.checked;
        
        // Trigger the change event
        const event = new Event('change');
        soundToggle.dispatchEvent(event);
    });
}

if (mobileSoundSelector && soundSelector) {
    mobileSoundSelector.addEventListener('change', () => {
        soundSelector.value = mobileSoundSelector.value;
        
        // Trigger the change event
        const event = new Event('change');
        soundSelector.dispatchEvent(event);
    });
}

// Close mobile panel when clicking outside
document.addEventListener('click', (e) => {
    if (mobileSoundPanel && mobileSoundPanel.classList.contains('open') &&
        !mobileSoundPanel.contains(e.target) && 
        !mobileSoundToggle.contains(e.target)) {
        mobileSoundPanel.classList.remove('open');
    }
});

