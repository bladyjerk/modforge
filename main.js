document.addEventListener('DOMContentLoaded', () => {
  // 1. Модальное окно заказа услуги
  const orderDialog = document.getElementById('order-dialog');
  const openDialogButtons = document.querySelectorAll('.open-dialog-btn');
  const closeDialogBtn = document.getElementById('close-dialog-btn');
  const dialogServiceInput = document.getElementById('dialog-service');
  const dialogForm = document.getElementById('order-dialog-form');

  if (orderDialog) {
    openDialogButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const title = btn.dataset.title || '';
        if (dialogServiceInput) dialogServiceInput.value = title;
        orderDialog.showModal();
      });
    });

    if (closeDialogBtn) {
      closeDialogBtn.addEventListener('click', () => orderDialog.close());
    }

    if (dialogForm) {
      dialogForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const order = window.ModForgeOrders && window.ModForgeOrders.add({
          title: (dialogServiceInput && dialogServiceInput.value) || 'Индивидуальный мод',
          name: (document.getElementById('dlg-name') || {}).value,
          email: (document.getElementById('dlg-email') || {}).value,
          comment: (document.getElementById('dlg-comment') || {}).value
        });
        alert('Заявка успешно отправлена! Мы свяжемся с вами.' + (order ? '\nНомер заказа: ' + order.id + ' — следите за готовностью в личном кабинете.' : ''));
        dialogForm.reset();
        orderDialog.close();
      });
    }
  }

  // 2. Модальное окно просмотра проекта (в портфолио)
  const projectDialog = document.getElementById('project-dialog');
  const openProjButtons = document.querySelectorAll('.open-project-modal');
  const closeProjBtn = document.getElementById('close-project-btn');
  const projTitle = document.getElementById('proj-dialog-title');
  const projGame = document.getElementById('proj-dialog-game');
  const projDesc = document.getElementById('proj-dialog-desc');

  if (projectDialog) {
    openProjButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        projTitle.textContent = btn.dataset.title;
        projGame.textContent = btn.dataset.game;
        projDesc.textContent = btn.dataset.desc;
        projectDialog.showModal();
      });
    });

    if (closeProjBtn) {
      closeProjBtn.addEventListener('click', () => projectDialog.close());
    }
  }

  // 3. Валидация главной формы контактов
  const mainOrderForm = document.getElementById('main-order-form');
  const contactsSuccess = document.getElementById('contacts-success');

  if (mainOrderForm) {
    mainOrderForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!mainOrderForm.checkValidity()) {
        mainOrderForm.reportValidity();
        return;
      }

      const modType = document.getElementById('mod-type');
      const game = document.getElementById('game-select');
      const order = window.ModForgeOrders && window.ModForgeOrders.add({
        title: modType && modType.selectedIndex > 0 ? modType.options[modType.selectedIndex].text : 'Индивидуальный мод',
        game: game && game.selectedIndex > 0 ? game.options[game.selectedIndex].text : '',
        name: (document.getElementById('user-name') || {}).value,
        email: (document.getElementById('user-email') || {}).value
      });

      if (contactsSuccess) {
        contactsSuccess.hidden = false;
        if (order) {
          contactsSuccess.innerHTML = '✓ Спасибо! Ваша заявка <strong>' + order.id + '</strong> принята. Следите за готовностью мода в <a href="cabinet.html">личном кабинете</a>.';
        }
      }
      mainOrderForm.reset();
    });
  }

  // 4. Кнопка «Наверх»
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 5. Фильтрация карточек на странице catalog.html
  const filterForm = document.getElementById('catalog-filter-form');
  if (filterForm) {
    const radios = filterForm.querySelectorAll('input[name="cat-filter"]');
    const cards = document.querySelectorAll('.catalog-layout__content .card');

    radios.forEach(radio => {
      radio.addEventListener('change', () => {
        const val = radio.value;
        cards.forEach(card => {
          if (val === 'all' || card.dataset.category === val) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
});

// Данные для окна "Подробнее"
const servicesData = {
  lighting: {
    title: 'Ремастер освещения и ENB/Reshade',
    category: 'Графика и визуальные эффекты',
    image: 'images/lighting-remaster.jpg',
    price: 'от 8 000 ₽',
    time: 'Срок: 3–5 дней',
    fullDesc: 'Комплексная модернизация визуального ряда вашей игры. Мы разрабатываем индивидуальные профили ENBSeries, ReShade и Community Shaders с учетом баланса графики и частоты кадров.',
    includes: [
      'Глубокая настройка эффектов: Bloom, Ambient Occlusion, Depth of Field',
      'Индивидуальная калибровка цветовой гаммы под нужную атмосферу',
      'Оптимизация объемного освещения без просадок FPS',
      'Полная поддержка популярных погодных модификаций'
    ],
    platforms: ['Skyrim SE / AE', 'Fallout 4', 'Cyberpunk 2077', 'The Witcher 3'],
    orderTitle: 'Ремастер освещения'
  },
  weapons: {
    title: 'Сет кастомного оружия и брони',
    category: 'Предметы и экипировка',
    image: 'images/weapon-set.jpg',
    price: 'от 15 000 ₽',
    time: 'Срок: 7–10 дней',
    fullDesc: 'Создание уникального комплекта экипировки с нуля по вашим концепт-артам или референсам. Полная интеграция в мир игры с поддержкой физики и крафта.',
    includes: [
      'High-poly моделирование и чистая оптимизированная Low-poly сетка',
      'Детализированные 4K PBR текстуры (Base Color, Normal, Roughness, Metalness)',
      'Риггинг под стандартные и кастомные игровые скелеты',
      'Интеграция в уровневые списки и рецепты крафта в кузнице'
    ],
    platforms: ['Skyrim SE / AE', 'Fallout 4', 'Bannerlord', 'Cyberpunk 2077'],
    orderTitle: 'Сет оружия и брони'
  },
  perks: {
    title: 'Комплексный ребаланс перков',
    category: 'Геймплей и механики',
    image: 'images/combat-system.jpg',
    price: 'от 18 000 ₽',
    time: 'Срок: 10–14 дней',
    fullDesc: 'Полный пересмотр ролевой составляющей игры. Превращаем устаревшие ветки прокачки в гибкие, вариативные деревья с новыми интересными синергиями.',
    includes: [
      'Переработка 18+ веток навыков с оригинальными эффектами',
      'Чистый скриптинг без лагов стека движка',
      'Математический расчет баланса прогрессии и урона'
    ],
    platforms: ['Skyrim SE / AE', 'Fallout 4', 'Fallout: New Vegas'],
    orderTitle: 'Ребаланс перков'
  },
  fixes: {
    title: 'Исправление CTD и багов движка',
    category: 'Оптимизация и фиксы',
    image: 'images/clean-code.jpg',
    price: 'от 5 000 ₽',
    time: 'Срок: 1–3 дня',
    fullDesc: 'Профессиональная диагностика и устранение вылетов на рабочий стол (CTD), бесконечных экранов загрузки и критических конфликтов между модами.',
    includes: [
      'Детальный разбор крэш-логов и трассировка ошибок',
      'Поиск и исправление поврежденных мешей и текстур',
      'Чистка сохранений от повисших скриптовых экземпляров',
      'Создание персонального патча совместимости'
    ],
    platforms: ['Любые игры на движках Creation Engine / Gamebryo / X-Ray'],
    orderTitle: 'Исправление ошибок'
  },
  ui: {
    title: 'Ретекстур интерфейса и UI',
    category: 'Графика и интерфейс',
    image: 'images/interface-retexture.jpg',
    price: 'от 9 000 ₽',
    time: 'Срок: 4–6 дней',
    fullDesc: 'Современный минималистичный HUD, меню инвентаря и диалогов. Идеальная четкость и адаптация под широкоформатные мониторы.',
    includes: [
      'Векторная перерисовка иконок, статусных баров и компаса',
      'Адаптация под мониторы 21:9 Ultrawide и 32:9',
      'Подбор стильных читаемых игровых шрифтов'
    ],
    platforms: ['Skyrim SE / AE', 'Fallout 4', 'The Witcher 3'],
    orderTitle: 'Ретекстур интерфейса'
  },
  quest: {
    title: 'Разработка сюжетного квеста',
    category: 'Сюжет и квесты',
    image: 'images/story-quest.jpg',
    price: 'от 35 000 ₽',
    time: 'Срок: от 25 дней',
    fullDesc: 'Полноценное сюжетное дополнение: оригинальный сценарий, диалоговая система с развилками, новые локации и озвученные персонажи.',
    includes: [
      'Сценарий и ветвящееся диалоговое дерево',
      'Декорирование локаций и подземелий',
      'Полная настройка квестовых стадий и триггеров'
    ],
    platforms: ['Skyrim SE / AE', 'Fallout 4', 'Fallout: New Vegas'],
    orderTitle: 'Сюжетный квест'
  }
};

// Логика открытия окна подробностей
const detailsDialog = document.getElementById('service-details-dialog');
const openDetailsButtons = document.querySelectorAll('.open-details-btn');
const closeDetailsBtn = document.getElementById('close-details-btn');
const cancelDetailsBtn = document.getElementById('cancel-details-btn');
const detailsOrderBtn = document.getElementById('details-order-btn');

if (detailsDialog) {
  let currentServiceOrderTitle = '';

  openDetailsButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.service;
      const data = servicesData[key];
      if (!data) return;

      currentServiceOrderTitle = data.orderTitle;
      document.getElementById('details-img').src = data.image;
      document.getElementById('details-img').alt = data.title;
      document.getElementById('details-category').textContent = data.category;
      document.getElementById('details-title').textContent = data.title;
      document.getElementById('details-full-desc').textContent = data.fullDesc;
      document.getElementById('details-price').textContent = data.price;
      document.getElementById('details-time').textContent = data.time;

      const incList = document.getElementById('details-includes');
      incList.innerHTML = data.includes.map(item => `<li>${item}</li>`).join('');

      const platList = document.getElementById('details-platforms');
      platList.innerHTML = data.platforms.map(p => `<span class="details-modal__tag">${p}</span>`).join('');

      detailsDialog.showModal();
    });
  });

  const closeDetails = () => detailsDialog.close();
  if (closeDetailsBtn) closeDetailsBtn.addEventListener('click', closeDetails);
  if (cancelDetailsBtn) cancelDetailsBtn.addEventListener('click', closeDetails);

  if (detailsOrderBtn) {
    detailsOrderBtn.addEventListener('click', () => {
      detailsDialog.close();
      const orderDialog = document.getElementById('order-dialog');
      const dialogServiceInput = document.getElementById('dialog-service');
      if (orderDialog) {
        if (dialogServiceInput) dialogServiceInput.value = currentServiceOrderTitle;
        orderDialog.showModal();
      }
    });
  }
}


/* =====================================================
   ФИШКА 1. Переключение тёмной / светлой темы
   ===================================================== */
(function () {
  const root = document.documentElement;
  const KEY = 'mf-theme';

  function updateButtons() {
    const isLight = root.dataset.theme === 'light';
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) icon.className = isLight ? 'bi bi-moon-stars' : 'bi bi-sun';
      btn.setAttribute('aria-pressed', String(isLight));
      btn.title = isLight ? 'Включить тёмную тему' : 'Включить светлую тему';
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateButtons();
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const next = root.dataset.theme === 'light' ? 'dark' : 'light';
        if (next === 'light') root.dataset.theme = 'light';
        else delete root.dataset.theme;
        try { localStorage.setItem(KEY, next); } catch (e) {}
        updateButtons();
      });
    });
  });
})();


