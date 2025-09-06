# frozen_string_literal: true

class WorkloadCalendar < ApplicationRecord
  validates :date, presence: true, uniqueness: true
  validates :cycles_completed, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :intensity_level, inclusion: { in: 0..4 }

  before_save :calculate_intensity_level

  scope :for_date_range, ->(start_date, end_date) { where(date: start_date..end_date) }
  scope :personal_projects, -> { where(is_personal_project: true) }
  scope :client_work, -> { where(is_personal_project: false) }
  scope :with_activity, -> { where('cycles_completed > 0') }

  def self.for_github_calendar(year = Date.current.year)
    start_date = Date.new(year, 1, 1)
    end_date = Date.new(year, 12, 31)

    for_date_range(start_date, end_date).map do |day|
      {
        date: day.date.strftime('%Y-%m-%d'),
        count: day.cycles_completed,
        level: day.intensity_level
      }
    end
  end

  def self.weekly_summary(date = Date.current)
    week_start = date.beginning_of_week
    week_end = date.end_of_week

    for_date_range(week_start, week_end).sum(:cycles_completed)
  end

  private

  def calculate_intensity_level
    self.intensity_level = case cycles_completed
                           when 0 then 0
                           when 1..2 then 1
                           when 3..5 then 2
                           when 6..8 then 3
                           else 4
                           end
  end
end
