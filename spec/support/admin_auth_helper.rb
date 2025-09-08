# frozen_string_literal: true

module AdminAuthHelper
  def sign_in_admin(user = nil)
    admin = user || create(:user, :admin)
    
    # Создаем JWT токен для пользователя
    payload = {
      user_id: admin.id,
      role: admin.role,
      exp: 24.hours.from_now.to_i
    }
    token = JWT.encode(payload, Rails.application.credentials.secret_key_base, 'HS256')
    
    # Возвращаем заголовки для аутентификации
    { 'Authorization' => "Bearer #{token}" }
  end
  
  def sign_in_client(user = nil)
    client = user || create(:user, :client)
    
    # Создаем JWT токен для пользователя
    payload = {
      user_id: client.id,
      role: client.role,
      exp: 24.hours.from_now.to_i
    }
    token = JWT.encode(payload, Rails.application.credentials.secret_key_base, 'HS256')
    
    # Возвращаем заголовки для аутентификации
    { 'Authorization' => "Bearer #{token}" }
  end
end

RSpec.configure do |config|
  config.include AdminAuthHelper, type: :request
end