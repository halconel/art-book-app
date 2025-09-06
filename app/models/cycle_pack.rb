# frozen_string_literal: true

class CyclePack < ApplicationRecord
  belongs_to :order, class_name: 'OrderQueue'
  has_many :projects, dependent: :nullify

  enum :status, {
    pending: 0,
    in_progress: 1,
    completed: 2,
    cancelled: 3
  }

  validates :pack_number, presence: true, uniqueness: { scope: :order_id }
  validates :cycles_in_pack, presence: true, numericality: { greater_than: 0 }
  validates :status, presence: true

  scope :by_pack_number, -> { order(:pack_number) }
  scope :active, -> { where(status: %i[pending in_progress]) }

  delegate :client, to: :order

  def duration_in_days
    return nil unless started_at && completed_at

    (completed_at.to_date - started_at.to_date).to_i + 1
  end

  def start!
    update!(status: :in_progress, started_at: Time.current)
  end

  def complete!
    update!(status: :completed, completed_at: Time.current)
  end

  def progress_percentage
    return 0 unless in_progress?
    return 100 if completed?

    projects_completed = projects.where(status: :completed).count
    total_projects = projects.count

    return 0 if total_projects.zero?

    (projects_completed.to_f / total_projects * 100).round(2)
  end
end
