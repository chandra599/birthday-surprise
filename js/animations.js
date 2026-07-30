/* =========================================================
   ANIMATIONS.JS
   Generative / particle-based visual effects:
   cursor sparkles, stars, floating hearts, gift burst,
   letter hearts, fireworks + confetti, balloons, petals.
   All effects are additive and degrade gracefully if an
   element is missing from the page.
   ========================================================= */

const BB = window.BirthdayFX = {};

/* ---------------------------------------------------------
   Utility
--------------------------------------------------------- */
function rand(min, max) { return Math.random() * (max - min) + min; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

/* ---------------------------------------------------------
   1. Cursor sparkle trail (canvas, pointer-events: none)
--------------------------------------------------------- */
BB.initCursorSparkle = function (canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function spawn(x, y) {
    particles.push({
      x, y,
      vx: rand(-0.6, 0.6),
      vy: rand(-1.2, -0.3),
      life: 1,
      size: rand(2, 4),
      color: pick(['#FF4F8B', '#FFD700', '#FF85B3'])
    });
    if (particles.length > 120) particles.shift();
  }

  let lastMove = 0;
  window.addEventListener('pointermove', (e) => {
    const now = performance.now();
    if (now - lastMove < 40) return; // throttle spawn rate
    lastMove = now;
    spawn(e.clientX, e.clientY);
  });

  function loop() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.02;
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(p.size * p.life, 0), 0, Math.PI * 2);
      ctx.fill();
    });
    particles = particles.filter((p) => p.life > 0);
    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  }
  loop();
};

/* ---------------------------------------------------------
   2. Twinkling stars in the hero sky
--------------------------------------------------------- */
BB.generateStars = function (container, count = 90) {
  if (!container) return;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    s.className = 'star';
    s.style.left = rand(0, 100) + '%';
    s.style.top = rand(0, 70) + '%';
    s.style.animation = `twinkle ${rand(1.5, 4)}s ease-in-out ${rand(0, 3)}s infinite`;
    frag.appendChild(s);
  }
  container.appendChild(frag);
};

/* ---------------------------------------------------------
   3. Continuously rising floating hearts (hero background)
--------------------------------------------------------- */
BB.startFloatingHearts = function (container, intervalMs = 900) {
  if (!container) return;
  const hearts = ['❤', '💕', '💖'];

  function spawn() {
    const el = document.createElement('span');
    el.className = 'floating-heart';
    el.textContent = pick(hearts);
    el.style.left = rand(2, 96) + '%';
    el.style.bottom = '-5%';
    el.style.setProperty('--drift', rand(-40, 40) + 'px');
    el.style.fontSize = rand(0.9, 1.8) + 'rem';
    el.style.animation = `rise-fade ${rand(6, 11)}s linear forwards`;
    container.appendChild(el);
    setTimeout(() => el.remove(), 12000);
  }

  spawn();
  return setInterval(spawn, intervalMs);
};

/* ---------------------------------------------------------
   4. Gift box opening burst (golden sparkle particles)
--------------------------------------------------------- */
BB.spawnGiftParticles = function (container) {
  if (!container) return;
  const colors = ['#FFD700', '#FF4F8B', '#FF85B3', '#FFFFFF'];
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('span');
    const size = rand(4, 9);
    p.style.position = 'absolute';
    p.style.left = '50%';
    p.style.top = '35%';
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.borderRadius = '50%';
    p.style.background = pick(colors);
    p.style.pointerEvents = 'none';
    const angle = rand(0, Math.PI * 2);
    const dist = rand(60, 160);
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist - 60;
    p.style.transition = `transform ${rand(0.8, 1.4)}s cubic-bezier(0.22,1,0.36,1), opacity ${rand(0.9, 1.4)}s ease`;
    p.style.transform = 'translate(-50%, -50%)';
    p.style.opacity = '1';
    container.appendChild(p);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        p.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
        p.style.opacity = '0';
      });
    });
    setTimeout(() => p.remove(), 1600);
  }
};

/* ---------------------------------------------------------
   5. Heart particles after the letter finishes typing
--------------------------------------------------------- */
BB.spawnLetterHearts = function (container) {
  if (!container) return;
  for (let i = 0; i < 16; i++) {
    const el = document.createElement('span');
    el.textContent = '❤';
    el.style.position = 'absolute';
    el.style.left = rand(5, 95) + '%';
    el.style.bottom = '0';
    el.style.color = pick(['#FF4F8B', '#FFD700', '#FF85B3']);
    el.style.fontSize = rand(0.8, 1.6) + 'rem';
    el.style.opacity = '0.9';
    el.style.animation = `rise-fade ${rand(2.4, 4)}s ease-out forwards`;
    el.style.animationDelay = rand(0, 0.6) + 's';
    container.appendChild(el);
    setTimeout(() => el.remove(), 5000);
  }
};

