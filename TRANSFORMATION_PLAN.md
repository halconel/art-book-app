# План трансформации ArtBook App

## 📋 Обзор проекта

### Текущее состояние

ArtBook App - это социальная платформа для множества художников с функциями:

- ✅ Пользователи (регистрация, вход, профили)
- ✅ Проекты (создание, просмотр, галерея изображений)
- ✅ Лайки и комментарии
- ✅ Аутентификация с BCrypt
- ✅ React/Redux фронтенд
- ✅ Rails API бэкенд

### Целевое состояние

Персональный арт-бук для художника **Atom Sergal** с проектом **"Beyond Home"**:

- 🎯 Один художник (Atom Sergal) - администратор
- 🎯 Один проект (Beyond Home)
- 🎯 Гости - только просмотр
- 🎯 Современная система аутентификации
- 🎯 Минималистичный дизайн в стиле [aidelank.com](https://aidelank.com/)

## 🚀 Этапы трансформации

### ✅ Этап 0: Настройка линтеров и инструментов качества (ЗАВЕРШЕН)

**Выполненные задачи:**

- ✅ Установлены Ruby линтеры (RuboCop 1.79.2)
- ✅ Установлены JavaScript линтеры (ESLint 8.57.1)
- ✅ Настроены pre-commit hooks с Husky
- ✅ Обновлен проект до Ruby 3.4.4 и Rails 7.1.5
- ✅ Создана документация по использованию линтеров

**Файлы конфигурации:**

- `.rubocop.yml` - настройки RuboCop
- `.eslintrc.js` - настройки ESLint
- `.prettierrc` - настройки Prettier
- `.husky/pre-commit` - pre-commit hook
- `LINTING_SETUP.md` - документация

### 🔄 Этап 1: Аудит и планирование архитектуры (1-2 дня)

#### 1.1 Аудит системы аутентификации

**Текущие проблемы:**

- ❌ Отсутствие JWT токенов
- ❌ Нет refresh токенов
- ❌ Отсутствие ролей пользователей
- ❌ Нет двухфакторной аутентификации
- ❌ Отсутствие OAuth интеграции
- ❌ Простая сессионная аутентификация

**Рекомендации по улучшению:**

- ✅ Внедрение JWT токенов с refresh механизмом
- ✅ Система ролей (admin, guest)
- ✅ OAuth через Google/GitHub для гостей
- ✅ Улучшенная безопасность сессий

#### 1.2 Анализ референса [aidelank.com](https://aidelank.com/)

**Ключевые особенности дизайна:**

- Минималистичный дизайн
- Четкая навигация (Resume, Showcase, Projects)
- Фокус на визуальный контент
- Простая структура без социальных функций
- Элегантная типографика
- Темная/светлая тема

#### 1.3 Техническое задание

**Backend требования:**

- Rails 7.1 API
- PostgreSQL база данных
- JWT аутентификация
- Роли пользователей (admin/guest)
- RESTful API endpoints
- Cloudinary для изображений

**Frontend требования:**

- React 18 с hooks
- Современный CSS (Tailwind или Styled Components)
- Адаптивный дизайн
- Плавные анимации
- Оптимизация производительности

### 🔄 Этап 2: Изменение модели данных (2-3 дня)

#### 2.1 Новые миграции

```ruby
# db/migrate/xxx_add_role_to_users.rb
class AddRoleToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :role, :integer, default: 0
    add_index :users, :role
  end
end

# db/migrate/xxx_remove_social_features.rb
class RemoveSocialFeatures < ActiveRecord::Migration[7.1]
  def change
    drop_table :likes
    drop_table :comments
  end
end

# db/migrate/xxx_add_jwt_tokens.rb
class AddJwtTokensToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :refresh_token, :string
    add_index :users, :refresh_token
  end
end
```

#### 2.2 Обновление моделей

```ruby
# app/models/user.rb
class User < ApplicationRecord
  enum role: { guest: 0, admin: 1 }

  validates :username, :password_digest, :session_token, presence: true
  validates :username, uniqueness: true
  validates :password, length: { minimum: 8 }, allow_nil: true

  has_many :projects, dependent: :destroy
  has_many :images, through: :projects

  # Убрать социальные ассоциации
  # has_many :likes, dependent: :destroy
  # has_many :comments, dependent: :destroy

  # JWT методы
  def generate_jwt_token
    JWT.encode(
      { user_id: id, exp: 24.hours.from_now.to_i },
      Rails.application.secrets.secret_key_base
    )
  end

  def generate_refresh_token
    self.refresh_token = SecureRandom.hex(32)
    save!
    refresh_token
  end
end
```

#### 2.3 Обновление seeds

```ruby
# db/seeds.rb
User.destroy_all
Project.destroy_all
Image.destroy_all

# Создание Atom Sergal как admin
atom_sergal = User.create!(
  username: 'atom_sergal',
  email: 'atom@beyondhome.com',
  password: 'secure_password_123',
  role: 'admin',
  avatar_url: 'path_to_atom_avatar'
)

# Создание проекта Beyond Home
beyond_home = Project.create!(
  user_id: atom_sergal.id,
  title: 'Beyond Home',
  description: 'Art project exploring the concept of home and belonging',
  thumbnail_url: 'path_to_thumbnail'
)

# Добавление изображений проекта
Image.create!(
  project_id: beyond_home.id,
  caption: 'Beyond Home - Part 1',
  img_url: 'path_to_image_1'
)

# Создание гостевых пользователей
guest_users = [
  { username: 'guest_1', email: 'guest1@example.com' },
  { username: 'guest_2', email: 'guest2@example.com' }
]

guest_users.each do |user_data|
  User.create!(
    username: user_data[:username],
    email: user_data[:email],
    password: 'guest_password',
    role: 'guest'
  )
end
```

### 🔄 Этап 3: Backend рефакторинг (3-4 дня)

#### 3.1 JWT аутентификация

```ruby
# app/controllers/concerns/jwt_authenticatable.rb
module JwtAuthenticatable
  extend ActiveSupport::Concern

  def authenticate_user!
    token = extract_token_from_header
    @current_user = User.find_by(id: decode_token(token)[:user_id])
  rescue JWT::DecodeError
    render json: { error: 'Invalid token' }, status: :unauthorized
  end

  def authenticate_admin!
    authenticate_user!
    unless @current_user.admin?
      render json: { error: 'Admin access required' }, status: :forbidden
    end
  end

  private

  def extract_token_from_header
    request.headers['Authorization']&.split(' ')&.last
  end

  def decode_token(token)
    JWT.decode(
      token,
      Rails.application.secrets.secret_key_base,
      true,
      algorithm: 'HS256'
    )[0]
  end
end
```

#### 3.2 Обновленные контроллеры

```ruby
# app/controllers/api/sessions_controller.rb
class Api::SessionsController < ApplicationController
  def login
    user = User.find_by_credentials(params[:username], params[:password])

    if user
      render json: {
        user: user,
        token: user.generate_jwt_token,
        refresh_token: user.generate_refresh_token
      }
    else
      render json: { error: 'Invalid credentials' }, status: :unauthorized
    end
  end

  def refresh
    user = User.find_by(refresh_token: params[:refresh_token])

    if user
      render json: {
        token: user.generate_jwt_token,
        refresh_token: user.generate_refresh_token
      }
    else
      render json: { error: 'Invalid refresh token' }, status: :unauthorized
    end
  end

  def logout
    current_user&.update(refresh_token: nil)
    render json: { message: 'Logged out successfully' }
  end
end
```

#### 3.3 Новые API endpoints

```ruby
# config/routes.rb
Rails.application.routes.draw do
  root "static_pages#root"

  namespace :api do
    # Основные страницы
    get 'project/beyond-home', to: 'projects#beyond_home'
    get 'artist/atom-sergal', to: 'users#atom_sergal'
    get 'gallery', to: 'images#gallery'

    # Аутентификация
    post 'auth/login', to: 'sessions#login'
    post 'auth/refresh', to: 'sessions#refresh'
    delete 'auth/logout', to: 'sessions#logout'

    # Админ функции
    namespace :admin do
      resources :projects, only: [:update]
      resources :images, only: [:create, :destroy]
    end

    # Убрать социальные endpoints
    # resources :likes, only: [:create]
    # resources :comments, only: [:index, :create, :destroy]
  end
end
```

### 🔄 Этап 4: Frontend редизайн (4-5 дней)

#### 4.1 Новая структура компонентов

```
frontend/
├── components/
│   ├── layout/
│   │   ├── Header.jsx
│   │   ├── Navigation.jsx
│   │   └── Footer.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Project.jsx
│   │   ├── Gallery.jsx
│   │   └── About.jsx
│   ├── admin/
│   │   ├── AdminPanel.jsx
│   │   ├── ImageUpload.jsx
│   │   └── ProjectEdit.jsx
│   └── shared/
│       ├── ImageGallery.jsx
│       ├── Modal.jsx
│       └── Loading.jsx
├── hooks/
│   ├── useAuth.js
│   └── useApi.js
├── services/
│   ├── authService.js
│   └── apiService.js
└── styles/
    ├── design-system.scss
    ├── components.scss
    └── pages.scss
```

#### 4.2 Дизайн система

```scss
// frontend/styles/design-system.scss
:root {
  // Цветовая палитра
  --primary-color: #2c3e50;
  --secondary-color: #34495e;
  --accent-color: #3498db;
  --text-color: #2c3e50;
  --text-light: #7f8c8d;
  --background-color: #ffffff;
  --background-dark: #f8f9fa;
  --border-color: #e9ecef;

  // Типографика
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;

  // Отступы
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;

  // Тени
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

  // Переходы
  --transition-fast: 150ms ease-in-out;
  --transition-normal: 300ms ease-in-out;
  --transition-slow: 500ms ease-in-out;
}

// Темная тема
[data-theme='dark'] {
  --primary-color: #ecf0f1;
  --secondary-color: #bdc3c7;
  --text-color: #ecf0f1;
  --text-light: #bdc3c7;
  --background-color: #2c3e50;
  --background-dark: #34495e;
  --border-color: #34495e;
}
```

#### 4.3 Основные компоненты

```jsx
// frontend/components/layout/Header.jsx
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Navigation from './Navigation';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo">
          <h1>Atom Sergal</h1>
          <span>Beyond Home</span>
        </div>

        <Navigation />

        {user && (
          <div className="header__user">
            <span>{user.username}</span>
            {user.role === 'admin' && <span className="badge">Admin</span>}
            <button onClick={logout}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
```

### 🔄 Этап 5: Админ панель (2-3 дня)

#### 5.1 Админ интерфейс

```jsx
// frontend/components/admin/AdminPanel.jsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import ImageUpload from './ImageUpload';
import ProjectEdit from './ProjectEdit';

const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('project');

  if (user?.role !== 'admin') {
    return <div className="admin-panel__error">Access denied</div>;
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel__header">
        <h1>Admin Panel</h1>
        <p>Manage Beyond Home project</p>
      </div>

      <div className="admin-panel__tabs">
        <button
          className={activeTab === 'project' ? 'active' : ''}
          onClick={() => setActiveTab('project')}
        >
          Project Settings
        </button>
        <button
          className={activeTab === 'images' ? 'active' : ''}
          onClick={() => setActiveTab('images')}
        >
          Manage Images
        </button>
      </div>

      <div className="admin-panel__content">
        {activeTab === 'project' && <ProjectEdit />}
        {activeTab === 'images' && <ImageUpload />}
      </div>
    </div>
  );
};

export default AdminPanel;
```

#### 5.2 Загрузка изображений

```jsx
// frontend/components/admin/ImageUpload.jsx
import React, { useState } from 'react';
import { uploadImage } from '../../services/apiService';

const ImageUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = event => {
    setFiles(Array.from(event.target.files));
  };

  const handleUpload = async () => {
    setUploading(true);

    try {
      for (const file of files) {
        await uploadImage(file);
      }

      setFiles([]);
      alert('Images uploaded successfully!');
    } catch (error) {
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-upload">
      <h2>Upload Images</h2>

      <div className="image-upload__dropzone">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
        />
        <p>Drag and drop images here or click to select</p>
      </div>

      {files.length > 0 && (
        <div className="image-upload__preview">
          <h3>Selected files ({files.length})</h3>
          <ul>
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
          <button onClick={handleUpload} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload Images'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
```

### 🔄 Этап 6: Тестирование и деплой (2-3 дня)

#### 6.1 Тестирование

```bash
# Запуск всех тестов
bundle exec rspec
npm test

# Проверка линтеров
rake lint:all
npm run lint

# Проверка безопасности
bundle exec brakeman

# Проверка покрытия кода
rake quality:coverage
```

#### 6.2 Оптимизация производительности

```bash
# Анализ сложности кода
rake quality:complexity

# Анализ дублирования
rake quality:duplication

# Оптимизация изображений
# Настройка Cloudinary для автоматической оптимизации
```

#### 6.3 Деплой

```bash
# Подготовка к продакшену
RAILS_ENV=production bundle exec rake assets:precompile
npm run build

# Деплой на Heroku/AWS
git push heroku main
```

## 📊 Оценка времени и ресурсов

### Временные затраты

- **Этап 1**: 1-2 дня (аудит и планирование)
- **Этап 2**: 2-3 дня (модели данных)
- **Этап 3**: 3-4 дня (backend рефакторинг)
- **Этап 4**: 4-5 дней (frontend редизайн)
- **Этап 5**: 2-3 дня (админ панель)
- **Этап 6**: 2-3 дня (тестирование и деплой)

**Общее время**: 14-20 дней

### Сложность

- **Backend**: Средняя (миграции, JWT, API)
- **Frontend**: Высокая (полный редизайн)
- **Интеграция**: Средняя (API интеграция)

### Риски

- Совместимость с существующим кодом
- Миграция данных
- Производительность при загрузке изображений
- Безопасность JWT токенов

## 🎯 Критерии успеха

### Функциональные требования

- ✅ Один художник (Atom Sergal) с правами администратора
- ✅ Один проект (Beyond Home) с галереей изображений
- ✅ Гости могут просматривать контент без регистрации
- ✅ Современная система аутентификации с JWT
- ✅ Админ панель для управления контентом

### Нефункциональные требования

- ✅ Минималистичный дизайн в стиле aidelank.com
- ✅ Адаптивный дизайн для всех устройств
- ✅ Быстрая загрузка страниц (< 3 секунд)
- ✅ Безопасность (HTTPS, JWT, валидация)
- ✅ SEO оптимизация

### Технические требования

- ✅ Ruby 3.4.4 + Rails 7.1.5
- ✅ React 18 + современные хуки
- ✅ PostgreSQL + Cloudinary
- ✅ JWT аутентификация
- ✅ Линтеры и тестирование

## 📚 Дополнительные ресурсы

### Документация

- [LINTING_SETUP.md](./LINTING_SETUP.md) - Настройка линтеров
- [API_ENDPOINTS.md](./docs/api-endpoints.md) - API документация
- [DESIGN_SYSTEM.md](./docs/design-system.md) - Дизайн система

### Референсы

- [aidelank.com](https://aidelank.com/) - Основной референс дизайна
- [JWT.io](https://jwt.io/) - Документация JWT
- [Rails 7.1 Guide](https://guides.rubyonrails.org/) - Rails документация

### Инструменты

- RuboCop - Ruby линтер
- ESLint - JavaScript линтер
- Prettier - Форматирование кода
- Brakeman - Проверка безопасности
- Husky - Git hooks

---

**Статус**: Готов к началу реализации
**Приоритет**: Высокий
**Ответственный**: Команда разработки
**Дата создания**: $(date)
**Версия**: 1.0
