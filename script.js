/* ==========================================================================
   CUSTOMIZE YOUR ROMANTIC MESSAGE HERE
   ========================================================================== */
const CONFIG = {
  crushName: "My Favorite Person",
  eyebrow: "A quiet note, just for you",
  envelopeSubtitle: "Made carefully, with something I have been wanting to tell you.",
  dateStamp: "Written Under The Same Sky",
  letterHeading: "Dear You,",
  letterBody: [
    "I kept trying to think of an ordinary way to say this, and every time I started, it felt like you deserved something a little more thoughtful.",
    "Somehow, even brief conversations with you end up being the best part of my day. I notice the little things—your laugh, the warmth you bring into a room, and how easy it feels just being around you.",
    "So I made this tiny corner of the internet to tell you honestly: I really like you, and I would love to spend some unhurried time together."
  ].join("\n\n"),
  signature: "— Always thinking of you, Me",
  questionPrompt: "Would you let me take you out sometime soon?",
  yesButtonText: "Yes, I'd love to",
  noButtonText: "Let me think...",
  dodgeWhispers: [
    "Nice try—that button is a little shy.",
    "Almost! Maybe the pink button is easier to catch?",
    "It keeps running away because it's rooting for us.",
    "Okay, even the button knows you meant Yes."
  ],
  celebrationTitle: "You just made my whole week",
  celebrationMessage:
    "Thank you for saying yes. Screenshot this or text me back whenever you are ready—I am already smiling.",
  datePlan:
    "My treat: warm coffee or dinner at your favorite spot, a slow evening walk, and nowhere we need to rush off to."
};

/* ==========================================================================
   ROMANTIC MUSIC-BOX SYNTHESIZER (WEB AUDIO API)
   ========================================================================== */
const Soundscape = (() => {
  let ctx = null;
  let masterGain = null;
  let loopTimer = null;
  let isPlaying = false;
  let stepIndex = 0;

  // Soft Cmaj7 -> Am9 -> Fmaj7 -> G6 arpeggio frequencies (Hz)
  const melody = [
    261.63, 329.63, 392.0, 493.88,
    220.0, 261.63, 329.63, 493.88,
    174.61, 261.63, 329.63, 440.0,
    196.0, 293.66, 329.63, 493.88
  ];

  function playNote(freq, duration = 1.4, volume = 0.08) {
    if (!ctx || !masterGain || ctx.state !== "running") return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);

    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.exponentialRampToValueAtTime(volume, now + 0.04);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(noteGain);
    noteGain.connect(masterGain);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  function startFromGesture() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return false;

    if (!ctx) {
      ctx = new AudioCtx();
      masterGain = ctx.createGain();
      masterGain.gain.value = 0.7;
      masterGain.connect(ctx.destination);
    }

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    isPlaying = true;
    playNote(melody[stepIndex % melody.length], 1.6, 0.09);
    stepIndex += 1;

    if (!loopTimer) {
      loopTimer = window.setInterval(() => {
        if (!isPlaying) return;
        playNote(melody[stepIndex % melody.length], 1.5, 0.075);
        stepIndex += 1;
      }, 650);
    }

    return true;
  }

  function playCelebrationChord() {
    if (!ctx || ctx.state !== "running" || !isPlaying) return;
    [523.25, 659.25, 783.99, 987.77].forEach((freq, idx) => {
      window.setTimeout(() => playNote(freq, 1.8, 0.09), idx * 90);
    });
  }

  function toggle() {
    if (!ctx) {
      return startFromGesture();
    }

    if (isPlaying) {
      isPlaying = false;
      if (masterGain) masterGain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.08);
      return false;
    }

    if (ctx.state === "suspended") {
      ctx.resume();
    }
    isPlaying = true;
    if (masterGain) masterGain.gain.setTargetAtTime(0.7, ctx.currentTime, 0.08);
    return true;
  }

  return { startFromGesture, playCelebrationChord, toggle };
})();

/* ==========================================================================
   AMBIENT STARLIGHT & HEART PETALS CANVAS
   ========================================================================== */
