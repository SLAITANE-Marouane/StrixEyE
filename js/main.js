(() => {
  'use strict';

  const headerInner = document.getElementById('headerInner');
  const header = document.querySelector('header');
  const menuToggle = document.getElementById('menuToggle');
  const navItems = ['home', 'about', 'services', 'technology', 'field-ops', 'specs', 'contact'];

  const updateHeaderHeight = () => {
    if (!headerInner) return;
    const h = headerInner.getBoundingClientRect().height + 20;
    document.documentElement.style.setProperty('--header-height', h + 'px');
  };
  updateHeaderHeight();
  window.addEventListener('resize', updateHeaderHeight, { passive: true });

  window.addEventListener('scroll', () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  let mobileOpen = false;
  let mobileNav = null;

  const closeMobileNav = () => {
    if (!mobileNav) return;
    mobileNav.remove();
    mobileNav = null;
    mobileOpen = false;
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
    }
  };

  const openMobileNav = () => {
    if (mobileNav) return;
    mobileNav = document.createElement('nav');
    mobileNav.id = 'mobileNav';
    mobileNav.setAttribute('aria-label', 'Mobile navigation');
    const rect = headerInner.getBoundingClientRect();
    mobileNav.style.top = (rect.bottom + 8) + 'px';

    navItems.forEach(id => {
      const a = document.createElement('a');
      a.href = '#' + id;
      a.textContent = id === 'field-ops' ? 'Engineering' : id.charAt(0).toUpperCase() + id.slice(1);
      a.addEventListener('click', closeMobileNav);
      mobileNav.appendChild(a);
    });

    document.body.appendChild(mobileNav);
    mobileOpen = true;
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'true');
      menuToggle.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i>';
    }
  };

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      mobileOpen ? closeMobileNav() : openMobileNav();
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileOpen) closeMobileNav();
  });

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const hOffset = (headerInner?.getBoundingClientRect().height ?? 70) + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - hOffset;
      window.scrollTo({ top, behavior: 'smooth' });
      if (mobileOpen) closeMobileNav();
    });
  });

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.fade-in').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.fade-in').forEach(el => el.classList.add('in'));
  }

  const heroVideo = document.querySelector('.hero-media video');
  if (heroVideo) {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const smallScreen = window.matchMedia('(max-width: 640px)').matches;
    if (reduced || smallScreen) {
      heroVideo.pause();
      heroVideo.removeAttribute('autoplay');
    }
  }
})();
