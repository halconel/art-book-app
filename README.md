# ArtBook

[![tested with rspec](https://img.shields.io/badge/tested%20with-rspec-brightgreen.svg)](https://github.com/rspec/rspec-rails)
[![tested with jest](https://facebook.github.io/jest/img/jest-badge.svg)](https://github.com/facebook/jest)

ArtBook is a portfolio showcase web application. It is a full-stack app built using a `Ruby on Rails` backend, `PostgreSQL` database, and `React/Redux` front-end architecture.

## Установка и запуск

### Системные требования

- **Ruby**: 3.4.4
- **Rails**: 7.1.0
- **Node.js**: 18.0+ (рекомендуется LTS версия)
- **npm**: 8.0+
- **PostgreSQL**: 12.0+
- **Git**: для клонирования репозитория

### Установка на Ubuntu

1. **Установка Ruby через rbenv (рекомендуется)**
   ```bash
   # Установка зависимостей
   sudo apt update
   sudo apt install -y curl gpg build-essential libssl-dev libreadline-dev zlib1g-dev \
     libncurses5-dev libffi-dev libgdbm-dev libyaml-dev

   # Установка rbenv
   curl -fsSL https://github.com/rbenv/rbenv-installer/raw/HEAD/bin/rbenv-installer | bash
   
   # Добавление rbenv в PATH
   echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
   echo 'eval "$(rbenv init -)"' >> ~/.bashrc
   source ~/.bashrc
   
   # Установка Ruby 3.4.4
   rbenv install 3.4.4
   rbenv global 3.4.4
   
   # Проверка версии
   ruby -v
   ```

2. **Установка Node.js**
   ```bash
   # Установка Node.js через NodeSource
   curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Проверка версии
   node -v
   npm -v
   ```

3. **Установка PostgreSQL**
   ```bash
   # Установка PostgreSQL
   sudo apt update
   sudo apt install -y postgresql postgresql-contrib libpq-dev
   
   # Запуск службы PostgreSQL
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   
   # Создание пользователя PostgreSQL
   sudo -u postgres createuser -s $USER
   sudo -u postgres psql -c "ALTER USER $USER PASSWORD 'postgres';"
   ```

### Установка на macOS

1. **Установка Homebrew (если не установлен)**
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Установка зависимостей через Homebrew**
   ```bash
   # Установка rbenv для управления версиями Ruby
   brew install rbenv ruby-build
   
   # Установка Node.js
   brew install node
   
   # Установка PostgreSQL
   brew install postgresql@15
   brew services start postgresql@15
   ```

3. **Установка Ruby 3.4.4**
   ```bash
   # Добавление rbenv в shell
   echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.zshrc  # или ~/.bash_profile
   echo 'eval "$(rbenv init -)"' >> ~/.zshrc  # или ~/.bash_profile
   source ~/.zshrc  # или source ~/.bash_profile
   
   # Установка Ruby 3.4.4
   rbenv install 3.4.4
   rbenv global 3.4.4
   
   # Проверка версии
   ruby -v
   ```

### Установка приложения

1. **Клонирование репозитория**
   ```bash
   git clone https://github.com/halconel/art-book-app.git
   cd art-book-app
   ```

2. **Установка Ruby зависимостей**
   ```bash
   # Установка Bundler (если не установлен)
   gem install bundler
   
   # Установка gems
   bundle install
   ```

3. **Установка JavaScript зависимостей**
   ```bash
   npm install
   ```

4. **Настройка базы данных**
   ```bash
   # Копирование файла с переменными окружения
   cp env.example .env
   
   # Редактирование .env файла при необходимости (по умолчанию настройки должны работать)
   # POSTGRES_USERNAME=postgres
   # POSTGRES_PASSWORD=postgres
   # POSTGRES_HOST=localhost
   # POSTGRES_PORT=5432
   
   # Создание и настройка баз данных
   bundle exec rails db:create
   bundle exec rails db:migrate
   bundle exec rails db:seed
   ```

5. **Запуск приложения**
   
   Необходимо запустить два процесса в отдельных терминалах:

   **Терминал 1 - Rails сервер:**
   ```bash
   bundle exec rails server -p 3000
   ```

   **Терминал 2 - Webpack для фронтенда:**
   ```bash
   npm start
   ```

6. **Открытие приложения**
   
   После запуска обоих серверов откройте браузер и перейдите по адресу:
   ```
   http://127.0.0.1:3000
   ```

### Проверка установки

Чтобы убедиться, что все работает корректно:

1. **Запуск тестов Ruby:**
   ```bash
   bundle exec rspec
   ```

2. **Запуск тестов JavaScript:**
   ```bash
   npm test -- --watchAll=false
   ```

3. **Проверка линтеров:**
   ```bash
   # Ruby код
   bundle exec rubocop
   
   # JavaScript код
   npm run lint
   ```

### Устранение возможных проблем

**Проблема с PostgreSQL подключением:**
```bash
# Убедитесь, что PostgreSQL запущен
sudo systemctl status postgresql  # Ubuntu
brew services list | grep postgresql  # macOS

# Проверьте настройки в .env файле
```

**Проблема с правами доступа к Ruby gems:**
```bash
# Не используйте sudo для установки gems
# Убедитесь, что rbenv настроен правильно
which ruby
which gem
```

**Проблема с Webpack сборкой:**
```bash
# Очистите кэш npm
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```
# UPDATE: 09.09.25 - миграция на vite HMR, проблем не должно возникать

## Design

<img width="2154" height="2013" alt="image" src="https://github.com/user-attachments/assets/f51b41d7-2553-4d2f-9398-97a00ccd54b0" />
