document.getElementById('year').textContent = new Date().getFullYear();

/* ---------------------------------------------------------------
   Hamburger menu
   --------------------------------------------------------------- */
const menuToggle = document.getElementById('menu-toggle');
const mobileNav = document.getElementById('mobile-nav');

function closeMobileNav() {
  mobileNav.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open menu');
}

function openMobileNav() {
  mobileNav.hidden = false;
  menuToggle.setAttribute('aria-expanded', 'true');
  menuToggle.setAttribute('aria-label', 'Close menu');
}

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  isOpen ? closeMobileNav() : openMobileNav();
});

document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', closeMobileNav);
});

/* ---------------------------------------------------------------
   Theme toggle (dark default, light optional) with persistence
   --------------------------------------------------------------- */
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;

function applyTheme(theme) {
  if (theme === 'light') {
    root.setAttribute('data-theme', 'light');
    themeToggle.setAttribute('aria-pressed', 'true');
    themeToggle.setAttribute('aria-label', 'Switch to dark mode');
  } else {
    root.removeAttribute('data-theme');
    themeToggle.setAttribute('aria-pressed', 'false');
    themeToggle.setAttribute('aria-label', 'Switch to light mode');
  }
}

const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme) {
  applyTheme(savedTheme);
} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
  applyTheme('light');
}

themeToggle.addEventListener('click', () => {
  const isLight = root.getAttribute('data-theme') === 'light';
  const next = isLight ? 'dark' : 'light';
  applyTheme(next);
  localStorage.setItem('portfolio-theme', next);
});

/* ---------------------------------------------------------------
   Rotating role text in hero
   --------------------------------------------------------------- */
const roles = [
  'Software Developer',
  'AI Systems Builder',
  'MSc IT Student',
  'Photographer'
];
let roleIndex = 0;
const roleTextEl = document.getElementById('role-text');

if (roleTextEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  setInterval(() => {
    roleIndex = (roleIndex + 1) % roles.length;
    roleTextEl.textContent = roles[roleIndex];
  }, 2600);
}

/* ---------------------------------------------------------------
   Scroll-spy: highlight current section in nav
   --------------------------------------------------------------- */
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const mobileLinks = document.querySelectorAll('.mobile-nav-link');

function setActiveLink(id) {
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
  });
  mobileLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setActiveLink(entry.target.id);
    }
  });
}, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

sections.forEach(section => observer.observe(section));

/* ---------------------------------------------------------------
   Scroll reveal for below-the-fold content
   --------------------------------------------------------------- */
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealTargets = document.querySelectorAll(
    '.about-photo-frame, .about-copy, .project-card, .contact-form'
  );

  revealTargets.forEach((el, index) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(index % 4) * 70}ms`;
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealTargets.forEach(el => revealObserver.observe(el));
}

/* ---------------------------------------------------------------
   Contact form validation
   --------------------------------------------------------------- */
const form = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

const fields = {
  name: {
    input: document.getElementById('name'),
    error: document.getElementById('name-error'),
    validate: (value) => value.trim().length >= 2,
    message: 'Please enter your full name (at least 2 characters).'
  },
  email: {
    input: document.getElementById('email'),
    error: document.getElementById('email-error'),
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
    message: 'Please enter a valid email address.'
  },
  subject: {
    input: document.getElementById('subject'),
    error: document.getElementById('subject-error'),
    validate: (value) => value.trim().length >= 3,
    message: 'Please enter a subject (at least 3 characters).'
  },
  message: {
    input: document.getElementById('message'),
    error: document.getElementById('message-error'),
    validate: (value) => value.trim().length >= 10,
    message: 'Your message should be at least 10 characters long.'
  }
};

function validateField(field) {
  const value = field.input.value;
  const isValid = field.validate(value);

  if (isValid) {
    field.input.classList.remove('invalid');
    field.error.textContent = '';
  } else {
    field.input.classList.add('invalid');
    field.error.textContent = field.message;
  }
  return isValid;
}

Object.values(fields).forEach(field => {
  field.input.addEventListener('blur', () => validateField(field));
  field.input.addEventListener('input', () => {
    if (field.input.classList.contains('invalid')) {
      validateField(field);
    }
  });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  let allValid = true;
  Object.values(fields).forEach(field => {
    const valid = validateField(field);
    if (!valid) allValid = false;
  });

  if (!allValid) {
    formStatus.textContent = 'Please fix the errors above before sending.';
    formStatus.className = 'form-status error';
    const firstInvalid = form.querySelector('.invalid');
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  formStatus.textContent = 'Message ready to send. Thank you, KKB will reply soon.';
  formStatus.className = 'form-status success';
  form.reset();
  Object.values(fields).forEach(field => field.input.classList.remove('invalid'));
});
