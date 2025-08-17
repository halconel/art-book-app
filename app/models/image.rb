# frozen_string_literal: true

# Image model for the Beyond Home application
class Image < ApplicationRecord
  validates :img_url, presence: true
  validates :crop_x, :crop_y, :crop_width, :crop_height,
            presence: true,
            numericality: { greater_than_or_equal_to: 0.0, less_than_or_equal_to: 1.0 }

  belongs_to :project
  has_one :user, through: :project, source: :user

  # Scope for images that should be shown on main page
  scope :show_on_main_page, -> { where(show_on_main_page: true) }

  # Returns crop parameters as a hash for CSS object-position
  def crop_style
    {
      object_position: "#{(crop_x * 100).round(2)}% #{(crop_y * 100).round(2)}%",
      object_fit: 'cover'
    }
  end

  # Returns crop parameters as CSS custom properties
  def crop_css_properties
    {
      '--crop-x' => "#{(crop_x * 100).round(2)}%",
      '--crop-y' => "#{(crop_y * 100).round(2)}%",
      '--crop-width' => "#{(crop_width * 100).round(2)}%",
      '--crop-height' => "#{(crop_height * 100).round(2)}%"
    }
  end

  # Check if image has custom crop settings
  def has_custom_crop?
    crop_x != 0.0 || crop_y != 0.0 || crop_width != 1.0 || crop_height != 1.0
  end
end
