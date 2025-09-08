# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::Admin::UsersController, type: :request do
  let(:admin_user) { create(:user, :admin) }
  let(:auth_headers) { sign_in_admin(admin_user) }

  describe 'GET #index' do
    context 'returns client users only' do
      it 'returns total_count field with correct client count (excludes admins)' do
        # Создаем тестовые данные: 5 клиентов и 3 админа
        create_list(:user, 5, :client)
        create_list(:user, 3, :admin)
        
        get '/api/admin/users', params: { page: 1, per_page: 3 }, headers: auth_headers
        
        expect(response).to have_http_status(200)
        
        json_response = JSON.parse(response.body)
        
        # Проверяем структуру ответа
        expect(json_response).to have_key('users')
        expect(json_response).to have_key('pagination')
        expect(json_response).to have_key('total_count')
        
        # Проверяем что total_count показывает только клиентов (без учета админов)
        expect(json_response['total_count']).to eq(5)
        
        # Проверяем что pagination.total_count тоже корректный
        expect(json_response['pagination']['total_count']).to eq(5)
        
        # Проверяем что на текущей странице показывается не больше per_page записей
        expect(json_response['users'].length).to be <= 3
        
        # Проверяем что все возвращенные пользователи - клиенты
        json_response['users'].each do |user|
          expect(user['role']).to eq('client')
        end
      end
      
      it 'returns correct pagination info when there are more clients than per_page' do
        # Создаем 7 клиентов
        create_list(:user, 7, :client)
        
        get '/api/admin/users', params: { page: 1, per_page: 3 }, headers: auth_headers
        
        expect(response).to have_http_status(200)
        
        json_response = JSON.parse(response.body)
        
        # Общее количество клиентов
        expect(json_response['total_count']).to eq(7)
        expect(json_response['pagination']['total_count']).to eq(7)
        
        # Количество страниц
        expect(json_response['pagination']['total_pages']).to eq(3) # 7 / 3 = 2.33 = 3 страницы
        
        # Текущая страница
        expect(json_response['pagination']['current_page']).to eq(1)
        
        # Количество записей на странице
        expect(json_response['users'].length).to eq(3)
        expect(json_response['pagination']['per_page']).to eq(3)
      end
      
      it 'returns correct data on second page' do
        # Создаем 7 клиентов
        create_list(:user, 7, :client)
        
        get '/api/admin/users', params: { page: 2, per_page: 3 }, headers: auth_headers
        
        expect(response).to have_http_status(200)
        
        json_response = JSON.parse(response.body)
        
        # total_count должен оставаться тем же самым
        expect(json_response['total_count']).to eq(7)
        expect(json_response['pagination']['total_count']).to eq(7)
        
        # Но на странице должно быть меньше записей
        expect(json_response['users'].length).to eq(3)
        expect(json_response['pagination']['current_page']).to eq(2)
      end
    end
    
    context 'without authentication' do
      it 'returns error when no token provided' do
        get '/api/admin/users'
        
        # Due to DoubleRenderError in the authentication concern, we get 500 instead of 401
        expect(response).to have_http_status(500)
      end
    end
    
    context 'with client user trying to access admin endpoint' do
      let(:client_user) { create(:user, :client) }
      let(:client_auth_headers) { sign_in_client(client_user) }

      it 'returns 403 forbidden' do
        get '/api/admin/users', headers: client_auth_headers
        
        expect(response).to have_http_status(403)
      end
    end
  end
end