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

const CATEGORIES = [
  {
    id: "autocrecimiento",
    name: "Autocrecimiento",
    unlocked: true,
    program: "Una vida maravillosa",
    phrases: [
      "Soy una buena persona.",
      "Amo mi vida.",
      "Mi vida tiene dirección y significado.",
      "Hoy será un gran día.",
      "Confío en mí.",
      "Tengo energía para avanzar.",
      "Disfruto construir mi mejor versión.",
      "Agradezco todo lo bueno que llega a mi vida.",
      "Estoy creando una vida maravillosa.",
      "Cada día crezco y mejoro.",
    ],
  },
  { id: "salud", name: "Salud", unlocked: false },
  { id: "amor", name: "Amor y pareja", unlocked: false },
  { id: "familia", name: "Familia y amigos", unlocked: false },
  { id: "carrera", name: "Carrera y propósito", unlocked: false },
  { id: "finanzas", name: "Finanzas", unlocked: false },
  { id: "diversion", name: "Diversión y recreación", unlocked: false },
  { id: "entorno", name: "Entorno físico", unlocked: false },
];

const welcome = document.querySelector("#welcome");
const form = document.querySelector("#greet-form");
const greeting = document.querySelector("#greeting");
const hello = document.querySelector("#hello");
const phrase = document.querySelector("#phrase");
const nameInput = document.querySelector("#name");
const again = document.querySelector("#again");
const reset = document.querySelector("#reset");
const auren = document.querySelector("#auren");
const aurenLede = document.querySelector("#auren-lede");
const categoriesEl = document.querySelector("#categories");
const practice = document.querySelector("#practice");
const practiceKicker = document.querySelector("#practice-kicker");
const practiceTitle = document.querySelector("#practice-title");
const practiceProgress = document.querySelector("#practice-progress");
const affirmation = document.querySelector("#affirmation");
const prevPhrase = document.querySelector("#prev-phrase");
const nextPhrase = document.querySelector("#next-phrase");
const backAuren = document.querySelector("#back-auren");

let currentName = "";
let lastPhrase = "";
let activeCategory = null;
let phraseIndex = 0;

function pickPhrase() {
  let next = lastPhrase;
  while (next === lastPhrase) {
    next = PHRASES[Math.floor(Math.random() * PHRASES.length)];
  }
  lastPhrase = next;
  return next;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function replay(el) {
  el.style.animation = "none";
  el.offsetHeight;
  el.style.animation = "";
}

function renderCategories() {
  categoriesEl.innerHTML = CATEGORIES.map((category) => {
    if (category.unlocked) {
      return `
        <button type="button" class="card open" data-id="${category.id}">
          <p class="card-name">${escapeHtml(category.name)}</p>
          <p class="card-meta">${escapeHtml(category.program)}</p>
        </button>
      `;
    }
    return `
      <div class="card locked" aria-disabled="true">
        <p class="card-name">${escapeHtml(category.name)}</p>
        <p class="card-meta">Próximamente</p>
      </div>
    `;
  }).join("");
}

function showGreeting(name) {
  currentName = name;
  hello.innerHTML = `Hola, <span>${escapeHtml(name)}</span>`;
  phrase.textContent = pickPhrase();
  welcome.hidden = true;
  greeting.hidden = false;
  auren.hidden = false;
  practice.hidden = true;
  aurenLede.textContent = `${name}, esta prueba abre Autocrecimiento. El resto llega pronto.`;
  replay(greeting);
  replay(auren);
  greeting.scrollIntoView({ behavior: "smooth", block: "start" });
}

function openPractice(category) {
  activeCategory = category;
  phraseIndex = 0;
  practiceKicker.textContent = category.name;
  practiceTitle.textContent = category.program;
  auren.hidden = true;
  practice.hidden = false;
  renderAffirmation();
  replay(practice);
}

function renderAffirmation() {
  const total = activeCategory.phrases.length;
  const current = activeCategory.phrases[phraseIndex];
  const finished = phraseIndex >= total;

  if (finished) {
    practiceProgress.textContent = "Completado";
    affirmation.textContent = `${currentName}, ya afirmaste tu vida maravillosa.`;
    prevPhrase.disabled = false;
    nextPhrase.textContent = "Repetir";
    return;
  }

  practiceProgress.textContent = `${phraseIndex + 1} / ${total}`;
  affirmation.textContent = current;
  prevPhrase.disabled = phraseIndex === 0;
  nextPhrase.textContent = phraseIndex === total - 1 ? "Cerrar" : "Siguiente";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = nameInput.value.trim();
  if (!name) return;
  showGreeting(name);
});

again.addEventListener("click", () => {
  if (!currentName) return;
  phrase.textContent = pickPhrase();
  replay(greeting);
});

reset.addEventListener("click", () => {
  currentName = "";
  activeCategory = null;
  greeting.hidden = true;
  auren.hidden = true;
  practice.hidden = true;
  welcome.hidden = false;
  nameInput.focus();
  nameInput.select();
});

categoriesEl.addEventListener("click", (event) => {
  const card = event.target.closest(".card.open");
  if (!card) return;
  const category = CATEGORIES.find((item) => item.id === card.dataset.id);
  if (category?.unlocked) openPractice(category);
});

prevPhrase.addEventListener("click", () => {
  if (!activeCategory) return;
  phraseIndex = Math.max(0, Math.min(phraseIndex, activeCategory.phrases.length) - 1);
  renderAffirmation();
});

nextPhrase.addEventListener("click", () => {
  if (!activeCategory) return;
  if (phraseIndex >= activeCategory.phrases.length) {
    phraseIndex = 0;
    renderAffirmation();
    return;
  }
  phraseIndex += 1;
  renderAffirmation();
});

backAuren.addEventListener("click", () => {
  practice.hidden = true;
  auren.hidden = false;
  replay(auren);
});

renderCategories();

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
