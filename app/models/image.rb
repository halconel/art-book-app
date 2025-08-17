# frozen_string_literal: true

# Image model for the Beyond Home application
class Image < ApplicationRecord
  validates :img_url, presence: true

  belongs_to :project
  has_one :user, through: :project, source: :user

  # Scope for images that should be shown on main page
  scope :show_on_main_page, -> { where(show_on_main_page: true) }
end