/* ---------------------------------------------------------
   6. Loading screen sparkles
--------------------------------------------------------- */
BB.spawnLoadingSparkles = function (container) {
  if (!container) return;
  setInterval(() => {
    const s = document.createElement('span');
    s.textContent = '✦';
    s.style.position = 'absolute';
    s.style.left = rand(10, 90) + '%';
    s.style.top = rand(10, 90) + '%';
    s.style.color = pick(['#FFD700', '#FF85B3']);
    s.style.fontSize = rand(0.6, 1.3) + 'rem';
    s.style.animation = 'sparkle-pop 1.4s ease-out forwards';
    container.appendChild(s);
    setTimeout(() => s.remove(), 1400);
  }, 260);
};

/* ---------------------------------------------------------
   7. Finale: fireworks + confetti on canvas
--------------------------------------------------------- */
BB.initFinale = function (canvas) {
  if (!canvas) return { start() {}, stop() {} };
  const ctx = canvas.getContext('2d');
  let w, h, raf, running = false;
  let fireworks = [];
  let confetti = [];

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', resize);

  const colors = ['#FF4F8B', '#FF85B3', '#FFD700', '#FFFFFF'];

  function launchFirework() {
    const x = rand(w * 0.15, w * 0.85);
    const y = rand(h * 0.15, h * 0.5);
    const count = 46;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = rand(2, 5.5);
      fireworks.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color: pick(colors)
      });
    }
  }

  function spawnConfettiBatch() {
    for (let i = 0; i < 60; i++) {
      confetti.push({
        x: rand(0, w),
        y: rand(-h, 0),
        vy: rand(1.5, 3.5),
        vx: rand(-1, 1),
        size: rand(4, 9),
        rot: rand(0, 360),
        vr: rand(-6, 6),
        color: pick(colors)
      });
    }
  }

  let fireworkTimer, confettiTimer;

  function loop() {
    ctx.clearRect(0, 0, w, h);

    fireworks.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.03;
      p.life -= 0.018;
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2);
      ctx.fill();
    });
    fireworks = fireworks.filter((p) => p.life > 0);

    confetti.forEach((c) => {
      c.x += c.vx;
      c.y += c.vy;
      c.rot += c.vr;
      ctx.save();
      ctx.globalAlpha = 0.9;
      ctx.translate(c.x, c.y);
      ctx.rotate((c.rot * Math.PI) / 180);
      ctx.fillStyle = c.color;
      ctx.fillRect(-c.size / 2, -c.size / 4, c.size, c.size / 2);
      ctx.restore();
    });
    confetti = confetti.filter((c) => c.y < h + 20);

    ctx.globalAlpha = 1;
    if (running) raf = requestAnimationFrame(loop);
  }

  return {
    start() {
      if (running) return;
      resize();
      running = true;
      launchFirework();
      fireworkTimer = setInterval(launchFirework, 900);
      confettiTimer = setInterval(spawnConfettiBatch, 700);
      loop();
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
      clearInterval(fireworkTimer);
      clearInterval(confettiTimer);
      fireworks = [];
      confetti = [];
      ctx.clearRect(0, 0, w, h);
    }
  };
};

/* ---------------------------------------------------------
   8. Floating balloons for the finale
--------------------------------------------------------- */
BB.spawnBalloons = function (container, count = 10) {
  if (!container) return;
  const colors = ['#FF4F8B', '#FF85B3', '#FFD700', '#FFFFFF'];
  for (let i = 0; i < count; i++) {
    const b = document.createElement('div');
    b.className = 'balloon';
    b.style.left = rand(2, 92) + '%';
    b.style.background = `radial-gradient(circle at 35% 30%, #fff8, ${pick(colors)})`;
    b.style.animation = `balloon-float ${rand(7, 12)}s ease-in ${rand(0, 4)}s forwards`;
    container.appendChild(b);
    setTimeout(() => b.remove(), 17000);
  }
};

/* ---------------------------------------------------------
   9. Falling rose petals for the finale
--------------------------------------------------------- */
BB.spawnPetals = function (container, count = 30) {
  if (!container) return;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'petal';
    p.style.left = rand(0, 100) + '%';
    p.style.animation = `petal-fall ${rand(5, 9)}s linear ${rand(0, 5)}s forwards`;
    container.appendChild(p);
    setTimeout(() => p.remove(), 15000);
  }
};

/* ---------------------------------------------------------
   10. Button ripple micro-interaction
--------------------------------------------------------- */
BB.attachRipple = function (el) {
  if (!el) return;
  el.style.position = el.style.position || 'relative';
  el.addEventListener('click', (e) => {
    const rect = el.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
    ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });
};
