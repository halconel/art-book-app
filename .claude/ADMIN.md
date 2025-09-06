# Техническое планирование панели администратора

## Обзор проекта

Данный документ содержит детальный план реализации панели администратора для галереи искусств "Beyond Home".
Панель предназначена:
 - для управления контентом (изображения, проекты) и редактирования резюме художника.
 - регистрации и ведения логов внесенных изменений.
 - регистрации рабочих циклов и взаимодействия с заказчиками.

## Требования

### Функциональные требования
1. **Аутентификация**: JWT-токены, логин существующих администраторов, регистрация новых заказчиков.
2. **Управление контентом**: CRUD операции для изображений и проектов
3. **Резюме художника**: редактирование в Markdown с живым предпросмотром
4. **Безопасность**: средний уровень CSRF защиты, логирование действий
5. **UX**: Material Design стиль, toast уведомления

### Технические требования
- Загрузка файлов миниатюр + URL изображений
- Автоматическое получение метаданных изображений
- Drag-and-drop сортировка изображений
- Шифрование чувствительных полей User

## Архитектура системы

### Backend (Ruby on Rails 7.1)

#### 1. Модели данных

**User модель**
```ruby
class User < ApplicationRecord
  # Поля: email, phone_number, username, password_digest, role, encrypted_*
  #       email_verified_at, invitation_token, display_name, created_at
  # Роли: enum role: { admin: 0, client: 1 }
  # Шифрование: attr_encrypted для phone_number, email (чувствительные данные)
  # Валидации: has_secure_password, has_email, email format, unique email/username, has_phone_number, phone format, unique phone_number/username
  # Scope: admins, clients, verified_users
  # Методы: verified?, admin?, client?, full_name
  # Связи: has_many :future_arts (для клиентов - их заказы)
end
```

**ArtistResume модель**
```ruby
class ArtistResume < ApplicationRecord
  # Поля: content (markdown), updated_at, user_id
  # Связь: belongs_to :user with role admin
end
```

**AdminLog модель**
```ruby
class AdminLog < ApplicationRecord
  # Поля: user_id, action, resource_type, resource_id, ip_address, timestamp
  # Для логирования всех действий администратора
end
```

**CreativePack модель (Пак творческих циклов)**
```ruby
class CreativePack < ApplicationRecord
  # Поля: name, start_date, end_date, target_cycles (default: 14), 
  #       current_cycles, status (active/completed/interrupted), user_id
  # Связь: has_many :creative_cycles, belongs_to :user, belongs_to :FutureArt
  # Логика: автоматическое завершение при достижении 14+ циклов
  # Статусы: active (в процессе), completed (14+ циклов), interrupted (прервано), on_pause (на паузе)
end
```

**CreativeCycle модель (Творческий цикл)**
```ruby
class CreativeCycle < ApplicationRecord
  # Поля: date, hours_worked (default: 10), description, progress_image_url, cycle_image_url,
  #       result_description, activities (JSON: 3D, photobash, textures, etc),
  #       creative_pack_id
  # Связь: belongs_to :creative_pack, belongs_to :FutureArt
  # Валидация: hours_worked >= 10
  # Автоматическое обновление счетчика в CreativePack при создании
end
```

**FutureArt модель (Будущие арты / Заказы)**
```ruby
class FutureArt < ApplicationRecord
  # Поля: title, description, concept_image_url, target_completion_date,
  #       status, priority, creative_pack_id, client_id, price, art_type
  # Статусы: enum status: { new: 0, accepted: 1, in_progress: 2, 
  #                        review: 3, completed: 4, cancelled: 5 }
  # Типы: enum art_type: { personal: 0, commission: 1 }
  # Связи: belongs_to :creative_pack (optional), belongs_to :client (User, optional)
  #        has_many :images, has_many :notifications
  # Scope: personal_works, commissions, for_client(user_id)
  # Методы: commission?, personal?, visible_to?(user), price_visible_to?(user)
end
```

**Notification модель (Система уведомлений)**
```ruby
class Notification < ApplicationRecord
  # Поля: recipient_id (User), title, message, notification_type, read_at,
  #       related_type, related_id (polymorphic), email_sent_at
  # Типы: enum notification_type: { order_status_change: 0, cycle_completed: 1, 
  #                                pack_completed: 2, order_cancelled: 3 }
  # Связи: belongs_to :recipient (User), belongs_to :related (polymorphic)
  # Методы: read?, mark_as_read!, send_email_notification!
end
```

