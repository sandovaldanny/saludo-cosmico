const PHRASES = [
  "El universo acaba de volverse más brillante.",
  "Hoy el mundo estaba esperando exactamente tu nombre.",
  "Bienvenido. Este momento ya te pertenecía.",
  "Tu llegada enciende luces que no sabíamos que existían.",
  "Hay magia en el aire… y acaba de decir tu nombre.",
  "El día se detuvo un segundo para recibirte.",
  "Estás en el lugar correcto, en el instante perfecto.",
  "Una nueva historia empieza cuando dices hola.",
  "Brillas más que las constelaciones de esta noche.",
  "Bienvenido al escenario. Las luces ya estaban listas.",
  "Tu presencia convierte lo ordinario en extraordinario.",
  "El cosmos sonríe. Tú acabas de entrar.",
];

const form = document.querySelector("#greet-form");
const greeting = document.querySelector("#greeting");
const hello = document.querySelector("#hello");
const phrase = document.querySelector("#phrase");
const nameInput = document.querySelector("#name");
const again = document.querySelector("#again");
const reset = document.querySelector("#reset");

let currentName = "";
let lastPhrase = "";

function pickPhrase() {
  let next = lastPhrase;
  while (next === lastPhrase) {
    next = PHRASES[Math.floor(Math.random() * PHRASES.length)];
  }
  lastPhrase = next;
  return next;
}

function showGreeting(name) {
  currentName = name;
  hello.innerHTML = `Hola, <span>${escapeHtml(name)}</span>`;
  phrase.textContent = pickPhrase();
  greeting.hidden = false;
  greeting.style.animation = "none";
  greeting.offsetHeight;
  greeting.style.animation = "";
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = nameInput.value.trim();
  if (!name) return;
  showGreeting(name);
});

again.addEventListener("click", () => {
  if (!currentName) return;
  showGreeting(currentName);
});

reset.addEventListener("click", () => {
  greeting.hidden = true;
  nameInput.focus();
  nameInput.select();
});

const canvas = document.querySelector("#stars");
const ctx = canvas.getContext("2d");
const stars = Array.from({ length: 90 }, () => ({
  x: Math.random(),
  y: Math.random(),
  r: Math.random() * 1.6 + 0.3,
  s: Math.random() * 0.25 + 0.05,
}));

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function draw(time) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach((star) => {
    const pulse = 0.45 + Math.sin(time * 0.002 + star.x * 12) * 0.35;
    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 240, 255, ${pulse})`;
    ctx.arc(star.x * canvas.width, star.y * canvas.height, star.r, 0, Math.PI * 2);
    ctx.fill();
    star.y -= star.s / 800;
    if (star.y < 0) star.y = 1;
  });
  requestAnimationFrame(draw);
}

window.addEventListener("resize", resize);
resize();
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  requestAnimationFrame(draw);
}
