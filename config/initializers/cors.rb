# frozen_string_literal: true

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # В разработке разрешаем все origins
    if Rails.env.development?
      origins 'localhost:3000', '127.0.0.1:3000'
    else
      # В продакшене ограничиваем конкретными доменами
      origins 'localhost:3000', '127.0.0.1:3000', 
              /\Ahttps:\/\/.*\.netlify\.app\z/, # Netlify deployments
              /\Ahttps:\/\/.*\.vercel\.app\z/   # Vercel deployments
    end

    resource '/api/*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true,
      expose: ['Content-Length', 'Content-Range', 'X-Total-Count']
  end

  # Отдельные правила для публичных endpoint'ов (без аутентификации)
  allow do
    origins '*'
    resource '/api/main-page-images',
      headers: :any,
      methods: [:get, :options, :head]
    
    resource '/api/project/beyond-home',
      headers: :any,
      methods: [:get, :options, :head]
      
    resource '/api/artist/atom-sergal',
      headers: :any,
      methods: [:get, :options, :head]
  end
end