function initStarlight(reducedMotion) {
  const canvas = document.getElementById("starlight-canvas");
  if (!canvas) return { burstHearts: () => {} };
  const ctx = canvas.getContext("2d");
  if (!ctx) return { burstHearts: () => {} };

  let width = 0;
  let height = 0;
  const stars = [];
  const bursts = [];

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createStars(count) {
    stars.length = 0;
    for (let i = 0; i < count; i += 1) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.7 + 0.4,
        alpha: Math.random() * 0.55 + 0.2,
        speedY: -(Math.random() * 0.22 + 0.06),
        twinkle: Math.random() * Math.PI * 2
      });
    }
  }

  function drawHeart(x, y, size, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size / 14, size / 14);
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.fillStyle = "#ef86a0";
    ctx.beginPath();
    ctx.moveTo(0, 4);
    ctx.bezierCurveTo(0, 0, -7, 0, -7, 4);
    ctx.bezierCurveTo(-7, 8, 0, 11, 0, 14);
    ctx.bezierCurveTo(0, 11, 7, 8, 7, 4);
    ctx.bezierCurveTo(7, 0, 0, 0, 0, 4);
    ctx.fill();
    ctx.restore();
  }

  function renderFrame() {
    ctx.clearRect(0, 0, width, height);

    for (const star of stars) {
      if (!reducedMotion) {
        star.y += star.speedY;
        star.twinkle += 0.02;
        if (star.y < -4) {
          star.y = height + 4;
          star.x = Math.random() * width;
        }
      }
      const glow = star.alpha + (reducedMotion ? 0 : Math.sin(star.twinkle) * 0.16);
      ctx.fillStyle = `rgba(255, 226, 232, ${Math.max(0.08, glow)})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = bursts.length - 1; i >= 0; i -= 1) {
      const p = bursts[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.04;
      p.alpha -= 0.012;
      if (p.alpha <= 0) {
        bursts.splice(i, 1);
      } else {
        drawHeart(p.x, p.y, p.size, p.alpha);
      }
    }

    if (!reducedMotion || bursts.length > 0) {
      window.requestAnimationFrame(renderFrame);
    }
  }

  function burstHearts() {
    if (reducedMotion) return;
    const originX = width / 2;
    const originY = height * 0.55;
    for (let i = 0; i < 28; i += 1) {
      const angle = (Math.PI * 2 * i) / 28 + Math.random() * 0.25;
      const speed = Math.random() * 3.5 + 1.8;
      bursts.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.2,
        size: Math.random() * 9 + 8,
        alpha: 0.95
      });
    }
    renderFrame();
  }

  resize();
  createStars(48);
  renderFrame();

  window.addEventListener("resize", () => {
    resize();
    createStars(48);
    if (reducedMotion) renderFrame();
  });

  return { burstHearts };
}

/* ==========================================================================
   MAIN PAGE INTERACTIONS
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const starlight = initStarlight(reducedMotion);

  const envelopeView = document.getElementById("envelope-view");
  const letterView = document.getElementById("letter-view");
  const openSealBtn = document.getElementById("open-seal-btn");
  const soundToggle = document.getElementById("sound-toggle");
  const soundLabel = document.getElementById("sound-label");

  const letterTextEl = document.getElementById("letter-text");
  const signatureEl = document.getElementById("letter-signature");
  const questionBox = document.getElementById("question-box");
  const yesBtn = document.getElementById("yes-btn");
  const noBtn = document.getElementById("no-btn");
  const dodgeWhisper = document.getElementById("dodge-whisper");
  const celebrationBox = document.getElementById("celebration-box");

  // Populate personalized text
  document.getElementById("envelope-eyebrow").textContent = CONFIG.eyebrow;
  document.getElementById("envelope-title").textContent = `For ${CONFIG.crushName}`;
  document.getElementById("envelope-subtitle").textContent = CONFIG.envelopeSubtitle;
  document.getElementById("date-stamp").textContent = CONFIG.dateStamp;
  document.getElementById("letter-heading").textContent = CONFIG.letterHeading;
  signatureEl.textContent = CONFIG.signature;
  document.getElementById("question-prompt").textContent = CONFIG.questionPrompt;
  yesBtn.textContent = CONFIG.yesButtonText;
  noBtn.textContent = CONFIG.noButtonText;
  document.getElementById("celebration-title").textContent = CONFIG.celebrationTitle;
  document.getElementById("celebration-message").textContent = CONFIG.celebrationMessage;
  document.getElementById("date-plan-card").textContent = CONFIG.datePlan;

  function updateSoundButton(active) {
    soundToggle.setAttribute("aria-pressed", String(active));
    soundLabel.textContent = active ? "Sound On" : "Sound Off";
  }

  function revealQuestion() {
    signatureEl.classList.add("is-visible");
    questionBox.hidden = false;
  }

  function typeLetter(text) {
    if (reducedMotion) {
      letterTextEl.textContent = text;
      revealQuestion();
      return;
    }

    let index = 0;
    const stepMs = 20;

    function tick() {
      index += 2;
      letterTextEl.textContent = text.slice(0, index);
      if (index < text.length) {
        window.setTimeout(tick, stepMs);
      } else {
        revealQuestion();
      }
    }

    tick();
  }

  openSealBtn.addEventListener("click", () => {
    const audioStarted = Soundscape.startFromGesture();
    if (audioStarted) {
      soundToggle.hidden = false;
      updateSoundButton(true);
    }

    envelopeView.hidden = true;
    letterView.hidden = false;
    typeLetter(CONFIG.letterBody);
  });

  soundToggle.addEventListener("click", () => {
    const active = Soundscape.toggle();
    updateSoundButton(active);
  });

  // Playful dodging button bounded safely within the active visual viewport
  let dodgeCount = 0;
  let lastDodgeAt = 0;

  function dodgeNoButton(event) {
    if (event.type === "pointerenter" && event.pointerType !== "mouse") return;
    if (event.cancelable) event.preventDefault();

    const now = Date.now();
    if (event.type === "click" && now - lastDodgeAt < 350) return;
    lastDodgeAt = now;

    if (noBtn.parentElement !== document.body) {
      const rect = noBtn.getBoundingClientRect();
      document.body.appendChild(noBtn);
      noBtn.classList.add("is-dodging");
      noBtn.style.left = `${rect.left}px`;
      noBtn.style.top = `${rect.top}px`;
    }

    const vp = window.visualViewport;
    const vpLeft = vp ? vp.offsetLeft : 0;
    const vpTop = vp ? vp.offsetTop : 0;
    const vpWidth = vp ? vp.width : window.innerWidth;
    const vpHeight = vp ? vp.height : window.innerHeight;

    const btnRect = noBtn.getBoundingClientRect();
    const margin = 20;
    const minX = vpLeft + margin;
    const minY = vpTop + margin + 32;
    const maxX = Math.max(minX, vpLeft + vpWidth - btnRect.width - margin);
    const maxY = Math.max(minY, vpTop + vpHeight - btnRect.height - margin - 24);

    const nextX = minX + Math.random() * (maxX - minX);
    const nextY = minY + Math.random() * (maxY - minY);

    window.requestAnimationFrame(() => {
      noBtn.style.left = `${Math.round(nextX)}px`;
      noBtn.style.top = `${Math.round(nextY)}px`;
    });

    const whisper = CONFIG.dodgeWhispers[dodgeCount % CONFIG.dodgeWhispers.length];
    dodgeWhisper.textContent = whisper;
    dodgeCount += 1;
  }

  noBtn.addEventListener("pointerenter", dodgeNoButton);
  noBtn.addEventListener("pointerdown", dodgeNoButton);
  noBtn.addEventListener("click", dodgeNoButton);

  yesBtn.addEventListener("click", () => {
    noBtn.hidden = true;
    questionBox.hidden = true;
    celebrationBox.hidden = false;
    Soundscape.playCelebrationChord();
    starlight.burstHearts();
  });
});