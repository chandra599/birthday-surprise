/* =========================================================
   APP.JS
   Core site logic: loading sequence, section interactions,
   content population, scroll reveals, and the music player.
   Relies on window.BirthdayFX from animations.js for effects.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const FX = window.BirthdayFX || {};

  /* ============================= */
  /* 1. LOADING SCREEN              */
  /* ============================= */
  const loadingScreen = document.getElementById('loading-screen');
  const loadingFill = document.getElementById('loading-bar-fill');
  const loadingPercent = document.getElementById('loading-percent');
  const loadingSparkles = document.getElementById('loading-sparkles');
  const soundGate = document.getElementById('sound-gate');
  const site = document.getElementById('site');

  FX.spawnLoadingSparkles && FX.spawnLoadingSparkles(loadingSparkles);

  let progress = 0;
  const loadTimer = setInterval(() => {
    progress += Math.random() * 12 + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadTimer);
      loadingFill.style.width = '100%';
      loadingPercent.textContent = '100%';
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
        soundGate.classList.add('visible');
      }, 500);
      return;
    }
    loadingFill.style.width = progress + '%';
    loadingPercent.textContent = Math.floor(progress) + '%';
  }, 220);

  /* ============================= */
  /* SOUND GATE -> REVEAL SITE       */
  /* ============================= */
  const bgAudio = document.getElementById('bg-audio');
  const musicPlayer = document.getElementById('music-player');

  soundGate.addEventListener('click', () => {
    soundGate.classList.remove('visible');
    site.hidden = false;
    musicPlayer.hidden = false;

    // Attempt autoplay now that we have a user gesture.
    bgAudio.volume = 0.5;
    bgAudio.play().catch(() => {
      // Autoplay might still be blocked; the player UI lets the user start it.
      musicPlayer.classList.add('paused');
    });

    initHero();
    initCursor();
  }, { once: true });

  /* ============================= */
  /* CURSOR SPARKLES                 */
  /* ============================= */
  function initCursor() {
    const canvas = document.getElementById('cursor-canvas');
    FX.initCursorSparkle && FX.initCursorSparkle(canvas);
  }

  /* ============================= */
  /* 2. HERO: stars + hearts + parallax */
  /* ============================= */
  function initHero() {
    const starsLayer = document.getElementById('stars-layer');
    const heroHearts = document.getElementById('hero-hearts');
    FX.generateStars && FX.generateStars(starsLayer, 100);
    FX.startFloatingHearts && FX.startFloatingHearts(heroHearts, 1000);

    const hero = document.getElementById('hero');
    const moon = document.querySelector('.moon');
    hero.addEventListener('pointermove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      moon.style.transform = `translate(${x * 14}px, ${y * 10}px)`;
    });
  }

  document.getElementById('open-surprise-btn').addEventListener('click', () => {
    document.getElementById('gift').scrollIntoView({ behavior: 'smooth' });
  });

  /* ============================= */
  /* 3. GIFT BOX                    */
  /* ============================= */
  const giftBox = document.getElementById('gift-box');
  const giftParticles = document.getElementById('gift-particles');
  let giftOpened = false;

  function openGift() {
    if (giftOpened) return;
    giftOpened = true;
    giftBox.classList.add('opened');
    FX.spawnGiftParticles && FX.spawnGiftParticles(giftParticles);
    setTimeout(() => {
      document.getElementById('envelope-section').scrollIntoView({ behavior: 'smooth' });
    }, 1400);
  }

  giftBox.addEventListener('click', openGift);
  giftBox.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openGift(); }
  });

  /* ============================= */
  /* 4 + 5. ENVELOPE + LETTER        */
  /* ============================= */
  const envelope = document.getElementById('envelope');
  const letterModal = document.getElementById('letter-modal');
  const letterModalBackdrop = document.getElementById('letter-modal-backdrop');
  const typewriterEl = document.getElementById('typewriter-text');
  const letterHeartParticles = document.getElementById('letter-heart-particles');
  const envelopeHint = document.getElementById('envelope-hint');
  const letterCloseBtn = document.getElementById('letter-close');
  let envelopeOpened = false;

  const letterLines = [
    'My Dear Cutu Baby ❤️',
    '',
    'Happy Birthday to the most beautiful person in my life.',
    '',
    'Every day with you is my favorite memory.',
    '',
    'Thank you for supporting me, believing in me, making me smile, and filling my life with happiness.',
    '',
    'May your life always be filled with joy, success, love, peace and beautiful surprises.',
    '',
    'I promise to always stand beside you.',
    '',
    'Happy Birthday once again.',
    'I Love You Forever ❤️',
    '',
    'Love,',
    'Chandra ❤️'
  ];

  function typewrite(el, lines, speed = 28) {
    el.textContent = '';
    let li = 0, ci = 0;

    return new Promise((resolve) => {
      function step() {
        if (li >= lines.length) { resolve(); return; }
        const line = lines[li];
        if (ci === 0 && line === '') {
          el.appendChild(document.createElement('br'));
          li++; ci = 0;
          requestAnimationFrame(() => setTimeout(step, speed));
          return;
        }
        if (ci < line.length) {
          el.appendChild(document.createTextNode(line[ci]));
          ci++;
          setTimeout(step, speed);
        } else {
          el.appendChild(document.createElement('br'));
          li++; ci = 0;
          setTimeout(step, speed);
        }
      }
      step();
    });
  }

  function openEnvelope() {
    if (envelopeOpened) return;
    envelopeOpened = true;
    envelope.classList.add('opened');
    envelopeHint.textContent = 'reading your letter...';

    // Wait for the paper to peek out of the envelope, then open the
    // dedicated, independent letter modal (avoids layout/transition
    // conflicts with the envelope's own slide animation).
    setTimeout(() => {
      typewriterEl.textContent = '';
      letterModal.classList.add('visible');
      letterModal.setAttribute('aria-hidden', 'false');
      typewrite(typewriterEl, letterLines, 26).then(() => {
        FX.spawnLetterHearts && FX.spawnLetterHearts(letterHeartParticles);
        envelopeHint.textContent = 'tap outside to continue';
      });
    }, 1300);
  }

  envelope.addEventListener('click', openEnvelope);
  envelope.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openEnvelope(); }
  });

  function closeLetter() {
    letterModal.classList.remove('visible');
    letterModal.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
      document.getElementById('story').scrollIntoView({ behavior: 'smooth' });
    }, 300);
  }

  letterCloseBtn.addEventListener('click', closeLetter);
  letterModalBackdrop.addEventListener('click', closeLetter);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && letterModal.classList.contains('visible')) closeLetter();
  });

  /* ============================= */
  /* 6. TIMELINE SCROLL REVEAL       */
  /* ============================= */
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.timeline-item').forEach((item) => timelineObserver.observe(item));

  /* ============================= */
  /* 7. GALLERY                      */
  /* ============================= */
