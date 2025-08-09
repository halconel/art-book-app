# frozen_string_literal: true

# Comment model for the Beyond Home application
class Comment < ApplicationRecord
  validates :body, presence: true

  belongs_to :user
  belongs_to :project
end
