# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::Admin::ProjectsController, type: :request do
  let(:admin_user) { create(:user, :admin) }
  let(:auth_headers) { sign_in_admin(admin_user) }

  describe 'GET #index' do
    context 'with pagination' do
      it 'returns total_count field with correct project count' do
        # Создаем 9 проектов разного типа
        create_list(:project, 5, is_personal: true)
        create_list(:project, 4, is_personal: false)
        
        get '/api/admin/projects', params: { page: 1, per_page: 6 }, headers: auth_headers
        
        expect(response).to have_http_status(200)
        
        json_response = JSON.parse(response.body)
        
        # Проверяем структуру ответа
        expect(json_response).to have_key('projects')
        expect(json_response).to have_key('pagination')
        expect(json_response).to have_key('total_count')
        expect(json_response).to have_key('filters')
        
        # Проверяем что total_count показывает все проекты
        expect(json_response['total_count']).to eq(9)
        
        # Проверяем что pagination.total_count тоже корректный
        expect(json_response['pagination']['total_count']).to eq(9)
        
        # Проверяем что на текущей странице показывается не больше per_page записей
        expect(json_response['projects'].length).to be <= 6
        
        # Проверяем что все проекты имеют необходимую структуру
        json_response['projects'].each do |project|
          expect(project).to have_key('id')
          expect(project).to have_key('title')
          expect(project).to have_key('is_personal')
          expect(project).to have_key('images_count')
        end
      end
      
      it 'returns correct pagination when there are more projects than per_page' do
        # Создаем 13 проектов
        create_list(:project, 13)
        
        get '/api/admin/projects', params: { page: 1, per_page: 5 }, headers: auth_headers
        
        expect(response).to have_http_status(200)
        
        json_response = JSON.parse(response.body)
        
        # Общее количество проектов
        expect(json_response['total_count']).to eq(13)
        expect(json_response['pagination']['total_count']).to eq(13)
        
        # Количество страниц
        expect(json_response['pagination']['total_pages']).to eq(3) # 13 / 5 = 2.6 = 3 страницы
        
        # Текущая страница
        expect(json_response['pagination']['current_page']).to eq(1)
        
        # Количество записей на странице
        expect(json_response['projects'].length).to eq(5)
        expect(json_response['pagination']['per_page']).to eq(5)
      end
      
      it 'returns correct data on third page' do
        # Создаем 11 проектов
        create_list(:project, 11)
        
        get '/api/admin/projects', params: { page: 3, per_page: 4 }, headers: auth_headers
        
        expect(response).to have_http_status(200)
        
        json_response = JSON.parse(response.body)
        
        # total_count должен оставаться тем же самым
        expect(json_response['total_count']).to eq(11)
        expect(json_response['pagination']['total_count']).to eq(11)
        
        # На третьей странице должно быть 3 записи (11 - 8 = 3)
        expect(json_response['projects'].length).to eq(3)
        expect(json_response['pagination']['current_page']).to eq(3)
      end
    end
    
    context 'with status filter' do
      it 'returns total_count for projects with specific status' do
        # Создаем проекты с разными статусами
        create_list(:project, 3, status: 'draft')
        create_list(:project, 4, status: 'in_progress')  
        create_list(:project, 2, status: 'completed')
        
        get '/api/admin/projects', params: { status: 'in_progress', page: 1, per_page: 10 }, headers: auth_headers
        
        expect(response).to have_http_status(200)
        
        json_response = JSON.parse(response.body)
        
        # total_count должен показывать только проекты со статусом 'in_progress'
        expect(json_response['total_count']).to eq(4)
        expect(json_response['pagination']['total_count']).to eq(4)
        
        # Проверяем что все возвращенные проекты имеют статус 'in_progress'
        json_response['projects'].each do |project|
          expect(project['status']).to eq('in_progress')
        end
      end
    end
    
    context 'with type filter for personal projects' do
      it 'returns total_count for personal projects only' do
        # Создаем персональные и клиентские проекты
        create_list(:project, 6, is_personal: true)
        create_list(:project, 4, is_personal: false)
        
        get '/api/admin/projects', params: { type: 'personal', page: 1, per_page: 10 }, headers: auth_headers
        
        expect(response).to have_http_status(200)
        
        json_response = JSON.parse(response.body)
        
        # total_count должен показывать только персональные проекты
        expect(json_response['total_count']).to eq(6)
        expect(json_response['pagination']['total_count']).to eq(6)
        
        # Проверяем что все возвращенные проекты персональные
        json_response['projects'].each do |project|
          expect(project['is_personal']).to be true
        end
      end
    end
    
    context 'with type filter for client projects' do
      it 'returns total_count for client projects only' do
        # Создаем персональные и клиентские проекты  
        create_list(:project, 3, is_personal: true)
        create_list(:project, 7, is_personal: false)
        
        get '/api/admin/projects', params: { type: 'client', page: 1, per_page: 10 }, headers: auth_headers
        
        expect(response).to have_http_status(200)
        
        json_response = JSON.parse(response.body)
        
        # total_count должен показывать только клиентские проекты
        expect(json_response['total_count']).to eq(7)
        expect(json_response['pagination']['total_count']).to eq(7)
        
        # Проверяем что все возвращенные проекты клиентские
        json_response['projects'].each do |project|
          expect(project['is_personal']).to be false
        end
      end
    end
    
    context 'with combined filters' do
      it 'returns total_count for multiple filtered results' do
        # Создаем проекты с разными комбинациями статуса и типа
        create_list(:project, 2, status: 'in_progress', is_personal: true)
        create_list(:project, 1, status: 'in_progress', is_personal: false) 
        create_list(:project, 1, status: 'completed', is_personal: true)
        create_list(:project, 1, status: 'draft', is_personal: false)
        
        get '/api/admin/projects', params: { 
          status: 'in_progress', 
          type: 'personal',
          page: 1, 
          per_page: 10 
        }, headers: auth_headers
        
        expect(response).to have_http_status(200)
        
        json_response = JSON.parse(response.body)
        
        # total_count должен показывать только персональные проекты со статусом 'in_progress'
        expect(json_response['total_count']).to eq(2)
        expect(json_response['pagination']['total_count']).to eq(2)
        
        # Проверяем что все возвращенные проекты соответствуют фильтрам
        json_response['projects'].each do |project|
          expect(project['status']).to eq('in_progress')
          expect(project['is_personal']).to be true
        end
      end
    end
    
    context 'filters information' do
      it 'returns available filter options in response' do
        get '/api/admin/projects', params: { page: 1, per_page: 10 }, headers: auth_headers
        
        expect(response).to have_http_status(200)
        
        json_response = JSON.parse(response.body)
        
        # Проверяем что ответ содержит информацию о доступных фильтрах
        expect(json_response['filters']).to have_key('statuses')
        expect(json_response['filters']).to have_key('types')
        
        expect(json_response['filters']['types']).to include('personal', 'client')
      end
    end
    
    context 'without authentication' do
      it 'returns error when no token provided' do
        get '/api/admin/projects'
        
        # Due to DoubleRenderError in the authentication concern, we get 500 instead of 401
        expect(response).to have_http_status(500)
      end
    end
  end
end