**WorkloadCalendar модель (Календарь загруженности)**
```ruby
class WorkloadCalendar < ApplicationRecord
  # Поля: date, cycles_count, intensity_level, is_working_day
  # Методы для генерации GitHub-подобного календаря на основе CreativeCycle
  # Scope: last_year, for_period(start_date, end_date)
  # Методы: calculate_intensity, generate_for_period(start_date, end_date)
end
```

**OrderQueue модель (Очередь заказов)**
```ruby
class OrderQueue < ApplicationRecord
  # Поля: future_art_id, position, estimated_start_date, notes
  # Связи: belongs_to :future_art
  # Scope: ordered_by_position
  # Методы: reorder!, move_to_position(new_position)
end
```

**Обновления существующих моделей:**
- Image: добавить position для сортировки, file_upload поля, future_art_id (optional)
- Project: добавить position, thumbnail_file, связь с creative_pack_id (optional)

#### 2. Контроллеры

**Api::Admin namespace:**
```
app/controllers/api/admin/
├── base_controller.rb          # authenticate_admin! + логирование
├── users_controller.rb         # показ профиля админа + управление клиентами
├── projects_controller.rb      # CRUD проекты + сортировка
├── images_controller.rb        # CRUD изображения + сортировка + загрузка
├── resumes_controller.rb       # редактирование резюме
├── creative_packs_controller.rb # CRUD паки циклов + статистика
├── creative_cycles_controller.rb # CRUD циклы + daily tracking
├── future_arts_controller.rb   # управление планами будущих работ + заказы
├── notifications_controller.rb # управление уведомлениями
├── order_queue_controller.rb   # управление очередью заказов
└── logs_controller.rb          # просмотр логов действий
```

**Api::Client namespace (для заказчиков):**
```
app/controllers/api/client/
├── base_controller.rb          # authenticate_client! + ограниченное логирование
├── dashboard_controller.rb     # дашборд клиента с его заказами
├── orders_controller.rb        # просмотр своих заказов (FutureArt)
├── workload_controller.rb      # календарь загруженности художника
├── notifications_controller.rb # уведомления клиента
└── profile_controller.rb       # управление профилем клиента
```

**Api::Auth namespace (аутентификация):**
```
app/controllers/api/auth/
├── registrations_controller.rb # регистрация клиентов + email verification
├── sessions_controller.rb      # JWT login/logout для всех ролей
├── invitations_controller.rb   # система приглашений от художника
└── password_resets_controller.rb # восстановление пароля
```

**Публичные API endpoints:**
```
app/controllers/api/
├── workload_public_controller.rb # публичный календарь загруженности (без авторизации)
└── gallery_controller.rb         # публичная галерея работ
```

#### 3. Operations (бизнес-логика)

