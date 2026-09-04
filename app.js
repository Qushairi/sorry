/**
 * ====================================================================
 * KONFIGURASI WEBSITE PERMINTAAN MAAF
 * ====================================================================
 * Anda bisa mengubah nama atau nomor WhatsApp di bawah ini dengan mudah:
 */
const CONFIG = {
  recipientName: "Nahdya", // Nama panggilan pasangan
  senderName: "Aku",      // Panggilan Anda
  whatsappNumber: "",     // Masukkan nomor WhatsApp Anda (Contoh: "6281234567890"). Jika kosong, akan meminta input / membuka WA langsung.
  
  // Teks pesan permohonan maaf (akan diketik otomatis)
  apologyText: [
    "Hai Nahdya sayang... 🌸",
    "Pertama-tama, dari lubuk hatiku yang paling dalam, aku mau minta maaf ya atas semua kesalahan, keegoisan, dan sikapku yang udah bikin kamu sedih, kesel, atau kecewa.",
    "Aku bener-bener nyesel dan merasa bersalah banget. Aku sadar perilakuku barusan udah ngerusak mood kamu.",
    "Kamu itu orang yang sangat berharga dalam hidup aku. Senyumanmu dan kebersamaan kita adalah hal yang paling aku jaga, dan aku gamau kehilangan itu cuma karena kebodohanku.",
    "Aku janji bakal terus belajar jadi pasangan yang lebih dewasa, lebih peka, dan lebih sabar. Semoga pintu maafmu masih terbuka buat aku ya sayang... 🥺🤍"
  ],

  // Pesan lucu saat tombol "Enggak Mau" mencoba ditekan / didekati
  dodgeMessages: [
    "Yakin nih gak mau maafin? 🥺",
    "Masa tega banget sama aku... 💔",
    "Pikir-pikir lagi dong sayang... 👉👈",
    "Tombol ini lagi rusak wlee 😜",
    "Coba klik yang warna hijau di sebelah deh! 🥺",
    "Jangan gitu dong cantik... 😭",
    "Nanti aku traktir makanan favoritmu deh! 🍽️",
    "Aku beliin es krim & matcha/boba janji! 🧋",
    "Plisss jangan ngambek lagi yaaa... 🥺🙏",
    "Tombol ini udah kabur ke planet lain 🚀"
  ]
};

// State global
let typewriterTimeout = null;
let isTypewriterFinished = false;
let dodgeCount = 0;
let yesBtnScale = 1;
let flowerCount = 0;
let isMusicPlaying = false;
let audioCtx = null;
let musicInterval = null;

/* ====================================================================
   INISIALISASI SAAT HALAMAN DIMUAT
   ==================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  // Update nama di teks jika diubah di CONFIG
  document.querySelectorAll(".recipient-name").forEach(el => {
    el.textContent = CONFIG.recipientName;
  });

  initBackgroundParticles();
  initEnvelopeEvents();
  initDecisionButtons();
  initFlipCards();
  initFlowerBouquet();
  initAudioPlayer();
  initWhatsAppButton();

  // Tombol reset/buka dari awal
  const restartBtn = document.getElementById("restart-btn");
  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => window.location.reload(), 300);
    });
  }
});

/* ====================================================================
   1. ANIMASI PARTIKEL LATAR BELAKANG (HEARTS & SPARKLES)
   ==================================================================== */
function initBackgroundParticles() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(35, Math.floor(width / 30));

  class HeartParticle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 50;
      this.size = Math.random() * 14 + 10;
      this.speedY = Math.random() * 1.2 + 0.6;
      this.speedX = Math.sin(Math.random() * Math.PI) * 0.8;
      this.opacity = Math.random() * 0.5 + 0.25;
      this.color = ["#ff4d6d", "#ff758f", "#ff8fa3", "#ffccd5", "#ffa69e"][
        Math.floor(Math.random() * 5)
      ];
      this.angle = Math.random() * 360;
      this.angularSpeed = (Math.random() - 0.5) * 1.2;
    }

    update() {
      this.y -= this.speedY;
      this.x += Math.sin(this.y * 0.015) * 0.7;
      this.angle += this.angularSpeed;

      if (this.y < -30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.angle * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;

      // Gambar bentuk hati menggunakan kurva Bezier
      const s = this.size / 20;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-10 * s, -10 * s, -20 * s, 5 * s, 0, 20 * s);
      ctx.bezierCurveTo(20 * s, 5 * s, 10 * s, -10 * s, 0, 0);
      ctx.fill();

      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    const p = new HeartParticle();
    p.y = Math.random() * height; // sebar di awal
    particles.push(p);
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
}

