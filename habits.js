let habits = [];
let selectedHabit = null;

const habitsList = document.getElementById('habitsList');
const habitDetails = document.getElementById('habitDetails');
const addHabitBtn = document.getElementById('addHabitBtn');
const calendarGrid = document.getElementById('calendarGrid');


function loadHabits() {
    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) {
        habits = JSON.parse(savedHabits);
        renderHabitsList();
    }
}

function saveHabits() {
    localStorage.setItem('habits', JSON.stringify(habits));
}


function renderHabitsList() {
    habitsList.innerHTML = '';
    habits.forEach(habit => {
        const habitItem = document.createElement('div');
        habitItem.className = 'habit-item';
        habitItem.innerHTML = `
            <div class="habit-info">
                <h3>${habit.name}</h3>
                <p>Current streak: ${habit.streak} days</p>
            </div>
            <div class="habit-progress">
                <div class="progress-bar">
                    <div class="progress" style="width: ${calculateCompletionRate(habit)}%"></div>
                </div>
                <span>${calculateCompletionRate(habit)}%</span>
            </div>
        `;

        habitItem.addEventListener('click', () => selectHabit(habit));
        habitsList.appendChild(habitItem);
    });
}

function calculateCompletionRate(habit) {
    if (!habit.history || habit.history.length === 0) return 0;
    const completed = habit.history.filter(entry => entry.completed).length;
    return Math.round((completed / habit.history.length) * 100);
}


function selectHabit(habit) {
    selectedHabit = habit;
    updateHabitDetails();
    renderCalendar();
}

function updateHabitDetails() {
    if (!selectedHabit) return;

    const streakElement = habitDetails.querySelector('.stat-card:nth-child(1) .stat-value');
    const longestStreakElement = habitDetails.querySelector('.stat-card:nth-child(2) .stat-value');
    const completionRateElement = habitDetails.querySelector('.stat-card:nth-child(3) .stat-value');

    streakElement.textContent = `${selectedHabit.streak} days`;
    longestStreakElement.textContent = `${selectedHabit.longestStreak || 0} days`;
    completionRateElement.textContent = `${calculateCompletionRate(selectedHabit)}%`;
}


function renderCalendar() {
    calendarGrid.innerHTML = '';
    const today = new Date();
    const past30Days = Array.from({length: 30}, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        return date;
    }).reverse();

    past30Days.forEach(date => {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        const dateStr = date.toISOString().split('T')[0];
        const completed = selectedHabit?.history?.some(entry => 
            entry.date.split('T')[0] === dateStr && entry.completed
        );

        dayElement.classList.add(completed ? 'completed' : 'incomplete');
        dayElement.title = `${date.toLocaleDateString()}: ${completed ? 'Completed' : 'Not completed'}`;
        calendarGrid.appendChild(dayElement);
    });
}

addHabitBtn.addEventListener('click', () => {
    const name = prompt('Enter habit name:');
    if (name) {
        const habit = {
            id: Date.now(),
            name,
            streak: 0,
            longestStreak: 0,
            history: []
        };
        habits.push(habit);
        saveHabits();
        renderHabitsList();
    }
});


document.querySelector('.edit-habit-btn').addEventListener('click', () => {
    if (!selectedHabit) return;
    const newName = prompt('Enter new habit name:', selectedHabit.name);
    if (newName) {
        selectedHabit.name = newName;
        saveHabits();
        renderHabitsList();
        updateHabitDetails();
    }
});

document.querySelector('.delete-habit-btn').addEventListener('click', () => {
    if (!selectedHabit) return;
    if (confirm(`Are you sure you want to delete "${selectedHabit.name}"?`)) {
        habits = habits.filter(h => h.id !== selectedHabit.id);
        saveHabits();
        selectedHabit = null;
        renderHabitsList();
        habitDetails.querySelector('.habit-stats').innerHTML = '';
        calendarGrid.innerHTML = '';
    }
});


loadHabits();