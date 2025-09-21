let workoutData = {};


function logWorkoutDataStatus() {
    console.log("Workout data loaded:", workoutData);
    if (Object.keys(workoutData).length === 0) {
        console.log("Workout data is empty - using fallback");
    } else {
        console.log("Available body parts:", Object.keys(workoutData));
        if (workoutData.shoulders) {
            console.log("Shoulders equipment:", Object.keys(workoutData.shoulders));
            if (workoutData.shoulders.dumbbells) {
                console.log("Shoulders dumbbells exercises:", workoutData.shoulders.dumbbells);
            }
        }
    }
}

// Fetch the JSON data
fetch('./WorkoutGeneratorPage/data/workouts.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    workoutData = data;
    console.log('Workout data loaded successfully');
    logWorkoutDataStatus();
  })
  .catch(error => {
    console.error('Error loading workout data:', error);
    // Fallback 
    workoutData = {
      "back": {
        "dumbbells": [
          { 
            "name": "Basic Dumbbell Rows", 
            "sets": "3", 
            "reps": "10-12", 
            "rest": "60s",
            "video": "v6bLx0xR_tU" 
          }
        ]
      },
      "shoulders": {
        "dumbbells": [
          { 
            "name": "Basic Shoulder Press", 
            "sets": "3", 
            "reps": "10-12", 
            "rest": "60s",
            "video": "B-aVuyhvLHU" 
          }
        ]
      }
    };
    console.log("Using fallback data");
    logWorkoutDataStatus();
  });

// Function to generate a random workout
function generateWorkout() {
  const bodyPart = document.getElementById('body-part').value;
  const equipment = document.getElementById('equipment').value;
  const workoutPlan = document.getElementById('workout-plan');
  
  console.log("Generating workout for:", bodyPart, "with", equipment);
  console.log("Available data for this combination:", workoutData[bodyPart] && workoutData[bodyPart][equipment]);
  

  if (workoutData[bodyPart] && workoutData[bodyPart][equipment] && 
      workoutData[bodyPart][equipment].length > 0) {
    
    const workouts = workoutData[bodyPart][equipment];
    const randomWorkout = workouts[Math.floor(Math.random() * workouts.length)];
    
   
    let workoutHTML = `
      <h2>Your custom workout plan</h2>
      <h4>Your ${bodyPart} Workout</h4>
      <div class="workout-content">
    `;
    
  
    if (randomWorkout.video) {
      workoutHTML += `
        <div class="workout-video">
          <div class="video-thumbnail" data-video-id="${randomWorkout.video}">
            <img src="https://img.youtube.com/vi/${randomWorkout.video}/hqdefault.jpg" alt="${randomWorkout.name}">
            <div class="play-button"></div>
          </div>
          <div class="video-links">
            <a href="https://www.youtube.com/watch?v=${randomWorkout.video}" target="_blank" class="youtube-link">
              Watch on YouTube
            </a>
          </div>
        </div>
      `;
    }
    
    workoutHTML += `
        <div class="workout-details">
          <p><strong>Exercise:</strong> ${randomWorkout.name}</p>
          <p><strong>Sets:</strong> ${randomWorkout.sets}</p>
          <p><strong>Reps:</strong> ${randomWorkout.reps}</p>
          <p><strong>Rest:</strong> ${randomWorkout.rest}</p>
        </div>
        <!-- Timer container will be inserted here -->
        <div id="exercise-timer-container"></div>
      </div>
      
      <!-- Video modal -->
      <div id="video-modal" class="modal">
        <div class="modal-content">
          <span class="close">&times;</span>
          <div id="video-player"></div>
        </div>
      </div>
    `;
    
 
    workoutPlan.innerHTML = workoutHTML;
    
   
    setupVideoPlayers();

    createExerciseTimers([randomWorkout]); 
    startExerciseTimer(0);

  } else {
    workoutPlan.innerHTML = `<p>No workouts found for ${bodyPart} with ${equipment}. Please try a different combination.</p>`;
    console.log("No workouts found. Available body parts:", Object.keys(workoutData));
    if (workoutData[bodyPart]) {
      console.log("Available equipment for", bodyPart + ":", Object.keys(workoutData[bodyPart]));
    }
  }
}


function setupVideoPlayers() {

  const videoThumbnails = document.querySelectorAll('.video-thumbnail');
  
  videoThumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', function() {
      const videoId = this.getAttribute('data-video-id');
      openVideoModal(videoId);
    });
  });
  
  
  const modal = document.getElementById('video-modal');
  const closeBtn = document.querySelector('.close');
  
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      modal.style.display = 'none';
      
      const player = document.getElementById('video-player');
      player.innerHTML = '';
    });
  }
  
 
  if (modal) {
    window.addEventListener('click', function(event) {
      if (event.target === modal) {
        modal.style.display = 'none';
       
        const player = document.getElementById('video-player');
        player.innerHTML = '';
      }
    });
  }
}


function openVideoModal(videoId) {
  const modal = document.getElementById('video-modal');
  const player = document.getElementById('video-player');
  

  player.innerHTML = `
    <iframe 
      width="100%" 
      height="400" 
      src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  `;
  

  modal.style.display = 'block';
}


