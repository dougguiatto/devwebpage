/* =============================================
   DEV4LAB — JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- HEADER SCROLL ---------- */
  const header = document.querySelector('.header');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- MOBILE MENU ---------- */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ---------- SMOOTH SCROLL ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------- SCROLL ANIMATIONS ---------- */
  const fadeEls = document.querySelectorAll('.fade-up');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  fadeEls.forEach(el => observer.observe(el));

  /* ---------- ACTIVE NAV LINK ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav a[href^="#"], .mobile-menu a[href^="#"]');

  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => navObserver.observe(s));

  /* ---------- CONTACT FORM ---------- */
  const form = document.getElementById('contactForm');
  const formSuccess = document.querySelector('.form-success');
  const submitBtn = document.getElementById('submitBtn');

  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();

      const nome = form.nome.value.trim();
      const email = form.email.value.trim();
      const empresa = form.empresa.value.trim();
      const mensagem = form.mensagem.value.trim();

      if (!nome || !email || !mensagem) {
        showFormError('Por favor, preencha os campos obrigatórios.');
        return;
      }
      if (!isValidEmail(email)) {
        showFormError('Por favor, insira um e-mail válido.');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando…';

      // Simulate API call — replace with your backend/EmailJS/Formspree endpoint
      await fakeSubmit();

      form.style.display = 'none';
      formSuccess.style.display = 'block';
    });
  }

  function fakeSubmit() {
    return new Promise(resolve => setTimeout(resolve, 1200));
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFormError(msg) {
    let err = form.querySelector('.form-error-msg');
    if (!err) {
      err = document.createElement('p');
      err.className = 'form-error-msg';
      err.setAttribute('role', 'alert');          // announced immediately by screen readers
      err.setAttribute('aria-live', 'assertive'); // interrupts current reading
      err.style.cssText = 'color:#c0392b;font-size:13px;margin-top:-12px;margin-bottom:16px;font-weight:500;';
      submitBtn.insertAdjacentElement('beforebegin', err);
    }
    err.textContent = msg;
    submitBtn.disabled = false;
    submitBtn.textContent = 'Enviar mensagem';
    // focus first invalid field
    const first = form.querySelector(':invalid');
    if (first) first.focus();
    setTimeout(() => err?.remove(), 5000);
  }

  /* ---------- COUNTER ANIMATION ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';

      if (prefersReducedMotion) {
        el.textContent = target + suffix;
        counterObserver.unobserve(el);
        return;
      }

      const duration = 1600;
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        current = Math.round(increment * step);
        if (step >= steps) { current = target; clearInterval(timer); }
        el.textContent = current + suffix;
      }, duration / steps);

      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

});
