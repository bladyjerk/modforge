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
        alert('Заявка успешно отправлена! Мы свяжемся с вами.');
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

      if (contactsSuccess) {
        contactsSuccess.hidden = false;
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