const galleryGrid = document.getElementById('gallery-grid');
const galleryPhotos = [
  { src: 'assets/images/photo-1.jpg', caption: 'that afternoon' },
  { src: 'assets/images/photo-2.jpg', caption: 'our favorite spot' },
  { src: 'assets/images/photo-3.jpg', caption: 'silly faces' },
  { src: 'assets/images/photo-4.jpg', caption: 'quiet moments' },
  { src: 'assets/images/photo-5.jpg', caption: 'celebrating together' },
  { src: 'assets/images/photo-6.jpg', caption: 'the trip we loved' },
  { src: 'assets/images/photo-7.jpg', caption: 'just us' },
  { src: 'assets/images/photo-8.jpg', caption: 'late night talks' },
  { src: 'assets/images/photo-9.jpg', caption: 'that big smile' },
  { src: 'assets/images/photo-10.jpg', caption: 'holding hands' },
  { src: 'assets/images/photo-11.jpg', caption: 'dancing around' },
  { src: 'assets/images/photo-12.jpg', caption: 'always us' }
];

galleryPhotos.forEach((photo, i) => {
  const item = document.createElement('div');
  item.className = 'gallery-item';
  item.style.animationDelay = (i * 0.15) + 's';
  item.innerHTML = `<img src="${photo.src}" alt="${photo.caption}" loading="lazy" />`;
  item.addEventListener('click', () => openLightbox(photo.src, photo.caption));
  galleryGrid.appendChild(item);
});

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.classList.add('visible');
  }
  function closeLightbox() { lightbox.classList.remove('visible'); }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  /* ============================= */
  /* 9. REASONS I LOVE YOU           */
  /* ============================= */
  const reasonsGrid = document.getElementById('reasons-grid');
  const reasons = [
    { icon: '😊', title: 'Your smile', back: 'It lights up every room you walk into.' },
    { icon: '💗', title: 'Your kindness', back: 'You make everyone around you feel cared for.' },
    { icon: '🕊️', title: 'Your patience', back: 'You never rush love, even when I test it.' },
    { icon: '❤️', title: 'Your caring heart', back: 'You notice what I need before I say it.' },
    { icon: '🌸', title: 'Your honesty', back: 'With you, I never have to guess.' },
    { icon: '😂', title: 'Your laughter', back: 'It is my favorite sound in the world.' },
    { icon: '🤝', title: 'Your support', back: 'You believe in me even when I doubt myself.' },
    { icon: '🧠', title: 'Your understanding', back: 'You listen in a way that makes me feel seen.' },
    { icon: '☀️', title: 'Your positivity', back: 'You find light in the smallest things.' },
    { icon: '✨', title: 'Everything about you', back: 'Simply put — you are my favorite person.' }
  ];

  reasons.forEach((r) => {
    const card = document.createElement('div');
    card.className = 'reason-card';
    card.tabIndex = 0;
    card.innerHTML = `
      <div class="reason-card-inner">
        <div class="reason-face reason-front">
          <div class="reason-icon">${r.icon}</div>
          <h4>${r.title}</h4>
        </div>
        <div class="reason-face reason-back">${r.back}</div>
      </div>
    `;
    card.addEventListener('click', () => card.classList.toggle('flipped'));
    reasonsGrid.appendChild(card);
  });

  /* ============================= */
  /* 10. WISHES fade cycle           */
  /* ============================= */
  const wishesStage = document.getElementById('wishes-stage');
  const wishes = [
    'Wishing you endless laughter',
    'A year full of new adventures',
    'Health, peace and happiness',
    'All your dreams within reach',
    'And me, right beside you ❤️'
  ];

  wishes.forEach((text, i) => {
    const el = document.createElement('p');
    el.className = 'wish-item';
    el.textContent = text;
    if (i === 0) el.classList.add('active');
    wishesStage.appendChild(el);
  });

  let wishIndex = 0;
  const wishEls = wishesStage.querySelectorAll('.wish-item');
  setInterval(() => {
    wishEls[wishIndex].classList.remove('active');
    wishIndex = (wishIndex + 1) % wishEls.length;
    wishEls[wishIndex].classList.add('active');
  }, 2600);

  /* ============================= */
  /* 11. MEMORY COUNTER               */
  /* ============================= */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.counter-number').forEach(animateCounter);
        obs.disconnect();
      }
    });
  }, { threshold: 0.4 });

  const counterSection = document.getElementById('counter');
  if (counterSection) counterObserver.observe(counterSection);

  /* ============================= */
  /* 12. MUSIC PLAYER                 */
  /* ============================= */
  const musicToggle = document.getElementById('music-toggle');
  const musicVolume = document.getElementById('music-volume');

  musicToggle.addEventListener('click', () => {
    if (bgAudio.paused) {
      bgAudio.play().catch(() => {});
      musicPlayer.classList.remove('paused');
    } else {
      bgAudio.pause();
      musicPlayer.classList.add('paused');
    }
  });

  musicVolume.addEventListener('input', () => {
    bgAudio.volume = parseFloat(musicVolume.value);
  });

  /* ============================= */
  /* 13. FINALE                       */
  /* ============================= */
  const finaleCanvas = document.getElementById('finale-canvas');
  const finaleBalloons = document.getElementById('finale-balloons');
  const finalePetals = document.getElementById('finale-petals');
  const finaleFX = FX.initFinale ? FX.initFinale(finaleCanvas) : { start() {}, stop() {} };

  function playFinale() {
    finaleFX.start();
    FX.spawnBalloons && FX.spawnBalloons(finaleBalloons, 10);
    FX.spawnPetals && FX.spawnPetals(finalePetals, 30);
  }

  let finalePlayed = false;
  const finaleObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !finalePlayed) {
        finalePlayed = true;
        playFinale();
      }
    });
  }, { threshold: 0.5 });

  const finaleSection = document.getElementById('finale');
  if (finaleSection) finaleObserver.observe(finaleSection);

  document.getElementById('replay-btn').addEventListener('click', () => {
    finaleFX.stop();
    playFinale();
  });

  /* ============================= */
  /* BUTTON RIPPLES                   */
  /* ============================= */
  document.querySelectorAll('.btn-glow').forEach((btn) => FX.attachRipple && FX.attachRipple(btn));

  /* ============================= */
  /* GENERIC SCROLL REVEAL for cards  */
  /* ============================= */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, { threshold: 0.2 });

  document.querySelectorAll(
    '.gallery-item, .reason-card, .counter-card'
  ).forEach((el) => {
    el.classList.add('reveal-on-scroll');
    revealObserver.observe(el);
  });
});
