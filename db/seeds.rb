# frozen_string_literal: true

# Очистка базы данных
User.destroy_all
Project.destroy_all
Image.destroy_all

# Создание Atom Sergal как admin
atom_sergal = User.create!(
  username: 'atom_sergal',
  email: 'atom@beyondhome.com',
  password: 'secure_password_123',
  role: 'admin',
  avatar_url: 'https://res.cloudinary.com/dvcd3fe9t/image/upload/c_fill,h_300,w_300/v1500935387/408555E200000578-0-image-a-121_1495165491692_tefjt7.jpg'
)

# Создание проекта Beyond Home
beyond_home = Project.create!(
  user_id: atom_sergal.id,
  title: 'Beyond Home',
  description: 'Art project exploring the concept of home and belonging',
  thumbnail_url: 'https://res.cloudinary.com/dvcd3fe9t/image/upload/c_fill,h_300,w_300/v1500599950/cylinder_ls_kibyeo.jpg'
)

# Добавление изображений проекта
Image.create!(
  project_id: beyond_home.id,
  caption: 'Beyond Home - Part 1',
  img_url: 'https://cdnb.artstation.com/p/assets/images/images/046/409/941/large/change-forge-of-universes-los-02-liminality-mini.jpg',
  show_on_main_page: true
)

Image.create!(
  project_id: beyond_home.id,
  caption: 'Beyond Home - Part 2',
  img_url: 'https://cdnb.artstation.com/p/assets/images/images/046/409/692/large/change-forge-of-universes-los-01-civit-mini.jpg',
  show_on_main_page: true
)

Image.create!(
  project_id: beyond_home.id,
  caption: 'Beyond Home - Part 3',
  img_url: 'https://cdnb.artstation.com/p/assets/images/images/044/258/645/large/change-forge-of-universes-.jpg',
  show_on_main_page: true
)

Image.create!(
  project_id: beyond_home.id,
  caption: 'Beyond Home - Part 4',
  img_url: 'https://cdnb.artstation.com/p/assets/images/images/046/409/302/large/change-forge-of-universes-los-00-out-there-mini.jpg',
  show_on_main_page: true
)

puts "✅ Seeds созданы успешно!"
puts "👤 Atom Sergal (admin): atom_sergal / secure_password_123"
puts "🎨 Проект: Beyond Home с 3 изображениями"
