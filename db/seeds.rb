# frozen_string_literal: true

puts "🌱 Seeding database..."

# Очистка базы данных
[RefundRequest, CyclePack, FutureArt, OrderQueue, Notification, WorkloadCalendar, Image, Project, User].each(&:destroy_all)

# Создание админа (художника) Atom Sergal
admin_user = User.create!(
  email: 'admin@artbook.com',
  password: 'admin123',
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

# Горизонтальные изображения из ARTS.MD
horizontal_artworks = [
  {
    url: 'https://cdnb.artstation.com/p/assets/images/images/091/586/747/large/change-forge-of-universes-drifting.jpg?1757233445',
    title: 'Drifting',
    description: 'Atmospheric space scene showcasing the vastness and solitude of cosmic exploration.',
    width: 3840,
    height: 2160
  },
  {
    url: 'https://cdnb.artstation.com/p/assets/images/images/091/586/592/large/change-forge-of-universes-los-00-out-there.jpg?1757232667',
    title: 'Out There',
    description: 'Expansive landscape depicting the unknown frontier and endless possibilities.',
    width: 3840,
    height: 2160
  },
  {
    url: 'https://cdnb.artstation.com/p/assets/images/images/091/586/585/large/change-forge-of-universes-los-01-civit.jpg?1757232639',
    title: 'Civit',
    description: 'Urban civilization merged with futuristic technology, showing harmony between nature and progress.',
    width: 3840,
    height: 2160
  },
  {
    url: 'https://cdnb.artstation.com/p/assets/images/images/091/586/543/large/change-forge-of-universes-los-03-liminality.jpg?1757232464',
    title: 'Liminality',
    description: 'Threshold spaces between worlds, exploring transitional states and dimensional boundaries.',
    width: 3840,
    height: 2160
  },
  {
    url: 'https://cdnb.artstation.com/p/assets/images/images/091/585/847/large/change-forge-of-universes-for-nodata.jpg?1757228576',
    title: 'For NoData',
    description: 'Abstract digital landscape representing the void between information and understanding.',
    width: 3840,
    height: 2160
  },
  {
    url: 'https://cdnb.artstation.com/p/assets/images/images/091/586/029/large/change-forge-of-universes-laserscope-for-dred700-publ.jpg?1757229532',
    title: 'Laserscope',
    description: 'High-tech targeting system visualization with precision mechanics and advanced optics.',
    width: 3840,
    height: 2160
  },
  {
    url: 'https://cdnb.artstation.com/p/assets/images/images/091/486/057/large/change-forge-of-universes-ych-full-art-tourism-v2.jpg?1756922132',
    title: 'Tourism V2',
    description: 'Futuristic travel destination showcasing exotic locations and advanced transportation methods.',
    width: 3840,
    height: 2160
  }
]

# Добавление горизонтальных изображений к личному проекту
horizontal_artworks.each_with_index do |artwork, index|
  Image.create!(
    project: personal_project,
    caption: "Beyond Home - #{artwork[:title]}",
    img_url: artwork[:url],
    show_on_main_page: true,
    title: artwork[:title],
    description: artwork[:description],
    width: artwork[:width],
    height: artwork[:height],
    file_size: rand(2_000_000..8_000_000) # Случайный размер файла от 2MB до 8MB
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
puts "🎨 Проект: Beyond Home с 7 горизонтальными изображениями"
puts "📋 Тестовый заказ с FutureArt и уведомлениями"
puts "📅 30 дней данных календаря рабочих нагрузок"