```
app/operations/
├── auth/
│   ├── authenticate.rb         # JWT создание/проверка для всех ролей
│   ├── register_client.rb      # регистрация клиента + email verification
│   ├── send_invitation.rb      # отправка приглашения от художника
│   └── verify_email.rb         # подтверждение email
├── admin/
│   ├── users/
│   │   ├── show.rb             # профиль админа
│   │   ├── manage_clients.rb   # управление клиентами
│   │   └── invite_client.rb    # создание приглашения
│   ├── projects/
│   │   ├── create.rb           # создание проекта
│   │   ├── update.rb           # обновление проекта
│   │   ├── destroy.rb          # удаление проекта
│   │   └── reorder.rb          # изменение порядка
│   ├── images/
│   │   ├── create.rb           # создание + метаданные
│   │   ├── update.rb           # обновление изображения
│   │   ├── destroy.rb          # удаление изображения
│   │   ├── upload.rb           # загрузка файлов
│   │   └── reorder.rb          # drag-and-drop сортировка
│   ├── resumes/
│   │   ├── show.rb             # получение резюме
│   │   └── update.rb           # обновление markdown
│   ├── creative_packs/
│   │   ├── create.rb           # создание нового пака циклов
│   │   ├── complete.rb         # автозавершение пака (14+ циклов)
│   │   ├── interrupt.rb        # прерывание пака (плохое самочувствие)
│   │   ├── statistics.rb       # статистика по пакам (рекорды, перегрузки)
│   │   └── index.rb            # список всех паков с фильтрацией
│   ├── creative_cycles/
│   │   ├── create.rb           # ежедневное добавление цикла
│   │   ├── update.rb           # редактирование цикла
│   │   ├── daily_tracker.rb    # отслеживание ежедневного прогресса
│   │   └── activities_parser.rb # парсинг JSON активностей
│   ├── future_arts/
│   │   ├── create.rb           # планирование работы/принятие заказа
│   │   ├── update.rb           # обновление статуса/прогресса
│   │   ├── cancel.rb           # отмена заказа
│   │   ├── link_to_pack.rb     # связывание с текущим паком
│   │   └── priority_manager.rb # управление приоритетами
│   ├── notifications/
│   │   ├── create.rb           # создание уведомления
│   │   ├── send_email.rb       # отправка email уведомления
│   │   └── bulk_notify.rb      # массовые уведомления
│   ├── order_queue/
│   │   ├── add_to_queue.rb     # добавление заказа в очередь
│   │   ├── reorder.rb          # изменение порядка в очереди
│   │   └── estimate_dates.rb   # расчет примерных дат начала работы
│   └── logs/
│       ├── create.rb           # создание лога
│       └── index.rb            # список логов
├── client/
│   ├── dashboard/
│   │   └── show.rb             # дашборд клиента с заказами
│   ├── orders/
│   │   ├── index.rb            # список заказов клиента
│   │   ├── show.rb             # детали заказа
│   │   └── cancel.rb           # отмена заказа клиентом
│   ├── workload/
│   │   └── calendar.rb         # просмотр календаря загруженности
│   ├── notifications/
│   │   ├── index.rb            # список уведомлений
│   │   └── mark_read.rb        # отметить как прочитанное
│   └── profile/
│       ├── show.rb             # профиль клиента
│       └── update.rb           # обновление профиля
└── shared/
    ├── workload_calendar.rb    # генерация календаря загруженности
    ├── email_service.rb        # сервис отправки email
    └── notification_service.rb # сервис уведомлений
```

#### 4. Миграции базы данных

```ruby
# 001_create_users.rb                  # пользователи с ролями
# 002_create_artist_resumes.rb         # резюме художника
# 003_create_admin_logs.rb             # логи действий
# 004_create_creative_packs.rb         # паки творческих циклов
# 005_create_creative_cycles.rb        # отдельные циклы работы
# 006_create_future_arts.rb            # планирование работ/заказов
# 007_create_notifications.rb          # система уведомлений
# 008_create_workload_calendars.rb     # календарь загруженности
# 009_create_order_queues.rb           # очередь заказов
# 010_add_position_to_images.rb        # сортировка изображений
# 011_add_position_to_projects.rb      # сортировка проектов
# 012_add_file_fields_to_images.rb     # поля загрузки файлов
# 013_add_creative_pack_relations.rb   # связи с изображениями/проектами
# 014_add_client_fields_to_users.rb    # поля для клиентов (email_verified_at, etc)
# 015_add_price_to_future_arts.rb      # стоимость заказов (зашифровано)
```

#### 5. Seeds

```ruby
# db/seeds.rb - создание первого администратора и тестовых данных
admin_user = User.create!(
  email: 'admin@example.com',
  username: 'atom_sergal',
  display_name: 'Atom Sergal',
  phone_number: '+1234567890', # будет зашифровано
  password: 'secure_password',
  role: 'admin',
  email_verified_at: Time.current
)

# Создание резюме художника
ArtistResume.create!(
  content: "# Atom Sergal - Digital Artist\n\nExperienced digital artist...",
  user: admin_user
)

# Создание тестового клиента (для демонстрации)
test_client = User.create!(
  email: 'client@example.com',
  username: 'test_client',
  display_name: 'Test Client',
  password: 'client_password',
  role: 'client',
  email_verified_at: Time.current
)

# Создание тестового заказа
FutureArt.create!(
  title: 'Commission: Character Design',
  description: 'Custom character design for game project',
  art_type: 'commission',
  status: 'in_progress',
  client: test_client,
  price: 500.00 # будет зашифровано
)
```

