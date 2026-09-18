const timePill = document.getElementById('timePill');
const modeToggle = document.getElementById('modeToggle');
const notesInput = document.getElementById('notesInput');
const factText = document.getElementById('factText');
const saveNote = document.getElementById('saveNote');
const nextFact = document.getElementById('nextFact');

const facts = [
  "A black hole's gravity is so strong that even light cannot escape from it.",
  'A day on Venus is longer than a Venus year.',
  'The Milky Way contains hundreds of billions of stars.',
  'Jupiter is larger than all the other planets combined.'
];

let factIndex = 0;

function updateTime() {
  const now = new Date();
  timePill.textContent = now.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit'
  });
}

function changeTheme(theme) {
  document.body.dataset.theme = theme;
  const labels = {
    dreamy: 'Dawn mode',
    dusk: 'Velvet dusk',
    aurora: 'Aurora bloom'
  };
  modeToggle.textContent = labels[theme] || 'Dawn mode';
}

function rotateFact() {
  factIndex = (factIndex + 1) % facts.length;
  factText.textContent = facts[factIndex];
}

const savedNotes = localStorage.getItem('astro-notes');
if (savedNotes) {
  notesInput.value = savedNotes;
}

saveNote.addEventListener('click', () => {
  localStorage.setItem('astro-notes', notesInput.value);
  saveNote.textContent = 'Saved';
  window.setTimeout(() => {
    saveNote.textContent = 'Save';
  }, 900);
});

nextFact.addEventListener('click', rotateFact);

modeToggle.addEventListener('click', () => {
  const themes = ['dreamy', 'dusk', 'aurora'];
  const current = document.body.dataset.theme || 'dreamy';
  const next = themes[(themes.indexOf(current) + 1) % themes.length];
  changeTheme(next);
});

const dockButtons = document.querySelectorAll('.dock-button');
dockButtons.forEach((button) => {
  button.addEventListener('click', () => {
    dockButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
  });
});

updateTime();
setInterval(updateTime, 30000);
