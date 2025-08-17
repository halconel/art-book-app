# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Image, type: :model do
  let(:project) { Project.create!(title: 'Test Project', thumbnail_url: 'test.jpg') }
  let(:image) do
    Image.create!(
      img_url: 'test-image.jpg',
      caption: 'Test Image',
      project: project
    )
  end

  describe 'validations' do
    it 'validates presence of img_url' do
      image_without_url = Image.new(caption: 'Test', project: project)
      expect(image_without_url).not_to be_valid
      expect(image_without_url.errors[:img_url]).to include("can't be blank")
    end
  end

  describe 'associations' do
    it 'belongs to a project' do
      expect(image.project).to eq(project)
    end
  end

  describe 'scopes' do
    let!(:main_page_image) do
      Image.create!(
        img_url: 'main-image.jpg',
        caption: 'Main Page Image',
        project: project,
        show_on_main_page: true
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

    describe '.show_on_main_page' do
      it 'returns only images that should be shown on main page' do
        expect(Image.show_on_main_page).to include(main_page_image)
        expect(Image.show_on_main_page).not_to include(regular_image)
      end
    end
  end
end
