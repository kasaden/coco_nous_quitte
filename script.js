const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const toast = $("#toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

$("#coffeeBtn")?.addEventListener("click", () => {
  showToast("☕ Oui. Allongé, s’il vous plaît.");
});

$$(".phrase-card").forEach((card) => {
  card.addEventListener("click", () => {
    const messages = {
      coffee: "☕ CAFÉ ?",
      station: "🚫 PAS LA STATION !",
      long: "☕ Un café allongé s’il vous plaît.",
      piu: "📄 J’ai encore 35 PIU à faire."
    };

    showToast(messages[card.dataset.sound] || "Archive chargée.");
  });
});

const reviews = [
  "Référence fiable, rapide et compatible avec un nombre déraisonnable de PIU.",
  "Aucune pièce de rechange disponible. Le support regrette déjà le départ.",
  "Testée pendant deux ans en environnement Marketing intensif : résultat validé.",
  "Produit non renouvelable. Toute tentative de réassort sera ignorée."
];

let reviewIndex = 0;

$("#reviewBtn")?.addEventListener("click", () => {
  $("#altReview").textContent = reviews[reviewIndex];
  reviewIndex = (reviewIndex + 1) % reviews.length;
});

const configMessages = {
  sku: "ERREUR 410 — Coraline Gone. La création de SKU doit désormais être réattribuée.",
  piu: "SERVICE INDISPONIBLE — Le module PIU a officiellement quitté le catalogue.",
  horse: "CONFIGURATION ACCEPTÉE — Compatibilité équitation : 100 %. 🐎",
  stay: "OPTION INCOMPATIBLE — Cette configuration n’est plus disponible chez Antalis."
};

$$("[data-config]").forEach((button) => {
  button.addEventListener("click", () => {
    $("#terminalText").textContent = configMessages[button.dataset.config];
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        fill.style.width = `${fill.dataset.width}%`;
        observer.unobserve(fill);
      }
    });
  },
  { threshold: 0.5 }
);

$$(".bar-fill").forEach((fill) => observer.observe(fill));

const restoreBtn = $("#restoreBtn");
const restoreMessage = $("#restoreMessage");

restoreBtn?.addEventListener("click", () => {
  restoreMessage.classList.add("show");
  launchConfetti();
  restoreBtn.textContent = "DEMANDE ENVOYÉE ✓";
  restoreBtn.disabled = true;
});

function launchConfetti() {
  const canvas = $("#confettiCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const dpr = Math.max(1, window.devicePixelRatio || 1);

  function resize() {
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resize();

  const pieces = Array.from({ length: 150 }, () => ({
    x: Math.random() * innerWidth,
    y: -20 - Math.random() * innerHeight * 0.3,
    vx: -2 + Math.random() * 4,
    vy: 2 + Math.random() * 4.5,
    rot: Math.random() * Math.PI,
    vr: -0.15 + Math.random() * 0.3,
    size: 5 + Math.random() * 8,
    life: 80 + Math.random() * 80,
    color:
      Math.random() > 0.45
        ? "#f0027f"
        : Math.random() > 0.5
        ? "#ffffff"
        : "#111111"
  }));

  let frame = 0;

  function draw() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    pieces.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.035;
      p.rot += p.vr;
      p.life--;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(
        -p.size / 2,
        -p.size / 4,
        p.size,
        p.size / 2
      );
      ctx.restore();
    });

    frame++;

    if (
      frame < 180 &&
      pieces.some((p) => p.life > 0 && p.y < innerHeight + 30)
    ) {
      requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
    }
  }

  draw();
}

window.addEventListener("resize", () => {
  const canvas = $("#confettiCanvas");

  if (canvas) {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  }
});