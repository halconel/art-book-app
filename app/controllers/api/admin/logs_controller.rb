# frozen_string_literal: true

module Api
  module Admin
    class LogsController < Api::Admin::BaseController
      def index
        logs = AdminLog.includes(:user)
                       .order(created_at: :desc)

        # Apply filters
        logs = apply_filters(logs)

        # Pagination
        page = params[:page].to_i.positive? ? params[:page].to_i : 1
        per_page = [params[:per_page].to_i, 100].min
        per_page = 25 if per_page <= 0

        paginated_logs = logs.page(page).per(per_page)

        render json: {
          logs: paginated_logs.map { |log| format_log(log) },
          total_count: logs.count,
          current_page: page,
          per_page: per_page,
          total_pages: (logs.count.to_f / per_page).ceil
        }
      end

      def show
        log = AdminLog.includes(:user).find(params[:id])
        render json: { log: format_log(log, include_details: true) }
      end

      private

      def apply_filters(logs)
        # Search filter
        if params[:search].present?
          search_term = "%#{params[:search]}%"
          logs = logs.joins(:user)
                     .where(
                       'admin_logs.action ILIKE ? OR admin_logs.resource_type ILIKE ? OR admin_logs.details ILIKE ? OR users.email ILIKE ?',
                       search_term, search_term, search_term, search_term
                     )
        end

        # Action filter
        if params[:action_filter].present? && params[:action_filter] != 'all'
          logs = logs.where('admin_logs.action ILIKE ?', "%#{params[:action_filter]}%")
        end

        # Time filter
        case params[:time_filter]
        when 'today'
          logs = logs.where(created_at: Date.current.all_day)
        when 'week'
          logs = logs.where(created_at: 1.week.ago..Time.current)
        when 'month'
          logs = logs.where(created_at: 1.month.ago..Time.current)
        end

        logs
      end

      def format_log(log, include_details: false)
        {
          id: log.id,
          action: log.action,
          resource_type: log.resource_type,
          resource_id: log.resource_id,
          ip_address: log.ip_address,
          created_at: log.created_at,
          user: if log.user
                  {
                    id: log.user.id,
                    email: log.user.email,
                    role: log.user.role
                  }
                end,
          details: include_details ? log.details : truncate_details(log.details),
          metadata: include_details ? log.metadata : nil
        }
      end

      def truncate_details(details)
        return nil unless details

        details.length > 100 ? "#{details[0..97]}..." : details
      end
    end
  end
end
