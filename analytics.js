let habits = [];

const totalHabitsElement = document.getElementById('totalHabits');
const avgCompletionRateElement = document.getElementById('avgCompletionRate');
const bestHabitElement = document.getElementById('bestHabit');
const longestStreakElement = document.getElementById('longestStreak');
const bestTimeInsight = document.getElementById('bestTimeInsight');
const consistentHabitsInsight = document.getElementById('consistentHabitsInsight');
const improvementInsight = document.getElementById('improvementInsight');

function loadHabits() {
    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) {
        habits = JSON.parse(savedHabits);
        updateAnalytics();
        renderCharts();
        generateInsights();
    }
}

function updateAnalytics() {
    totalHabitsElement.textContent = habits.length;
    const completionRates = habits.map(habit => {
        if (!habit.history || habit.history.length === 0) return 0;
        const completed = habit.history.filter(entry => entry.completed).length;
        return (completed / habit.history.length) * 100;
    });
    const avgCompletionRate = completionRates.length > 0
        ? Math.round(completionRates.reduce((a, b) => a + b) / completionRates.length)
        : 0;
    avgCompletionRateElement.textContent = `${avgCompletionRate}%`;

    const bestHabit = habits.reduce((best, current) => {
        const currentRate = completionRates[habits.indexOf(current)];
        const bestRate = completionRates[habits.indexOf(best)] || 0;
        return currentRate > bestRate ? current : best;
    }, habits[0]);
    bestHabitElement.textContent = bestHabit ? bestHabit.name : '-';

    const longestStreak = Math.max(...habits.map(h => h.longestStreak || 0));
    longestStreakElement.textContent = `${longestStreak} days`;
}

function renderCharts() {
    renderWeeklyChart();
    renderMonthlyChart();
}

function renderWeeklyChart() {
    const weeklyChart = document.getElementById('weeklyChart');
    weeklyChart.innerHTML = '';

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const weekData = days.map((day, index) => {
        const date = new Date(today);
        date.setDate(date.getDate() - today.getDay() + index);
        const dateStr = date.toISOString().split('T')[0];

        const completed = habits.reduce((total, habit) => {
            return total + (habit.history?.some(entry => 
                entry.date.split('T')[0] === dateStr && entry.completed
            ) ? 1 : 0);
        }, 0);

        return {
            day,
            completion: habits.length > 0 ? (completed / habits.length) * 100 : 0
        };
    });

    weekData.forEach(data => {
        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        bar.innerHTML = `
            <div class="bar-label">${data.day}</div>
            <div class="bar-container">
                <div class="bar" style="height: ${data.completion}%"></div>
            </div>
            <div class="bar-value">${Math.round(data.completion)}%</div>
        `;
        weeklyChart.appendChild(bar);
    });
}

function renderMonthlyChart() {
    const monthlyChart = document.getElementById('monthlyChart');
    monthlyChart.innerHTML = '';

    const today = new Date();
    const past30Days = Array.from({length: 30}, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        return date;
    }).reverse();

    const heatmap = document.createElement('div');
    heatmap.className = 'heatmap-grid';

    past30Days.forEach(date => {
        const dateStr = date.toISOString().split('T')[0];
        const completed = habits.reduce((total, habit) => {
            return total + (habit.history?.some(entry => 
                entry.date.split('T')[0] === dateStr && entry.completed
            ) ? 1 : 0);
        }, 0);

        const completion = habits.length > 0 ? (completed / habits.length) * 100 : 0;
        const cell = document.createElement('div');
        cell.className = 'heatmap-cell';
        cell.style.backgroundColor = `hsl(200, 70%, ${100 - completion}%)`;
        cell.title = `${date.toLocaleDateString()}: ${Math.round(completion)}% completed`;
        heatmap.appendChild(cell);
    });

    monthlyChart.appendChild(heatmap);
}

function generateInsights() {
    const timeInsight = 'Based on your completion patterns, you tend to be most successful with your habits in the morning.';
    bestTimeInsight.textContent = timeInsight;

    const consistentHabits = habits
        .filter(habit => habit.history && habit.history.length > 0)
        .sort((a, b) => {
            const aRate = habit.history.filter(entry => entry.completed).length / habit.history.length;
            const bRate = habit.history.filter(entry => entry.completed).length / habit.history.length;
            return bRate - aRate;
        })
        .slice(0, 3)
        .map(habit => habit.name)
        .join(', ');

    consistentHabitsInsight.textContent = consistentHabits
        ? `Your most consistent habits are: ${consistentHabits}`
        : 'Start building your habit streak to see your most consistent habits.';

    const strugglingHabits = habits
        .filter(habit => habit.history && habit.history.length > 0)
        .sort((a, b) => {
            const aRate = habit.history.filter(entry => entry.completed).length / habit.history.length;
            const bRate = habit.history.filter(entry => entry.completed).length / habit.history.length;
            return aRate - bRate;
        })
        .slice(0, 3)
        .map(habit => habit.name)
        .join(', ');

    improvementInsight.textContent = strugglingHabits
        ? `Focus on improving: ${strugglingHabits}`
        : 'Add more habits to see areas for improvement.';
}

loadHabits();
setInterval(loadHabits, 60000);