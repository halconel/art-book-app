# frozen_string_literal: true

class Notification < ApplicationRecord
  belongs_to :user

  enum :notification_type, {
    order_created: 0,
    future_art_ready: 1,
    cycle_pack_completed: 2,
    deadline_approaching: 3,
    refund_processed: 4,
    verification_reminder: 5,
    system_announcement: 6
  }

  validates :title, presence: true
  validates :notification_type, presence: true

  scope :unread, -> { where(read_at: nil) }
  scope :read, -> { where.not(read_at: nil) }
  scope :recent, -> { order(created_at: :desc) }

  def read?
    read_at.present?
  end

  def mark_as_read!
    update!(read_at: Time.current)
  end
end
