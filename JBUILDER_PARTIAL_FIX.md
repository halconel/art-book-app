# Исправление проблемы с Jbuilder Partial

## Проблема:
```
Missing partial api/users/_user.json.jbuilder with {locale: [:en], formats: [:html], variants: [], handlers: [:raw, :erb, :html, :builder, :ruby, :coffee, :jbuilder]}
```

## Причина:
Rails не мог найти partial `_user.json.jbuilder` из-за неправильного пути в нескольких файлах.

## Решение:

### 1. Исправлен путь к partial в `app/views/api/users/show.json.jbuilder`:

```ruby
# Было:
json.partial! '/api/users/user', user: @user

# Стало:
json.partial! 'api/users/user', user: @user
```

### 2. Исправлен путь к partial в `app/views/static_pages/root.html.erb`:

#### Вариант A (простой):
```erb
<!-- Было: -->
window.currentUser = <%= render("api/users/user.json.jbuilder", user: current_user).html_safe %>

<!-- Стало: -->
window.currentUser = <%= render("api/users/user", user: current_user).html_safe %>
```

#### Вариант B (детальный - РЕШЕНИЕ ПОЛЬЗОВАТЕЛЯ):
```erb
<!-- Было: -->
window.currentUser = <%= render("api/users/user.json.jbuilder", user: current_user).html_safe %>

<!-- Стало: -->
window.currentUser = <%= render(
  partial: 'api/users/user',
  formats: [:json, :html],
  locale: [:en, :ru],
  handlers: [:erb, :builder, :raw, :ruby, :coffee, :jbuilder],
  locals: { user: current_user }).html_safe %>
```

**Объяснение:** 
- Убран начальный слеш `/` из путей к partial
- Убрано расширение `.json.jbuilder` из вызова `render()` в ERB файле
- **Детальный подход:** Явное указание всех параметров для `render()`:
  - `partial:` - путь к partial
  - `formats:` - поддерживаемые форматы
  - `locale:` - поддерживаемые локали
  - `handlers:` - поддерживаемые обработчики
  - `locals:` - локальные переменные
- В Rails partials ищутся относительно текущей директории, поэтому правильный путь - `'api/users/user'`

### 3. Проверена структура файлов:

```
app/views/api/users/
├── _user.json.jbuilder     # Partial (существует)
└── show.json.jbuilder      # Основной файл

app/views/static_pages/
└── root.html.erb           # Главная страница
```

### 4. Проверено содержимое partial `_user.json.jbuilder`:

```ruby
json.extract! user, :id, :username, :description, :avatar_url
json.likes user.likes.map(&:project_id)
```

### 5. Проверена схема базы данных:

Все необходимые атрибуты существуют в таблице `users`:
- `id` (primary key)
- `username` (string)
- `description` (string, nullable)
- `avatar_url` (string, nullable)

### 6. Очищен кэш Rails:

```bash
rails tmp:clear
```

## Результат:

✅ **API endpoint работает корректно:**
```bash
curl http://localhost:3000/api/users/1.json
```

✅ **Главная страница загружается без ошибок:**
```bash
curl http://localhost:3000/
```

**Ответ API:**
```json
{
  "id": 1,
  "username": "guest",
  "description": null,
  "avatar_url": "https://res.cloudinary.com/...",
  "likes": []
}
```

## Полезные команды для отладки:

```bash
# Очистка кэша Rails
rails tmp:clear

# Проверка синтаксиса jbuilder файлов
ruby -c app/views/api/users/_user.json.jbuilder
ruby -c app/views/api/users/show.json.jbuilder

# Тестирование API endpoint
curl http://localhost:3000/api/users/1.json

# Тестирование главной страницы
curl http://localhost:3000/

# Проверка прав доступа к файлам
ls -la app/views/api/users/
```

## Важные моменты:

1. **Пути к partials:** Не используйте начальный слеш `/` в путях к partials
2. **Расширения файлов:** В ERB файлах не указывайте расширение `.json.jbuilder` при вызове `render()`
3. **Детальный render:** При проблемах с поиском partial используйте детальный подход с явным указанием всех параметров
4. **Кэширование:** При изменении jbuilder файлов может потребоваться очистка кэша
5. **Синтаксис:** Всегда проверяйте синтаксис jbuilder файлов
6. **Атрибуты:** Убедитесь, что все используемые атрибуты существуют в модели/базе данных

## Связанные файлы:

- `app/views/api/users/show.json.jbuilder` - основной файл API
- `app/views/api/users/_user.json.jbuilder` - partial
- `app/views/static_pages/root.html.erb` - главная страница
- `app/controllers/api/users_controller.rb` - контроллер
- `app/models/user.rb` - модель
- `db/schema.rb` - схема базы данных
