# frozen_string_literal: true

module Notifications
  class CreateNotificationOperation < BaseOperation
    attribute :user
    attribute :notification_type, :string
    attribute :title, :string
    attribute :message, :string
    attribute :metadata, :string

    validates :user, :notification_type, :title, :message, presence: true
    validates :notification_type, inclusion: { in: Notification.notification_types.keys }

    private

    def execute
      notification = Notification.new(
        user: user,
        notification_type: notification_type,
        title: title,
        message: message,
        metadata: parse_metadata
      )

      if notification.save
        # TODO: Отправить email уведомление если настроено
        # send_email_notification(notification) if should_send_email?

        notification
      else
        failure(notification.errors.full_messages)
      end
    end

    def parse_metadata
      return {} if metadata.blank?
      return metadata if metadata.is_a?(Hash)

      begin
        JSON.parse(metadata)
      rescue JSON::ParserError
        {}
      end
    end

    def should_send_email?
      # Отправляем email для важных уведомлений
      %w[order_created cycle_pack_completed refund_processed].include?(notification_type)
    end
  end
end
