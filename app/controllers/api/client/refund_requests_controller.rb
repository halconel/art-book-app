# frozen_string_literal: true

module Api
  module Client
    class RefundRequestsController < BaseController
      def index
        refund_requests = RefundRequest.joins(:order)
                                       .where(order_queues: { client: current_client })
                                       .recent
                                       .page(params[:page])
                                       .per(params[:per_page] || 10)

        render json: {
          refund_requests: refund_requests.map { |request| refund_request_response(request) },
          pagination: pagination_meta(refund_requests)
        }
      end

      def show
        refund_request = RefundRequest.joins(:order)
                                      .where(order_queues: { client: current_client })
                                      .find(params[:id])

        render json: {
          refund_request: detailed_refund_request_response(refund_request)
        }
      end

      def create
        order = scope_to_current_client(OrderQueue).find(params[:order_id])

        unless order.can_request_refund?
          return render json: {
            error: 'Refund cannot be requested for this order',
            reasons: refund_unavailable_reasons(order)
          }, status: :unprocessable_entity
        end

        refund_request = order.refund_requests.build(refund_request_params)
        refund_request.requested_at = Time.current

        if refund_request.save
          # Создаем уведомление для админа
          create_admin_notification(refund_request)

          render json: {
            message: 'Refund request submitted successfully',
            refund_request: refund_request_response(refund_request)
          }, status: :created
        else
          render json: {
            error: 'Failed to create refund request',
            errors: refund_request.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      private

      def refund_request_params
        params.require(:refund_request).permit(:reason)
      end

      def refund_request_response(request)
        {
          id: request.id,
          reason: request.reason,
          status: request.status,
          refund_amount: request.refund_amount,
          requested_at: request.requested_at,
          processed_at: request.processed_at,
          days_since_request: request.days_since_request,
          order: {
            id: request.order.id,
            title: request.order.title,
            deadline: request.order.deadline,
            overdue: request.order.overdue?
          }
        }
      end

      def detailed_refund_request_response(request)
        refund_request_response(request).merge(
          order_details: {
            id: request.order.id,
            title: request.order.title,
            description: request.order.description,
            status: request.order.status,
            deadline: request.order.deadline,
            created_at: request.order.created_at,
            progress_percentage: request.order.progress_percentage
          }
        )
      end

      def refund_unavailable_reasons(order)
        reasons = []
        reasons << 'Order is already completed' if order.completed?
        reasons << 'Order is not overdue' unless order.overdue?
        reasons << 'Another refund request is pending' if order.refund_requests.pending.any?
        reasons
      end

      def create_admin_notification(refund_request)
        # Находим админов и создаем уведомления
        User.admins.each do |admin|
          Notification.create!(
            user: admin,
            notification_type: 'refund_requested',
            title: 'New Refund Request',
            message: "Client #{refund_request.client.full_name} requested refund for \"#{refund_request.order.title}\"",
            metadata: {
              refund_request_id: refund_request.id,
              order_id: refund_request.order.id,
              client_id: refund_request.client.id
            }
          )
        end
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
