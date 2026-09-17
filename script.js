const notesInput = document.getElementById('notesInput');
const timePill = document.getElementById('timePill');
const monthLabel = document.getElementById('monthLabel');
const calendarGrid = document.getElementById('calendarGrid');
const forecast = document.getElementById('forecast');
const flashcard = document.getElementById('flashcard');
const flashQuestion = document.getElementById('flashQuestion');
const flashAnswer = document.getElementById('flashAnswer');
const factText = document.getElementById('factText');
const galleryMain = document.getElementById('galleryMain');
const galleryStrip = document.getElementById('galleryStrip');
const musicToggle = document.getElementById('musicToggle');
const volumeControl = document.getElementById('volumeControl');
const trackName = document.getElementById('trackName');
const modeToggle = document.getElementById('modeToggle');

const appPanels = [...document.querySelectorAll('.app-panel')];
const dockButtons = [...document.querySelectorAll('.dock-button')];
const themeButtons = [...document.querySelectorAll('.theme-choice')];

const savedNotes = localStorage.getItem('astro-notes') || 'Astro is my little moonbeam.\n\nTonight: draw a constellation, sip warm starlight, and keep the room cozy.';
notesInput.value = savedNotes;

const weatherData = [
  { day: 'Mon', temp: '15°', icon: '☼' },
  { day: 'Tue', temp: '13°', icon: '☁' },
  { day: 'Wed', temp: '17°', icon: '☼' },
  { day: 'Thu', temp: '12°', icon: '☄' }
];

const flashcards = [
  { q: 'What is a nebula?', a: 'A cloud of gas and dust where stars are born.' },
  { q: 'Why do stars twinkle?', a: 'Their light bends through Earth’s atmosphere, creating a shimmering effect.' },
  { q: 'What is a black hole?', a: 'A region where gravity is so intense that not even light can escape.' },
  { q: 'What is an exoplanet?', a: 'A planet that orbits a star outside our solar system.' }
];

const facts = [
  'A day on Venus is longer than a Venus year.',
  'The Milky Way contains hundreds of billions of stars.',
  'Jupiter’s moon Ganymede is larger than Mercury.',
  'A teaspoon of a neutron star would weigh billions of tons.',
  'The Sun is a yellow dwarf star, but it is actually white in space.'
];

const galleryItems = [
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80'
];

const trackNames = ['Luna Drift', 'Velvet Orbit', 'Starlight Hush'];
let currentTrack = 0;
let currentCard = 0;
let factIndex = 0;
let currentGallery = 0;
let audioCtx = null;
let masterGain = null;
let isPlaying = false;

function updateTime() {
  const clock = new Date();
  timePill.textContent = clock.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function renderForecast() {
  forecast.innerHTML = weatherData
    .map(
      (day) => `
        <div class="forecast-day">
          <div class="icon">${day.icon}</div>
          <div class="day">${day.day}</div>
          <div class="degree">${day.temp}</div>
        </div>
      `
    )
    .join('');
}

function renderCalendar() {
  const today = new Date();
  const month = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthName = month.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  monthLabel.textContent = monthName;

  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const startIndex = firstDay.getDay();
  const totalDays = lastDay.getDate();

  const cells = [];

  for (let i = 0; i < startIndex; i += 1) {
    cells.push('<div class="calendar-day muted"></div>');
  }

  for (let day = 1; day <= totalDays; day += 1) {
    const isToday = day === today.getDate();
    cells.push(`
      <div class="calendar-day ${isToday ? 'today' : ''}">${day}</div>
    `);
  }

  calendarGrid.innerHTML = cells.join('');
}

function updateFlashcard() {
  const card = flashcards[currentCard];
  flashQuestion.textContent = card.q;
  flashAnswer.textContent = card.a;
  flashcard.classList.remove('flipped');
}

function cycleFact() {
  factText.textContent = facts[factIndex % facts.length];
  factIndex += 1;
}

function renderGallery() {
  const mainImage = galleryItems[currentGallery];
  galleryMain.innerHTML = `<img src="${mainImage}" alt="Astral scenery" />`;

  galleryStrip.innerHTML = galleryItems
    .map(
      (image, index) => `
        <button class="gallery-thumb ${index === currentGallery ? 'active' : ''}" data-index="${index}" aria-label="Select gallery image ${index + 1}">
          <img src="${image}" alt="Gallery thumb ${index + 1}" />
        </button>
      `
    )
    .join('');

  galleryStrip.querySelectorAll('.gallery-thumb').forEach((button) => {
    button.addEventListener('click', () => {
      currentGallery = Number(button.dataset.index);
      renderGallery();
    });
  });
}

function setActivePanel(name) {
  appPanels.forEach((panel) => {
    panel.classList.toggle('active', panel.dataset.panel === name);
  });

  dockButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.target === name);
  });
}

