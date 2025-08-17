# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Image, type: :model do
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

  describe 'validations' do
    it { should validate_presence_of(:img_url) }
    it { should validate_presence_of(:crop_x) }
    it { should validate_presence_of(:crop_y) }
    it { should validate_presence_of(:crop_width) }
    it { should validate_presence_of(:crop_height) }

    it 'validates crop_x is between 0 and 1' do
      image.crop_x = -0.1
      expect(image).not_to be_valid
      expect(image.errors[:crop_x]).to include('must be greater than or equal to 0.0')

      image.crop_x = 1.1
      expect(image).not_to be_valid
      expect(image.errors[:crop_x]).to include('must be less than or equal to 1.0')

      image.crop_x = 0.5
      expect(image).to be_valid
    end

    it 'validates crop_y is between 0 and 1' do
      image.crop_y = -0.1
      expect(image).not_to be_valid
      expect(image.errors[:crop_y]).to include('must be greater than or equal to 0.0')

      image.crop_y = 1.1
      expect(image).not_to be_valid
      expect(image.errors[:crop_y]).to include('must be less than or equal to 1.0')

      image.crop_y = 0.5
      expect(image).to be_valid
    end

    it 'validates crop_width is between 0 and 1' do
      image.crop_width = -0.1
      expect(image).not_to be_valid
      expect(image.errors[:crop_width]).to include('must be greater than or equal to 0.0')

      image.crop_width = 1.1
      expect(image).not_to be_valid
      expect(image.errors[:crop_width]).to include('must be less than or equal to 1.0')

      image.crop_width = 1.0
      expect(image).to be_valid
    end

    it 'validates crop_height is between 0 and 1' do
      image.crop_height = -0.1
      expect(image).not_to be_valid
      expect(image.errors[:crop_height]).to include('must be greater than or equal to 0.0')

      image.crop_height = 1.1
      expect(image).not_to be_valid
      expect(image.errors[:crop_height]).to include('must be less than or equal to 1.0')

      image.crop_height = 1.0
      expect(image).to be_valid
    end
  end

  describe 'associations' do
    it { should belong_to(:project) }
    it { should have_one(:user).through(:project) }
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

  describe '#crop_style' do
    it 'returns correct CSS object-position values' do
      image.crop_x = 0.25
      image.crop_y = 0.75

      expected_style = {
        object_position: '25.0% 75.0%',
        object_fit: 'cover'
      }

      expect(image.crop_style).to eq(expected_style)
    end

    it 'rounds values to 2 decimal places' do
      image.crop_x = 0.333333
      image.crop_y = 0.666666

      style = image.crop_style
      expect(style[:object_position]).to eq('33.33% 66.67%')
    end
  end

  describe '#crop_css_properties' do
    it 'returns correct CSS custom properties' do
      image.crop_x = 0.3
      image.crop_y = 0.7
      image.crop_width = 0.8
      image.crop_height = 0.6

      expected_properties = {
        '--crop-x' => '30.0%',
        '--crop-y' => '70.0%',
        '--crop-width' => '80.0%',
        '--crop-height' => '60.0%'
      }

      expect(image.crop_css_properties).to eq(expected_properties)
    end
  end

  describe '#has_custom_crop?' do
    it 'returns false for default crop values' do
      image.crop_x = 0.0
      image.crop_y = 0.0
      image.crop_width = 1.0
      image.crop_height = 1.0

      expect(image.has_custom_crop?).to be false
    end

    it 'returns true for custom crop values' do
      image.crop_x = 0.25
      image.crop_y = 0.5
      image.crop_width = 1.0
      image.crop_height = 1.0

      expect(image.has_custom_crop?).to be true
    end

    it 'returns true when any crop parameter is custom' do
      image.crop_x = 0.0
      image.crop_y = 0.0
      image.crop_width = 1.0
      image.crop_height = 0.8

      expect(image.has_custom_crop?).to be true
    end
  end

  describe 'default values' do
    let(:new_image) do
      Image.new(
        img_url: 'new-image.jpg',
        caption: 'New Image',
        project: project
      )
    end

    it 'sets default crop values when created' do
      new_image.save!
      expect(new_image.crop_x).to eq(0.0)
      expect(new_image.crop_y).to eq(0.0)
      expect(new_image.crop_width).to eq(1.0)
      expect(new_image.crop_height).to eq(1.0)
    end
  end
end
