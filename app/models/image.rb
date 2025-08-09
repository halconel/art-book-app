# frozen_string_literal: true

# Image model for the Beyond Home application
class Image < ApplicationRecord
  validates :img_url, presence: true

  belongs_to :project
  has_one :user, through: :project, source: :user
end
