# Настройка переменных окружения

## Обзор

Приложение Beyond Home использует переменные окружения для конфигурации базы данных и других настроек. Это обеспечивает безопасность и гибкость при развертывании.

## Переменные окружения

### База данных

| Переменная          | Описание                       | Значение по умолчанию |
| ------------------- | ------------------------------ | --------------------- |
| `POSTGRES_USERNAME` | Имя пользователя PostgreSQL    | `postgres`            |
| `POSTGRES_PASSWORD` | Пароль пользователя PostgreSQL | `postgres`            |
| `POSTGRES_HOST`     | Хост базы данных               | `localhost`           |
| `POSTGRES_PORT`     | Порт базы данных               | `5432`                |

### Rails

| Переменная          | Описание                        | Значение по умолчанию |
| ------------------- | ------------------------------- | --------------------- |
| `RAILS_ENV`         | Окружение Rails                 | `development`         |
| `RAILS_MAX_THREADS` | Максимальное количество потоков | `5`                   |

## Настройка для разработки

### 1. Использование Figaro (рекомендуется)

Приложение использует gem `figaro` для управления переменными окружения.

```bash
# Конфигурация уже создана в config/application.yml
# Отредактируйте файл под ваши нужды
```

### 2. Прямая настройка переменных окружения

```bash
# Установите переменные окружения в вашей системе
export POSTGRES_USERNAME=postgres
export POSTGRES_PASSWORD=postgres
export POSTGRES_HOST=localhost
export POSTGRES_PORT=5432
```

### 3. Использование .env файла

```bash
# Создайте файл .env в корне проекта
cp env.example .env

# Отредактируйте .env файл
nano .env
```

## Настройка для production

### 1. Переменные окружения на сервере

```bash
# Установите переменные окружения на вашем сервере
export POSTGRES_USERNAME=beyond_home
export POSTGRES_PASSWORD=your_secure_password
export POSTGRES_HOST=your_db_host
export POSTGRES_PORT=5432
```

### 2. Использование DATABASE_URL

Альтернативно, вы можете использовать одну переменную `DATABASE_URL`:

```bash
export DATABASE_URL=postgresql://username:password@host:port/database_name
```

## Проверка конфигурации

### Проверка подключения к базе данных

```bash
# Проверьте версию базы данных
rails db:version

# Проверьте статус базы данных
rails db:status
```

### Проверка переменных окружения

```bash
# В Rails console
rails console
> ENV['POSTGRES_USERNAME']
> ENV['POSTGRES_HOST']
```

## Безопасность

### Важные моменты:

1. **Никогда не коммитьте** `config/application.yml` в git
2. **Используйте разные пароли** для разных окружений
3. **Ограничьте доступ** к переменным окружения в production
4. **Регулярно меняйте пароли** в production

### Файлы, которые НЕ должны быть в git:

- `config/application.yml` (уже в .gitignore)
- `.env` (если используете)
- Любые файлы с паролями

## Устранение неполадок

### Ошибка подключения к базе данных

1. Проверьте, что PostgreSQL запущен
2. Убедитесь, что переменные окружения установлены правильно
3. Проверьте права доступа пользователя PostgreSQL

```bash
# Проверьте статус PostgreSQL
sudo systemctl status postgresql

# Проверьте подключение
psql -h localhost -U postgres -d beyond_home_development
```

### Ошибка "undefined method 'fetch'"

Убедитесь, что переменные окружения доступны в Rails:

```ruby
# В Rails console
ENV.fetch("POSTGRES_USERNAME", "default_value")
```
