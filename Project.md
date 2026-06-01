# Project Documentation

## Обзор проекта

Проект представляет собой веб-сайт TheSimsTree - платформу для контента о играх The Sims. Это статический HTML-сайт с использованием Bootstrap 5 и кастомными стилями.

## Структура проекта

```
Архив/
├── chalanges.html              # Главная страница с сеткой карточек статей
├── Chalange-page.html          # Страница отдельной статьи
├── css/
│   ├── custom.css              # Кастомные стили (минимальные)
│   ├── theme.css               # Основные стили темы (минифицированы)
│   ├── theme.min.css           # Минифицированная версия
│   └── theme.css.map           # Source map
├── js/
│   ├── theme-switcher.js       # Переключатель тем (light/dark)
│   ├── theme.js                # Основной JS темы
│   ├── theme.min.js            # Минифицированная версия
│   └── theme.js.map            # Source map
├── json/
│   ├── animation-404-dark.json # Lottie анимация для 404 (тёмная тема)
│   ├── animation-404-light.json # Lottie анимация для 404 (светлая тема)
│   ├── animation-sandwatch-dark.json # Анимация песочных часов (тёмная)
│   ├── animation-sandwatch-light.json # Анимация песочных часов (светлая)
│   └── animation-soundwave.json # Анимация звуковой волны
├── vendor/                     # Сторонние библиотеки
├── img/                        # Изображения (186 файлов)
├── icons/                      # Иконки (around-icons.min.css)
├── app-icons/                  # Иконки приложений
└── old-files/                  # Старые файлы (2323 файла)
```

## Верстка и HTML

### Основные страницы

**chalanges.html** - страница с сеткой карточек статей:
- Фиксированный navbar с логотипом и навигацией
- Breadcrumb навигация
- Сетка карточек статей (tst-grid)
- Пагинация
- Footer с социальными ссылками

**challenge-page.html** - страница отдельной статьи:
- Аналогичная структура navbar и footer
- Breadcrumb навигация
- Контент статьи

### Ключевые компоненты верстки

#### Navbar
```html
<header class="navbar navbar-expand-lg fixed-top">
  <div class="container">
    <a class="navbar-brand" href="https://thesimstree.com/">
      <img src="https://thesimstree.com/logo.svg" style="width:140px; height: auto">
    </a>
    <a href="https://app.thesimstree.com/auth" class="btn btn-outline-primary btn-sm">
      Login
    </a>
    <button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarNav">
    </button>
    <nav class="collapse navbar-collapse" id="navbarNav">
      <!-- Навигационные ссылки -->
    </nav>
  </div>
</header>
```

#### Сетка карточек (tst-grid)
- Адаптивная сетка: 1 колонка (<576px), 2 колонки (≥576px), 3 колонки (≥992px)
- Каждая карточка содержит:
  - Изображение (aspect-ratio: 5/3)
  - Автора с аватарами
  - Заголовок
  - Описание
  - Теги с dropdown для скрытых

#### Карточка статьи (tst-card)
```html
<article class="tst-card">
  <a class="tst-card-img-link" href="...">
    <img class="tst-card-img" src="..." alt="...">
  </a>
  <div class="tst-card-body">
    <div class="tst-author">
      <div class="tst-avatars">
        <img class="tst-avatar" src="...">
      </div>
      <span class="tst-author-name">Author Name</span>
    </div>
    <div>
      <h3 class="tst-card-title">
        <a href="...">Title</a>
      </h3>
      <p class="tst-card-desc">Description</p>
    </div>
    <div class="tst-tags">
      <a class="tst-tag" href="...">Tag</a>
      <!-- Дополнительные теги -->
    </div>
  </div>
</article>
```

#### Footer
- Социальные ссылки (Instagram, YouTube, X, TikTok, Pinterest, Twitch, Discord, Reddit)
- Ссылки на Confidentiality и Public offer

## Стили (CSS)

### Кастомные стили (custom.css)
```css
.tree-app {
  height: 750px;
  width: 100%;
  border: solid 1px #ddd;
  border-radius: 8px;
}

@media (max-width: 760px) {
  .tree-app {
    height: 450px;
  }
}
```

### Встроенные стили в HTML

Основные стили для сетки карточек определены внутри `<style>` тега в chalanges.html:

**Сетка (tst-grid):**
- display: grid
- Адаптивные колонки через media queries
- gap: 16px

**Карточка (tst-card):**
- border-radius: 18px
- border: 1px solid #D7DDE2
- background: #fff
- hover: box-shadow 0 8px 24px rgba(0,0,0,.09)

**Изображение карточки:**
- aspect-ratio: 5/3
- hover: transform scale(1.04)

**Теги (tst-tag):**
- border-radius: 999px
- border: 1.5px solid #D7DDE2
- padding: 7px 14px
- hover: background #f0f5f2, border-color #45bc60, color #2e8a47

**Пагинация (tst-pagination):**
- Центрированная
- Минимальная ширина 32px
- Активный элемент: font-weight 700

