# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Api::Images', type: :request do
  let(:project) { Project.create!(title: 'Test Project', thumbnail_url: 'test.jpg') }
  let(:beyond_home_project) { Project.create!(title: 'Beyond Home', thumbnail_url: 'beyond-home.jpg') }
  let(:image) do
    Image.create!(
      img_url: 'test-image.jpg',
      caption: 'Test Image',
      project: project
    )
  end

  describe 'GET /api/images' do
    before do
      image # Create the image
    end

    it 'returns all images' do
      get '/api/images', headers: { 'Accept' => 'application/json' }
      expect(response).to have_http_status(:ok)

      json_response = response.parsed_body
      expect(json_response).to be_a(Hash)
      expect(json_response[image.id.to_s]).to be_present
      expect(json_response[image.id.to_s]['id']).to eq(image.id)
    end

    it 'returns images for specific project' do
      get '/api/images', params: { project_id: project.id }, headers: { 'Accept' => 'application/json' }
      expect(response).to have_http_status(:ok)

      json_response = response.parsed_body
      expect(json_response).to be_a(Hash)
      expect(json_response[image.id.to_s]).to be_present
      expect(json_response[image.id.to_s]['project_id']).to eq(project.id)
    end
  end

  describe 'GET /api/images/:id' do
    it 'returns the requested image' do
      get "/api/images/#{image.id}", headers: { 'Accept' => 'application/json' }
      expect(response).to have_http_status(:ok)

      json_response = response.parsed_body
      expect(json_response['id']).to eq(image.id)
      expect(json_response['img_url']).to eq(image.img_url)
      expect(json_response['caption']).to eq(image.caption)
    end
  end

  describe 'GET /api/main-page-images' do
    let!(:main_page_image) do
      Image.create!(
        img_url: 'main-image.jpg',
        caption: 'Main Page Image',
        project: beyond_home_project,
        show_on_main_page: true
      )
    end

    it 'returns images from Beyond Home project' do
      get '/api/main-page-images', headers: { 'Accept' => 'application/json' }
      expect(response).to have_http_status(:ok)

      json_response = response.parsed_body
      expect(json_response).to be_a(Hash)
      expect(json_response[main_page_image.id.to_s]).to be_present
      expect(json_response[main_page_image.id.to_s]['project_id']).to eq(beyond_home_project.id)
    end
  end

  describe 'PATCH /api/images/:id' do
    let(:update_params) do
      {
        image: {
          caption: 'Updated Caption'
        }
      }
    end

    it 'updates image' do
      patch "/api/images/#{image.id}", params: update_params, headers: { 'Accept' => 'application/json' }
      expect(response).to have_http_status(:ok)

      json_response = response.parsed_body
      expect(json_response['caption']).to eq('Updated Caption')
    end
  end
end
