# frozen_string_literal: true

# Project model for the Beyond Home application
class Project < ApplicationRecord
  validates :title, :thumbnail_url, presence: true

  belongs_to :user, class_name: 'User'
  has_many :images, dependent: :destroy

  has_many :likes, dependent: :destroy
  has_many :likers, through: :likes, source: :user
  has_many :comments, dependent: :destroy
end