### Цветовая схема
- Основной текст: #1F2937
- Вторичный текст: #697488
- Акцентный цвет: #45bc60 (зелёный)
- Границы: #D7DDE2
- Фон: #fff

### Шрифты
- Основной шрифт: Inter (встроенные @font-face для всех весов 100-900)
- Поддержка кириллицы, греческого, вьетнамского, латиницы

## Скрипты (JavaScript)

### theme-switcher.js
Переключатель между светлой и тёмной темами:

```javascript
const getStoredTheme = () => localStorage.getItem('theme')
const setStoredTheme = theme => localStorage.setItem('theme', theme)

const getPreferredTheme = () => {
  const storedTheme = getStoredTheme()
  if (storedTheme) return storedTheme
  return 'light' // Default theme
}

const setTheme = theme => {
  if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-bs-theme', 'dark')
  } else {
    document.documentElement.setAttribute('data-bs-theme', theme)
  }
}
```

### Встроенный скрипт для dropdown тегов
Динамическое управление тегами в карточках:

- Создаёт глобальный dropdown в body
- Скрывает теги, которые не помещаются в контейнер
- Показывает кнопку "···" для скрытых тегов
- Позиционирует dropdown над кнопкой
- Закрывает при клике вне или скролле
- Пересчитывает при ресайзе окна

### Встроенный скрипт для ref-параметров
Реферальная система:

```javascript
const default_ref = 'tstnews';

const ref = new URLSearchParams(location.search).get('ref');
if (ref)
  localStorage.setItem('ref', ref);
else if (!localStorage.getItem('ref'))
  localStorage.setItem('ref', default_ref);

document.addEventListener('DOMContentLoaded', () => {
  const ref = localStorage.getItem('ref');
  document.querySelectorAll('.inject-ref').forEach(element => 
    element.setAttribute('href', element.getAttribute('href') + '?ref=' + ref)
  );
});
```

### Vendor библиотеки
- AOS (Animate On Scroll)
- Swiper (слайдер)
- LightGallery (галерея)
- Parallax.js
- timezz (таймер)
- img-comparison-slider

## Особенности проекта

### Реферальная система
- URL параметр ?ref= сохраняется в localStorage
- Автоматически добавляется к ссылкам с классом .inject-ref
- Default ref: 'tstnews'

### Темы
- Поддержка light/dark тем
- Переключение через data-bs-theme атрибут на html
- Сохранение выбора в localStorage
- Автоматическое определение системной темы

### Адаптивность
- Мобильная первая разработка
- Breakpoints: 576px, 768px, 992px, 1200px
- Адаптивная сетка карточек
- Мобильное меню (hamburger)

### SEO
- Open Graph теги
- Twitter Card теги
- Canonical URL
- Meta description и keywords

## Стиль кодирования

### HTML
- Использование семантических тегов (header, main, footer, article, nav)
- Bootstrap классы для layout
- Кастомные классы с префиксом tst- (tst-grid, tst-card, tst-tag и т.д.)
- Встроенные стили для специфических компонентов

### CSS
- BEM-подобный подход для кастомных классов
- Использование CSS переменных (через Bootstrap)
- Flexbox и Grid для layout
- Media queries для адаптивности
- Transition для hover эффектов

### JavaScript
- IIFE для изоляции
- localStorage для персистентности
- Event delegation
- Debounce для resize событий
- Vanilla JS без зависимостей (кроме vendor библиотек)

## Рекомендации для разработки

### При добавлении новых карточек
1. Скопировать структуру article.tst-card
2. Обновить ссылку, изображение, автора, заголовок, описание, теги
3. Скрипт dropdown автоматически обработает скрытие тегов

### При изменении стилей
1. Кастомные стили добавлять в custom.css
2. Стили компонентов карточек - во встроенный <style> в HTML
3. Использовать существующие CSS переменные Bootstrap

### При добавлении нового функционала
1. Проверить наличие соответствующей vendor библиотеки
2. Использовать существующие паттерны (IIFE, localStorage)
3. Следовать конвенции именования классов (tst- префикс)

### Темы
- Новые стили для тёмной темы добавлять через data-bs-theme="dark" селекторы
- Проверять контрастность цветов в обеих темах

## Зависимости

### CSS
- Bootstrap 5 (через theme.css)
- AOS CSS
- Swiper CSS
- LightGallery CSS
- img-comparison-slider CSS
- around-icons (иконки)

### JavaScript
- Bootstrap 5 JS
- AOS JS
- Swiper JS
- LightGallery JS
- Parallax JS
- timezz JS
- img-comparison-slider JS

## Известные проблемы

1. **old-files/** - содержит 2323 файла, возможно устаревшие или временные
2. **theme.css** и **theme.js** - минифицированы, source maps доступны
3. Встроенные стили в HTML - лучше вынести в отдельный CSS файл для поддержки

## Контакты и ссылки

- Основной домен: https://thesimstree.com
- Приложение: https://app.thesimstree.com
- Руководство: https://thesimstree-guide.notion.site/Instructions-64abad735aec486fadc2e88e107b89d5
- Социальные сети: Instagram, YouTube, X, TikTok, Pinterest, Twitch, Discord, Reddit
