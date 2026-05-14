// ── NAVBAR ──
const navbar = document.getElementById('navbar');
if (navbar) {
  // Inner pages start scrolled; homepage starts transparent
  if (!document.getElementById('hero')) navbar.classList.add('scrolled');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// ── HAMBURGER ──
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
if (hamburger && navLinks) {
  function openMenu() {
    navLinks.style.top = navbar.offsetHeight + 'px';
    navLinks.classList.add('open');
  }
  function closeMenu() {
    navLinks.classList.remove('open');
    navLinks.querySelectorAll('.has-dropdown').forEach(d => d.classList.remove('mob-open'));
  }

  hamburger.addEventListener('click', () => {
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Mobile accordion: toggle submenus on parent click
  navLinks.querySelectorAll('.has-dropdown>a').forEach(a => {
    a.addEventListener('click', e => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const li = a.parentElement;
        const wasOpen = li.classList.contains('mob-open');
        navLinks.querySelectorAll('.has-dropdown').forEach(d => d.classList.remove('mob-open'));
        if (!wasOpen) li.classList.add('mob-open');
      }
    });
  });

  // Close menu when a leaf link is clicked
  navLinks.querySelectorAll('.dropdown a').forEach(a =>
    a.addEventListener('click', () => closeMenu())
  );
  // Close menu when non-dropdown links clicked
  navLinks.querySelectorAll('li:not(.has-dropdown)>a').forEach(a =>
    a.addEventListener('click', () => closeMenu())
  );
}

// ── SMOOTH SCROLL (same-page anchors only) ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// ── ACTIVE NAV LINK (highlight current page) ──
const page = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href && href.split('#')[0] === page) a.classList.add('active');
});

// ── NETLIFY FORM SUBMISSION ──
function netlifySubmit(form, successFn) {
  fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(new FormData(form)).toString()
  }).then(function() {
    form.reset();
    successFn();
  }).catch(function() {
    form.reset();
    successFn();
  });
}

// ── CONTACT FORM ──
function handleForm(e) {
  e.preventDefault();
  const note = document.getElementById('formNote');
  note.textContent = 'Sending…';
  netlifySubmit(e.target, function() {
    note.textContent = '✓ Message sent! We\'ll be in touch soon.';
    setTimeout(function() { note.textContent = ''; }, 4000);
  });
}

// ── FADE-IN on scroll ──
const fadeTargets = document.querySelectorAll(
  '.svc-card,.svc-time-card,.ev,.sm-card,.gp,.testi-card,.give-opt,.stat-item,.pillar,.value-card,.team-card,.give-big-card,.ev-card-big,.gm-item'
);
const io = new IntersectionObserver((entries) => {
  entries.forEach(el => {
    if (el.isIntersecting) {
      el.target.style.opacity = '1';
      el.target.style.transform = 'translateY(0)';
      io.unobserve(el.target);
    }
  });
}, { threshold: 0.07, rootMargin: '0px 0px -24px 0px' });

fadeTargets.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = `opacity 0.45s ease ${(i % 5) * 0.08}s, transform 0.45s ease ${(i % 5) * 0.08}s`;
  io.observe(el);
});