document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('workout-button').addEventListener('click', generateWorkout);
});


const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const pauseButton = document.getElementById('pause');
const timerValue = document.getElementById('timer-value');
const settingsToggle = document.getElementById('settings-toggle');
const timerSettings = document.getElementById('timer-settings');
const applyTimer = document.getElementById('apply-timer');
const customMinutes = document.getElementById('custom-minutes');
const timerSound = new Audio("./MindfullnessPage/sounds/alarm_sound.mp3");

let exerciseTimers = [];
let currentExerciseTimer = null;
let timeLeft = 1500; 
let timerInterval;

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
            const message = document.createElement('p');
            message.textContent = "Time's up!";
            document.getElementById('timer-container').appendChild(message);
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
}

function resetTimer() {
    timeLeft = parseInt(customMinutes.value) * 60 || 1500;
    pauseTimer();
    updateTimer();
    startButton.disabled = false;
    pauseButton.disabled = false;
    const message = document.querySelector('#timer-container p');
    if (message) message.remove();
}


startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);

settingsToggle.addEventListener('click', function() {
    timerSettings.classList.toggle('show');
});

applyTimer.addEventListener('click', function() {
    const minutes = parseInt(customMinutes.value);
    if (minutes && minutes > 0 && minutes <= 120) {
        timeLeft = minutes * 60;
        updateTimer();
        timerSettings.classList.remove('show');
    } else {
        alert('Please enter a valid number between 1 and 120');
    }
});


updateTimer();


function createExerciseTimers(exercises) {
   
    exerciseTimers = [];
    
    exercises.forEach((exercise, index) => {
        // Convert rest time (e.g., "60s") to seconds
        const restTime = parseInt(exercise.rest) || 60;
        
        exerciseTimers.push({
            exercise: exercise.name,
            duration: restTime,
            element: null
        });
    });
}

//function to start an exercise timer
function startExerciseTimer(timerIndex) {
    if (currentExerciseTimer) {
        clearInterval(currentExerciseTimer);
    }
    
    const timer = exerciseTimers[timerIndex];
    let timeLeft = timer.duration;
    

    if (!timer.element) {
        timer.element = document.createElement('div');
        timer.element.className = 'exercise-timer';
        timer.element.innerHTML = `
            <h4>Rest: ${timer.exercise}</h4>
            <div class="timer-circle">
                <svg class="timer-svg" viewBox="0 0 100 100">
                    <circle class="timer-circle-bg" cx="50" cy="50" r="45"></circle>
                    <circle class="timer-circle-fill" cx="50" cy="50" r="45" 
                            style="stroke-dashoffset: 283"></circle>
                </svg>
                <div class="timer-text">${formatTime(timeLeft)}</div>
            </div>
            <button class="start-exercise-timer">Start Rest Timer</button>
        `;
        
 
        const timerContainer = document.getElementById('exercise-timer-container');
        timerContainer.innerHTML = ''; 
        timerContainer.appendChild(timer.element);
        

        const startButton = timer.element.querySelector('.start-exercise-timer');
        startButton.addEventListener('click', function() {
            startButton.disabled = true;
            startTimerCountdown(timerIndex, timeLeft);
        });
    }
    
    // Play start sound
    const startSound = new Audio("./WorkoutGeneratorPage/sounds3/timer-start.mp3");
    startSound.play().catch(e => console.log("Audio play failed:", e));
}

// handle the countdown
function startTimerCountdown(timerIndex, timeLeft) {
    const timer = exerciseTimers[timerIndex];
    const timerText = timer.element.querySelector('.timer-text');
    const timerCircle = timer.element.querySelector('.timer-circle-fill');
    const startButton = timer.element.querySelector('.start-exercise-timer');
    
    const circumference = 2 * Math.PI * 45;
    const totalTime = timer.duration;
    
    currentExerciseTimer = setInterval(() => {
        timeLeft--;
        
  
        timerText.textContent = formatTime(timeLeft);
        

        const offset = circumference - (timeLeft / totalTime) * circumference;
        timerCircle.style.strokeDashoffset = offset;
        

        if (timeLeft <= 10) {
            timerCircle.style.stroke = '#ff4444';
            timerText.style.color = '#ff4444';
            
    
            if (timeLeft <= 3) {
                const beep = new Audio("./WorkoutGeneratorPage/sounds3/beep.mp3");
                beep.play().catch(e => console.log("Audio play failed:", e));
            }
        }
        

        if (timeLeft <= 0) {
            clearInterval(currentExerciseTimer);
            timerText.textContent = "Time's up!";
            

            const completeSound = new Audio("./WorkoutGeneratorPage/sounds3/timer-complete.mp3");
            completeSound.play().catch(e => console.log("Audio play failed:", e));
            

            if (timerIndex < exerciseTimers.length - 1) {
                startButton.textContent = "Next Exercise";
                startButton.disabled = false;
                startButton.onclick = function() {
                    startExerciseTimer(timerIndex + 1);
                };
            } else {
                startButton.textContent = "All Complete!";
            }
        }
    }, 1000);
}


function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
