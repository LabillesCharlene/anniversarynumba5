const hungerDisplay = document.getElementById('hunger');
const sleepText = document.getElementById('sleep-text');
const petImage = document.getElementById('pet-image');
const clipboardBtn = document.getElementById('clipboard-btn');
const clipboardPanel = document.getElementById('clipboard-panel');
const noteText = document.getElementById('note-text');
const saveNoteBtn = document.getElementById('save-note-btn');
const deleteNoteBtn = document.getElementById('delete-note-btn');
const hungerText = document.getElementById('hunger-text');
const eatSound = new Audio('nomnom.mp3');
const sleepSound = new Audio('sleeping noise.mp3');
const talkSound = new Audio('talking2.mp3');
const bgMusic = document.getElementById("bg music");
const musicToggle = document.getElementById("music-toggle");
const LOCALSTORAGE_KEY = 'virtualPetNote';

let hunger = 100;
let sleep = 100;
let animationInterval = null;
let isSleeping = false;
let sleepLoopInterval = null;
let musicEnabled = true;
const appContainer = document.getElementById('app');
let messageTimeout;
bgMusic.volume = 0.2;


const eatFrames = ['eat1.png','eat2.png'];
const sleepFrames = ['sleep.png'];
const talkFrames = ['talk1.png', 'talk2.png','talk1.png', 'talk2.png'];
const messages = ["elo elo elo elo elo elo","bat ang tagal mo?","omzim","GIMME SOME MONEI","Mama misses you~", "Mi name le Cici desu", "Happy Anniversary BTW!","Lemme sleep pls"];

let lastMessageIndex = -1;

musicToggle.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play();
    musicToggle.textContent = "🔊 Music On";
    musicEnabled = true;
  } else {
    bgMusic.pause();
    musicToggle.textContent = "🔇 Music Off";
    musicEnabled = false;
  }
});

// Ensure music starts after first user interaction
window.addEventListener("click", () => {
  if (musicEnabled && bgMusic.paused) {
    bgMusic.play().catch(err => console.warn("Autoplay blocked:", err));
  }
}, { once: true });

function getRandomMessage() {
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * messages.length);
  } while (newIndex === lastMessageIndex);
  lastMessageIndex = newIndex;
  return messages[newIndex];
}

appContainer.classList.add('sleeping'); // when sleeping
appContainer.classList.remove('sleeping'); // when waking

function updateHungerDisplay() {
  hungerDisplay.textContent = hunger;
}

function preloadImages(frames) {
  frames.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

// Preload all images
[...eatFrames, ...sleepFrames, ...talkFrames, 'idle.png'].forEach(src => preloadImages([src]));

function playAnimation(frames, frameDuration = 300, callback = null) {
  let i = 0;

  function nextFrame() {
    if (i < frames.length) {
      petImage.src = frames[i];
      i++;
      setTimeout(nextFrame, frameDuration);
    } else {
      if (callback) callback();
    }
  }

  nextFrame();
}

function returnToIdle() {
  petImage.src = 'assets/idle.png';
}

function updateHungerDisplay() {
  hungerText.textContent = `HUNGER: ${hunger}`;
}

// Increase hunger every 30 seconds (capped at 100)
setInterval(() => {
  hunger = Math.min(100, hunger + 20);
  updateHungerDisplay();
}, 30000); // 30,000 ms = 30 seconds

window.feedPet = () => {
  hunger = Math.max(0, hunger - 10);
  updateHungerDisplay();
  eatSound.play();
  playAnimation(eatFrames, 700, () => {
    petImage.src = 'idle.png';
  });
};

updateHungerDisplay();

window.sleepPet = () => {
  const appContainer = document.getElementById('app');

  if (!isSleeping) {
    isSleeping = true;
    sleepSound.play();
    bgMusic.pause();

    // Change to night background
    appContainer.style.backgroundImage = "url('night bg.png')";

    let i = 0;
    sleepLoopInterval = setInterval(() => {
      petImage.src = sleepFrames[i % sleepFrames.length];
      i++;
    }, 800);
  } else {
    isSleeping = false;
    sleepSound.pause();
    bgMusic.play();
    clearInterval(sleepLoopInterval);
    petImage.src = 'idle.png';

    // Change back to day background
    appContainer.style.backgroundImage = "url('bg.png')";
  }
};

window.talkPet = () => {
  const messageDisplay = document.getElementById('pet-message');
  const randomMessage = getRandomMessage();
  talkSound.play();

  // Show message
  messageDisplay.textContent = randomMessage;

  // Clear previous timeout if any
  if (messageTimeout) clearTimeout(messageTimeout);

  // Hide message after 3 seconds
  messageTimeout = setTimeout(() => {
    messageDisplay.textContent = null;
  }, 3000);

  // Play talk animation
  playAnimation(talkFrames, 200, () => {
    petImage.src = 'idle.png';
  });
};

// Initialize UI
updateHungerDisplay();

clipboardBtn.addEventListener('click', () => {
  const isVisible = clipboardPanel.style.display === 'block';
  clipboardPanel.style.display = isVisible ? 'none' : 'block';

  if (!isVisible) {
    const savedNote = localStorage.getItem(LOCALSTORAGE_KEY);
    noteText.value = savedNote || ''; // Load saved note
    noteText.focus();
  }
});

// Load saved note on page load too
window.addEventListener('DOMContentLoaded', () => {
  const savedNote = localStorage.getItem(LOCALSTORAGE_KEY);
  if (savedNote) {
    noteText.value = savedNote;
  }
});

saveNoteBtn.addEventListener('click', () => {
  localStorage.setItem(LOCALSTORAGE_KEY, noteText.value);
  alert('YIPIEEEEEEEEEE!!! Note saved!');
});

deleteNoteBtn.addEventListener('click', () => {
  if (confirm('regret what you wrote?')) {
    localStorage.removeItem(LOCALSTORAGE_KEY);
    noteText.value = '';
  }
});