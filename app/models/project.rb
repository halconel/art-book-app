# frozen_string_literal: true

# Project model for the Beyond Home application
class Project < ApplicationRecord
  has_many :images, dependent: :destroy

  validates :title, :thumbnail_url, presence: true
end
