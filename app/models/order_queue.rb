# frozen_string_literal: true

class OrderQueue < ApplicationRecord
  belongs_to :client, class_name: 'User'
  has_many :future_arts, foreign_key: :order_id, dependent: :destroy
  has_many :cycle_packs, foreign_key: :order_id, dependent: :destroy
  has_many :refund_requests, foreign_key: :order_id, dependent: :destroy

  enum :status, {
    pending: 0,
    in_progress: 1,
    completed: 2,
    cancelled: 3,
    on_hold: 4
  }

  enum :priority, {
    low: 0,
    medium: 1,
    high: 2,
    urgent: 3
  }

  validates :title, presence: true
  validates :status, presence: true
  validates :estimated_cycles, numericality: { greater_than: 0 }, allow_nil: true
  validates :deadline, presence: true

  attr_encrypted :price,
                 key: Rails.application.credentials.encryption_key,
                 algorithm: 'aes-256-gcm',
                 encode: true,
                 attribute: :encrypted_price

  scope :by_priority, -> { order(:priority, :created_at) }
  scope :active, -> { where(status: %i[pending in_progress on_hold]) }
  scope :overdue, -> { where(deadline: ...Date.current) }
  scope :due_soon, -> { where(deadline: Date.current..1.week.from_now) }

  def total_cycles_completed
    cycle_packs.completed.sum(:cycles_in_pack)
  end

  def progress_percentage
    return 0 if estimated_cycles.nil? || estimated_cycles.zero?

    (total_cycles_completed.to_f / estimated_cycles * 100).round(2)
  end

  def overdue?
    deadline < Date.current && !completed?
  end

  def due_soon?
    deadline <= 1.week.from_now && !completed?
  end

  def can_request_refund?
    !completed? && overdue? && refund_requests.pending.empty?
  end
end