#### 6. Безопасность и middleware

**CSRF Protection:**
```ruby
# config/application.rb - настройка CSRF для API
# Middleware для проверки CSRF токенов в admin запросах
```

**JWT Service:**
```ruby
# app/services/jwt_service.rb
class JwtService
  # encode, decode, expired?, refresh методы
  # Использование Rails.application.credentials.secret_key_base
end
```

### Frontend (React 18)

#### 1. Структура компонентов

```
frontend/components/
├── auth/
│   ├── login.jsx              # универсальная страница входа для всех ролей
│   ├── register.jsx           # регистрация клиентов
│   ├── email_verification.jsx # подтверждение email
│   ├── invitation_signup.jsx  # регистрация по приглашению
│   ├── role_router.jsx        # маршрутизация после входа по ролям
│   └── protected_route.jsx    # HOC для защищенных маршрутов
├── admin/ (для художника-администратора)
│   ├── dashboard/
│   │   ├── admin_dashboard.jsx     # дашборд художника с полной статистикой
│   │   ├── sidebar.jsx             # админ навигация
│   │   ├── header.jsx              # шапка с logout
│   │   └── current_pack_widget.jsx # виджет активного пака
│   ├── clients/
│   │   ├── clients_list.jsx        # управление клиентами
│   │   ├── client_profile.jsx      # профиль клиента
│   │   ├── send_invitation.jsx     # отправка приглашений
│   │   └── client_orders.jsx       # заказы конкретного клиента
│   ├── creative_packs/ (без изменений)
│   ├── creative_cycles/ (без изменений)
│   ├── future_arts/
│   │   ├── arts_kanban.jsx         # Kanban личных работ + заказов
│   │   ├── commission_form.jsx     # форма создания заказа
│   │   ├── personal_art_form.jsx   # форма личной работы
│   │   ├── order_queue.jsx         # управление очередью заказов
│   │   └── commission_card.jsx     # карточка заказа с ценой (только админ)
│   ├── projects/ (без изменений)
│   ├── images/ (без изменений)
│   ├── resume/ (без изменений)
│   ├── notifications/
│   │   ├── notifications_center.jsx # центр уведомлений админа
│   │   └── notification_settings.jsx # настройки уведомлений
│   └── logs/ (без изменений)
├── client/ (для заказчиков)
│   ├── dashboard/
│   │   ├── client_dashboard.jsx    # дашборд клиента с его заказами
│   │   ├── client_sidebar.jsx      # клиентская навигация
│   │   └── client_header.jsx       # шапка клиента
│   ├── orders/
│   │   ├── my_orders.jsx           # список заказов клиента
│   │   ├── order_detail.jsx        # детали заказа с прогрессом
│   │   ├── order_history.jsx       # история изменений заказа
│   │   └── cancel_order.jsx        # отмена заказа
│   ├── workload/
│   │   ├── artist_calendar.jsx     # GitHub-подобный календарь загруженности
│   │   ├── calendar_legend.jsx     # легенда календаря
│   │   └── availability_info.jsx   # информация о доступности
│   ├── notifications/
│   │   ├── client_notifications.jsx # уведомления клиента
│   │   └── notification_item.jsx    # элемент уведомления
│   └── profile/
│       ├── client_profile.jsx      # профиль клиента
│       └── profile_settings.jsx    # настройки профиля
├── shared/ (общие компоненты)
│   ├── ui/
│   │   ├── toast_notifications.jsx # toast уведомления
│   │   ├── confirm_dialog.jsx      # диалог подтверждения
│   │   ├── loading_spinner.jsx     # спиннер загрузки
│   │   ├── progress_circle.jsx     # круговой прогресс
│   │   ├── statistics_chart.jsx    # графики статистики
│   │   ├── workload_calendar.jsx   # переиспользуемый календарь
│   │   ├── notification_badge.jsx  # значок уведомлений
│   │   └── status_badge.jsx        # значки статусов заказов
│   ├── layout/
│   │   ├── main_layout.jsx         # основной layout
│   │   ├── auth_layout.jsx         # layout для аутентификации
│   │   └── mobile_layout.jsx       # мобильный layout
│   └── forms/
│       ├── form_field.jsx          # переиспользуемое поле формы
│       ├── file_upload.jsx         # загрузка файлов
│       └── rich_text_editor.jsx    # rich text редактор
└── public/
    ├── gallery.jsx                 # публичная галерея
    ├── public_workload.jsx         # публичный календарь загруженности
    └── artist_info.jsx             # публичная информация о художнике
```

