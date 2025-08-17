# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::ImagesController, type: :controller do
  let(:user) { User.create!(username: 'testuser', email: 'test@example.com', password: 'password') }
  let(:project) { Project.create!(user: user, title: 'Test Project', thumbnail_url: 'test.jpg') }
  let(:image) do
    Image.create!(
      img_url: 'test-image.jpg',
      caption: 'Test Image',
      project: project,
      crop_x: 0.5,
      crop_y: 0.5,
      crop_width: 1.0,
      crop_height: 1.0
    )
  end

  describe 'GET #index' do
    before do
      image # Create the image
    end

    it 'returns all images' do
      get :index
      expect(response).to have_http_status(:ok)
      
      json_response = JSON.parse(response.body)
      expect(json_response.length).to eq(1)
      expect(json_response.first['id']).to eq(image.id)
    end

    it 'returns images for specific project' do
      get :index, params: { project_id: project.id }
      expect(response).to have_http_status(:ok)
      
      json_response = JSON.parse(response.body)
      expect(json_response.length).to eq(1)
      expect(json_response.first['project_id']).to eq(project.id)
    end
  end

  describe 'GET #show' do
    it 'returns the requested image' do
      get :show, params: { id: image.id }
      expect(response).to have_http_status(:ok)
      
      json_response = JSON.parse(response.body)
      expect(json_response['id']).to eq(image.id)
      expect(json_response['img_url']).to eq(image.img_url)
      expect(json_response['caption']).to eq(image.caption)
    end

    it 'includes crop parameters in response' do
      get :show, params: { id: image.id }
      expect(response).to have_http_status(:ok)
      
      json_response = JSON.parse(response.body)
      expect(json_response['crop_x']).to eq(0.5)
      expect(json_response['crop_y']).to eq(0.5)
      expect(json_response['crop_width']).to eq(1.0)
      expect(json_response['crop_height']).to eq(1.0)
      expect(json_response['crop_style']).to be_present
      expect(json_response['crop_css_properties']).to be_present
      expect(json_response['has_custom_crop']).to be false
    end
  end

  describe 'GET #main_page' do
    let!(:main_page_image) do
      Image.create!(
        img_url: 'main-image.jpg',
        caption: 'Main Page Image',
        project: project,
        show_on_main_page: true,
        crop_x: 0.25,
        crop_y: 0.75
      )
    end

    let!(:regular_image) do
      Image.create!(
        img_url: 'regular-image.jpg',
        caption: 'Regular Image',
        project: project,
        show_on_main_page: false
      )
    end

    it 'returns only images for main page' do
      get :main_page
      expect(response).to have_http_status(:ok)
      
      json_response = JSON.parse(response.body)
      expect(json_response.length).to eq(1)
      expect(json_response.first['id']).to eq(main_page_image.id)
      expect(json_response.first['show_on_main_page']).to be true
    end
  end

  describe 'POST #create' do
    let(:valid_params) do
      {
        image: {
          img_url: 'new-image.jpg',
          caption: 'New Image',
          project_id: project.id,
          crop_x: 0.3,
          crop_y: 0.7,
          crop_width: 0.8,
          crop_height: 0.6
        }
      }
    end

    it 'creates a new image with crop parameters' do
      expect {
        post :create, params: valid_params
      }.to change(Image, :count).by(1)

      expect(response).to have_http_status(:ok)
      
      json_response = JSON.parse(response.body)
      expect(json_response['img_url']).to eq('new-image.jpg')
      expect(json_response['crop_x']).to eq(0.3)
      expect(json_response['crop_y']).to eq(0.7)
      expect(json_response['crop_width']).to eq(0.8)
      expect(json_response['crop_height']).to eq(0.6)
    end

    it 'creates image with default crop values when not provided' do
      params_without_crop = {
        image: {
          img_url: 'default-crop-image.jpg',
          caption: 'Default Crop Image',
          project_id: project.id
        }
      }

      post :create, params: params_without_crop
      expect(response).to have_http_status(:ok)
      
      json_response = JSON.parse(response.body)
      expect(json_response['crop_x']).to eq(0.0)
      expect(json_response['crop_y']).to eq(0.0)
      expect(json_response['crop_width']).to eq(1.0)
      expect(json_response['crop_height']).to eq(1.0)
    end

    it 'returns errors for invalid crop parameters' do
      invalid_params = {
        image: {
          img_url: 'invalid-crop-image.jpg',
          caption: 'Invalid Crop Image',
          project_id: project.id,
          crop_x: 1.5, # Invalid: greater than 1.0
          crop_y: 0.5,
          crop_width: 1.0,
          crop_height: 1.0
        }
      }

      post :create, params: invalid_params
      expect(response).to have_http_status(:unprocessable_entity)
      
      json_response = JSON.parse(response.body)
      expect(json_response).to include('Crop x must be less than or equal to 1.0')
    end
  end

  describe 'PATCH #update' do
    let(:update_params) do
      {
        id: image.id,
        image: {
          crop_x: 0.25,
          crop_y: 0.75,
          crop_width: 0.8,
          crop_height: 0.6
        }
      }
    end

    it 'updates image crop parameters' do
      patch :update, params: update_params
      expect(response).to have_http_status(:ok)
      
      json_response = JSON.parse(response.body)
      expect(json_response['crop_x']).to eq(0.25)
      expect(json_response['crop_y']).to eq(0.75)
      expect(json_response['crop_width']).to eq(0.8)
      expect(json_response['crop_height']).to eq(0.6)
      expect(json_response['has_custom_crop']).to be true
    end

    it 'updates crop_style and crop_css_properties' do
      patch :update, params: update_params
      expect(response).to have_http_status(:ok)
      
      json_response = JSON.parse(response.body)
      expect(json_response['crop_style']['object_position']).to eq('25.0% 75.0%')
      expect(json_response['crop_css_properties']['--crop-x']).to eq('25.0%')
      expect(json_response['crop_css_properties']['--crop-y']).to eq('75.0%')
    end

    it 'returns errors for invalid crop parameters' do
      invalid_update_params = {
        id: image.id,
        image: {
          crop_x: -0.1 # Invalid: less than 0.0
        }
      }

      patch :update, params: invalid_update_params
      expect(response).to have_http_status(:unprocessable_entity)
      
      json_response = JSON.parse(response.body)
      expect(json_response).to include('Crop x must be greater than or equal to 0.0')
    end
  end

  describe 'DELETE #destroy' do
    it 'deletes the image' do
      image_to_delete = image
      expect {
        delete :destroy, params: { id: image_to_delete.id }
      }.to change(Image, :count).by(-1)

      expect(response).to have_http_status(:ok)
    end
  end
end
