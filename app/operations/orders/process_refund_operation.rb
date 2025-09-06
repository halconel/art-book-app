# frozen_string_literal: true

module Orders
  class ProcessRefundOperation < BaseOperation
    attribute :refund_request_id, :integer
    attribute :admin_user
    attribute :action, :string # 'approve' or 'reject'
    attribute :refund_amount, :decimal
    attribute :admin_notes, :string

    validates :refund_request_id, :admin_user, :action, presence: true
    validates :action, inclusion: { in: %w[approve reject] }
    validates :refund_amount, presence: true, numericality: { greater_than: 0 }, if: -> { action == 'approve' }
    validates :admin_notes, presence: true, if: -> { action == 'reject' }

    private

    def execute
      refund_request = RefundRequest.find(refund_request_id)

      return failure(['Refund request has already been processed']) unless refund_request.pending?

      case action
      when 'approve'
        approve_refund(refund_request)
      when 'reject'
        reject_refund(refund_request)
      end

      refund_request
    end

    def approve_refund(refund_request)
      refund_request.approve!(
        amount: refund_amount,
        admin_notes: admin_notes
      )

      # Создаем уведомление для клиента
      create_refund_notification(refund_request, 'approved')

      # Обновляем статус заказа
      refund_request.order.update!(status: 'cancelled') if should_cancel_order?(refund_request)
    end

    def reject_refund(refund_request)
      refund_request.reject!(admin_notes: admin_notes)

      # Создаем уведомление для клиента
      create_refund_notification(refund_request, 'rejected')
    end

    def create_refund_notification(refund_request, status)
      title = status == 'approved' ? 'Refund Approved' : 'Refund Request Rejected'
      message = if status == 'approved'
                  "Your refund request for \"#{refund_request.order.title}\" has been approved. Amount: #{refund_request.refund_amount}"
                else
                  "Your refund request for \"#{refund_request.order.title}\" has been rejected."
                end

      Notifications::CreateNotificationOperation.call(
        user: refund_request.client,
        notification_type: 'refund_processed',
        title: title,
        message: message,
        metadata: {
          refund_request_id: refund_request.id,
          order_id: refund_request.order.id,
          amount: refund_request.refund_amount
        }
      )
    end

    def should_cancel_order?(refund_request)
      # Отменяем заказ если он просрочен и возврат одобрен
      refund_request.order.overdue? && !refund_request.order.completed?
    end
  end
end