#### 2. Маршрутизация

```javascript
// frontend/components/app_routes.jsx - главная маршрутизация
const AppRoutes = () => (
  <Routes>
    {/* Публичные маршруты */}
    <Route path="/" element={<PublicGallery />} />
    <Route path="/gallery" element={<PublicGallery />} />
    <Route path="/workload" element={<PublicWorkload />} />
    <Route path="/artist" element={<ArtistInfo />} />
    
    {/* Аутентификация */}
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/verify-email/:token" element={<EmailVerification />} />
    <Route path="/invitation/:token" element={<InvitationSignup />} />
    
    {/* Маршруты администратора */}
    <Route path="/admin/*" element={<ProtectedRoute role="admin" />}>
      <Route index element={<AdminDashboard />} />
      <Route path="clients" element={<ClientsList />} />
      <Route path="clients/:id" element={<ClientProfile />} />
      <Route path="creative-packs" element={<PacksList />} />
      <Route path="creative-packs/:id" element={<PackDetail />} />
      <Route path="cycles" element={<CycleCalendar />} />
      <Route path="cycles/today" element={<DailyCycleForm />} />
      <Route path="commissions" element={<ArtsKanban type="commission" />} />
      <Route path="personal-arts" element={<ArtsKanban type="personal" />} />
      <Route path="queue" element={<OrderQueue />} />
      <Route path="projects" element={<ProjectsList />} />
      <Route path="images" element={<ImagesList />} />
      <Route path="resume" element={<ResumeEditor />} />
      <Route path="notifications" element={<NotificationsCenter />} />
      <Route path="logs" element={<LogsList />} />
    </Route>
    
    {/* Маршруты клиента */}
    <Route path="/client/*" element={<ProtectedRoute role="client" />}>
      <Route index element={<ClientDashboard />} />
      <Route path="orders" element={<MyOrders />} />
      <Route path="orders/:id" element={<OrderDetail />} />
      <Route path="workload" element={<ArtistCalendar />} />
      <Route path="notifications" element={<ClientNotifications />} />
      <Route path="profile" element={<ClientProfile />} />
    </Route>
    
    {/* 404 */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

// frontend/components/auth/role_router.jsx - перенаправление по ролям
const RoleRouter = ({ user }) => {
  if (user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  } else if (user.role === 'client') {
    return <Navigate to="/client" replace />;
  }
  return <Navigate to="/" replace />;
};
```

#### 3. State Management

**Redux состояние:**
```javascript
// frontend/reducers/
├── auth/
│   └── auth_reducer.js              # JWT токен, текущий пользователь, роль
├── admin/ (для художника)
│   ├── creative_packs_reducer.js    # активный пак, список паков, статистика
│   ├── creative_cycles_reducer.js   # циклы текущего пака, календарь
│   ├── future_arts_reducer.js       # все работы (личные + заказы)
│   ├── clients_reducer.js           # управление клиентами
│   ├── projects_reducer.js          # список проектов, текущий проект
│   ├── images_reducer.js            # список изображений, текущее изображение
│   ├── resume_reducer.js            # содержимое резюме, статус сохранения
│   ├── order_queue_reducer.js       # очередь заказов
│   ├── logs_reducer.js              # логи действий
│   └── admin_notifications_reducer.js # уведомления админа
├── client/ (для заказчиков)
│   ├── orders_reducer.js            # заказы клиента
│   ├── workload_reducer.js          # календарь загруженности художника
│   ├── client_notifications_reducer.js # уведомления клиента
│   └── profile_reducer.js           # профиль клиента
├── shared/ (общие)
│   ├── ui_reducer.js               # toast уведомления, модальные окна
│   ├── notifications_reducer.js    # общие уведомления
│   └── workload_calendar_reducer.js # переиспользуемый календарь
└── root_reducer.js                 # объединение всех редьюсеров
```

