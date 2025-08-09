# frozen_string_literal: true

# Like model for the Beyond Home application
class Like < ApplicationRecord
  validates :project_id, uniqueness: { scope: :user_id }

  belongs_to :user
  belongs_to :project
end