function saveNotes() {
  localStorage.setItem('astro-notes', notesInput.value);
}

function createAudio() {
  if (audioCtx) return;

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  audioCtx = new AudioContext();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.025;
  masterGain.connect(audioCtx.destination);

  const padOsc = audioCtx.createOscillator();
  const padOsc2 = audioCtx.createOscillator();
  const lfo = audioCtx.createOscillator();
  const lfoGain = audioCtx.createGain();

  const padGain = audioCtx.createGain();
  const padFilter = audioCtx.createBiquadFilter();

  padOsc.type = 'sine';
  padOsc2.type = 'triangle';
  padOsc.frequency.value = 196;
  padOsc2.frequency.value = 293.66;

  padFilter.type = 'lowpass';
  padFilter.frequency.value = 1100;
  padGain.gain.value = 0.03;

  lfo.type = 'sine';
  lfo.frequency.value = 0.15;
  lfoGain.gain.value = 12;

  lfo.connect(lfoGain);
  lfoGain.connect(padOsc.frequency);
  lfoGain.connect(padOsc2.frequency);

  padOsc.connect(padFilter);
  padOsc2.connect(padFilter);
  padFilter.connect(padGain);
  padGain.connect(masterGain);

  padOsc.start();
  padOsc2.start();
  lfo.start();

  window.__astroAudio = { padOsc, padOsc2, padGain, lfo, lfoGain, masterGain, padFilter };
}

function toggleMusic(forceState) {
  const shouldPlay = typeof forceState === 'boolean' ? forceState : !isPlaying;
  createAudio();

  if (!audioCtx || !masterGain) return;

  if (shouldPlay) {
    audioCtx.resume();
    isPlaying = true;
    musicToggle.textContent = 'Pause';
    trackName.textContent = trackNames[currentTrack % trackNames.length];
    document.body.classList.add('music-on');
  } else {
    isPlaying = false;
    musicToggle.textContent = 'Play';
    document.body.classList.remove('music-on');
  }

  const gainLevel = shouldPlay ? Number(volumeControl.value) / 100 : 0;
  masterGain.gain.setTargetAtTime(gainLevel, audioCtx.currentTime, 0.25);
}

function changeTheme(theme) {
  document.body.dataset.theme = theme;
  themeButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.theme === theme);
  });

  const labels = {
    dreamy: 'Dawn mode',
    dusk: 'Velvet dusk',
    aurora: 'Aurora bloom'
  };

  modeToggle.textContent = labels[theme] || 'Dawn mode';
}

notesInput.addEventListener('input', saveNotes);

dockButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setActivePanel(button.dataset.target);
  });
});

modeToggle.addEventListener('click', () => {
  const themes = ['dreamy', 'dusk', 'aurora'];
  const currentTheme = document.body.dataset.theme || 'dreamy';
  const nextTheme = themes[(themes.indexOf(currentTheme) + 1) % themes.length];
  changeTheme(nextTheme);
});

themeButtons.forEach((button) => {
  button.addEventListener('click', () => changeTheme(button.dataset.theme));
});

flashcard.addEventListener('click', () => {
  flashcard.classList.toggle('flipped');
});

document.getElementById('nextCard').addEventListener('click', () => {
  currentCard = (currentCard + 1) % flashcards.length;
  updateFlashcard();
});

document.getElementById('nextFact').addEventListener('click', cycleFact);

musicToggle.addEventListener('click', () => {
  toggleMusic();
});

volumeControl.addEventListener('input', () => {
  if (!audioCtx || !masterGain) return;
  const level = Number(volumeControl.value) / 100;
  const gainValue = isPlaying ? level : 0;
  masterGain.gain.setTargetAtTime(gainValue, audioCtx.currentTime, 0.12);
});

updateTime();
renderForecast();
renderCalendar();
updateFlashcard();
cycleFact();
renderGallery();
changeTheme('dreamy');
setActivePanel('notes');

setInterval(updateTime, 1000 * 30);
setInterval(() => {
  if (Math.random() > 0.5) {
    const nextCard = (currentCard + 1) % flashcards.length;
    currentCard = nextCard;
    updateFlashcard();
  }
}, 10000);

setInterval(() => {
  const nextTrack = (currentTrack + 1) % trackNames.length;
  currentTrack = nextTrack;
  if (isPlaying) {
    trackName.textContent = trackNames[currentTrack];
  }
}, 18000);
