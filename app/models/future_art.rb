# frozen_string_literal: true

class FutureArt < ApplicationRecord
  belongs_to :order, class_name: 'OrderQueue'

  enum :status, {
    draft: 0,
    in_progress: 1,
    ready_for_review: 2,
    approved: 3,
    delivered: 4,
    revision_requested: 5
  }

  validates :title, presence: true
  validates :status, presence: true
  validates :cycles_spent, numericality: { greater_than_or_equal_to: 0 }
  validates :quality_rating, inclusion: { in: 1..5 }, allow_nil: true

  scope :completed, -> { where(status: %i[approved delivered]) }
  scope :in_work, -> { where(status: %i[draft in_progress revision_requested]) }
  scope :ready_for_client, -> { where(status: :ready_for_review) }

  delegate :client, to: :order

  def work_in_progress?
    draft? || in_progress? || revision_requested?
  end

  def ready_for_client?
    ready_for_review?
  end

  def completed?
    approved? || delivered?
  end

  def overdue?
    delivery_date && delivery_date < Date.current && !completed?
  end
end
