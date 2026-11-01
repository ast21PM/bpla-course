/* Учебное пособие «Внутреннее устройство БПЛА» — общие скрипты */

(function () {
  'use strict';

  /* --- Мобильное меню --- */
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav__toggle');
  if (nav && toggle) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', nav.classList.contains('is-open'));
    });
  }

  /* --- Полоса прогресса чтения (только на страницах уроков) --- */
  var article = document.querySelector('.lesson-body');
  if (article) {
    var bar = document.createElement('div');
    bar.className = 'progress-bar';
    document.body.appendChild(bar);

    var updateBar = function () {
      var top = article.offsetTop;
      var height = article.offsetHeight - window.innerHeight;
      var scrolled = window.scrollY - top;
      var pct = height > 0 ? (scrolled / height) * 100 : 0;
      bar.style.width = Math.min(100, Math.max(0, pct)) + '%';
    };
    window.addEventListener('scroll', updateBar, { passive: true });
    window.addEventListener('resize', updateBar);
    updateBar();
  }

  /* --- Подсветка активного пункта оглавления --- */
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll('.toc a[href^="#"]'));
  if (tocLinks.length) {
    var sections = tocLinks
      .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
      .filter(Boolean);

    if ('IntersectionObserver' in window) {
      var visible = new Set();
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { visible.add(e.target.id); }
          else { visible.delete(e.target.id); }
        });
        var firstVisible = sections.filter(function (s) { return visible.has(s.id); })[0];
        if (firstVisible) {
          tocLinks.forEach(function (a) {
            a.classList.toggle('is-active', a.getAttribute('href') === '#' + firstVisible.id);
          });
        }
      }, { rootMargin: '-90px 0px -65% 0px' });

      sections.forEach(function (s) { observer.observe(s); });
    }
  }
})();
