# Настройка линтеров и инструментов качества кода

## 📋 Обзор

Проект настроен с современными инструментами для обеспечения качества кода:

### Ruby линтеры
- **RuboCop** - основной линтер для Ruby
- **RuboCop Rails** - правила для Rails
- **RuboCop RSpec** - правила для тестов
- **RuboCop Performance** - оптимизация производительности

### JavaScript линтеры
- **ESLint** - основной линтер для JavaScript
- **Prettier** - форматирование кода
- **Airbnb config** - популярный стиль кода

### Инструменты безопасности
- **Brakeman** - проверка безопасности Rails приложений

## 🚀 Установка

### 1. Установка Ruby гемов
```bash
bundle install
```

### 2. Установка npm пакетов
```bash
npm install
```

### 3. Настройка Husky (pre-commit hooks)
```bash
npm run prepare
```

## 🔧 Использование

### Автоматические проверки
Линтеры запускаются автоматически перед каждым коммитом благодаря Husky.

### Ручной запуск

#### Ruby линтеры
```bash
# Проверка кода
bundle exec rubocop

# Автоисправление
bundle exec rubocop --auto-correct

# Параллельная проверка
bundle exec rubocop --parallel

# Проверка конкретного файла
bundle exec rubocop app/models/user.rb
```

#### JavaScript линтеры
```bash
# Проверка кода
npm run lint

# Автоисправление
npm run lint:fix

# Форматирование
npm run format

# Проверка форматирования
npm run format:check
```

#### Rake задачи
```bash
# Все линтеры
rake lint:all

# Только Ruby
rake lint:ruby

# Только JavaScript
rake lint:javascript

# Проверка безопасности
rake lint:security

# Автоисправление Ruby
rake lint:ruby:fix

# Автоисправление JavaScript
rake lint:javascript:fix
```

#### Анализ качества кода
```bash
# Анализ сложности
rake quality:complexity

# Анализ дублирования
rake quality:duplication

# Покрытие тестами
rake quality:coverage
```

## 📁 Конфигурационные файлы

- `.rubocop.yml` - настройки RuboCop
- `.eslintrc.js` - настройки ESLint
- `.prettierrc` - настройки Prettier
- `.husky/pre-commit` - pre-commit hook

## 🎯 Правила и стандарты

### Ruby
- Длина строки: 120 символов
- Отступы: 2 пробела
- Строки: одинарные кавычки
- Хеши: современный синтаксис

### JavaScript
- Длина строки: 80 символов
- Отступы: 2 пробела
- Точки с запятой: обязательны
- Кавычки: одинарные

### React
- Функциональные компоненты
- Arrow functions
- Props spreading разрешен
- PropTypes отключены

## 🔍 Игнорирование файлов

### RuboCop
Исключения в `.rubocop.yml`:
- `db/**/*`
- `config/**/*`
- `vendor/**/*`
- `node_modules/**/*`

### ESLint
Исключения в `.eslintignore`:
- `node_modules/`
- `dist/`
- `build/`
- `coverage/`

## 🚨 Частые проблемы и решения

### RuboCop ошибки
```bash
# Игнорировать конкретное правило в файле
# rubocop:disable Layout/LineLength
long_line_of_code_here
# rubocop:enable Layout/LineLength

# Игнорировать для одной строки
some_code # rubocop:disable Style/SomeRule
```

### ESLint ошибки
```javascript
// Игнорировать конкретное правило в файле
/* eslint-disable react/prop-types */

// Игнорировать для одной строки
const unusedVar = 'test'; // eslint-disable-line no-unused-vars
```

## 📊 Отчеты

### RuboCop отчет
```bash
bundle exec rubocop --format html --out rubocop.html
```

### ESLint отчет
```bash
npm run lint -- --format html --output-file eslint.html
```

### Brakeman отчет
```bash
bundle exec brakeman --format html --output brakeman.html
```

## 🔄 CI/CD интеграция

Линтеры интегрированы в CI/CD pipeline:

```yaml
# .github/workflows/lint.yml
name: Lint
on: [push, pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
      - name: Setup Node.js
        uses: actions/setup-node@v2
      - name: Install dependencies
        run: |
          bundle install
          npm install
      - name: Run linters
        run: |
          bundle exec rubocop
          npm run lint
          bundle exec brakeman --quiet
```

## 📚 Полезные ссылки

- [RuboCop документация](https://rubocop.org/)
- [ESLint документация](https://eslint.org/)
- [Prettier документация](https://prettier.io/)
- [Brakeman документация](https://brakemanscanner.org/)
- [Husky документация](https://typicode.github.io/husky/)