**Actions:**
```javascript
// frontend/actions/
├── auth/
│   ├── auth_actions.js              # login/logout для всех ролей
│   ├── registration_actions.js      # регистрация клиентов
│   └── invitation_actions.js        # система приглашений
├── admin/
│   ├── creative_pack_actions.js     # CRUD паки, завершение, прерывание
│   ├── creative_cycle_actions.js    # добавление циклов, календарь, трекинг
│   ├── future_art_actions.js        # управление работами и заказами
│   ├── client_actions.js            # управление клиентами
│   ├── project_actions.js           # CRUD + reorder проекты
│   ├── image_actions.js             # CRUD + upload + reorder изображения
│   ├── resume_actions.js            # get/update резюме
│   ├── order_queue_actions.js       # управление очередью заказов
│   ├── log_actions.js               # получение логов
│   └── admin_notification_actions.js # уведомления админа
├── client/
│   ├── order_actions.js             # просмотр/отмена заказов
│   ├── workload_actions.js          # получение календаря загруженности
│   ├── client_notification_actions.js # уведомления клиента
│   └── profile_actions.js           # управление профилем
└── shared/
    ├── ui_actions.js               # toast, модальные окна
    ├── notification_actions.js    # общие уведомления
    └── workload_calendar_actions.js # календарь загруженности
```

#### 4. API Integration

```javascript
// frontend/api/admin/
├── auth.js                # аутентификация API
├── creative_packs.js      # паки циклов API
├── creative_cycles.js     # циклы API + загрузка картинок прогресса
├── future_arts.js         # будущие работы API
├── projects.js            # проекты API
├── images.js              # изображения + загрузка API
├── resume.js              # резюме API
├── logs.js                # логи API
└── interceptors.js        # JWT токен в заголовках, обновление токенов
```

#### 5. Material Design компоненты

**Используемые библиотеки:**
```json
{
  "@mui/material": "^5.x",
  "@mui/icons-material": "^5.x", 
  "@mui/lab": "^5.x",
  "@mui/x-date-pickers": "^6.x", // для календаря циклов
  "react-beautiful-dnd": "^13.x", // для drag-and-drop
  "react-markdown": "^8.x", // для предпросмотра
  "react-dropzone": "^14.x", // для загрузки файлов
  "recharts": "^2.x", // для статистических графиков
  "react-grid-layout": "^1.x" // для kanban досок
}
```

### Стили (SCSS)

```
frontend/styles/admin/
├── admin.scss              # основные стили админки
├── auth.scss               # стили страницы входа
├── dashboard.scss          # стили дашборда
├── forms.scss              # общие стили форм Material Design
├── drag_drop.scss          # стили для drag-and-drop
├── markdown_editor.scss    # стили редактора Markdown
└── toast_notifications.scss # стили уведомлений
```

## Пользовательские истории

### Система творческих циклов - User Stories

**Как художник-администратор, я хочу:**

1. **Начать новый пак циклов**
   - Создать новый пак с названием и целевым количеством циклов (по умолчанию 14)
   - Видеть статус пака (активный/завершенный/прерванный)
   - Отслеживать текущий прогресс (X/14 циклов)

2. **Записывать ежедневные циклы**
   - Добавлять новый цикл с количеством отработанных часов (дефолт 10)
   - Загружать картинку прогресса работы (фотошоп файл)
   - Описывать результат работы за день
   - Отмечать виды деятельности: 3D, фотобаш, структуризация материалов, генерация текстур, Photoshop, ClipStudio

3. **Управлять паками**
   - Автоматически завершать пак при достижении 14 циклов
   - Вручную прерывать пак при плохом самочувствии, отпуске или по другим причинам
   - Видеть перегрузку (циклы свыше 14)
   - Начинать новый пак после отдыха

4. **Анализировать статистику**
   - Видеть свой текущий рекорд (например, 26 циклов)
   - Отслеживать количество перегрузочных циклов
   - Просматривать историю всех паков
   - Видеть графики продуктивности по времени

5. **Планировать будущие работы**
   - Создавать карточки планируемых артов
   - Связывать арты с текущим паком
   - Управлять приоритетами работ
   - Отслеживать прогресс выполнения

