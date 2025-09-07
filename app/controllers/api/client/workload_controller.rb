# frozen_string_literal: true

module Api
  module Client
    class WorkloadController < BaseController
      def index
        start_date = Date.parse(params[:start_date]) if params[:start_date]
        end_date = Date.parse(params[:end_date]) if params[:end_date]

        # Default to current month if no dates provided
        start_date ||= Date.current.beginning_of_month
        end_date ||= Date.current.end_of_month

        # Get workload data for the date range
        calendar_data = WorkloadCalendar.for_date_range(start_date, end_date)
                                        .map { |day| format_calendar_day(day) }

        render json: {
          calendar: calendar_data,
          start_date: start_date,
          end_date: end_date
        }
      end

      private

      def format_calendar_day(workload_day)
        {
          date: workload_day.date,
          cycles_completed: workload_day.cycles_completed,
          intensity_level: calculate_intensity_level(workload_day.cycles_completed),
          is_personal_project: workload_day.is_personal_project,
          notes: workload_day.notes
        }
      end

      def calculate_intensity_level(cycles)
        case cycles
        when 0
          0
        when 1..2
          1
        when 3..5
          2
        when 6..8
          3
        when 9..12
          4
        else
          5
        end
      end

      def workload_statistics(year)
        start_date = Date.new(year, 1, 1)
        end_date = Date.new(year, 12, 31)

        all_days = WorkloadCalendar.for_date_range(start_date, end_date)
        client_work_days = all_days.client_work

        {
          total_cycles_completed: all_days.sum(:cycles_completed),
          client_work_cycles: client_work_days.sum(:cycles_completed),
          active_days: all_days.with_activity.count,
          client_work_days: client_work_days.with_activity.count,
          average_cycles_per_day: calculate_average_cycles(all_days),
          most_productive_month: most_productive_month(all_days),
          current_streak: current_work_streak,
          longest_streak: longest_work_streak(year)
        }
      end

      def calculate_average_cycles(days_relation)
        active_days = days_relation.with_activity
        return 0 if active_days.empty?

        (active_days.sum(:cycles_completed).to_f / active_days.count).round(2)
      end

      def most_productive_month(days_relation)
        monthly_cycles = days_relation.group('EXTRACT(month FROM date)')
                                      .sum(:cycles_completed)

        return nil if monthly_cycles.empty?

        best_month = monthly_cycles.max_by { |_, cycles| cycles }
        {
          month: Date::MONTHNAMES[best_month[0].to_i],
          cycles: best_month[1]
        }
      end

      def current_work_streak
        streak = 0
        date = Date.current

        loop do
          day_data = WorkloadCalendar.find_by(date: date)
          break if !day_data || day_data.cycles_completed.zero?

          streak += 1
          date = date.prev_day
        end

        streak
      end

      def longest_work_streak(year)
        start_date = Date.new(year, 1, 1)
        end_date = Date.new(year, 12, 31)

        days = WorkloadCalendar.for_date_range(start_date, end_date)
                               .order(:date)
                               .pluck(:date, :cycles_completed)

        max_streak = 0
        current_streak = 0

        days.each_value do |cycles|
          if cycles.positive?
            current_streak += 1
            max_streak = [max_streak, current_streak].max
          else
            current_streak = 0
          end
        end

        max_streak
      end

      def available_years
        WorkloadCalendar.distinct.pluck('EXTRACT(year FROM date)').sort.reverse
      end
    end
  end
end
