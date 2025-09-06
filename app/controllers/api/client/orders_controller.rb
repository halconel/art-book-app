# frozen_string_literal: true

module Api
  module Client
    class OrdersController < BaseController
      def index
        orders = scope_to_current_client(OrderQueue)
                 .includes(:future_arts, :cycle_packs, :refund_requests)
                 .order(created_at: :desc)
                 .page(params[:page])
                 .per(params[:per_page] || 10)

        # Фильтры для клиента
        orders = orders.where(status: params[:status]) if params[:status].present?
        orders = orders.overdue if params[:overdue] == 'true'
        orders = orders.due_soon if params[:due_soon] == 'true'

        render json: {
          orders: orders.map { |order| client_order_response(order) },
          pagination: pagination_meta(orders),
          summary: orders_summary
        }
      end

      def show
        order = scope_to_current_client(OrderQueue).find(params[:id])

        render json: {
          order: detailed_client_order_response(order)
        }
      end

      private

      def client_order_response(order)
        {
          id: order.id,
          title: order.title,
          description: order.description,
          status: order.status,
          priority: order.priority,
          estimated_cycles: order.estimated_cycles,
          deadline: order.deadline,
          created_at: order.created_at,
          overdue: order.overdue?,
          due_soon: order.due_soon?,
          progress_percentage: order.progress_percentage,
          cycle_packs_completed: order.cycle_packs.completed.count,
          cycle_packs_total: order.cycle_packs.count,
          future_arts_count: order.future_arts.count,
          can_request_refund: order.can_request_refund?,
          # НЕ показываем цену и внутренние детали клиенту
          external_reference: order.external_reference
        }
      end

      def detailed_client_order_response(order)
        client_order_response(order).merge(
          cycle_packs: order.cycle_packs.by_pack_number.map { |pack| client_cycle_pack_response(pack) },
          future_arts: order.future_arts.map { |art| client_future_art_response(art) },
          refund_requests: order.refund_requests.recent.map { |request| client_refund_request_response(request) }
        )
      end

      def client_cycle_pack_response(pack)
        {
          id: pack.id,
          pack_number: pack.pack_number,
          cycles_in_pack: pack.cycles_in_pack,
          status: pack.status,
          started_at: pack.started_at,
          completed_at: pack.completed_at,
          duration_in_days: pack.duration_in_days,
          progress_percentage: pack.progress_percentage
          # НЕ показываем внутренние заметки
        }
      end

      def client_future_art_response(art)
        {
          id: art.id,
          title: art.title,
          description: art.description,
          status: art.status,
          cycles_spent: art.cycles_spent,
          delivery_date: art.delivery_date,
          quality_rating: art.quality_rating,
          preview_image_url: art.preview_image_url,
          overdue: art.overdue?,
          client_feedback: art.client_feedback,
          ready_for_review: art.ready_for_client?
        }
      end

      def client_refund_request_response(request)
        {
          id: request.id,
          reason: request.reason,
          status: request.status,
          refund_amount: request.refund_amount,
          requested_at: request.requested_at,
          processed_at: request.processed_at,
          days_since_request: request.days_since_request
          # НЕ показываем admin_notes
        }
      end

      def orders_summary
        user_orders = scope_to_current_client(OrderQueue)
        {
          total_orders: user_orders.count,
          active_orders: user_orders.active.count,
          completed_orders: user_orders.completed.count,
          overdue_orders: user_orders.overdue.count
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