/* =====================================================
   ФИШКА 2. Градиент на карточке, следующий за курсором
   ===================================================== */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.card, .portfolio-card, .feature-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
      card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
    });
  });
});


/* =====================================================
   ФИШКА 3. Плавное появление карточек при прокрутке
   ===================================================== */
(function () {
  if (!('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('js-reveal');

  document.addEventListener('DOMContentLoaded', () => {
    const selector = '.card, .portfolio-card, .feature-card, .step-card, .review-card, .stat-card, .game-badge, .game-tag, .faq-item, .cta-banner, .cabinet-stat, .order-card, .calc__box';
    const items = document.querySelectorAll(selector);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('reveal--in');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach(el => {
      // Задержка «лесенкой» для соседних карточек
      const siblings = Array.from(el.parentElement.children).filter(c => c.matches(selector));
      const index = siblings.indexOf(el);
      el.style.setProperty('--reveal-delay', (index % 4) * 110 + 'ms');
      el.classList.add('reveal');
      observer.observe(el);
    });

    window.ModForgeReveal = (el) => {
      el.classList.add('reveal');
      observer.observe(el);
    };
  });
})();


/* =====================================================
   ФИШКА 4. Личный кабинет: хранение заказов и готовность
   (демо-версия: данные хранятся в localStorage браузера)
   ===================================================== */
window.ModForgeOrders = (function () {
  const USER_KEY = 'mf-user';
  const ORDERS_KEY = 'mf-orders';
  const DAY = 24 * 60 * 60 * 1000;

  const STAGES = [
    { at: 0,   label: 'Заявка принята', icon: 'bi-inbox' },
    { at: 8,   label: 'ТЗ и анализ',    icon: 'bi-clipboard-check' },
    { at: 25,  label: 'Прототип',       icon: 'bi-bezier2' },
    { at: 45,  label: 'Разработка',     icon: 'bi-code-slash' },
    { at: 80,  label: 'Тестирование',   icon: 'bi-bug' },
    { at: 100, label: 'Готово',         icon: 'bi-check2' }
  ];

  // Срок работ (в днях) по ключевым словам названия услуги
  const DURATIONS = [
    [/квест/i, 25], [/перк|геймпле|скрипт|механик|боев/i, 12], [/оруж|брон|предмет|модел|компаньон/i, 8],
    [/интерфейс|ui/i, 5], [/освещ|графи|текстур|enb/i, 4], [/исправ|фикс|ошиб|вылет|патч/i, 2]
  ];

  function read(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch (e) { return fallback; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  function getUser() { return read(USER_KEY, null); }
  function setUser(user) { write(USER_KEY, user); }
  function logout() { try { localStorage.removeItem(USER_KEY); } catch (e) {} }
  function getOrders() { return read(ORDERS_KEY, []); }

  function nextId() {
    const orders = getOrders();
    const max = orders.reduce((m, o) => Math.max(m, parseInt(o.id.replace(/\D/g, ''), 10) || 0), 1040);
    return 'MF-' + (max + 1);
  }

  function durationFor(title) {
    const found = DURATIONS.find(([re]) => re.test(title || ''));
    return found ? found[1] : 7;
  }

  function add(data) {
    const orders = getOrders();
    const order = {
      id: nextId(),
      title: data.title || 'Индивидуальный мод',
      game: data.game || '',
      created: Date.now(),
      days: data.days || durationFor(data.title),
      comment: data.comment || ''
    };
    orders.unshift(order);
    write(ORDERS_KEY, orders);
    if (!getUser() && data.email) setUser({ name: data.name || 'Клиент', email: data.email });
    return order;
  }

  function seedDemo() {
    if (getOrders().length) return;
    const now = Date.now();
    write(ORDERS_KEY, [
      { id: 'MF-1043', title: 'Ремастер освещения и ENB', game: 'Skyrim SE / AE', created: now - 1.6 * DAY, days: 4 },
      { id: 'MF-1042', title: 'Сет кастомного оружия и брони', game: 'Fallout 4', created: now - 5.4 * DAY, days: 8 },
      { id: 'MF-1041', title: 'Исправление CTD и багов движка', game: 'The Witcher 3', created: now - 6 * DAY, days: 2 }
    ]);
  }

  function progressOf(order) {
    const p = ((Date.now() - order.created) / (order.days * DAY)) * 100;
    return Math.max(2, Math.min(100, Math.round(p)));
  }

  function stageIndex(progress) {
    let idx = 0;
    STAGES.forEach((s, i) => { if (progress >= s.at) idx = i; });
    return idx;
  }

  return { getUser, setUser, logout, getOrders, add, seedDemo, progressOf, stageIndex, STAGES, DAY };
})();

document.addEventListener('DOMContentLoaded', () => {
  const loginBox = document.getElementById('cabinet-login');
  const panel = document.getElementById('cabinet-panel');
  if (!loginBox || !panel) return;

  const api = window.ModForgeOrders;
  const list = document.getElementById('orders-list');
  const fmtDate = (ts) => new Date(ts).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  const escapeHtml = (str) => String(str).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  function renderOrders(animate) {
    const orders = api.getOrders();
    let done = 0;

    if (!orders.length) {
      list.innerHTML = '<div class="cabinet-empty"><p>У вас пока нет заказов.</p><a class="button button--primary" href="catalog.html" style="margin-top:12px">Перейти в каталог</a></div>';
    } else {
      list.innerHTML = orders.map(order => {
        const progress = api.progressOf(order);
        const stage = api.stageIndex(progress);
        const isDone = progress >= 100;
        if (isDone) done++;
        const due = order.created + order.days * api.DAY;

        const stages = api.STAGES.map((s, i) => {
          const cls = i < stage || isDone ? 'stages__item--done' : (i === stage ? 'stages__item--current' : '');
          const icon = i < stage || isDone ? 'bi-check-lg' : s.icon;
          return `<li class="stages__item ${cls}"><span class="stages__dot"><i class="bi ${icon}" aria-hidden="true"></i></span>${s.label}</li>`;
        }).join('');

        return `
          <article class="order-card ${isDone ? 'order-card--done' : ''}">
            <div class="order-card__top">
              <div>
                <span class="order-card__id">Заказ ${escapeHtml(order.id)}</span>
                <h3 class="order-card__title">${escapeHtml(order.title)}</h3>
                <div class="order-card__meta">${order.game ? escapeHtml(order.game) + ' · ' : ''}создан ${fmtDate(order.created)} · ${isDone ? 'сдан' : 'сдача'} ${fmtDate(due)}</div>
              </div>
              <span class="order-status ${isDone ? 'order-status--done' : ''}">
                <i class="bi ${isDone ? 'bi-check-circle-fill' : 'bi-hourglass-split'}" aria-hidden="true"></i>
                ${isDone ? 'Готов' : api.STAGES[stage].label}
              </span>
            </div>
            <div class="progress">
              <div class="progress__row"><span>Готовность мода</span><span class="progress__value">${progress}%</span></div>
              <div class="progress__track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}" aria-label="Готовность заказа ${escapeHtml(order.id)}">
                <div class="progress__bar" data-width="${progress}"></div>
              </div>
            </div>
            <ol class="stages">${stages}</ol>
            <div class="order-card__actions">
              ${isDone
                ? `<button class="button button--primary download-btn" type="button" data-id="${escapeHtml(order.id)}"><i class="bi bi-download" aria-hidden="true"></i> Скачать архив мода</button>`
                : `<button class="button button--secondary" type="button" disabled title="Станет доступно после завершения"><i class="bi bi-lock" aria-hidden="true"></i> Архив будет доступен после сдачи</button>`}
              <a class="button button--secondary" href="https://t.me/modforge_studio" target="_blank" rel="noopener"><i class="bi bi-chat-dots" aria-hidden="true"></i> Написать моддеру</a>
            </div>
          </article>`;
      }).join('');
    }

    document.getElementById('stat-total').textContent = orders.length;
    document.getElementById('stat-done').textContent = done;
    document.getElementById('stat-work').textContent = orders.length - done;

    // Анимируем заполнение полос прогресса
    requestAnimationFrame(() => requestAnimationFrame(() => {
      list.querySelectorAll('.progress__bar').forEach(bar => { bar.style.width = bar.dataset.width + '%'; });
    }));

    if (animate && window.ModForgeReveal) list.querySelectorAll('.order-card').forEach(window.ModForgeReveal);

    list.querySelectorAll('.download-btn').forEach(btn => {
      btn.addEventListener('click', () => alert('Архив заказа ' + btn.dataset.id + ' будет отправлен вам на почту (демо-версия).'));
    });
  }

  function show() {
    const user = api.getUser();
    loginBox.hidden = !!user;
    panel.hidden = !user;
    if (!user) return;
    document.getElementById('cab-user-name').textContent = user.name;
    document.getElementById('cab-user-email').textContent = user.email;
    document.getElementById('cab-avatar').textContent = (user.name || '?').trim().charAt(0).toUpperCase();
    renderOrders(true);
  }

  document.getElementById('cabinet-login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    api.setUser({
      name: document.getElementById('cab-name').value.trim(),
      email: document.getElementById('cab-email').value.trim()
    });
    api.seedDemo();
    show();
  });

  document.getElementById('cab-logout').addEventListener('click', () => {
    api.logout();
    show();
  });

  show();
  // Обновляем готовность раз в минуту
  setInterval(() => { if (api.getUser()) renderOrders(false); }, 60000);
});


/* =====================================================
   ФИШКА 5. Калькулятор стоимости мода
   ===================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('calc-form');
  if (!form) return;

  const BASE = {
    lighting: { title: 'Ремастер освещения',   price: 8000,  days: 4 },
    weapons:  { title: 'Сет оружия и брони',   price: 15000, days: 8 },
    perks:    { title: 'Ребаланс перков',      price: 18000, days: 12 },
    fixes:    { title: 'Исправление ошибок',   price: 5000,  days: 2 },
    ui:       { title: 'Ретекстур интерфейса', price: 9000,  days: 5 },
    quest:    { title: 'Сюжетный квест',       price: 35000, days: 25 }
  };
  const GAME_K = { skyrim: 1, fallout: 1.1, witcher: 1.2, cyberpunk: 1.3, other: 1.4 };
  const EXTRAS = { voice: { price: 6000, days: 3 }, textures: { price: 4000, days: 2 }, support: { price: 3000, days: 0 } };

  const typeSel = document.getElementById('calc-type');
  const gameSel = document.getElementById('calc-game');
  const priceEl = document.getElementById('calc-price');
  const timeEl = document.getElementById('calc-time');
  let current = { price: 0, days: 0 };

  const plural = (n) => (n % 10 === 1 && n % 100 !== 11) ? 'день' : ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100) ? 'дня' : 'дней');

  function animateNumber(from, to) {
    const start = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - start) / 400);
      const value = Math.round((from + (to - from) * k) / 100) * 100;
      priceEl.textContent = value.toLocaleString('ru-RU') + ' ₽';
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function calc() {
    const base = BASE[typeSel.value];
    let price = base.price * GAME_K[gameSel.value];
    let days = base.days;
    const checked = Array.from(form.querySelectorAll('input[name="extra"]:checked')).map(i => i.value);
    checked.forEach(key => {
      if (EXTRAS[key]) { price += EXTRAS[key].price; days += EXTRAS[key].days; }
    });
    if (checked.includes('urgent')) {
      price *= 1.4;
      days = Math.max(1, Math.ceil(days * 0.6));
    }
    price = Math.round(price / 100) * 100;
    animateNumber(current.price, price);
    timeEl.textContent = 'Срок: ~' + days + ' ' + plural(days);
    current = { price, days, title: base.title, checked };
  }

  form.addEventListener('change', calc);
  calc();

  document.getElementById('calc-order-btn').addEventListener('click', () => {
    const orderDialog = document.getElementById('order-dialog');
    if (!orderDialog) return;
    const names = { voice: 'озвучка', textures: '4K-текстуры', support: 'поддержка 6 мес.', urgent: 'срочно' };
    document.getElementById('dialog-service').value = current.title;
    const comment = document.getElementById('dlg-comment');
    if (comment) {
      comment.value = 'Расчёт калькулятора: ' + current.title + ', ' + gameSel.options[gameSel.selectedIndex].text +
        (current.checked.length ? ' (' + current.checked.map(k => names[k]).join(', ') + ')' : '') +
        ' — ' + current.price.toLocaleString('ru-RU') + ' ₽, ~' + current.days + ' ' + plural(current.days) + '.';
    }
    orderDialog.showModal();
  });
});