/* ====================================================================
   2. SCENE 1: AMPLOP & BUKA SURAT
   ==================================================================== */
function initEnvelopeEvents() {
  const envelopeBox = document.getElementById("envelope-box");
  const sealTrigger = document.getElementById("seal-trigger");
  const openLetterBtn = document.getElementById("open-letter-btn");
  const sceneEnvelope = document.getElementById("scene-envelope");
  const sceneLetter = document.getElementById("scene-letter");

  let isOpening = false;

  const openLetterAction = () => {
    if (isOpening) return;
    isOpening = true;

    playChimeSound();

    // Animasi buka flap amplop
    envelopeBox.classList.add("opened");

    // Mulai melodi jika belum diputar
    startRomanticMelody();

    setTimeout(() => {
      // Sembunyikan amplop, tampilkan surat
      sceneEnvelope.classList.remove("active-scene");
      sceneEnvelope.classList.add("hidden-scene");

      sceneLetter.classList.remove("hidden-scene");
      sceneLetter.classList.add("active-scene");

      // Scroll ke bagian atas surat dengan mulus
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Mulai efek ketik
      startTypewriter();
    }, 900);
  };

  if (envelopeBox) envelopeBox.addEventListener("click", openLetterAction);
  if (sealTrigger) sealTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    openLetterAction();
  });
  if (openLetterBtn) openLetterBtn.addEventListener("click", openLetterAction);
}

/* ====================================================================
   3. SCENE 2: TYPEWRITER TEXT EFFECT
   ==================================================================== */
function startTypewriter() {
  const targetElement = document.getElementById("typewriter-text");
  const skipBtn = document.getElementById("skip-type-btn");
  if (!targetElement) return;

  const fullContent = CONFIG.apologyText.join("\n\n");
  let charIndex = 0;
  targetElement.innerHTML = "";

  function typeNextChar() {
    if (charIndex < fullContent.length) {
      const char = fullContent.charAt(charIndex);
      if (char === "\n") {
        targetElement.innerHTML += "<br>";
      } else {
        targetElement.innerHTML += char;
      }
      charIndex++;
      const delay = char === "." || char === "?" || char === "!" ? 280 : 35;
      typewriterTimeout = setTimeout(typeNextChar, delay);
    } else {
      isTypewriterFinished = true;
      if (skipBtn) skipBtn.style.display = "none";
    }
  }

  typeNextChar();

  if (skipBtn) {
    skipBtn.addEventListener("click", () => {
      clearTimeout(typewriterTimeout);
      targetElement.innerHTML = CONFIG.apologyText.map(p => `<p>${p}</p>`).join("");
      isTypewriterFinished = true;
      skipBtn.style.display = "none";
    });
  }
}

/* ====================================================================
   4. KARTU ALASAN (FLIP CARDS)
   ==================================================================== */
function initFlipCards() {
  const cards = document.querySelectorAll(".interactive-card");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.toggle("is-flipped");
      playPopSound(520);
    });
  });
}

/* ====================================================================
   5. INTERAKSI TOMBOL "IYA" VS "ENGGAK" (VIRAL RUNAWAY BUTTON)
   ==================================================================== */
