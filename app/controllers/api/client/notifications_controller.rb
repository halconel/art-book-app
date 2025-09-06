# frozen_string_literal: true

module Api
  module Client
    class NotificationsController < BaseController
      def index
        notifications = current_client.notifications
                                      .recent
                                      .page(params[:page])
                                      .per(params[:per_page] || 20)

        # Фильтры
        notifications = notifications.unread if params[:unread] == 'true'
        notifications = notifications.where(notification_type: params[:type]) if params[:type].present?

        render json: {
          notifications: notifications.map { |notification| notification_response(notification) },
          pagination: pagination_meta(notifications),
          summary: notifications_summary
        }
      end

      def show
        notification = current_client.notifications.find(params[:id])

        # Автоматически отмечаем как прочитанное при просмотре
        notification.mark_as_read! unless notification.read?

        render json: {
          notification: detailed_notification_response(notification)
        }
      end

      def update
        notification = current_client.notifications.find(params[:id])

        case params[:action_type]
        when 'mark_as_read'
          notification.mark_as_read!
          message = 'Notification marked as read'
        when 'mark_as_unread'
          notification.update!(read_at: nil)
          message = 'Notification marked as unread'
        else
          return render json: { error: 'Invalid action' }, status: :bad_request
        end

        render json: {
          message: message,
          notification: notification_response(notification)
        }
      end

      # Bulk operations
      def bulk_update
        notification_ids = params[:notification_ids] || []
        action = params[:action_type]

        return render json: { error: 'No notifications selected' }, status: :bad_request if notification_ids.empty?

        notifications = current_client.notifications.where(id: notification_ids)

        case action
        when 'mark_all_read'
          notifications.update_all(read_at: Time.current)
          message = "#{notifications.count} notifications marked as read"
        when 'mark_all_unread'
          notifications.update_all(read_at: nil)
          message = "#{notifications.count} notifications marked as unread"
        when 'delete_all'
          count = notifications.count
          notifications.destroy_all
          message = "#{count} notifications deleted"
        else
          return render json: { error: 'Invalid action' }, status: :bad_request
        end

        render json: { message: message }
      end

      private

      def notification_response(notification)
        {
          id: notification.id,
          title: notification.title,
          message: notification.message,
          notification_type: notification.notification_type,
          read: notification.read?,
          created_at: notification.created_at,
          read_at: notification.read_at,
          metadata: notification.metadata
        }
      end

      def detailed_notification_response(notification)
        notification_response(notification).merge(
          related_order: related_order_info(notification)
        )
      end

      def related_order_info(notification)
        return nil unless notification.metadata&.dig('order_id')

        order = current_client.order_queues.find_by(id: notification.metadata['order_id'])
        return nil unless order

        {
          id: order.id,
          title: order.title,
          status: order.status,
          deadline: order.deadline
        }
      end

      def notifications_summary
        user_notifications = current_client.notifications
        {
          total_notifications: user_notifications.count,
          unread_notifications: user_notifications.unread.count,
          today_notifications: user_notifications.where(created_at: Time.current.beginning_of_day..).count
        }
      end

      def pagination_meta(collection)
        {
          current_page: collection.current_page,
          total_pages: collection.total_pages,
          total_count: collection.total_count,
          per_page: collection.limit_value
        }
      end
    end
  end
end
