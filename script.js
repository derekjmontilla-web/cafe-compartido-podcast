/* ========================
   CAFE COMPARTIDO — SCRIPT
   ======================== */

// ---- Mobile Nav ----
const navToggle = document.querySelector('.nav__toggle');
const navLinks  = document.querySelector('.nav__links');

navToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close nav when a link is clicked
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});


// ---- Audio Player ----
const audio       = document.getElementById('main-audio');
const playBtn     = document.getElementById('play-btn');
const playIcon    = playBtn?.querySelector('.play-icon');
const progressBar = document.getElementById('progress-bar');
const progressFill= document.getElementById('progress-fill');
const currentTime = document.getElementById('current-time');
const totalTime   = document.getElementById('total-time');
const volumeSlider= document.getElementById('volume');

let isPlaying = false;

function formatTime(secs) {
  if (isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function setPlayIcon(playing) {
  if (playIcon) playIcon.innerHTML = playing ? '&#9646;&#9646;' : '&#9654;';
}

// Play / Pause
playBtn?.addEventListener('click', () => {
  if (!audio.src || audio.src === window.location.href + '#') {
    showToast('🎙️ Añade el archivo de audio en el atributo src del episodio.');
    return;
  }
  if (isPlaying) {
    audio.pause();
  } else {
    audio.play().catch(() => showToast('No se pudo reproducir el audio.'));
  }
});

audio?.addEventListener('play',  () => { isPlaying = true;  setPlayIcon(true); });
audio?.addEventListener('pause', () => { isPlaying = false; setPlayIcon(false); });
audio?.addEventListener('ended', () => { isPlaying = false; setPlayIcon(false); progressFill.style.width = '0%'; });

// Progress update
audio?.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  progressFill.style.width = pct + '%';
  if (currentTime) currentTime.textContent = formatTime(audio.currentTime);
  if (totalTime)   totalTime.textContent   = formatTime(audio.duration);
});

// Seek on click
progressBar?.addEventListener('click', (e) => {
  const rect = progressBar.getBoundingClientRect();
  const pct  = (e.clientX - rect.left) / rect.width;
  if (audio.duration) audio.currentTime = pct * audio.duration;
});

// Volume
volumeSlider?.addEventListener('input', () => {
  audio.volume = volumeSlider.value;
});
if (audio && volumeSlider) audio.volume = volumeSlider.value;


// ---- Episode cards "play" buttons ----
document.querySelectorAll('.play-ep-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const src = btn.dataset.src;
    const card = btn.closest('.episode-card');
    const title = card?.querySelector('h3')?.textContent || '';

    // Update featured player title (optional UX touch)
    const featuredTitle = document.querySelector('.player-card__title');
    if (featuredTitle && title) featuredTitle.textContent = title;

    if (!src || src === '#') {
      showToast('🎙️ Añade la URL del audio en data-src del episodio.');
      // Scroll to player anyway
      document.getElementById('player')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    audio.src = src;
    audio.play().catch(() => showToast('No se pudo reproducir el audio.'));
    document.getElementById('player')?.scrollIntoView({ behavior: 'smooth' });
  });
});


// ---- Newsletter form ----
const form = document.getElementById('newsletter-form');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = form.querySelector('input[type="email"]').value;
  if (email) {
    showToast(`¡Genial! Te avisaremos en ${email} 🎉`);
    form.reset();
  }
});


// ---- Toast notification ----
function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}


// ---- Scroll-reveal (lightweight) ----
const revealEls = document.querySelectorAll('.episode-card, .player-card, .about__grid, .platform-btn');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  observer.observe(el);
});
