# Руководство по миграции на Ruby 3.4.1

## ✅ Успешно выполненные обновления:

### 1. Ruby и Rails
- Ruby: 2.3.1 → 3.4.1
- Rails: 5.1.2 → 7.1.5.1
- PostgreSQL gem: 0.18 → 1.5
- Puma: 3.7 → 6.0
- Sass: sass-rails → sassc-rails

### 2. JavaScript и Frontend
- React: 15.6.1 → 18.2.0
- React Router: 4.1.2 → 6.8.0
- Webpack: 3.3.0 → 5.88.0
- Babel: 6.x → 7.x
- Node.js: 8.3.0 → 18.0.0+

### 3. Тестирование
- RSpec: 3.7 → 6.0
- Jest: 22.4.3 → 29.5.0
- Capybara: 2.13 → 3.38

### 4. База данных
- Переименованы базы данных с префиксом `beyond_home_`
- Обновлены конфигурации для пользователя `postgres`
- Удалены комментарии TODO
- **Учетные данные перенесены в переменные окружения**

## 🔧 Решенные проблемы:

### Проблема с Bundler
**Проблема:** Bundler 1.16.1 не совместим с Ruby 3.4.1 (метод `untaint` удален)

**Решение:**
```bash
# 1. Удалить старую версию Bundler
gem uninstall bundler -v 1.16.1

# 2. Удалить старый Gemfile.lock
rm Gemfile.lock

# 3. Установить gems с новой версией Bundler (при необходимости установите новую версию Bundler)
bundle install
```

### Проблема с Rails 7.0 и Ruby 3.4
**Проблема:** Rails 7.0.8.7 не совместим с Ruby 3.4.1 (Logger issues)

**Решение:**
```bash
# Обновить Rails до 7.1.x
gem 'rails', '~> 7.1.0'
bundle update rails
```

### Переименование баз данных
**Выполнено:**
- `baehance_development` → `beyond_home_development`
- `baehance_test` → `beyond_home_test`
- `baehance_production` → `beyond_home_production`
- Обновлены конфигурации в `config/database.yml`
- Обновлен модуль приложения: `Baehance` → `BeyondHome`
- Обновлены префиксы в `config/cable.yml` и `config/environments/production.rb`

### Переменные окружения
**Выполнено:**
- Учетные данные PostgreSQL перенесены в переменные окружения
- Настроен Figaro для управления переменными окружения
- Создан `config/application.yml` с настройками по умолчанию
- Создан `env.example` как шаблон
- Создана документация `ENVIRONMENT_SETUP.md`

## Шаги для завершения миграции:

### 1. Установка зависимостей ✅
```bash
# Установка Ruby gems - ВЫПОЛНЕНО
bundle install

# Установка Node.js пакетов
npm install
```

### 2. Настройка переменных окружения ✅
```bash
# Конфигурация Figaro создана - ВЫПОЛНЕНО
# config/application.yml настроен с переменными по умолчанию

# При необходимости отредактируйте config/application.yml
nano config/application.yml
```

### 3. Обновление базы данных ✅
```bash
# Создание новых баз данных - ВЫПОЛНЕНО
rails db:create

# Запуск миграций - ВЫПОЛНЕНО
rails db:migrate

# Заполнение тестовыми данными - ВЫПОЛНЕНО
rails db:seed
```

### 4. Проверка совместимости кода
Возможные проблемы, которые нужно исправить:

#### React Router v6 изменения:
- `component` → `element`
- `exact` больше не нужно
- Изменения в API

#### Rails 7.1 изменения:
- Новые конфигурации по умолчанию
- Изменения в asset pipeline

### 5. Запуск тестов
```bash
# Ruby тесты
bundle exec rspec

# JavaScript тесты
npm test
```

### 6. Запуск приложения
```bash
# В одном терминале
rails server

# В другом терминале
npm start
```

## Возможные проблемы и решения:

### 1. Проблемы с React Router
Если есть ошибки с роутингом, обновите компоненты:
```jsx
// Старый способ
<Route path="/path" component={Component} />

// Новый способ
<Route path="/path" element={<Component />} />
```

### 2. Проблемы с Webpack
Если есть ошибки сборки, проверьте:
- Все импорты корректны
- Babel конфигурация правильная
- Webpack конфигурация обновлена

### 3. Проблемы с Rails
Если есть ошибки Rails:
- Проверьте миграции
- Обновите устаревшие методы
- Проверьте конфигурацию

### 4. Проблемы с переменными окружения
Если есть ошибки подключения к базе данных:
```bash
# Проверьте переменные окружения
rails console
> ENV['POSTGRES_USERNAME']
> ENV['POSTGRES_PASSWORD']

# Проверьте подключение к базе
rails db:version
```

## Полезные команды:

```bash
# Очистка кэша
rails tmp:clear
npm cache clean --force

# Пересборка assets
rails assets:precompile
rails assets:clean

# Проверка версий
ruby --version
node --version
npm --version
bundle --version
rails --version

# Проверка переменных окружения
rails console
> ENV['POSTGRES_USERNAME']
```

## Текущий статус:
- ✅ Ruby 3.4.1 установлен
- ✅ Bundler 2.7.1 работает
- ✅ Rails 7.1.5.1 установлен
- ✅ Gems установлены
- ✅ Базы данных созданы и заполнены
- ✅ Переменные окружения настроены
- ⏳ Node.js пакеты (требуют установки)
- ⏳ Frontend (требует обновления)

## Документация:
- 📖 `ENVIRONMENT_SETUP.md` - Настройка переменных окружения
- 📖 `MIGRATION_GUIDE.md` - Данное руководство по миграции

## Контакты для поддержки:
Если возникнут проблемы, проверьте:
1. Логи Rails (`log/development.log`)
2. Логи Webpack (в терминале)
3. Консоль браузера
4. Переменные окружения (`rails console`)
