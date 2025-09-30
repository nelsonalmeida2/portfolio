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

// ===== Mobile drawer =====
const menuToggle = document.getElementById('menu-toggle');
const mobileDrawer = document.getElementById('mobile-drawer');

menuToggle?.addEventListener('click', () => {
  const isOpen = mobileDrawer.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

mobileDrawer?.addEventListener('click', (e) => {
  if (e.target.matches('a[href^="#"]')) {
    mobileDrawer.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }
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
  }
});

// ===== Active link (scrollspy) =====
const sections = ['#sobre', '#projetos', '#skills', '#contacto'].map((s) => document.querySelector(s)).filter(Boolean);
const navLinks = [...document.querySelectorAll('.nav-link, .bottom-link')];

function setActive(hash) {
  navLinks.forEach((a) => a.setAttribute('aria-current', a.getAttribute('href') === hash ? 'true' : 'false'));
}

const spyObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries.filter((e) => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible?.target?.id) setActive('#' + visible.target.id);
  },
  { root: null, rootMargin: '0px 0px -60% 0px', threshold: [0.25, 0.6] }
);
sections.forEach((s) => spyObserver.observe(s));

// ===== Year in footer =====
document.getElementById('year').textContent = new Date().getFullYear();

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
  img.alt = p.title;
  img.src = p.image;
  img.sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
  media.appendChild(img);

  const body = document.createElement('div');
  body.className = 'card__body';

  const h3 = document.createElement('h3');
  h3.className = 'card__title';
  h3.textContent = p.title;

  const desc = document.createElement('p');
  desc.className = 'card__desc';
  desc.textContent = p.description;

  const actions = document.createElement('div');
  actions.className = 'card__actions';

  const codeBtn = document.createElement('a');
  codeBtn.href = p.github;
  codeBtn.className = 'btn btn-ghost tap-target';
  codeBtn.target = '_blank';
  codeBtn.rel = 'noopener noreferrer';
  codeBtn.textContent = 'Ver Código';

  actions.appendChild(codeBtn);

  body.append(h3, desc, actions);
  article.append(media, body);
  return article;
}

if (typeof projetos !== 'undefined' && Array.isArray(projetos)) {
  projetos.forEach((p) => projectsGrid.appendChild(createProjectCard(p)));
}

// ===== Tecnologias (logos) =====
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
