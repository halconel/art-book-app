# frozen_string_literal: true

source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?('/')
  "https://github.com/#{repo_name}.git"
end

ruby '3.4.4'
# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 7.1.0'
# Use postgresql as the database for Active Record
gem 'pg', '~> 1.5'
# Use Puma as the app server
gem 'puma', '~> 6.0'
# Use SCSS for stylesheets
gem 'sassc-rails', '~> 2.1'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby

# Use CoffeeScript for .coffee assets and views
gem 'coffee-rails', '~> 5.0'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.11'
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 4.0'
# Use ActiveModel has_secure_password
gem 'bcrypt', '~> 3.1.18'
gem 'figaro'
gem 'jquery-rails'

# Use Active Storage variant
# gem 'image_processing', '~> 1.2'

# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', '>= 1.4.2', require: false

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: %i[mri mingw x64_mingw]

  # Линтеры и инструменты качества кода
  gem 'rubocop', require: false
  gem 'rubocop-performance', require: false
  gem 'rubocop-rails', require: false
  gem 'rubocop-rspec', require: false

  # Форматирование кода
  gem 'prettier_print'

  # Проверка безопасности
  gem 'brakeman'

  # Анализ покрытия кода
  gem 'simplecov', require: false

  # Тестирование
  gem 'factory_bot_rails'
  gem 'faker'
  gem 'rspec_junit_formatter'
  gem 'rspec-rails', '~> 6.0'

  # Дополнительные инструменты разработки
  gem 'annotate'
  gem 'better_errors'
  gem 'binding_of_caller'
  gem 'pry-rails'
end

group :development do
  # Access an IRB console on exception pages or by using <%= console %> anywhere in the code.
  gem 'listen', '>= 3.3.0'
  gem 'web-console', '>= 4.2.0'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.1.0'

  # Автоматическое исправление кода
  gem 'rubocop-ast'

  # Анализ сложности кода
  gem 'flay'
  gem 'flog'
end

group :test do
  # Adds support for Capybara system testing and selenium driver
  gem 'capybara', '~> 3.38'
  gem 'selenium-webdriver'
  # Easy installation and use of web drivers to run system tests with browsers
  gem 'webdrivers'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: %i[mingw mswin x64_mingw jruby]

# JWT для аутентификации
gem 'jwt'

# CORS для API
gem 'rack-cors'
