# Общие правила

- Изменение главной страницы HOME должно соответствовать спецификацию в файле: .claude/HOME.md

- Изменение панели администратора должно соответствовать спецификацию в файле: .claude/ADMIN.md

- Для пользовательских историй используй тесты в каталоге: spec/features

- Структура файлов и каталогов стилей и структура файлов и каталогов компонентов должна совпадать друг с другов. Например: есть компонет: "frontend/components/home/hero/artist_branding.jsx" соответствующий стиль должен быть в файле: "frontend/styles//home/hero/artist_branding.scss".

- Используй Puppeteer что бы сделать скриншот и проверить результат при изменении frontend.

- Используй разных агентов для разных задач.

- Я бы хотел самостоятельно запускать rails server и npm start, если я в ответ не дал других инструкций.

## Команда для создания скриншота

```bash
node .claude/commands/screenshot.js
```

## Команды для работы с GitHub Issues

### Просмотр всех проблем/задач
```bash
gh issue list --repo halconel/art-book-app
```

### Просмотр конкретной проблемы/задачи
```bash
gh issue view [номер] --repo halconel/art-book-app
```

### Создание новой проблемы/задачи
```bash
gh issue create --repo halconel/art-book-app --title "[заголовок]" --body "[описание]" --label "[метка]"
```

### Редактирование существующей проблемы/задачи
```bash
gh issue edit [номер] --repo halconel/art-book-app --title "[новый заголовок]" --body "[новое описание]"
```

### Закрытие проблемы/задачи
```bash
gh issue close [номер] --repo halconel/art-book-app
```

- При указании номера проблемы/задачи (issue) нужно сначала прочитать содержимое проблемы используя команду выше
- Используй mcp figma для получения доступа к дизайну. Cсылка: 'https://www.figma.com/design/2bBYuF2MmKZQflUiDZ0O45/Beyond-Home?node-id=332-6&t=2pC7SXDWMCKcgmZo-4'