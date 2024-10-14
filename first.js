document.getElementById('begin-workout').addEventListener('click', startWorkout);
document.getElementById('add-exercise').addEventListener('click', addExercise);

let exercises = [];

function addExercise() {
    const exerciseName = document.getElementById('exercise-name').value;
    const exerciseReps = document.getElementById('exercise-reps').value;
    const exerciseTime = document.getElementById('exercise-time').value;

    const exercise = {
        name: exerciseName,
        reps: exerciseReps,
        time: exerciseTime,
        completed: false
    };

    exercises.push(exercise);
    displayExercises();
}

function displayExercises() {
    const exerciseList = document.getElementById('exercise-list');
    exerciseList.innerHTML = '';

    exercises.forEach((exercise, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${exercise.name} -- x${exercise.reps} -- time: ${exercise.time}
            <button class="complete-button" onclick="completeExercise(${index})">Complete</button>
        `;
        exerciseList.appendChild(li);
    });
}

function startWorkout() {
    if (exercises.length === 0) {
        alert('Please add exercises first!');
        return;
    }
    
    document.getElementById('current-exercise').style.display = 'block';
    document.getElementById('results').style.display = 'none';

    let currentExerciseIndex = 0;
    startExercise(currentExerciseIndex);
}

function startExercise(index) {
    if (index >= exercises.length) {
        showResults();
        return;
    }

    const exercise = exercises[index];
    document.getElementById('exercise-name-timer').textContent = exercise.name;
    document.getElementById('exercise-time-timer').textContent = exercise.time;

    let timeLeft = convertTimeToSeconds(exercise.time);
    const timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            setTimeout(() => {
                startExercise(index + 1);
            }, index < exercises.length - 1 ? 20000 : 0); // 20 second break
        } else {
            timeLeft--;
            document.getElementById('exercise-time-timer').textContent = convertSecondsToTime(timeLeft);
        }
    }, 1000);

    const completeButton = document.getElementById('complete-exercise');
    completeButton.disabled = false;
    completeButton.onclick = () => {
        clearInterval(timerInterval);
        completeExercise(index);
        setTimeout(() => {
            startExercise(index + 1);
        }, index < exercises.length - 1 ? 20000 : 0); // 20 second break
    };
}

function completeExercise(index) {
    exercises[index].completed = true;
    document.getElementById('exercise-list').children[index].querySelector('.complete-button').disabled = true;
}

function showResults() {
    const resultsTable = document.getElementById('results-table').getElementsByTagName('tbody')[0];
    resultsTable.innerHTML = '';

    exercises.forEach(exercise => {
        const row = resultsTable.insertRow();
        row.insertCell(0).textContent = exercise.name;
        row.insertCell(1).textContent = exercise.time;
        row.insertCell(2).textContent = exercise.completed ? 'Completed' : 'Not Completed';
    });

    document.getElementById('results').style.display = 'block';
}

function convertTimeToSeconds(time) {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
}

function convertSecondsToTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

window.onload = () => {
    document.getElementById('current-exercise').style.display = 'none';
    document.getElementById('results').style.display = 'none';
};