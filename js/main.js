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
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => navLinks.classList.remove('open'))
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

// ── CONTACT FORM ──
function handleForm(e) {
  e.preventDefault();
  const note = document.getElementById('formNote');
  note.textContent = 'Sending…';
  setTimeout(() => {
    note.textContent = '✓ Message sent! We\'ll be in touch soon.';
    e.target.reset();
    setTimeout(() => note.textContent = '', 4000);
  }, 1200);
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
