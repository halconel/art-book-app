# frozen_string_literal: true

module Api
  module Admin
    class WorkloadCalendarController < BaseController
      def index
        start_date = Date.parse(params[:start_date]) if params[:start_date].present?
        end_date = Date.parse(params[:end_date]) if params[:end_date].present?

        calendar = WorkloadCalendar.all
        calendar = calendar.where(date: start_date..end_date) if start_date && end_date

        render json: {
          calendar: calendar.order(:date).map(&method(:calendar_response))
        }
      end

      def create
        calendar_entry = WorkloadCalendar.find_or_initialize_by(
          date: Date.parse(params[:workload_calendar][:date])
        )

        calendar_entry.assign_attributes(workload_calendar_params)

        if calendar_entry.save
          render json: calendar_response(calendar_entry), status: :created
        else
          render json: { errors: calendar_entry.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        calendar_entry = WorkloadCalendar.find(params[:id])

        if calendar_entry.update(workload_calendar_params)
          render json: calendar_response(calendar_entry)
        else
          render json: { errors: calendar_entry.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        calendar_entry = WorkloadCalendar.find(params[:id])
        calendar_entry.destroy

        head :no_content
      end

      private

      def workload_calendar_params
        params.require(:workload_calendar).permit(
          :cycles_completed,
          :is_personal_project,
          :intensity_level,
          :notes
        )
      end

      def calendar_response(entry)
        {
          id: entry.id,
          date: entry.date,
          cycles_completed: entry.cycles_completed,
          is_personal_project: entry.is_personal_project,
          intensity_level: entry.intensity_level,
          notes: entry.notes,
          created_at: entry.created_at,
          updated_at: entry.updated_at
        }
      end
    end
  end
end
