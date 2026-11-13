/* =====================================================================
   ModForge Studio — дополнительные фишки (тема, анимации, курсор,
   поиск по сайту, чат). Подключается на всех страницах после main.js.
   ===================================================================== */
(function () {
  'use strict';

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  /* -------------------------------------------------------------------
     1. Светлая / тёмная тема с круговой анимацией
     ------------------------------------------------------------------- */
  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('mf-theme', theme); } catch (e) {}
    document.querySelectorAll('.theme-toggle').forEach((b) => {
      b.setAttribute('aria-label', theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему');
      b.setAttribute('title', theme === 'dark' ? 'Светлая тема' : 'Тёмная тема');
    });
  }

  function toggleTheme(e) {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';

    // Без поддержки View Transitions — просто плавно перекрашиваем
    if (!document.startViewTransition || reduceMotion) {
      root.classList.add('theme-fade');
      setTheme(next);
      setTimeout(() => root.classList.remove('theme-fade'), 550);
      return;
    }

    const btn = e.currentTarget.getBoundingClientRect();
    const x = btn.left + btn.width / 2;
    const y = btn.top + btn.height / 2;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    const transition = document.startViewTransition(() => setTheme(next));
    transition.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 650, easing: 'cubic-bezier(.4,0,.2,1)', pseudoElement: '::view-transition-new(root)' }
      );
    });
  }

  setTheme(root.getAttribute('data-theme') || 'dark');
  document.querySelectorAll('.theme-toggle').forEach((b) => b.addEventListener('click', toggleTheme));

  /* -------------------------------------------------------------------
     2. Анимации
     ------------------------------------------------------------------- */

  // 2.1 Полоса прогресса прокрутки
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  document.body.appendChild(progress);
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  };
  addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // 2.2 Плавное появление карточек при прокрутке (с «лесенкой» задержек)
  const revealSelector = [
    '.card', '.portfolio-card', '.feature-card', '.step-card', '.review-card',
    '.stat-card', '.game-badge', '.faq-item', '.section__title', '.cta-banner',
    '.contacts-list__item', '.contacts-map', '.contacts-layout__form-box', '.catalog-filters'
  ].join(',');
  const revealEls = document.querySelectorAll(revealSelector);

  if ('IntersectionObserver' in window && !reduceMotion) {
    revealEls.forEach((el) => {
      const siblings = Array.from(el.parentElement.children).filter((c) => c.matches(revealSelector));
      el.style.setProperty('--reveal-delay', `${Math.min(siblings.indexOf(el), 6) * 0.09}s`);
      el.classList.add('reveal');
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
          // после появления убираем задержку, чтобы hover срабатывал мгновенно
          setTimeout(() => entry.target.style.removeProperty('--reveal-delay'), 1200);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  }

  // 2.3 Градиент за курсором + 3D-наклон карточек
  document.querySelectorAll('.card, .portfolio-card, .feature-card, .review-card, .step-card').forEach((card) => {
    card.classList.add('glow-card');
    const tilt = finePointer && !reduceMotion && (card.matches('.card, .portfolio-card'));
    if (tilt) card.classList.add('tilt-card');

    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = e.clientX - r.left;
      const py = e.clientY - r.top;
      card.style.setProperty('--mx', `${px}px`);
      card.style.setProperty('--my', `${py}px`);
      if (tilt) {
        const rx = ((py / r.height) - 0.5) * -8;
        const ry = ((px / r.width) - 0.5) * 8;
        card.classList.add('is-tilting');
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
      }
    });
    card.addEventListener('pointerleave', () => {
      if (tilt) {
        card.classList.remove('is-tilting');
        card.style.transform = '';
      }
    });
  });

  // 2.4 «Волна» при нажатии на кнопки
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.button');
    if (!btn || reduceMotion) return;
    const r = btn.getBoundingClientRect();
    const size = Math.max(r.width, r.height);
    const wave = document.createElement('span');
    wave.className = 'ripple';
    wave.style.width = wave.style.height = `${size}px`;
    wave.style.left = `${e.clientX - r.left - size / 2}px`;
    wave.style.top = `${e.clientY - r.top - size / 2}px`;
    btn.appendChild(wave);
    setTimeout(() => wave.remove(), 650);
  });

  // 2.5 Счётчики в блоке статистики
  const counters = document.querySelectorAll('.stat-card__number');
  if (counters.length && 'IntersectionObserver' in window && !reduceMotion) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        cio.unobserve(entry.target);
        const el = entry.target;
        const original = el.textContent.trim();
        const m = original.match(/^([\d.]+)(.*)$/);
        if (!m) return;
        const target = parseFloat(m[1]);
        const decimals = (m[1].split('.')[1] || '').length;
        const suffix = m[2];
        const start = performance.now();
        const dur = 1600;
        const tick = (now) => {
          const t = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = (target * eased).toFixed(decimals) + suffix;
          if (t < 1) requestAnimationFrame(tick); else el.textContent = original;
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    counters.forEach((c) => cio.observe(c));
  }

  // 2.6 Искры в главном баннере
  const hero = document.querySelector('.hero');
  if (hero && !reduceMotion) {
    const sparks = document.createElement('div');
    sparks.className = 'hero-sparks';
    sparks.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 22; i++) {
      const s = document.createElement('span');
      s.style.left = `${Math.random() * 100}%`;
      s.style.animationDuration = `${6 + Math.random() * 8}s`;
      s.style.animationDelay = `${-Math.random() * 12}s`;
      const size = 2 + Math.random() * 3;
      s.style.width = s.style.height = `${size}px`;
      sparks.appendChild(s);
    }
    hero.prepend(sparks);
  }

  /* -------------------------------------------------------------------
     3. Курсор «кузня»: точка + прицел, искры при клике
     ------------------------------------------------------------------- */
  if (finePointer && !reduceMotion) {
    root.classList.add('has-cursor');
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    ring.innerHTML = '<div class="cursor-ring__inner"></div>';
    document.body.append(dot, ring);

    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    const interactive = 'a, button, summary, label, select, [role="button"], .card, .portfolio-card, input[type="radio"], input[type="checkbox"]';
    const textual = 'input:not([type="radio"]):not([type="checkbox"]):not([type="submit"]), textarea';

    addEventListener('pointermove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
      root.classList.add('cursor-visible');
      const t = e.target;
      root.classList.toggle('cursor-text', !!(t.closest && t.closest(textual)));
      root.classList.toggle('cursor-hover', !!(t.closest && t.closest(interactive)));
    }, { passive: true });
    document.addEventListener('pointerleave', () => root.classList.remove('cursor-visible'));
    addEventListener('blur', () => root.classList.remove('cursor-visible'));
    addEventListener('pointerdown', () => root.classList.add('cursor-down'));
    addEventListener('pointerup', () => root.classList.remove('cursor-down'));

    (function loop() {
      rx += (mx - rx) * 0.2;
      ry += (my - ry) * 0.2;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(loop);
    })();

    // Искры как от наковальни
    addEventListener('click', (e) => {
      for (let i = 0; i < 10; i++) {
        const s = document.createElement('div');
        s.className = 'cursor-spark';
        s.style.left = `${e.clientX - 2}px`;
        s.style.top = `${e.clientY - 2}px`;
        document.body.appendChild(s);
        const angle = Math.random() * Math.PI * 2;
        const dist = 20 + Math.random() * 40;
        s.animate([
          { transform: 'translate(0,0) scale(1)', opacity: 1 },
          { transform: `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist + 18}px) scale(0)`, opacity: 0 }
        ], { duration: 500 + Math.random() * 300, easing: 'cubic-bezier(.2,.7,.4,1)' }).onfinish = () => s.remove();
      }
    });
  }

  /* -------------------------------------------------------------------
     4. Поиск по сайту (Ctrl + K или «/»)
     ------------------------------------------------------------------- */
  const searchIndex = [
    // Страницы
    { g: 'Страницы', icon: 'house', t: 'Главная', d: 'Студия модификаций, этапы работы, популярные услуги, отзывы', u: 'index.html', k: 'главная студия старт' },
    { g: 'Страницы', icon: 'grid', t: 'Каталог услуг', d: 'Все услуги с ценами, сроками и фильтрами', u: 'catalog.html', k: 'каталог услуги цены прайс' },
    { g: 'Страницы', icon: 'people', t: 'О нас', d: 'Студия, преимущества, игры и выполненные проекты', u: 'about.html', k: 'о нас команда студия портфолио' },
    { g: 'Страницы', icon: 'telephone', t: 'Контакты', d: 'Телефон, адрес, карта, форма заявки и FAQ', u: 'contacts.html', k: 'контакты телефон адрес почта' },
    // Услуги
    { g: 'Услуги', icon: 'brightness-high', t: 'Ремастер освещения и ENB/Reshade', d: 'от 8 000 ₽ · 3–5 дней', u: 'catalog.html#svc-lighting', k: 'графика освещение шейдеры enb reshade свет' },
    { g: 'Услуги', icon: 'shield-shaded', t: 'Сет кастомного оружия и брони', d: 'от 15 000 ₽ · 7–10 дней', u: 'catalog.html#svc-weapons', k: 'оружие броня меч 3d модели предметы экипировка' },
    { g: 'Услуги', icon: 'diagram-3', t: 'Комплексный ребаланс перков', d: 'от 18 000 ₽ · 10–14 дней', u: 'catalog.html#svc-perks', k: 'перки навыки баланс геймплей классы прокачка' },
    { g: 'Услуги', icon: 'bug', t: 'Исправление CTD и багов движка', d: 'от 5 000 ₽ · 1–3 дня', u: 'catalog.html#svc-fixes', k: 'баги вылеты ctd ошибки фикс исправление оптимизация' },
    { g: 'Услуги', icon: 'window', t: 'Ретекстур интерфейса и UI', d: 'от 9 000 ₽ · 4–6 дней', u: 'catalog.html#svc-ui', k: 'интерфейс ui hud меню текстуры ultrawide' },
    { g: 'Услуги', icon: 'book', t: 'Разработка сюжетного квеста', d: 'от 35 000 ₽ · от 25 дней', u: 'catalog.html#svc-quest', k: 'квест сюжет диалоги озвучка локации' },
    // Разделы
    { g: 'Разделы', icon: 'list-ol', t: 'Как строится процесс разработки', d: 'ТЗ, прототип, разработка, тест и релиз', u: 'index.html#process', k: 'процесс этапы тз прототип релиз' },
    { g: 'Разделы', icon: 'star', t: 'Популярные услуги', d: 'Самые востребованные моды', u: 'index.html#popular-services', k: 'популярные хиты' },
    { g: 'Разделы', icon: 'controller', t: 'Поддерживаемые игры', d: 'Skyrim, Fallout 4, Cyberpunk 2077, The Witcher 3 и другие', u: 'index.html#games', k: 'игры skyrim скайрим fallout фоллаут cyberpunk киберпанк witcher ведьмак bannerlord' },
    { g: 'Разделы', icon: 'chat-quote', t: 'Отзывы заказчиков', d: 'Что говорят наши клиенты', u: 'index.html#reviews', k: 'отзывы клиенты мнения' },
    { g: 'Разделы', icon: 'award', t: 'Почему выбирают ModForge', d: 'Наши преимущества', u: 'about.html#advantages', k: 'преимущества почему качество' },
    { g: 'Разделы', icon: 'calculator', t: 'Заявка на разработку', d: 'Форма заказа мода', u: 'contacts.html#order', k: 'заказать заявка форма купить оформить' },
    { g: 'Разделы', icon: 'geo-alt', t: 'Мы на карте', d: 'г. Москва, пр. Вернадского, д. 78', u: 'contacts.html#map', k: 'карта адрес москва вернадского где' },
    // FAQ
    { g: 'Вопросы', icon: 'question-circle', t: 'Сколько времени занимает создание мода?', d: 'Ответ в разделе FAQ', u: 'contacts.html#faq', k: 'сроки время долго faq' },
    { g: 'Вопросы', icon: 'question-circle', t: 'Будет ли мод работать с другими плагинами?', d: 'Ответ в разделе FAQ', u: 'contacts.html#faq', k: 'совместимость плагины конфликты faq' },
    { g: 'Вопросы', icon: 'question-circle', t: 'Поможете ли вы с установкой?', d: 'Ответ в разделе FAQ', u: 'contacts.html#faq', k: 'установка помощь поддержка faq' }
  ];

  const norm = (s) => s.toLowerCase().replace(/ё/g, 'е');
  const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const highlight = (text, q) => {
    if (!q) return escapeHtml(text);
    const i = norm(text).indexOf(q);
    if (i < 0) return escapeHtml(text);
    return escapeHtml(text.slice(0, i)) + '<mark>' + escapeHtml(text.slice(i, i + q.length)) + '</mark>' + escapeHtml(text.slice(i + q.length));
  };

  const searchDialog = document.createElement('dialog');
  searchDialog.className = 'search-dialog';
  searchDialog.setAttribute('aria-label', 'Поиск по сайту');
  searchDialog.innerHTML = `
    <div class="search-box">
      <i class="bi bi-search" aria-hidden="true"></i>
      <input class="search-box__input" type="text" placeholder="Поиск: услуги, игры, цены, контакты…" autocomplete="off" aria-label="Что ищем?">
      <button class="search-box__esc" type="button">Esc</button>
    </div>
    <ul class="search-results" role="listbox"></ul>
    <div class="search-footer"><span><kbd>↑</kbd> <kbd>↓</kbd> выбор</span><span><kbd>Enter</kbd> открыть</span><span><kbd>Ctrl</kbd> + <kbd>K</kbd> поиск</span></div>`;
  document.body.appendChild(searchDialog);
  const sInput = searchDialog.querySelector('.search-box__input');
  const sList = searchDialog.querySelector('.search-results');
  let sActive = 0;

  function renderSearch() {
    const q = norm(sInput.value.trim());
    const words = q.split(/\s+/).filter(Boolean);
    const found = searchIndex
      .map((item) => {
        const hay = norm(`${item.t} ${item.d} ${item.k}`);
        if (!words.every((w) => hay.includes(w))) return null;
        let score = 0;
        words.forEach((w) => { if (norm(item.t).includes(w)) score += 3; if (norm(item.k).includes(w)) score += 1; });
        return { item, score };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.item);
    const list = q ? found : searchIndex.filter((i) => i.g !== 'Вопросы').slice(0, 8);

    if (!list.length) {
      sList.innerHTML = `<li class="search-empty">Ничего не нашлось по запросу «${escapeHtml(sInput.value)}».<br>Попробуйте «skyrim», «оружие» или «цены» — или спросите в чате.</li>`;
      return;
    }
    let html = '';
    let lastGroup = '';
    list.forEach((item, i) => {
      if (item.g !== lastGroup) { html += `<li class="search-results__group">${item.g}</li>`; lastGroup = item.g; }
      html += `<li class="search-result${i === sActive ? ' is-active' : ''}" role="option" data-i="${i}">
        <a href="${item.u}"><i class="bi bi-${item.icon}" aria-hidden="true"></i>
        <span><span class="search-result__title">${highlight(item.t, words[0])}</span><span class="search-result__text">${highlight(item.d, words[0])}</span></span></a></li>`;
    });
    sList.innerHTML = html;
  }

  function moveActive(step) {
    const items = sList.querySelectorAll('.search-result');
    if (!items.length) return;
    sActive = (sActive + step + items.length) % items.length;
    items.forEach((el, i) => el.classList.toggle('is-active', i === sActive));
    items[sActive].scrollIntoView({ block: 'nearest' });
  }

  function openSearch() {
    if (searchDialog.open) return;
    sActive = 0;
    sInput.value = '';
    renderSearch();
    searchDialog.showModal();
    setTimeout(() => sInput.focus(), 30);
  }

  sInput.addEventListener('input', () => { sActive = 0; renderSearch(); });
  sInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); moveActive(1); }
    if (e.key === 'ArrowUp') { e.preventDefault(); moveActive(-1); }
    if (e.key === 'Enter') {
      const a = sList.querySelector('.search-result.is-active a');
      if (a) { e.preventDefault(); a.click(); }
    }
  });
  sList.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (a) searchDialog.close();
  });
  searchDialog.querySelector('.search-box__esc').addEventListener('click', () => searchDialog.close());
  searchDialog.addEventListener('click', (e) => { if (e.target === searchDialog) searchDialog.close(); });

  document.querySelectorAll('.search-btn').forEach((b) => b.addEventListener('click', openSearch));
  document.addEventListener('keydown', (e) => {
    const typing = e.target.closest && e.target.closest('input, textarea, select, [contenteditable]');
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(); }
    else if ((e.key === '/' || e.code === 'Slash') && !typing && !e.ctrlKey && !e.metaKey) { e.preventDefault(); openSearch(); }
  });

  // Переход к нужной услуге / разделу по ссылке из поиска
  function focusHashTarget() {
    const hash = decodeURIComponent(location.hash.slice(1));
    if (!hash) return;
    if (hash.startsWith('svc-')) {
      const key = hash.slice(4);
      const btn = document.querySelector(`.open-details-btn[data-service="${key}"]`);
      const card = btn && btn.closest('.card');
      if (card) {
        const all = document.querySelector('#catalog-filter-form input[value="all"]');
        if (all && !all.checked) { all.checked = true; all.dispatchEvent(new Event('change')); }
        card.classList.add('is-visible');
        card.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        card.classList.remove('search-highlight');
        void card.offsetWidth;
        card.classList.add('search-highlight');
        setTimeout(() => btn.click(), 900);
      }
      return;
    }
    const el = document.getElementById(hash);
    if (el) {
      el.querySelectorAll('.reveal').forEach((r) => r.classList.add('is-visible'));
      el.classList.add('is-visible');
      el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      if (el.tagName === 'DETAILS') el.open = true;
    }
  }
  addEventListener('hashchange', focusHashTarget);
  setTimeout(focusHashTarget, 150);

  /* -------------------------------------------------------------------
     5. Виджет чата с помощником
     ------------------------------------------------------------------- */
  const wrap = document.createElement('div');
  wrap.className = 'chat-widget';
  wrap.innerHTML = `
    <div class="chat-teaser" hidden>Привет! Подскажу цену и сроки вашего мода — спрашивайте</div>
    <section class="chat-panel" role="dialog" aria-label="Чат с ModForge" aria-hidden="true">
      <header class="chat-head">
        <div class="chat-head__avatar"><img src="images/logo.svg" alt=""></div>
        <div>
          <div class="chat-head__name">ModForge · Помощник</div>
          <div class="chat-head__status">Онлайн · отвечаем за пару минут</div>
        </div>
        <button class="chat-head__close" type="button" aria-label="Свернуть чат"><i class="bi bi-dash-lg"></i></button>
      </header>
      <div class="chat-body" aria-live="polite"></div>
      <div class="chat-quick"></div>
      <form class="chat-form">
        <input class="chat-form__input" type="text" placeholder="Напишите сообщение…" aria-label="Сообщение" maxlength="500">
        <button class="chat-form__send" type="submit" aria-label="Отправить"><i class="bi bi-send-fill"></i></button>
      </form>
    </section>
    <button class="chat-fab" type="button" aria-label="Открыть чат">
      <i class="bi bi-chat-dots-fill" aria-hidden="true"></i>
      <i class="bi bi-x-lg" aria-hidden="true"></i>
      <span class="chat-fab__badge" hidden>1</span>
    </button>`;
  document.body.appendChild(wrap);

  const fab = wrap.querySelector('.chat-fab');
  const panel = wrap.querySelector('.chat-panel');
  const body = wrap.querySelector('.chat-body');
  const quick = wrap.querySelector('.chat-quick');
  const form = wrap.querySelector('.chat-form');
  const input = wrap.querySelector('.chat-form__input');
  const badge = wrap.querySelector('.chat-fab__badge');
  const teaser = wrap.querySelector('.chat-teaser');

  const QUICK = ['Цены', 'Сроки', 'Какие игры?', 'Как заказать?', 'Позвать менеджера'];
  const answers = [
    { k: ['привет', 'здравств', 'добрый', 'хай', 'hello', 'hi'], a: 'Привет! Я помощник ModForge Studio. Расскажите, для какой игры нужен мод — подскажу цену и сроки.' },
    { k: ['цен', 'стоим', 'сколько стоит', 'прайс', 'руб', '₽', 'бюджет', 'дорого'], a: 'Ориентировочные цены:\n• Исправление вылетов — от 5 000 ₽\n• Освещение ENB/ReShade — от 8 000 ₽\n• Интерфейс и UI — от 9 000 ₽\n• Оружие и броня — от 15 000 ₽\n• Ребаланс перков — от 18 000 ₽\n• Сюжетный квест — от 35 000 ₽\nПодробнее — в <a href="catalog.html">каталоге услуг</a>.' },
    { k: ['срок', 'долго', 'когда', 'быстро', 'время', 'дней'], a: 'Простые фиксы делаем за 1–3 дня, графику — за 3–6 дней, новые предметы — 7–10 дней, крупные квесты — от 25 дней. Есть срочное выполнение.' },
    { k: ['игр', 'skyrim', 'скайрим', 'fallout', 'фоллаут', 'киберпанк', 'cyberpunk', 'ведьмак', 'witcher', 'bannerlord'], a: 'Работаем со Skyrim SE/AE, Fallout 4 и New Vegas, Cyberpunk 2077, The Witcher 3 и Mount & Blade II: Bannerlord. Другие игры — обсудим индивидуально.' },
    { k: ['заказ', 'оформ', 'купить', 'заявк', 'начать'], a: 'Заполните <a href="contacts.html#order">форму заявки</a> — опишите игру и идею мода. Мы ответим в течение рабочего дня и пришлём ТЗ.' },
    { k: ['менеджер', 'человек', 'оператор', 'позвон', 'телефон', 'связ', 'контакт'], a: 'Свяжитесь с менеджером напрямую:\n📞 <a href="tel:+74957885699">+7 (495) 788-56-99</a>\n✉️ <a href="mailto:dev@modforge.ru">dev@modforge.ru</a>\nTelegram: <a href="https://t.me/modforge_studio" target="_blank" rel="noopener">@modforge_studio</a>' },
    { k: ['адрес', 'где', 'офис', 'наход', 'карта'], a: 'Мы находимся в Москве: пр. Вернадского, д. 78. Схема проезда — на странице <a href="contacts.html#map">Контакты</a>.' },
    { k: ['вылет', 'ctd', 'баг', 'ошибк', 'краш', 'лаг', 'фикс'], a: 'Поможем! Пришлите crash-лог и список модов — найдём причину вылета. Исправление стоит от 5 000 ₽ и занимает 1–3 дня.' },
    { k: ['график', 'время работы', 'выходн', 'часы'], a: 'Работаем Пн–Пт с 10:00 до 19:00, в субботу с 11:00 до 16:00. Воскресенье — выходной.' },
    { k: ['спасибо', 'благодар', 'спс'], a: 'Всегда рады помочь! Если появятся вопросы — пишите.' }
  ];

  const now = () => new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  let history = [];
  try { history = JSON.parse(sessionStorage.getItem('mf-chat') || '[]'); } catch (e) { history = []; }
  const save = () => { try { sessionStorage.setItem('mf-chat', JSON.stringify(history.slice(-40))); } catch (e) {} };

  function addMsg(who, html, time, store = true) {
    const m = document.createElement('div');
    m.className = `chat-msg chat-msg--${who}`;
    m.innerHTML = `${html}<span class="chat-msg__time">${time || now()}</span>`;
    body.appendChild(m);
    body.scrollTop = body.scrollHeight;
    if (store) { history.push({ who, html, time: time || now() }); save(); }
  }

  function botReply(text) {
    const q = norm(text);
    const found = answers.find((a) => a.k.some((k) => q.includes(k)));
    const reply = found ? found.a : 'Хороший вопрос! Чтобы ответить точно, оставьте <a href="contacts.html#order">заявку</a> или напишите менеджеру в Telegram <a href="https://t.me/modforge_studio" target="_blank" rel="noopener">@modforge_studio</a>.';
    const typing = document.createElement('div');
    typing.className = 'chat-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    body.appendChild(typing);
    body.scrollTop = body.scrollHeight;
    setTimeout(() => {
      typing.remove();
      addMsg('bot', reply);
      if (!wrap.classList.contains('chat-open')) { badge.hidden = false; }
    }, 700 + Math.min(reply.length * 8, 1200));
  }

  function send(text) {
    text = text.trim();
    if (!text) return;
    addMsg('user', escapeHtml(text));
    botReply(text);
  }

  QUICK.forEach((label) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = label;
    b.addEventListener('click', () => send(label));
    quick.appendChild(b);
  });

  if (history.length) history.forEach((h) => addMsg(h.who, h.html, h.time, false));

  function openChat(open) {
    wrap.classList.toggle('chat-open', open);
    panel.setAttribute('aria-hidden', String(!open));
    fab.setAttribute('aria-label', open ? 'Закрыть чат' : 'Открыть чат');
    teaser.hidden = true;
    if (open) {
      badge.hidden = true;
      try { sessionStorage.setItem('mf-chat-seen', '1'); } catch (e) {}
      if (!history.length) {
        setTimeout(() => addMsg('bot', 'Здравствуйте! 👋 Я помощник ModForge Studio. Помогу узнать цены, сроки и оформить заказ мода. Выберите вопрос ниже или напишите свой.'), 250);
      }
      setTimeout(() => input.focus(), 300);
    }
  }

  fab.addEventListener('click', () => openChat(!wrap.classList.contains('chat-open')));
  teaser.addEventListener('click', () => openChat(true));
  wrap.querySelector('.chat-head__close').addEventListener('click', () => openChat(false));
  form.addEventListener('submit', (e) => { e.preventDefault(); send(input.value); input.value = ''; });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && wrap.classList.contains('chat-open') && !searchDialog.open) openChat(false); });

  // Через 5 секунд показываем подсказку (один раз за визит)
  let seen = false;
  try { seen = sessionStorage.getItem('mf-chat-seen') === '1'; } catch (e) {}
  if (!seen) {
    setTimeout(() => {
      if (!wrap.classList.contains('chat-open')) { teaser.hidden = false; badge.hidden = false; }
      setTimeout(() => { teaser.hidden = true; }, 7000);
    }, 5000);
  }
})();
