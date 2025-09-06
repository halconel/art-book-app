# frozen_string_literal: true

puts "🌱 Seeding database..."

# Очистка базы данных
[RefundRequest, CyclePack, FutureArt, OrderQueue, Notification, WorkloadCalendar, Image, Project, User].each(&:destroy_all)

# Создание админа (художника) Atom Sergal
admin_user = User.create!(
  email: 'admin@artbook.com',
  password: 'admin_password_123',
  first_name: 'Atom',
  last_name: 'Sergal',
  role: 'admin',
  verified_at: Time.current
)

# Создание тестового клиента
test_client = User.create!(
  email: 'client@test.com',
  password: 'client_password_123',
  first_name: 'John',
  last_name: 'Doe',
  phone: '+1234567890',
  contact_info: 'Telegram: @johndoe',
  role: 'client',
  verified_at: Time.current
)

# Создание личного проекта художника
personal_project = Project.create!(
  user: admin_user,
  title: 'Beyond Home',
  description: 'Personal art project exploring the concept of home and belonging',
  thumbnail_url: 'https://res.cloudinary.com/dvcd3fe9t/image/upload/c_fill,h_300,w_300/v1500599950/cylinder_ls_kibyeo.jpg',
  status: 'completed',
  is_personal: true
)

# Добавление изображений к личному проекту
['https://cdnb.artstation.com/p/assets/images/images/046/409/941/large/change-forge-of-universes-los-02-liminality-mini.jpg',
 'https://cdnb.artstation.com/p/assets/images/images/046/409/692/large/change-forge-of-universes-los-01-civit-mini.jpg',
 'https://cdnb.artstation.com/p/assets/images/images/044/258/645/large/change-forge-of-universes-.jpg',
 'https://cdnb.artstation.com/p/assets/images/images/046/409/302/large/change-forge-of-universes-los-00-out-there-mini.jpg'].each_with_index do |url, index|
  Image.create!(
    project: personal_project,
    caption: "Beyond Home - Part #{index + 1}",
    img_url: url,
    show_on_main_page: true,
    title: "Artwork #{index + 1}",
    description: "Part #{index + 1} of the Beyond Home series"
  )
end

# Создание тестового заказа
test_order = OrderQueue.create!(
  client: test_client,
  title: 'Custom Portrait Commission',
  description: 'Digital portrait artwork in fantasy style',
  estimated_cycles: 28, # 2 пака по 14 циклов
  priority: 'medium',
  status: 'in_progress',
  deadline: 30.days.from_now,
  created_via: 'telegram',
  external_reference: '@johndoe',
  price: '500.00'
)

# Создание пака циклов для заказа
cycle_pack = CyclePack.create!(
  order: test_order,
  pack_number: 1,
  cycles_in_pack: 14,
  status: 'completed',
  started_at: 2.weeks.ago,
  completed_at: 1.week.ago
)

# Создание проекта для заказа
client_project = Project.create!(
  user: admin_user,
  title: 'Portrait Commission for John Doe',
  description: 'Custom digital portrait commission',
  thumbnail_url: 'https://via.placeholder.com/300x300',
  status: 'in_progress',
  is_personal: false,
  cycle_pack: cycle_pack
)

# Создание FutureArt для заказа
future_art = FutureArt.create!(
  order: test_order,
  title: 'Digital Portrait',
  description: 'Fantasy-style digital portrait',
  status: 'in_progress',
  cycles_spent: 14,
  started_at: 2.weeks.ago,
  delivery_date: 2.weeks.from_now
)

# Создание уведомлений для клиента
Notification.create!(
  user: test_client,
  notification_type: 'order_created',
  title: 'Order Created',
  message: 'Your commission "Custom Portrait Commission" has been created and added to the queue.',
  metadata: { order_id: test_order.id }
)

Notification.create!(
  user: test_client,
  notification_type: 'cycle_pack_completed',
  title: 'Cycle Pack Completed',
  message: 'Cycle pack #1 for your commission has been completed.',
  metadata: { order_id: test_order.id, cycle_pack_id: cycle_pack.id }
)

# Создание данных календаря рабочих нагрузок
(30.days.ago.to_date..Date.current).each do |date|
  cycles = rand(0..6) # случайное количество циклов от 0 до 6
  is_personal = [true, false].sample
  
  WorkloadCalendar.create!(
    date: date,
    cycles_completed: cycles,
    is_personal_project: is_personal,
    notes: cycles > 0 ? "Productive day with #{cycles} cycles" : "Rest day"
  )
end

puts "✅ Seeds созданы успешно!"
puts "👤 Admin: admin@artbook.com / admin_password_123"
puts "👤 Test Client: client@test.com / client_password_123"
puts "🎨 Проект: Beyond Home с 4 изображениями"
puts "📋 Тестовый заказ с FutureArt и уведомлениями"
puts "📅 30 дней данных календаря рабочих нагрузок"
