let habits = [];

const habitsGrid = document.getElementById('habitsGrid');
const addHabitBtn = document.getElementById('addHabitBtn');
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendMessageBtn = document.getElementById('sendMessage');
const themeToggle = document.getElementById('themeToggle');

const theme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', theme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

class Habit {
    constructor(name, frequency = 'daily', streak = 0) {
        this.id = Date.now();
        this.name = name;
        this.frequency = frequency;
        this.streak = streak;
        this.completed = false;
    }
}

addHabitBtn.addEventListener('click', () => {
    const habitName = prompt('Enter habit name:');
    if (habitName) {
        const habit = new Habit(habitName);
        habits.push(habit);
        renderHabit(habit);
        updateProgress();
    }
});

function renderHabit(habit) {
    const habitCard = document.createElement('div');
    habitCard.className = 'habit-card';
    habitCard.style.cssText = `
        background: white;
        padding: 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `;

    habitCard.innerHTML = `
        <h3>${habit.name}</h3>
        <p>Streak: ${habit.streak} days</p>
        <button 
            class="${habit.completed ? 'complete' : ''}"
            onclick="toggleHabit(${habit.id})"
            style="
                background: ${habit.completed ? '#48bb78' : '#e2e8f0'};
                color: ${habit.completed ? 'white' : '#4a5568'};
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 0.25rem;
                cursor: pointer;
                margin-top: 1rem;
            "
        >
            ${habit.completed ? 'Completed' : 'Mark Complete'}
        </button>
    `;

    habitsGrid.appendChild(habitCard);
}

function toggleHabit(id) {
    const habit = habits.find(h => h.id === id);
    if (habit) {
        habit.completed = !habit.completed;
        if (habit.completed) {
            habit.streak++;
        } else {
            habit.streak--;
        }
        habitsGrid.innerHTML = '';
        habits.forEach(renderHabit);
        updateProgress();
    }
}

function updateProgress() {
    const streakCount = document.querySelector('.streak-count');
    const completedCount = document.querySelector('.completed-count');
    
    const maxStreak = Math.max(...habits.map(h => h.streak));
    const completedHabits = habits.filter(h => h.completed).length;
    
    streakCount.textContent = `${maxStreak} days`;
    completedCount.textContent = `${completedHabits}/${habits.length}`;
}

sendMessageBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        addMessage('user', message);
        respondToMessage(message);
        messageInput.value = '';
    }
}

function addMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.style.cssText = `
        margin: 0.5rem 0;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        max-width: 80%;
        ${sender === 'user' ? 
            'background: #4299e1; color: white; margin-left: auto;' : 
            'background: #e2e8f0; color: #2d3748;'}
    `;
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function respondToMessage(message) {
    const responses = {
        'hello': 'Hi! How can I help you with your habits today?',
        'help': 'I can help you track habits, set reminders, and provide motivation. What would you like to know?',
        'motivation': 'Remember, small steps lead to big changes. Keep going!',
        'default': 'Im here to support your habit-building journey. What can I help you with?'
    };

    const lowerMessage = message.toLowerCase();
    let response = responses.default;

    for (const [key, value] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
            response = value;
            break;
        }
    }

    setTimeout(() => addMessage('bot', response), 500);
}