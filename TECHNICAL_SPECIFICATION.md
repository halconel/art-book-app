# Техническое задание: Трансформация ArtBook App

## 📋 Общие сведения

### Название проекта
**Atom Sergal - Beyond Home Art Book**

### Описание
Трансформация социальной платформы ArtBook App в персональный арт-бук для художника Atom Sergal с проектом "Beyond Home".

### Цель проекта
Создать минималистичный, элегантный веб-сайт для демонстрации арт-проекта "Beyond Home" в стиле референса [aidelank.com](https://aidelank.com/).

## 🎯 Функциональные требования

### 1. Система пользователей

#### 1.1 Роли пользователей
- **Admin** (Atom Sergal) - полный доступ к управлению контентом
- **Guest** - только просмотр контента

#### 1.2 Аутентификация
- JWT токены с refresh механизмом
- Автоматическое обновление токенов
- Безопасный logout с инвалидацией токенов
- OAuth интеграция (опционально)

#### 1.3 Профиль администратора
- Управление проектом "Beyond Home"
- Загрузка и управление изображениями
- Редактирование описания проекта
- Статистика просмотров

### 2. Контент

#### 2.1 Проект "Beyond Home"
- Название: "Beyond Home"
- Описание: "Art project exploring the concept of home and belonging"
- Галерея изображений
- Метаданные (дата создания, техника, размеры)

#### 2.2 Изображения
- Поддержка форматов: JPG, PNG, WebP
- Автоматическая оптимизация через Cloudinary
- Responsive изображения
- Lazy loading
- Lightbox для просмотра

#### 2.3 Навигация
- Главная страница (Home)
- Проект (Project)
- Галерея (Gallery)
- О художнике (About)
- Админ панель (только для admin)

### 3. Дизайн и UX

#### 3.1 Стиль дизайна
- Минималистичный дизайн
- Фокус на визуальный контент
- Элегантная типографика
- Темная/светлая тема
- Плавные анимации

#### 3.2 Адаптивность
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

#### 3.3 Производительность
- Время загрузки < 3 секунд
- Core Web Vitals оптимизация
- SEO оптимизация

## 🛠 Технические требования

### 1. Backend (Rails 7.1)

#### 1.1 Технологии
- Ruby 3.4.4
- Rails 7.1.5
- PostgreSQL 14+
- JWT для аутентификации
- Cloudinary для изображений

#### 1.2 API Endpoints

```ruby
# Основные страницы
GET /api/project/beyond-home     # Данные проекта
GET /api/artist/atom-sergal      # Информация о художнике
GET /api/gallery                 # Галерея изображений

# Аутентификация
POST /api/auth/login             # Вход
POST /api/auth/refresh           # Обновление токена
DELETE /api/auth/logout          # Выход

# Админ функции
PUT /api/admin/project           # Обновление проекта
POST /api/admin/images           # Загрузка изображений
DELETE /api/admin/images/:id     # Удаление изображения
```

#### 1.3 Модели данных

```ruby
# User
- id: integer
- username: string (unique)
- email: string (unique)
- password_digest: string
- role: integer (enum: guest, admin)
- refresh_token: string
- avatar_url: string
- created_at: datetime
- updated_at: datetime

# Project
- id: integer
- user_id: integer (foreign key)
- title: string
- description: text
- thumbnail_url: string
- created_at: datetime
- updated_at: datetime

# Image
- id: integer
- project_id: integer (foreign key)
- img_url: string
- caption: string
- order: integer
- created_at: datetime
- updated_at: datetime
```

### 2. Frontend (React 18)

#### 2.1 Технологии
- React 18 с hooks
- Modern CSS (CSS Grid, Flexbox)
- Styled Components или Tailwind CSS
- React Router v6
- Axios для API запросов

#### 2.2 Структура компонентов

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.jsx
│   │   ├── Navigation.jsx
│   │   ├── Footer.jsx
│   │   └── Layout.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Project.jsx
│   │   ├── Gallery.jsx
│   │   ├── About.jsx
│   │   └── Admin.jsx
│   ├── admin/
│   │   ├── AdminPanel.jsx
│   │   ├── ImageUpload.jsx
│   │   ├── ProjectEdit.jsx
│   │   └── ImageManager.jsx
│   └── shared/
│       ├── ImageGallery.jsx
│       ├── Lightbox.jsx
│       ├── Modal.jsx
│       ├── Loading.jsx
│       └── Button.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useApi.js
│   └── useLocalStorage.js
├── services/
│   ├── authService.js
│   ├── apiService.js
│   └── imageService.js
├── styles/
│   ├── design-system.scss
│   ├── components.scss
│   └── pages.scss
└── utils/
    ├── constants.js
    └── helpers.js
```

#### 2.3 Дизайн система

```scss
// Цветовая палитра
$primary-color: #2c3e50;
$secondary-color: #34495e;
$accent-color: #3498db;
$text-color: #2c3e50;
$text-light: #7f8c8d;
$background-color: #ffffff;
$background-dark: #f8f9fa;
$border-color: #e9ecef;

// Типографика
$font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
$font-size-base: 16px;
$line-height-base: 1.6;

// Отступы
$spacing-xs: 0.25rem;
$spacing-sm: 0.5rem;
$spacing-md: 1rem;
$spacing-lg: 1.5rem;
$spacing-xl: 2rem;

// Breakpoints
$breakpoint-sm: 576px;
$breakpoint-md: 768px;
$breakpoint-lg: 992px;
$breakpoint-xl: 1200px;
```

### 3. Безопасность

#### 3.1 Аутентификация
- JWT токены с коротким временем жизни (24 часа)
- Refresh токены с длительным временем жизни (30 дней)
- Безопасное хранение токенов в localStorage
- Автоматическое обновление токенов

#### 3.2 Валидация
- Валидация всех входных данных
- Защита от XSS атак
- CSRF защита
- Rate limiting для API

#### 3.3 Файлы
- Валидация типов файлов
- Ограничение размера файлов
- Сканирование на вирусы (опционально)

### 4. Производительность

#### 4.1 Оптимизация изображений
- Автоматическое сжатие через Cloudinary
- Responsive изображения
- WebP формат для современных браузеров
- Lazy loading

#### 4.2 Кэширование
- Кэширование API ответов
- Кэширование статических ресурсов
- CDN для изображений

#### 4.3 Бандлинг
- Code splitting
- Tree shaking
- Минификация CSS и JS
- Gzip сжатие

## 📱 Пользовательские сценарии

### 1. Гость

#### 1.1 Просмотр главной страницы
1. Пользователь заходит на сайт
2. Видит заголовок "Atom Sergal - Beyond Home"
3. Просматривает краткое описание проекта
4. Переходит к галерее

#### 1.2 Просмотр галереи
1. Пользователь открывает галерею
2. Видит сетку изображений
3. Кликает на изображение для увеличения
4. Просматривает в lightbox режиме

#### 1.3 Информация о художнике
1. Пользователь переходит на страницу "About"
2. Читает биографию Atom Sergal
3. Просматривает контактную информацию

### 2. Администратор

#### 2.1 Вход в систему
1. Администратор вводит логин/пароль
2. Получает JWT токен
3. Перенаправляется в админ панель

#### 2.2 Управление проектом
1. Редактирует описание проекта
2. Обновляет метаданные
3. Сохраняет изменения

#### 2.3 Загрузка изображений
1. Выбирает файлы для загрузки
2. Добавляет подписи к изображениям
3. Загружает на сервер
4. Видит превью в галерее

## 🧪 Тестирование

### 1. Unit тесты
- Тестирование моделей Rails
- Тестирование React компонентов
- Тестирование сервисов

### 2. Integration тесты
- Тестирование API endpoints
- Тестирование пользовательских сценариев
- Тестирование аутентификации

### 3. E2E тесты
- Тестирование полного пользовательского пути
- Тестирование админ функций
- Тестирование адаптивности

### 4. Производительность
- Тестирование времени загрузки
- Тестирование Core Web Vitals
- Нагрузочное тестирование

## 📊 Критерии приемки

### 1. Функциональные
- ✅ Все API endpoints работают корректно
- ✅ Аутентификация работает безопасно
- ✅ Админ панель функциональна
- ✅ Галерея изображений работает
- ✅ Адаптивный дизайн на всех устройствах

### 2. Производительность
- ✅ Время загрузки < 3 секунд
- ✅ Core Web Vitals в зеленой зоне
- ✅ Изображения оптимизированы
- ✅ Кэширование работает

### 3. Безопасность
- ✅ JWT токены работают корректно
- ✅ Валидация входных данных
- ✅ Защита от основных атак
- ✅ Безопасное хранение данных

### 4. UX/UI
- ✅ Дизайн соответствует референсу
- ✅ Плавные анимации
- ✅ Интуитивная навигация
- ✅ Доступность (WCAG 2.1)

## 🚀 Деплой

### 1. Окружения
- **Development** - локальная разработка
- **Staging** - тестовое окружение
- **Production** - продакшен

### 2. Инфраструктура
- **Backend**: Heroku/AWS
- **Database**: PostgreSQL
- **CDN**: Cloudinary
- **Monitoring**: Sentry, LogRocket

### 3. CI/CD
- Автоматические тесты
- Линтинг кода
- Автоматический деплой
- Мониторинг производительности

## 📚 Документация

### 1. Техническая документация
- API документация
- Архитектура системы
- Руководство по развертыванию

### 2. Пользовательская документация
- Руководство администратора
- FAQ для гостей
- Контактная информация

### 3. Код документация
- Комментарии в коде
- README файлы
- Примеры использования

---

**Версия**: 1.0  
**Дата создания**: $(date)  
**Статус**: Утверждено  
**Ответственный**: Команда разработки
