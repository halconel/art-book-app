# frozen_string_literal: true

# Image model for the Beyond Home application
class Image < ApplicationRecord
  validates :img_url, presence: true

  belongs_to :project
  has_one :user, through: :project, source: :user

  # Scope for images that should be shown on main page
  scope :show_on_main_page, -> { where(show_on_main_page: true) }

  # Gallery-specific scopes
  scope :visible, -> { joins(:project).where(projects: { status: 'completed' }) }
  scope :featured_first, -> { order(is_featured: :desc, show_on_main_page: :desc, created_at: :desc) }
  scope :by_tags, ->(tags) { where('tags && ARRAY[?]::text[]', Array(tags)) if tags.present? }
  scope :search_by_title, ->(query) { where('title ILIKE ?', "%#{query}%") if query.present? }

  # Gallery helper methods
  def thumbnail_url
    # For now, return the main image URL. In future, could implement thumbnail generation
    img_url
  end

  def alt_text
    # Use the alt_text field if present, otherwise fallback to title or caption
    read_attribute(:alt_text).presence || title.presence || caption.presence || 'Gallery image'
  end

  def tags
    # Return tags array, ensuring it's always an array
    read_attribute(:tags) || []
  end

  def is_featured
    # Return the is_featured boolean value
    read_attribute(:is_featured) || false
  end

  # Method to get formatted dimensions
  def dimensions
    return nil unless width && height
    { width: width, height: height }
  end

  # Method to get aspect ratio for grid layout
  def aspect_ratio
    return 1.0 unless width && height && height > 0
    width.to_f / height.to_f
  end

  # Method for metadata used in gallery
  def metadata
    {
      file_size: file_size,
      dimensions: dimensions,
      tags: tags,
      is_featured: is_featured
    }.compact
  end
end
