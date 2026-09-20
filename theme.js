(function () {
  'use strict';

  var root = document.documentElement;
  var header = document.querySelector('.site-header');
  var themeToggle = document.querySelector('.theme-toggle');
  var menuToggle = document.querySelector('.menu-toggle');
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  /* ---- theme toggle (dark default, persisted in localStorage) ---- */

  function currentTheme() {
    return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
    if (themeMeta) themeMeta.setAttribute('content', theme === 'dark' ? '#1c1a18' : '#f3f2f2');
    try { localStorage.setItem('theme', theme); } catch (e) { /* storage unavailable */ }
  }

  themeToggle.setAttribute('aria-pressed', String(currentTheme() === 'dark'));
  if (themeMeta) themeMeta.setAttribute('content', currentTheme() === 'dark' ? '#1c1a18' : '#f3f2f2');
  themeToggle.addEventListener('click', function () {
    applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
  });

  /* ---- mobile menu ---- */

  function setMenu(open) {
    header.classList.toggle('menu-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
  }

  menuToggle.addEventListener('click', function () {
    setMenu(!header.classList.contains('menu-open'));
  });

  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  navLinks.forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && header.classList.contains('menu-open')) {
      setMenu(false);
      menuToggle.focus();
    }
  });

  /* ---- active section in the nav ---- */

  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  function setActive(id) {
    navLinks.forEach(function (a) {
      if (id && a.getAttribute('href') === '#' + id) {
        a.setAttribute('aria-current', 'location');
      } else {
        a.removeAttribute('aria-current');
      }
    });
  }

  var ticking = false;
  function updateActive() {
    var offset = header.offsetHeight + 24;
    var y = window.scrollY + offset;
    var current = null;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop <= y) current = sections[i].id;
    }
    // At the very bottom, always highlight the last section.
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      current = sections[sections.length - 1].id;
    }
    setActive(current);
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateActive);
    }
  }, { passive: true });
  window.addEventListener('resize', updateActive);
  updateActive();
})();