### Ключевые сценарии использования

#### Сценарии для художника-администратора:

**Сценарий 1: Начало рабочего дня**
1. Художник входит в админ панель
2. Видит виджет текущего пака на дашборде (например: "Пак #5: 8/14 циклов")
3. Переходит в форму добавления цикла
4. Заполняет: часы работы, загружает картинку, описывает результат
5. Система автоматически обновляет счетчик пака

**Сценарий 2: Принятие нового заказа**
1. Клиент связывается через внешний чат и обсуждает заказ
2. Художник создает FutureArt с типом "commission"
3. Указывает стоимость, описание, связывает с клиентом
4. Добавляет заказ в очередь, система рассчитывает примерную дату начала
5. Клиент получает email уведомление о принятии заказа

**Сценарий 3: Управление клиентами**
1. Художник отправляет приглашение новому клиенту через email
2. Клиент регистрируется по ссылке-приглашению
3. Художник видит нового клиента в списке и может управлять его заказами
4. При необходимости может просматривать профиль и историю заказов клиента

#### Сценарии для заказчика:

**Сценарий 4: Регистрация и первый заказ**
1. Клиент самостоятельно регистрируется или получает приглашение
2. Подтверждает email через ссылку в письме
3. Входит в систему и видит дашборд с пустым списком заказов
4. Контактирует с художником через внешний чат для обсуждения заказа
5. Получает уведомление о создании заказа в системе

**Сценарий 5: Отслеживание прогресса заказа**
1. Клиент входит в систему и видит свои активные заказы
2. Открывает детали заказа и видит текущий статус и историю циклов работы над заказом
3. Просматривает календарь загруженности художника (GitHub-стиль)
4. Получает email уведомления об изменении статуса заказа
5. Может отменить заказ, если необходимо
6. Рефанд стоимости заказа может быть назначен, только если превышены сроки выполнения работы
7. При отмене заказа, если сроки не превышены, заказчик получает уведомление, о том, что рефанд стоимости заказа не будет произведен

**Сценарий 6: Просмотр календаря загруженности**
1. Клиент открывает раздел "Загруженность художника"
2. Видит GitHub-подобный календарь с интенсивностью работы за последний год
3. Понимает периоды высокой/низкой загруженности
4. Может планировать время для новых заказов исходя из загруженности

## План реализации по этапам

### Этап 1: Backend основа + система ролей (3-4 дня)
1. Создать все миграции (User с ролями, Notification, WorkloadCalendar, OrderQueue и др.)
2. Реализовать модели с валидациями, шифрованием и связями
3. Настроить JWT аутентификацию для обеих ролей
4. Создать Seeds с админом и тестовым клиентом
5. Настроить email сервис для уведомлений и верификации

### Этап 2: Backend аутентификация и управление пользователями (3-4 дня)
1. Реализовать Auth Operations (регистрация, приглашения, email verification)
2. Создать Auth контроллеры (registrations, sessions, invitations)
3. Реализовать систему разрешений и проверки ролей
4. Настроить email отправку для регистрации и уведомлений
5. Создать Client Operations (dashboard, orders, workload calendar)

### Этап 3: Backend творческие циклы + заказы (4-5 дней)
1. Реализовать Operations для creative_packs и creative_cycles
2. Реализовать Operations для FutureArt (личные работы + заказы)
3. Создать систему уведомлений (Notification Operations)
4. Реализовать календарь загруженности (WorkloadCalendar)
5. Создать систему очереди заказов (OrderQueue Operations)

### Этап 4: Backend админ функциональность (2-3 дня)
1. Реализовать Admin Operations для управления контентом
2. Добавить обработку загрузки файлов
3. Создать систему логирования действий всех пользователей
4. Настроить CSRF защиту и безопасность API
5. Тестирование всех API endpoints

### Этап 5: Frontend основа + аутентификация (3-4 дня)
1. Установить все необходимые зависимости (Material-UI, календарь, графики)
2. Создать систему аутентификации для всех ролей
3. Реализовать защищенные маршруты с проверкой ролей
4. Создать базовые layouts для админа и клиента
5. Подключить API интеграцию с role-based permissions

