# frozen_string_literal: true

class RefundRequest < ApplicationRecord
  belongs_to :order, class_name: 'OrderQueue'

  enum :status, {
    pending: 0,
    approved: 1,
    rejected: 2,
    processed: 3
  }

  validates :reason, presence: true
  validates :requested_at, presence: true
  validates :status, presence: true
  validates :refund_amount, presence: true, numericality: { greater_than: 0 }, if: :approved?

  scope :recent, -> { order(created_at: :desc) }
  scope :awaiting_review, -> { where(status: :pending) }

  delegate :client, to: :order

  def approve!(amount:, admin_notes: nil)
    update!(
      status: :approved,
      refund_amount: amount,
      admin_notes: admin_notes,
      processed_at: Time.current
    )
  end

  def reject!(admin_notes:)
    update!(
      status: :rejected,
      admin_notes: admin_notes,
      processed_at: Time.current
    )
  end

  def mark_as_processed!
    update!(status: :processed)
  end

  def days_since_request
    (Time.current.to_date - requested_at.to_date).to_i
  end
end
