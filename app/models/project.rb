# frozen_string_literal: true

class Project < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :cycle_pack, optional: true
  has_many :images, dependent: :destroy

  enum :status, {
    draft: 0,
    in_progress: 1,
    completed: 2,
    cancelled: 3,
    on_hold: 4
  }

  validates :title, :thumbnail_url, presence: true
  validates :status, presence: true

  scope :personal, -> { where(is_personal: true) }
  scope :client_work, -> { where(is_personal: false) }
  scope :active, -> { where(status: %i[draft in_progress on_hold]) }
  scope :by_status, ->(status) { where(status: status) }

  def client_project?
    !is_personal?
  end

  def personal_project?
    is_personal?
  end

  def client
    cycle_pack&.client
  end

  def order
    cycle_pack&.order
  end
end
