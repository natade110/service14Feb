/* ============================================================
   💗 Valentine's Day – Enhanced JS
   ============================================================ */

/* ── HEART CANVAS BACKGROUND ── */
(function initHeartCanvas() {
  const canvas = document.createElement('canvas');
  canvas.id = 'heartCanvas';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const EMOJIS = ['💗','💕','💖','🌸','💓','✨','🌹','💝'];
  const hearts = Array.from({ length: 28 }, () => ({
    x:    Math.random() * window.innerWidth,
    y:    Math.random() * window.innerHeight,
    vy:   -(0.25 + Math.random() * 0.55),
    vx:   (Math.random() - 0.5) * 0.35,
    size: 14 + Math.random() * 22,
    alpha:0.12 + Math.random() * 0.28,
    emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    rot:  Math.random() * Math.PI * 2,
    rotV: (Math.random() - 0.5) * 0.02,
    wobble: Math.random() * Math.PI * 2,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hearts.forEach(h => {
      h.y  += h.vy;
      h.x  += h.vx + Math.sin(h.wobble) * 0.3;
      h.rot += h.rotV;
      h.wobble += 0.03;

      if (h.y + h.size < 0) {
        h.y = canvas.height + h.size;
        h.x = Math.random() * canvas.width;
      }

      ctx.save();
      ctx.globalAlpha = h.alpha;
      ctx.font = `${h.size}px serif`;
      ctx.translate(h.x, h.y);
      ctx.rotate(h.rot);
      ctx.fillText(h.emoji, -h.size / 2, h.size / 2);
      ctx.restore();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();


/* ── SPARKLE CURSOR TRAIL ── */
(function initSparkles() {
  const SPARKS = ['💗','✨','🌸','💕','⭐','🌷'];
  let last = 0;

  document.addEventListener('mousemove', e => {
    const now = Date.now();
    if (now - last < 80) return;
    last = now;

    const el = document.createElement('span');
    el.className = 'sparkle';
    el.textContent = SPARKS[Math.floor(Math.random() * SPARKS.length)];
    el.style.left = (e.clientX - 12) + 'px';
    el.style.top  = (e.clientY - 12) + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 850);
  });
})();


/* ── ENTER SITE + FADE-IN MUSIC ── */
function enterSite() {
  const music = document.getElementById('bgMusic');
  music.volume = 0;
  music.play().catch(() => {});

  let vol = 0;
  const fade = setInterval(() => {
    if (vol < 0.75) {
      vol = Math.min(vol + 0.04, 0.75);
      music.volume = vol;
    } else {
      clearInterval(fade);
    }
  }, 200);

  document.getElementById('welcomeScreen').classList.add('hide');

  const main = document.getElementById('mainContent');
  main.classList.add('show');

  // Trigger first reveal immediately
  setTimeout(() => checkReveal(), 100);
}


/* ── SCROLL REVEAL ── */
const reveals = document.querySelectorAll('.reveal');

function checkReveal() {
  reveals.forEach(section => {
    const top = section.getBoundingClientRect().top;
    if (top < window.innerHeight - 80) {
      section.classList.add('active');
    }
  });
}

window.addEventListener('scroll', checkReveal);


/* ── GROWING "YES" BUTTON ── */
(function initGrowingYes() {
  const btn = document.getElementById('yesBtn');
  if (!btn) return;

  const MAX_SCALE  = 2.6;   // ใหญ่สุดเท่าไหร่
  const GROW_RATE  = 0.018; // โตเร็วแค่ไหนต่อ frame
  const SHRINK_RATE = 0.04; // หดกลับเร็วแค่ไหนเมื่อเมาส์ออก

  const labels = [
    'ได้สิ ❤️',
    'ได้เลย!! 💗',
    'ตอบเลย!! 💕',
    'กดกดกด!! 💖',
    'ใช่ ๆ ๆ ๆ!! 💝',
  ];

  let scale       = 1;
  let hovering    = false;
  let rafId       = null;
  let labelIdx    = 0;
  let labelTimer  = null;

  function animate() {
    if (hovering && scale < MAX_SCALE) {
      scale = Math.min(scale + GROW_RATE, MAX_SCALE);
    } else if (!hovering && scale > 1) {
      scale = Math.max(scale - SHRINK_RATE, 1);
    }

    // Dynamic glow that intensifies as button grows
    const glowSize  = Math.round((scale - 1) * 60);
    const glowAlpha = Math.min((scale - 1) / (MAX_SCALE - 1), 1);
    btn.style.transform  = `scale(${scale.toFixed(3)})`;
    btn.style.boxShadow  = `0 0 ${glowSize}px rgba(255,64,129,${(glowAlpha * 0.8).toFixed(2)}),
                             0 0 ${glowSize * 2}px rgba(255,64,129,${(glowAlpha * 0.35).toFixed(2)})`;
    btn.style.zIndex     = scale > 1.05 ? '100' : '';

    if (hovering || scale > 1) rafId = requestAnimationFrame(animate);
  }

  btn.addEventListener('mouseenter', () => {
    hovering = true;
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(animate);

    // Change label every 0.7s while hovering
    labelTimer = setInterval(() => {
      labelIdx = (labelIdx + 1) % labels.length;
      btn.textContent = labels[labelIdx];
    }, 700);
  });

  btn.addEventListener('mouseleave', () => {
    hovering = false;
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(animate);

    clearInterval(labelTimer);
    // Reset label after shrink
    setTimeout(() => {
      if (!hovering) {
        labelIdx = 0;
        btn.textContent = labels[0];
      }
    }, 600);
  });

  // Touch support
  btn.addEventListener('touchstart', () => {
    hovering = true;
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(animate);
  }, { passive: true });
})();


/* ── CONFETTI + MODAL ── */
function sayYes() {
  // Burst 1
  confetti({
    particleCount: 160,
    spread: 90,
    origin: { y: 0.55 },
    colors: ['#ff85a1', '#ffc2d4', '#ff4081', '#ffffff', '#ffb3c1'],
  });

  // Burst 2 – sides
  setTimeout(() => {
    confetti({ particleCount: 60, angle: 60,  spread: 55, origin: { x: 0, y: 0.6 } });
    confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1, y: 0.6 } });
  }, 250);

  // Heart emojis rain
  setTimeout(() => {
    for (let i = 0; i < 12; i++) {
      setTimeout(() => {
        confetti({
          particleCount: 1,
          shapes: ['text'],
          shapeOptions: { text: { value: ['💗', '💕', '🌸', '💝'][i % 4] } },
          spread: 120,
          startVelocity: 20,
          scalar: 2.5,
          origin: { x: Math.random(), y: 0 },
        });
      }, i * 80);
    }
  }, 100);

  setTimeout(() => {
    document.getElementById('loveModal').classList.add('show');
  }, 600);
}

function closeModal() {
  document.getElementById('loveModal').classList.remove('show');

  // Tiny celebration burst on close
  confetti({ particleCount: 40, spread: 60, origin: { y: 0.5 } });
}


/* ── RUNAWAY "NO" BUTTON ── */
const noBtn = document.getElementById('noBtn');
let escapeTries = 0;
const taunts = [
  'อย่านะ 🥺', 'คิดใหม่สิ! 😤', 'ไม่ได้นะ 😡',
  'กดไม่ได้จ้า 🤭', 'หนีแล้ว 🏃', 'ไม่ ๆ ๆ 😭',
  '...ไม่นะ 🙈', 'พยายามดีนะ 😏',
];

function moveButton(e) {
  if (e) e.preventDefault();
  escapeTries++;

  const margin = 160;
  const x = margin + Math.random() * (window.innerWidth  - margin * 2);
  const y = margin + Math.random() * (window.innerHeight - margin * 2);

  noBtn.style.position  = 'fixed';
  noBtn.style.left      = x + 'px';
  noBtn.style.top       = y + 'px';
  noBtn.style.zIndex    = '9000';
  noBtn.style.transition = 'left 0.18s ease, top 0.18s ease';

  // Change button text as it escapes
  if (escapeTries <= taunts.length) {
    noBtn.textContent = taunts[escapeTries - 1];
  }

  // After 8 tries, shrink it
  if (escapeTries > 5) {
    const scale = Math.max(0.4, 1 - (escapeTries - 5) * 0.1);
    noBtn.style.transform = `scale(${scale})`;
  }
}

if (noBtn) {
  noBtn.addEventListener('mouseover',   moveButton);
  noBtn.addEventListener('touchstart',  moveButton, { passive: false });
  noBtn.addEventListener('click',       moveButton);
}