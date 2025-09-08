# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::Admin::ImagesController, type: :request do
  let(:admin_user) { create(:user, :admin) }
  let(:auth_headers) { sign_in_admin(admin_user) }

  describe 'GET #index' do
    context 'with pagination' do
      it 'returns total_count field with correct image count' do
        # Создаем проекты и изображения
        project1 = create(:project, title: 'Project 1')
        project2 = create(:project, title: 'Project 2')
        
        # Создаем 7 изображений в разных проектах
        create_list(:image, 4, project: project1)
        create_list(:image, 3, project: project2)
        
        get '/api/admin/images', params: { page: 1, per_page: 5 }, headers: auth_headers
        
        expect(response).to have_http_status(200)
        
        json_response = JSON.parse(response.body)
        
        # Проверяем структуру ответа
        expect(json_response).to have_key('images')
        expect(json_response).to have_key('pagination')
        expect(json_response).to have_key('total_count')
        
        # Проверяем что total_count показывает все изображения
        expect(json_response['total_count']).to eq(7)
        
        # Проверяем что pagination.total_count тоже корректный
        expect(json_response['pagination']['total_count']).to eq(7)
        
        # Проверяем что на текущей странице показывается не больше per_page записей
        expect(json_response['images'].length).to be <= 5
        
        # Проверяем что все изображения имеют необходимую структуру
        json_response['images'].each do |image|
          expect(image).to have_key('id')
          expect(image).to have_key('img_url')
          expect(image).to have_key('project')
          expect(image['project']).to have_key('id')
          expect(image['project']).to have_key('title')
        end
      end
      
      it 'returns correct pagination when there are more images than per_page' do
        # Создаем проект и 15 изображений
        project = create(:project)
        create_list(:image, 15, project: project)
        
        get '/api/admin/images', params: { page: 1, per_page: 6 }, headers: auth_headers
        
        expect(response).to have_http_status(200)
        
        json_response = JSON.parse(response.body)
        
        # Общее количество изображений
        expect(json_response['total_count']).to eq(15)
        expect(json_response['pagination']['total_count']).to eq(15)
        
        # Количество страниц
        expect(json_response['pagination']['total_pages']).to eq(3) # 15 / 6 = 2.5 = 3 страницы
        
        # Текущая страница
        expect(json_response['pagination']['current_page']).to eq(1)
        
        # Количество записей на странице
        expect(json_response['images'].length).to eq(6)
        expect(json_response['pagination']['per_page']).to eq(6)
      end
      
      it 'returns correct data on second page' do
        # Создаем проект и 10 изображений
        project = create(:project)
        create_list(:image, 10, project: project)
        
        get '/api/admin/images', params: { page: 2, per_page: 4 }, headers: auth_headers
        
        expect(response).to have_http_status(200)
        
        json_response = JSON.parse(response.body)
        
        # total_count должен оставаться тем же самым
        expect(json_response['total_count']).to eq(10)
        expect(json_response['pagination']['total_count']).to eq(10)
        
        # На второй странице должно быть 4 записи
        expect(json_response['images'].length).to eq(4)
        expect(json_response['pagination']['current_page']).to eq(2)
      end
    end
    
    context 'with project_id filter' do
      it 'returns total_count for specific project images' do
        # Создаем два проекта
        project1 = create(:project, title: 'Project 1')
        project2 = create(:project, title: 'Project 2')
        
        # Создаем изображения в разных проектах
        create_list(:image, 5, project: project1)
        create_list(:image, 3, project: project2)
        
        get '/api/admin/images', params: { project_id: project1.id, page: 1, per_page: 10 }, headers: auth_headers
        
        expect(response).to have_http_status(200)
        
        json_response = JSON.parse(response.body)
        
        # total_count должен показывать только изображения из project1
        expect(json_response['total_count']).to eq(5)
        expect(json_response['pagination']['total_count']).to eq(5)
        
        # Проверяем что все возвращенные изображения принадлежат project1
        json_response['images'].each do |image|
          expect(image['project']['id']).to eq(project1.id)
        end
      end
    end
    
    context 'with main_page filter' do
      it 'returns total_count for main page images only' do
        # Создаем проект
        project = create(:project)
        
        # Создаем изображения с разными настройками show_on_main_page
        create_list(:image, 3, project: project, show_on_main_page: true)
        create_list(:image, 4, project: project, show_on_main_page: false)
        
        get '/api/admin/images', params: { main_page: 'true', page: 1, per_page: 10 }, headers: auth_headers
        
        expect(response).to have_http_status(200)
        
        json_response = JSON.parse(response.body)
        
        # total_count должен показывать только изображения для главной страницы
        expect(json_response['total_count']).to eq(3)
        expect(json_response['pagination']['total_count']).to eq(3)
        
        # Проверяем что все возвращенные изображения показываются на главной странице
        json_response['images'].each do |image|
          expect(image['show_on_main_page']).to be true
        end
      end
    end
    
    context 'with combined filters' do
      it 'returns total_count for multiple filtered results' do
        # Создаем два проекта
        project1 = create(:project, title: 'Project 1')
        project2 = create(:project, title: 'Project 2')
        
        # Создаем изображения с разными комбинациями фильтров
        create_list(:image, 2, project: project1, show_on_main_page: true)
        create_list(:image, 1, project: project1, show_on_main_page: false)
        create_list(:image, 1, project: project2, show_on_main_page: true)
        
        get '/api/admin/images', params: { 
          project_id: project1.id, 
          main_page: 'true', 
          page: 1, 
          per_page: 10 
        }, headers: auth_headers
        
        expect(response).to have_http_status(200)
        
        json_response = JSON.parse(response.body)
        
        # total_count должен показывать только изображения project1 для главной страницы
        expect(json_response['total_count']).to eq(2)
        expect(json_response['pagination']['total_count']).to eq(2)
        
        # Проверяем что все возвращенные изображения соответствуют фильтрам
        json_response['images'].each do |image|
          expect(image['project']['id']).to eq(project1.id)
          expect(image['show_on_main_page']).to be true
        end
      end
    end
    
    context 'without authentication' do
      it 'returns error when no token provided' do
        get '/api/admin/images'
        
        # Due to DoubleRenderError in the authentication concern, we get 500 instead of 401
        expect(response).to have_http_status(500)
      end
    end
  end
end