function initDecisionButtons() {
  const btnYes = document.getElementById("btn-yes");
  const btnNo = document.getElementById("btn-no");
  const buttonsArea = document.getElementById("buttons-area");
  const noBtnText = document.getElementById("no-btn-text");
  const dodgeMessage = document.getElementById("dodge-message");

  if (!btnYes || !btnNo || !buttonsArea) return;

  // Fungsi saat tombol "Enggak" dicoba didekati / disentuh
  const dodgeNoButton = (e) => {
    e.preventDefault();
    dodgeCount++;

    playSpringSound();

    // Pastikan tombol berpindah posisi secara dinamis
    btnNo.classList.add("is-teleporting");

    const areaRect = buttonsArea.getBoundingClientRect();
    const btnRect = btnNo.getBoundingClientRect();

    // Hitung batasan area aman
    const maxLeft = Math.max(20, areaRect.width - btnRect.width - 20);
    const maxTop = Math.max(10, areaRect.height - btnRect.height - 10);

    const randomLeft = Math.floor(Math.random() * maxLeft);
    const randomTop = Math.floor(Math.random() * maxTop);

    btnNo.style.position = "absolute";
    btnNo.style.left = `${randomLeft}px`;
    btnNo.style.top = `${randomTop}px`;

    // Ganti teks pesan lucu
    const randomMsg =
      CONFIG.dodgeMessages[dodgeCount % CONFIG.dodgeMessages.length];
    dodgeMessage.textContent = randomMsg;
    noBtnText.textContent = dodgeCount > 3 ? "Masih gamau 😝" : "Enggak Mau!";

    // Tombol "IYA" makin membesar
    yesBtnScale = Math.min(1.45, yesBtnScale + 0.08);
    btnYes.style.transform = `scale(${yesBtnScale})`;

    // Reaksi maskot tambah gemas
    const moodStatus = document.getElementById("mood-status");
    if (moodStatus) {
      moodStatus.textContent = `Status: Memohon dimaafkan level ${dodgeCount} 🥺`;
    }
  };

  // Event untuk mouse (desktop)
  btnNo.addEventListener("mouseenter", dodgeNoButton);
  btnNo.addEventListener("mouseover", dodgeNoButton);
  btnNo.addEventListener("click", dodgeNoButton);

  // Event untuk layar sentuh HP (mobile touch)
  btnNo.addEventListener("touchstart", (e) => {
    dodgeNoButton(e);
  }, { passive: false });

  // Event saat tombol "IYA" dimaafkan diklik
  btnYes.addEventListener("click", handleForgiveness);
}

/* ====================================================================
   6. AKSI SETELAH DIMAAFKAN (CELEBRATION & GIFTS)
   ==================================================================== */
function handleForgiveness() {
  playCelebrationFanfare();

  // Ledakan konfeti spektakuler
  triggerConfettiExplosion();

  // Ubah maskot menjadi gembira
  const mascotDisplay = document.getElementById("mascot-display");
  const moodStatus = document.getElementById("mood-status");
  const mascotMouth = document.getElementById("mascot-mouth");
  const mascotEyes = document.getElementById("mascot-eyes");

  if (mascotDisplay) mascotDisplay.classList.add("happy");
  if (moodStatus) {
    moodStatus.textContent = "Status: Super Bahagia & Lega Banget! 🥰💖";
    moodStatus.style.background = "#d8f3dc";
    moodStatus.style.color = "#1b4332";
    moodStatus.style.borderColor = "#52b788";
  }

  // Ubah senyum maskot SVG
  if (mascotMouth) {
    mascotMouth.setAttribute("d", "M 92 112 Q 100 124 108 112");
  }

  // Sembunyikan air mata maskot
  document.querySelectorAll(".tear").forEach((t) => (t.style.display = "none"));

  // Sembunyikan bagian tombol pertanyaan
  const decisionSection = document.getElementById("decision-section");
  if (decisionSection) {
    decisionSection.style.display = "none";
  }

  // Tampilkan bagian hadiah & ucapan terima kasih
  const forgivenSection = document.getElementById("forgiven-section");
  if (forgivenSection) {
    forgivenSection.classList.remove("hidden-element");
    forgivenSection.scrollIntoView({ behavior: "smooth" });
  }

  // Tambahkan bunga pertama otomatis
  addRoseToBouquet();
}

/* ====================================================================
   7. BUKET BUNGA VIRTUAL INTERAKTIF
   ==================================================================== */
function initFlowerBouquet() {
  const addFlowerBtn = document.getElementById("add-flower-btn");
  if (addFlowerBtn) {
    addFlowerBtn.addEventListener("click", () => {
      addRoseToBouquet();
      playPopSound(600 + flowerCount * 40);
    });
  }
}

