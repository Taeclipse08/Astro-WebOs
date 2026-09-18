const timePill = document.getElementById('timePill');
const modeToggle = document.getElementById('modeToggle');

function updateTime() {
  const now = new Date();
  const formatted = now.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit'
  });
  timePill.textContent = formatted;
}

function changeTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  const labels = {
    dreamy: 'Dawn mode',
    dusk: 'Velvet dusk',
    aurora: 'Aurora bloom'
  };
  modeToggle.textContent = labels[theme] || 'Dawn mode';
}

modeToggle.addEventListener('click', () => {
  const themes = ['dreamy', 'dusk', 'aurora'];
  const currentTheme = document.body.getAttribute('data-theme') || 'dreamy';
  const nextTheme = themes[(themes.indexOf(currentTheme) + 1) % themes.length];
  changeTheme(nextTheme);
});

updateTime();
setInterval(updateTime, 1000 * 30);
