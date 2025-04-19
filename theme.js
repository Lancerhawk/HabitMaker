const themeToggle = document.getElementById('themeToggle');

const theme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', theme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});