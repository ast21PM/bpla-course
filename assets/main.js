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

  /* --- Оглавление: на узких экранах свёрнуто --- */
  var tocBox = document.querySelector('.toc__box');
  if (tocBox) {
    var collapseToc = function () {
      // на десктопе всегда раскрыто, на мобильном — по умолчанию закрыто
      if (window.matchMedia('(max-width: 1000px)').matches) {
        if (!tocBox.dataset.touched) { tocBox.open = false; }
      } else {
        tocBox.open = true;
      }
    };
    // запоминаем, что пользователь сам трогал оглавление
    tocBox.addEventListener('toggle', function () {
      if (window.matchMedia('(max-width: 1000px)').matches) {
        tocBox.dataset.touched = '1';
      }
    });
    // при переходе по ссылке оглавления на мобильном — сворачиваем обратно
    tocBox.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' && window.matchMedia('(max-width: 1000px)').matches) {
        tocBox.open = false;
      }
    });
    collapseToc();
    window.addEventListener('resize', collapseToc);
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

  /* --- Высота шапки в CSS-переменную (для прилипающих блоков) --- */
  var header = document.querySelector('.site-header');
  if (header) {
    var setHeaderHeight = function () {
      document.documentElement.style.setProperty(
        '--header-h', Math.round(header.getBoundingClientRect().height) + 'px'
      );
    };
    setHeaderHeight();
    window.addEventListener('resize', setHeaderHeight);
  }

  /* --- Поиск по странице терминов --- */
  var glossInput = document.getElementById('gloss-q');
  if (glossInput) {
    var items = Array.prototype.slice.call(document.querySelectorAll('.gloss__item'));
    var groups = Array.prototype.slice.call(document.querySelectorAll('.gloss-group'));
    var index = document.querySelector('.gloss-index');
    var counter = document.getElementById('gloss-count');
    var empty = document.querySelector('.gloss-empty');
    var total = items.length;

    var plural = function (n) {
      var d10 = n % 10, d100 = n % 100;
      if (d10 === 1 && d100 !== 11) { return 'термин'; }
      if (d10 >= 2 && d10 <= 4 && (d100 < 12 || d100 > 14)) { return 'термина'; }
      return 'терминов';
    };

    var filter = function () {
      var q = glossInput.value.trim().toLowerCase().replace(/ё/g, 'е');
      var shown = 0;

      items.forEach(function (item) {
        var hit = !q || item.dataset.s.indexOf(q) !== -1;
        item.hidden = !hit;
        if (hit) { shown++; }
      });

      // группа скрывается, если в ней ничего не осталось
      groups.forEach(function (g) {
        var any = Array.prototype.some.call(
          g.querySelectorAll('.gloss__item'),
          function (i) { return !i.hidden; }
        );
        g.hidden = !any;
      });

      if (index) { index.hidden = !!q; }
      if (empty) { empty.hidden = shown !== 0; }
      if (counter) {
        counter.textContent = q
          ? 'Найдено ' + shown + ' ' + plural(shown) + ' из ' + total
          : 'Показано ' + total + ' из ' + total;
      }
    };

    glossInput.addEventListener('input', filter);
    glossInput.addEventListener('search', filter);
    // Esc очищает поле
    glossInput.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && glossInput.value) {
        glossInput.value = '';
        filter();
      }
    });
    filter();
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
