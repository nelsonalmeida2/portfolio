// ===== A11y & UX helpers =====
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===== Theme Toggle (dark default, user override persisted) =====
const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

const savedTheme = localStorage.getItem('theme');

function applyTheme(value) {
  if (value === 'light') {
    root.setAttribute('data-theme', 'light');
    themeToggle?.setAttribute('aria-pressed', 'true');
  } else {
    root.setAttribute('data-theme', 'dark');
    themeToggle?.setAttribute('aria-pressed', 'false');
  }
}
applyTheme(savedTheme || 'dark');

themeToggle?.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', current);
  applyTheme(current);
});

// ===== Smooth scrolling =====
function smoothScrollTo(target) {
  const el = document.querySelector(target);
  if (!el) return;
  el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
}

document.addEventListener('click', (e) => {
  const link = e.target.closest('a[data-scroll]');
  if (!link) return;
  const href = link.getAttribute('href');
  if (href && href.startsWith('#')) {
    e.preventDefault();
    history.pushState(null, '', href);
    smoothScrollTo(href);
    // After a short delay, recompute active to ensure sync during smooth scroll
    setTimeout(computeActive, 200);
  }
});

// ===== Active link (scrollspy) =====
const sectionIds = ['#hero','#about','#projects','#skills','#technologies','#contact'];
const sections = sectionIds.map((s) => document.querySelector(s)).filter(Boolean);
const navLinks = [...document.querySelectorAll('.nav-link, .bottom-link')];

function setActive(hash) {
  navLinks.forEach((a) => a.setAttribute('aria-current', a.getAttribute('href') === hash ? 'true' : 'false'));
}

function computeActive() {
  const viewportMid = window.scrollY + window.innerHeight / 2;
  let best = null;
  let bestDist = Infinity;
  for (const sec of sections) {
    const rect = sec.getBoundingClientRect();
    const top = window.scrollY + rect.top;
    const bottom = top + rect.height;
    const center = (top + bottom) / 2;
    const dist = Math.abs(center - viewportMid);
    if (dist < bestDist) { bestDist = dist; best = sec; }
  }
  if (best?.id) setActive('#' + best.id);
}

// Initial and event-driven updates
computeActive();
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => { computeActive(); ticking = false; });
    ticking = true;
  }
});
window.addEventListener('resize', computeActive);
window.addEventListener('hashchange', () => setActive(location.hash));

// ===== Year in footer =====
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Build project cards from projetos.js =====
const projectsGrid = document.getElementById('projects-grid');

function createProjectCard(p) {
  const article = document.createElement('article');
  article.className = 'card';

  const media = document.createElement('div');
  media.className = 'card__media';
  const img = document.createElement('img');
  img.loading = 'lazy';
  img.decoding = 'async';
  img.alt = p.title ?? 'Project';
  img.src = p.image ?? 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 800 400%22%3E%3Crect width=%22800%22 height=%22400%22 fill=%22%23D7D7D9%22/%3E%3Ctext x=%22400%22 y=%22210%22 font-family=%22system-ui%22 font-size=%2240%22 text-anchor=%22middle%22 fill=%22%23333%22%3ENo image%3C/text%3E%3C/svg%3E';
  img.sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
  img.addEventListener('error', () => {
    img.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 800 400%22%3E%3Crect width=%22800%22 height=%22400%22 fill=%22%23D7D7D9%22/%3E%3Ctext x=%22400%22 y=%22210%22 font-family=%22system-ui%22 font-size=%2240%22 text-anchor=%22middle%22 fill=%22%23333%22%3EImage not found%3C/text%3E%3C/svg%3E';
  });
  media.appendChild(img);

  const body = document.createElement('div');
  body.className = 'card__body';

  const h3 = document.createElement('h3');
  h3.className = 'card__title';
  h3.textContent = p.title ?? 'Untitled project';

  const desc = document.createElement('p');
  desc.className = 'card__desc';
  desc.textContent = p.description ?? '';

  const actions = document.createElement('div');
  actions.className = 'card__actions';

  const codeBtn = document.createElement('a');
  codeBtn.href = p.github || '#';
  codeBtn.className = 'btn btn-ghost tap-target';
  if (!p.github) {
    codeBtn.setAttribute('aria-disabled', 'true');
    codeBtn.setAttribute('tabindex', '-1');
  } else {
    codeBtn.target = '_blank';
    codeBtn.rel = 'noopener noreferrer';
  }
  codeBtn.textContent = 'View Code';

  actions.appendChild(codeBtn);

  body.append(h3, desc, actions);
  article.append(media, body);
  return article;
}

if (projectsGrid && typeof projetos !== 'undefined' && Array.isArray(projetos)) {
  projetos.forEach((p) => projectsGrid.appendChild(createProjectCard(p)));
}

// ===== Technologies (logos) =====
const techGrid = document.getElementById('tech-grid');
const technologyImages = ['CSharp.svg','C.svg','CSS3.svg','Django.svg','HTML5.svg','Java.svg','JavaScript.svg','Kotlin.svg','Microsoft-SQL-Server.svg','Python.svg','Selenium.svg','Tailwind-CSS.svg'];

technologyImages.forEach((name) => {
  const img = document.createElement('img');
  img.loading = 'lazy';
  img.decoding = 'async';
  img.width = 72; img.height = 72;
  img.alt = name.replace('.svg','');
  img.src = `img/technologies/${name}`;
  techGrid?.appendChild(img);
});
