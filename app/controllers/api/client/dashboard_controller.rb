# frozen_string_literal: true

module Api
  module Client
    class DashboardController < Api::Client::BaseController
      def index
        current_orders = current_user.future_arts.where(status: %i[new accepted in_progress])
                                     .includes(:creative_pack, :cycle_packs)
                                     .order(created_at: :desc)
                                     .limit(5)

        recent_notifications = current_user.notifications.unread
                                           .order(created_at: :desc)
                                           .limit(3)

        stats = {
          total_orders: current_user.future_arts.count,
          active_orders: current_user.future_arts.where(status: %i[accepted in_progress]).count,
          completed_orders: current_user.future_arts.where(status: :completed).count,
          pending_orders: current_user.future_arts.where(status: :new).count
        }

        render json: {
          orders: current_orders.map { |order| format_order_summary(order) },
          notifications: recent_notifications.map { |notification| format_notification(notification) },
          stats: stats
        }
      end

      private

      def format_order_summary(order)
        {
          id: order.id,
          title: order.title,
          status: order.status,
          priority: order.priority,
          created_at: order.created_at,
          deadline: order.target_completion_date,
          progress: calculate_progress(order),
          estimated_cycles: order.estimated_cycles,
          total_cycles_completed: order.cycle_packs&.sum(&:cycles_completed) || 0
        }
      end

      def format_notification(notification)
        {
          id: notification.id,
          title: notification.title,
          message: notification.message,
          notification_type: notification.notification_type,
          created_at: notification.created_at,
          read: notification.read?
        }
      end

      def calculate_progress(order)
        return 0 unless order.estimated_cycles&.positive?

        total_completed = order.cycle_packs&.sum(&:cycles_completed) || 0
        ((total_completed.to_f / order.estimated_cycles) * 100).round(1)
      end
    end
  end
end
