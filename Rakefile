# frozen_string_literal: true

# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require_relative 'config/application'

Rails.application.load_tasks

# Задачи для линтинга
namespace :lint do
  desc 'Запуск всех линтеров'
  task all: %i[ruby javascript security] do
    puts '✅ Все линтеры прошли успешно!'
  end

  desc 'Линтинг Ruby кода'
  task ruby: :environment do
    run_ruby_lint
  end

  desc 'Линтинг JavaScript кода'
  task javascript: :environment do
    run_javascript_lint
  end

  desc 'Проверка безопасности'
  task security: :environment do
    run_security_check
  end

  desc 'Автоисправление Ruby кода'
  task 'ruby:fix': :environment do
    run_ruby_fix
  end

  desc 'Автоисправление JavaScript кода'
  task 'javascript:fix': :environment do
    run_javascript_fix
  end
end

def run_ruby_lint
  puts '🔍 Проверка Ruby кода...'
  system('bundle exec rubocop --parallel')
end

def run_javascript_lint
  puts '🔍 Проверка JavaScript кода...'
  system('npm run lint')
end

def run_security_check
  puts '🔒 Проверка безопасности...'
  system('bundle exec brakeman --quiet')
end

def run_ruby_fix
  puts '🔧 Автоисправление Ruby кода...'
  system('bundle exec rubocop --auto-correct --parallel')
end

def run_javascript_fix
  puts '🔧 Автоисправление JavaScript кода...'
  system('npm run lint:fix')
end

# Задачи для качества кода
namespace :quality do
  desc 'Анализ сложности кода'
  task complexity: :environment do
    puts '📊 Анализ сложности кода...'
    system('bundle exec flog app/')
  end

  desc 'Анализ дублирования кода'
  task duplication: :environment do
    puts '📊 Анализ дублирования кода...'
    system('bundle exec flay app/')
  end

  desc 'Покрытие тестами'
  task coverage: :environment do
    puts '📊 Анализ покрытия тестами...'
    system('COVERAGE=true bundle exec rspec')
  end
end