function addRoseToBouquet() {
  const bouquetFlowers = document.getElementById("bouquet-flowers");
  const flowerCountBadge = document.getElementById("flower-count-badge");
  const flowerQuote = document.getElementById("flower-quote");
  if (!bouquetFlowers) return;

  flowerCount++;

  const rose = document.createElement("span");
  rose.className = "rose-stem";
  // Variasi bunga romantis
  const flowers = ["🌹", "🌷", "🌸", "💐", "🌺", "✨"];
  rose.textContent = flowers[flowerCount % flowers.length];
  bouquetFlowers.appendChild(rose);

  if (flowerCountBadge) {
    flowerCountBadge.textContent = `${flowerCount} Tangkai`;
  }

  if (flowerQuote) {
    if (flowerCount === 1) {
      flowerQuote.textContent = `"Satu tangkai pertama: melambangkan cinta yang cuma ada satu untukmu."`;
    } else if (flowerCount === 3) {
      flowerQuote.textContent = `"Tiga tangkai: I Love You, kemarin, hari ini, dan seterusnya."`;
    } else if (flowerCount >= 7) {
      flowerQuote.textContent = `"Buket cintaku udah penuh mekar spesial hanya untuk Nahdya tersayang! 💐❤️"`;
    }
  }
}

/* ====================================================================
   8. KLAIM KUPON PERDAMAIAN (VOUCHERS)
   ==================================================================== */
function claimVoucher(voucherId) {
  const card = document.getElementById(voucherId);
  if (!card) return;

  if (!card.classList.contains("claimed")) {
    card.classList.add("claimed");
    playStampSound();
    triggerMiniSparkles(card);

    const btn = card.querySelector(".claim-voucher-btn");
    if (btn) {
      btn.textContent = "Klaim Berhasil! ✓";
    }
  }
}
window.claimVoucher = claimVoucher; // expose ke global scope HTML onclick

/* ====================================================================
   9. WHATSAPP AUTO-LINK GENERATOR
   ==================================================================== */
function initWhatsAppButton() {
  const waBtn = document.getElementById("whatsapp-reply-btn");
  if (!waBtn) return;

  const defaultMsg = encodeURIComponent(
    `Hai sayang, aku udah baca semua surat permintaan maaf kamu... Iya, aku maafin kok ❤️ Jangan diulangin lagi ya!`
  );

  let waUrl = "";
  if (CONFIG.whatsappNumber && CONFIG.whatsappNumber.trim() !== "") {
    waUrl = `https://api.whatsapp.com/send?phone=${CONFIG.whatsappNumber.trim()}&text=${defaultMsg}`;
  } else {
    // Jika nomor belum diisi, buka tautan universal WA dengan teks pre-filled
    waUrl = `https://api.whatsapp.com/send?text=${defaultMsg}`;
  }

  waBtn.setAttribute("href", waUrl);

  waBtn.addEventListener("click", (e) => {
    if (!CONFIG.whatsappNumber) {
      const userNumber = prompt(
        "klik OK untuk membuka WhatsApp: kirim ke aku ya sayang",
        ""
      );
      if (userNumber && userNumber.trim() !== "") {
        const cleanNumber = userNumber.replace(/[^0-9]/g, "");
        waBtn.setAttribute(
          "href",
          `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${defaultMsg}`
        );
      }
    }
  });
}

/* ====================================================================
   10. SISTEM LEDAKAN KONFETI SPEKTAKULER (CANVAS CONFETTI)
   ==================================================================== */
function triggerConfettiExplosion() {
  const canvas = document.getElementById("confetti-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confettis = [];
  const colors = ["#ff4d6d", "#ff758f", "#ffb703", "#52b788", "#2ec4b6", "#ffd166", "#7209b7", "#ffffff"];
  const shapes = ["circle", "rect", "heart"];

  for (let i = 0; i < 180; i++) {
    confettis.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 22,
      vy: (Math.random() - 0.7) * 24,
      size: Math.random() * 9 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 15,
      gravity: 0.35,
      opacity: 1,
      decay: Math.random() * 0.008 + 0.005,
    });
  }

  let animationFrame;
  function updateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let activeCount = 0;

    confettis.forEach((c) => {
      c.x += c.vx;
      c.y += c.vy;
      c.vy += c.gravity;
      c.vx *= 0.98;
      c.rotation += c.vRot;
      c.opacity -= c.decay;

      if (c.opacity > 0) {
        activeCount++;
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate((c.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, c.opacity);
        ctx.fillStyle = c.color;

        if (c.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, c.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (c.shape === "rect") {
          ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.6);
        } else if (c.shape === "heart") {
          const s = c.size / 15;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-5 * s, -5 * s, -10 * s, 2 * s, 0, 10 * s);
          ctx.bezierCurveTo(10 * s, 2 * s, 5 * s, -5 * s, 0, 0);
          ctx.fill();
        }

        ctx.restore();
      }
    });

    if (activeCount > 0) {
      animationFrame = requestAnimationFrame(updateConfetti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrame);
    }
  }

  updateConfetti();
}

