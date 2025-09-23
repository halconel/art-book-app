# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::GalleryController, type: :request do
  let!(:project) { create(:project, status: 'completed', title: 'Test Project') }
  let!(:visible_images) do
    create_list(:image, 5, project: project, title: 'Test Image')
  end
  let!(:hidden_project) { create(:project, status: 'in_progress') }
  let!(:hidden_images) do
    create_list(:image, 3, project: hidden_project, title: 'Hidden Image')
  end

  describe 'GET #index' do
    it 'returns visible images only' do
      get '/api/gallery'

      expect(response).to have_http_status(:ok)
      json_response = JSON.parse(response.body)

      expect(json_response['images']).to be_present
      expect(json_response['images'].size).to eq(5)
      expect(json_response['pagination']).to be_present
      expect(json_response['filters']).to be_present
    end

    it 'returns correct pagination info' do
      get '/api/gallery'

      json_response = JSON.parse(response.body)
      pagination = json_response['pagination']

      expect(pagination['current_page']).to eq(1)
      expect(pagination['per_page']).to eq(24)
      expect(pagination['has_more']).to eq(false)
      expect(pagination['total_count']).to eq(5)
    end

    it 'supports search functionality' do
      searchable_image = create(:image, project: project, title: 'Unique Search Term')

      get '/api/gallery', params: { search: 'Unique' }

      json_response = JSON.parse(response.body)
      expect(json_response['images'].size).to eq(1)
      expect(json_response['images'].first['title']).to eq('Unique Search Term')
    end

    it 'supports tag filtering' do
      tagged_image = create(:image, project: project, tags: ['nature', 'landscape'])

      get '/api/gallery', params: { tags: 'nature' }

      json_response = JSON.parse(response.body)
      expect(json_response['images'].size).to eq(1)
      expect(json_response['images'].first['tags']).to include('nature')
    end

    it 'supports pagination' do
      # Create more images to test pagination
      create_list(:image, 25, project: project, title: 'Page Test')

      get '/api/gallery', params: { page: 1 }

      json_response = JSON.parse(response.body)
      expect(json_response['images'].size).to eq(24) # ITEMS_PER_PAGE
      expect(json_response['pagination']['has_more']).to eq(true)

      get '/api/gallery', params: { page: 2 }

      json_response = JSON.parse(response.body)
      expect(json_response['images'].size).to eq(6) # Remaining images
      expect(json_response['pagination']['has_more']).to eq(false)
    end
  end

  describe 'GET #show' do
    let(:image) { visible_images.first }

    it 'returns single image with details' do
      get "/api/gallery/#{image.id}"

      expect(response).to have_http_status(:ok)
      json_response = JSON.parse(response.body)

      expect(json_response['image']).to be_present
      expect(json_response['image']['id']).to eq(image.id)
      expect(json_response['image']['metadata']).to be_present
    end

    it 'returns 404 for non-existent image' do
      get '/api/gallery/999999'

      expect(response).to have_http_status(:not_found)
    end
  end
end