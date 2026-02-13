/* ENTER SITE + FADE IN MUSIC */
function enterSite() {
  const music = document.getElementById("bgMusic");
  music.volume = 0;
  music.play().catch(() => {});

  // fade in audio
  let vol = 0;
  const fade = setInterval(() => {
    if (vol < 0.8) {
      vol += 0.05;
      music.volume = vol;
    } else {
      clearInterval(fade);
    }
  }, 200);

  document.getElementById("welcomeScreen").classList.add("hide");
  document.getElementById("mainContent").classList.add("show");
}

/* Scroll Reveal */
const reveals = document.querySelectorAll(".reveal");

window.addEventListener("scroll", () => {
  reveals.forEach(section => {
    const top = section.getBoundingClientRect().top;
    if (top < window.innerHeight - 100) {
      section.classList.add("active");
    }
  });
});

/* Confetti + Modal */
function sayYes() {
  confetti({
    particleCount: 200,
    spread: 80,
    origin: { y: 0.6 }
  });

  setTimeout(() => {
    document.getElementById("loveModal").classList.add("show");
  }, 500);
}

function closeModal() {
  document.getElementById("loveModal").classList.remove("show");
}

/* Runaway Button */
const noBtn = document.getElementById("noBtn");

if (noBtn) {
  noBtn.addEventListener("mouseover", moveButton);
  noBtn.addEventListener("click", moveButton);
}

function moveButton() {
  const x = Math.random() * (window.innerWidth - 150);
  const y = Math.random() * (window.innerHeight - 100);

  noBtn.style.position = "fixed";
  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";
}