function triggerMiniSparkles(targetElement) {
  const rect = targetElement.getBoundingClientRect();
  const canvas = document.getElementById("confetti-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const sparkles = [];
  for (let i = 0; i < 20; i++) {
    sparkles.push({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      size: Math.random() * 6 + 3,
      color: "#2ec4b6",
      opacity: 1,
    });
  }

  function renderSparkles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let count = 0;
    sparkles.forEach((s) => {
      s.x += s.vx;
      s.y += s.vy;
      s.opacity -= 0.03;
      if (s.opacity > 0) {
        count++;
        ctx.save();
        ctx.globalAlpha = s.opacity;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    });
    if (count > 0) requestAnimationFrame(renderSparkles);
  }
  renderSparkles();
}

/* ====================================================================
   11. PEMUTAR AUDIO & SOUND EFFECTS (WEB AUDIO API NATIVE)
   Tidak membutuhkan file eksternal, 100% aman dan pasti berbunyi!
   ==================================================================== */
function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function initAudioPlayer() {
  const toggleBtn = document.getElementById("music-toggle-btn");
  if (!toggleBtn) return;

  toggleBtn.addEventListener("click", () => {
    if (isMusicPlaying) {
      stopRomanticMelody();
      toggleBtn.classList.remove("playing");
      toggleBtn.querySelector(".music-text").textContent = "Putar Melodi Romantis";
    } else {
      startRomanticMelody();
      toggleBtn.classList.add("playing");
      toggleBtn.querySelector(".music-text").textContent = "Jeda Musik ⏸️";
    }
  });
}

// Suara lonceng manis saat membuka amplop
function playChimeSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  notes.forEach((freq, idx) => {
    setTimeout(() => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    }, idx * 120);
  });
}

// Suara lucu saat tombol kabur
function playSpringSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(320, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(640, ctx.currentTime + 0.15);

  gain.gain.setValueAtTime(0.18, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.2);
}

// Suara pop kartu
function playPopSound(freq = 500) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.08);

  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.1);
}

// Suara stempel kupon
function playStampSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(160, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.12);

  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.15);
}

// Fanfare perayaan dimaafkan
function playCelebrationFanfare() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const chords = [
    [523.25, 659.25], // C5, E5
    [587.33, 739.99], // D5, F#5
    [659.25, 783.99], // E5, G5
    [783.99, 1046.5]  // G5, C6
  ];

  chords.forEach((chord, step) => {
    setTimeout(() => {
      chord.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.7);
      });
    }, step * 160);
  });
}

// Melodi lembut romantis berulang di latar belakang
function startRomanticMelody() {
  const ctx = getAudioContext();
  if (!ctx || isMusicPlaying) return;
  isMusicPlaying = true;

  const toggleBtn = document.getElementById("music-toggle-btn");
  if (toggleBtn) {
    toggleBtn.classList.add("playing");
    toggleBtn.querySelector(".music-text").textContent = "Jeda Musik ⏸️";
  }

  // Pola nada lofi romantis hangat: Cmaj7 - Am7 - Fmaj7 - G
  const melodyChords = [
    [261.63, 329.63, 392.0, 493.88], // Cmaj7
    [220.0, 261.63, 329.63, 392.0],  // Am7
    [174.61, 220.0, 261.63, 329.63], // Fmaj7
    [196.0, 246.94, 293.66, 392.0]   // G
  ];

  let currentChordIndex = 0;

  function playNextChord() {
    if (!isMusicPlaying) return;
    const currentNotes = melodyChords[currentChordIndex];

    currentNotes.forEach((freq, i) => {
      setTimeout(() => {
        if (!isMusicPlaying) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.8);
      }, i * 220);
    });

    currentChordIndex = (currentChordIndex + 1) % melodyChords.length;
  }

  playNextChord();
  musicInterval = setInterval(playNextChord, 2200);
}

function stopRomanticMelody() {
  isMusicPlaying = false;
  if (musicInterval) {
    clearInterval(musicInterval);
    musicInterval = null;
  }
}
