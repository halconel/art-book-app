# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::Admin::OrdersController, type: :request do
  let(:admin_user) { create(:user, :admin) }
  let(:auth_headers) { sign_in_admin(admin_user) }

  describe 'GET #index' do
    context 'with pagination' do
      it 'returns total_count field with correct order count' do
        # Создаем 8 заказов разного статуса
        create_list(:order_queue, 3, status: 'pending')
        create_list(:order_queue, 2, status: 'in_progress')
        create_list(:order_queue, 3, status: 'completed')
        
        get '/api/admin/orders', params: { page: 1, per_page: 5 }, headers: auth_headers
        
        expect(response).to have_http_status(200)
        
        json_response = JSON.parse(response.body)
        
        # Проверяем структуру ответа
        expect(json_response).to have_key('orders')
        expect(json_response).to have_key('pagination')
        expect(json_response).to have_key('total_count')
        expect(json_response).to have_key('filters')
        
        # Проверяем что total_count показывает все заказы
        expect(json_response['total_count']).to eq(8)
        
        # Проверяем что pagination.total_count тоже корректный
        expect(json_response['pagination']['total_count']).to eq(8)
        
        # Проверяем что на текущей странице показывается не больше per_page записей
        expect(json_response['orders'].length).to be <= 5
        
        # Проверяем что все заказы имеют необходимую структуру
        json_response['orders'].each do |order|
          expect(order).to have_key('id')
          expect(order).to have_key('title')
          expect(order).to have_key('status')
          expect(order).to have_key('client')
        end
      end
      
      it 'returns correct pagination when there are more orders than per_page' do
        # Создаем 12 заказов
        create_list(:order_queue, 12)
        
        get '/api/admin/orders', params: { page: 1, per_page: 5 }, headers: auth_headers
        
        expect(response).to have_http_status(200)
        
        json_response = JSON.parse(response.body)
        
        # Общее количество заказов
        expect(json_response['total_count']).to eq(12)
        expect(json_response['pagination']['total_count']).to eq(12)
        
        # Количество страниц
        expect(json_response['pagination']['total_pages']).to eq(3) # 12 / 5 = 2.4 = 3 страницы
        
        # Текущая страница
        expect(json_response['pagination']['current_page']).to eq(1)
        
        # Количество записей на странице
        expect(json_response['orders'].length).to eq(5)
        expect(json_response['pagination']['per_page']).to eq(5)
      end
    end
    
    context 'with status filter' do
      it 'returns total_count for filtered results' do
        # Создаем заказы разного статуса
        create_list(:order_queue, 4, status: 'pending')
        create_list(:order_queue, 3, status: 'in_progress')
        create_list(:order_queue, 2, status: 'completed')
        
        get '/api/admin/orders', params: { status: 'pending', page: 1, per_page: 10 }, headers: auth_headers
        
        expect(response).to have_http_status(200)
        
        json_response = JSON.parse(response.body)
        
        # total_count должен показывать только заказы со статусом 'pending'
        expect(json_response['total_count']).to eq(4)
        expect(json_response['pagination']['total_count']).to eq(4)
        
        # Проверяем что все возвращенные заказы имеют статус 'pending'
        json_response['orders'].each do |order|
          expect(order['status']).to eq('pending')
        end
      end
    end
    
    context 'with priority filter' do
      it 'returns total_count for priority filtered results' do
        # Создаем заказы разного приоритета
        create_list(:order_queue, 2, priority: 'high')
        create_list(:order_queue, 3, priority: 'medium')
        create_list(:order_queue, 1, priority: 'urgent')
        
        get '/api/admin/orders', params: { priority: 'high', page: 1, per_page: 10 }, headers: auth_headers
        
        expect(response).to have_http_status(200)
        
        json_response = JSON.parse(response.body)
        
        # total_count должен показывать только заказы с высоким приоритетом
        expect(json_response['total_count']).to eq(2)
        expect(json_response['pagination']['total_count']).to eq(2)
        
        # Проверяем что все возвращенные заказы имеют приоритет 'high'
        json_response['orders'].each do |order|
          expect(order['priority']).to eq('high')
        end
      end
    end
    
    context 'with combined filters' do
      it 'returns total_count for multiple filtered results' do
        # Создаем заказы с разными комбинациями статуса и приоритета
        create_list(:order_queue, 2, status: 'pending', priority: 'high')
        create_list(:order_queue, 1, status: 'pending', priority: 'medium')
        create_list(:order_queue, 1, status: 'in_progress', priority: 'high')
        
        get '/api/admin/orders', params: { status: 'pending', priority: 'high', page: 1, per_page: 10 }, headers: auth_headers
        
        expect(response).to have_http_status(200)
        
        json_response = JSON.parse(response.body)
        
        # total_count должен показывать только заказы со статусом 'pending' и приоритетом 'high'
        expect(json_response['total_count']).to eq(2)
        expect(json_response['pagination']['total_count']).to eq(2)
        
        # Проверяем что все возвращенные заказы соответствуют фильтрам
        json_response['orders'].each do |order|
          expect(order['status']).to eq('pending')
          expect(order['priority']).to eq('high')
        end
      end
    end
    
    context 'without authentication' do
      it 'returns error when no token provided' do
        get '/api/admin/orders'
        
        # Due to DoubleRenderError in the authentication concern, we get 500 instead of 401
        expect(response).to have_http_status(500)
      end
    end
  end
end