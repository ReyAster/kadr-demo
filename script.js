(function () {
  'use strict';

  /* Адрес видео-приветствия (YouTube или VK, ссылка на встраивание).
     Пример: 'https://www.youtube.com/embed/XXXXXXXXXXX'
     Пока пусто: по клику на Play ничего не происходит. */
  var VIDEO_URL = '';

  // ---------- бургер-меню ----------
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('nav');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  }
  burger.addEventListener('click', function () {
    setMenu(burger.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      setMenu(false);
      burger.focus();
    }
  });
  window.matchMedia('(min-width: 860px)').addEventListener('change', function (e) {
    if (e.matches) setMenu(false);
  });

  // ---------- появление блоков ----------
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // ---------- видео-приветствие ----------
  var play = document.getElementById('play');
  var video = document.getElementById('video');
  play.addEventListener('click', function () {
    if (!VIDEO_URL) return;
    var sep = VIDEO_URL.indexOf('?') === -1 ? '?' : '&';
    var frame = document.createElement('iframe');
    frame.src = VIDEO_URL + sep + 'autoplay=1';
    frame.title = 'Видео-приветствие Марка Северина';
    frame.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
    frame.allowFullscreen = true;
    video.innerHTML = '';
    video.appendChild(frame);
  });

  // ---------- выбор тарифа из карточек ----------
  document.querySelectorAll('[data-plan]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var radio = document.querySelector('input[name="plan"][value="' + btn.dataset.plan + '"]');
      if (radio) radio.checked = true;
      document.getElementById('apply').scrollIntoView();
      document.getElementById('name').focus({ preventScroll: true });
    });
  });

  // ---------- форма ----------
  var form = document.getElementById('form');
  var nameEl = document.getElementById('name');
  var contactEl = document.getElementById('contact');

  function setError(input, message) {
    var out = document.getElementById(input.id + '-err');
    out.textContent = message;
    if (message) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
  }

  function checkName() {
    var v = nameEl.value.trim();
    if (!v) { setError(nameEl, 'Укажите, как к вам обращаться.'); return false; }
    if (v.length < 2) { setError(nameEl, 'Имя слишком короткое.'); return false; }
    setError(nameEl, '');
    return true;
  }

  function checkContact() {
    var v = contactEl.value.trim();
    if (!v) { setError(contactEl, 'Оставьте Telegram или телефон, чтобы Марк мог вам написать.'); return false; }
    var isTelegram = /^@?[A-Za-z][A-Za-z0-9_]{4,31}$/.test(v);
    var digits = v.replace(/\D/g, '');
    var isPhone = /^[+\d\s()\-]+$/.test(v) && digits.length >= 10 && digits.length <= 15;
    if (!isTelegram && !isPhone) {
      setError(contactEl, 'Не похоже на Telegram или телефон. Пример: @ник или +7 900 000-00-00.');
      return false;
    }
    setError(contactEl, '');
    return true;
  }

  nameEl.addEventListener('input', function () { if (nameEl.hasAttribute('aria-invalid')) checkName(); });
  contactEl.addEventListener('input', function () { if (contactEl.hasAttribute('aria-invalid')) checkContact(); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var okName = checkName();
    var okContact = checkContact();
    if (!okName) { nameEl.focus(); return; }
    if (!okContact) { contactEl.focus(); return; }
    // Демо: данные никуда не отправляются.
    var card = document.getElementById('card');
    var done = document.getElementById('done');
    card.classList.add('sent');
    done.focus();
  });
})();