### Этап 6: Frontend админ панель (5-6 дней)
1. Реализовать админ дашборд с виджетами творческих циклов
2. Создать управление клиентами (список, профили, приглашения)
3. Реализовать Kanban доску заказов и личных работ
4. Создать формы ежедневных циклов и календарное представление
5. Добавить управление очередью заказов и статистику

### Этап 7: Frontend клиентская панель (3-4 дня)
1. Реализовать клиентский дашборд с заказами
2. Создать детальные страницы заказов с прогрессом
3. Реализовать GitHub-подобный календарь загруженности художника
4. Добавить систему уведомлений для клиентов
5. Создать профиль клиента и настройки

### Этап 8: Frontend остальная функциональность (3-4 дня)
1. Реализовать управление проектами и изображениями (админ)
2. Создать Markdown редактор резюме с предпросмотром
3. Добавить drag-and-drop сортировку
4. Реализовать просмотр логов действий
5. Создать публичные страницы (галерея, информация о художнике)

### Этап 9: UI/UX, уведомления и мобильная версия (4-5 дней)
1. Применить Material Design стили для всех компонентов
2. Настроить email уведомления и push-уведомления
3. Добавить toast уведомления и диалоги подтверждения
4. Создать графики и визуализацию статистики
5. Реализовать мобильную адаптивность для всех ролей

### Этап 10: Тестирование и полировка (3-4 дня)
1. Написать тесты для критических Operations и бизнес-логики
2. Создать feature тесты для всех пользовательских сценариев
3. Провести сквозное тестирование всех ролей
4. Оптимизировать производительность и UX
5. Документировать API endpoints и пользовательские инструкции

## Безопасность

### Защита данных
- Шифрование phone_number через attr_encrypted
- Хеширование паролей через bcrypt (has_secure_password)
- JWT токены с коротким временем жизни + refresh токены

### CSRF защита
- Проверка Origin header для admin маршрутов
- CSRF токены в формах (где необходимо)
- Валидация Content-Type для API запросов

### Логирование
- Все действия администратора записываются в admin_logs
- IP адрес, timestamp, тип действия, затронутый ресурс
- Ротация логов для предотвращения переполнения БД

## Мониторинг и метрики

### Ключевые метрики
- Время отклика admin API endpoints
- Частота использования различных функций админки
- Ошибки загрузки изображений
- Размер uploaded файлов

### Логирование ошибок
- Интеграция с Rails logger
- Отдельный лог файл для admin действий
- Уведомления о критических ошибках

## Заключение

Данный план обеспечивает создание **комплексной системы управления творческой деятельностью** с двумя типами пользователей, современным интерфейсом, надежной безопасностью и уникальными возможностями отслеживания творческих процессов.

**Ключевые особенности обновленной системы:**

### 🎨 Система творческих циклов:
- Геймификация творческого процесса через систему паков и рекордов
- Детальное логирование творческой деятельности с визуальным прогрессом
- Статистическая аналитика продуктивности и перегрузок
- GitHub-подобный календарь загруженности для клиентов

### 👥 Многопользовательская система:
- **Художник-администратор**: полный контроль над творческими процессами и заказами
- **Заказчики**: отслеживание своих заказов и загруженности художника
- Система ролей с гранулярными разрешениями и безопасностью данных

### 📧 Коммуникация и уведомления:
- Email верификация и система приглашений
- Автоматические уведомления о статусах заказов
- Push-уведомления для мобильных устройств
- Логирование всех действий пользователей

### 🔒 Безопасность и приватность:
- Шифрование чувствительной информации (цены заказов, контакты)
- JWT аутентификация с role-based доступом
- CSRF защита и валидация данных
- Приватность личных работ художника от клиентов

### 📱 Современный UX:
- Material Design интерфейс
- Мобильная адаптивность для всех ролей
- Drag-and-drop функциональность
- Интерактивные графики и календари

**Общее время реализации: 34-42 дня** (7-8 недель) с учетом многопользовательской архитектуры, системы уведомлений, и полной мобильной поддержки.

**Возможности для будущего развития:**
- Интеграция с Telegram/Discord ботами для уведомлений
- Платежная система для автоматизации расчетов
- Система генерации договоров и документооборота

---

*Документ создан: 2025-01-09*  
*Версия: 1.0*  
*Статус: Готов к реализации*