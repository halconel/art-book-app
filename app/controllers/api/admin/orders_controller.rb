# frozen_string_literal: true

module Api
  module Admin
    class OrdersController < BaseController
      def index
        orders = OrderQueue.includes(:client, :future_arts, :cycle_packs)
                           .by_priority
                           .page(params[:page])
                           .per(params[:per_page] || 20)

        # Фильтры
        orders = orders.where(status: params[:status]) if params[:status].present?
        orders = orders.where(priority: params[:priority]) if params[:priority].present?
        orders = orders.overdue if params[:overdue] == 'true'
        orders = orders.due_soon if params[:due_soon] == 'true'

        render json: {
          orders: orders.map { |order| order_response(order) },
          pagination: pagination_meta(orders),
          filters: {
            statuses: OrderQueue.statuses.keys,
            priorities: OrderQueue.priorities.keys
          }
        }
      end

      def show
        order = OrderQueue.find(params[:id])

        render json: {
          order: detailed_order_response(order)
        }
      end

      def create
        order = OrderQueue.new(order_create_params)

        if order.save
          # Создаем уведомление для клиента
          create_order_notification(order)

          render json: {
            message: 'Order created successfully',
            order: order_response(order)
          }, status: :created
        else
          render json: {
            error: 'Failed to create order',
            errors: order.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      def update
        order = OrderQueue.find(params[:id])

        if order.update(order_update_params)
          render json: {
            message: 'Order updated successfully',
            order: order_response(order)
          }
        else
          render json: {
            error: 'Failed to update order',
            errors: order.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      def destroy
        order = OrderQueue.find(params[:id])

        if order.future_arts.any? || order.cycle_packs.any?
          return render json: {
            error: 'Cannot delete order with associated work'
          }, status: :unprocessable_entity
        end

        order.destroy
        render json: { message: 'Order deleted successfully' }
      end

      # Создание нового пака циклов для заказа
      def create_cycle_pack
        order = OrderQueue.find(params[:id])

        cycle_pack = order.cycle_packs.build(cycle_pack_params)
        cycle_pack.pack_number = (order.cycle_packs.maximum(:pack_number) || 0) + 1

        if cycle_pack.save
          render json: {
            message: 'Cycle pack created successfully',
            cycle_pack: cycle_pack_response(cycle_pack)
          }, status: :created
        else
          render json: {
            error: 'Failed to create cycle pack',
            errors: cycle_pack.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      private

      def order_create_params
        params.require(:order).permit(:client_id, :title, :description, :estimated_cycles,
                                      :priority, :deadline, :created_via, :external_reference,
                                      :price, :metadata)
      end

      def order_update_params
        params.require(:order).permit(:title, :description, :estimated_cycles, :priority,
                                      :status, :deadline, :price, :metadata)
      end

      def cycle_pack_params
        params.require(:cycle_pack).permit(:cycles_in_pack, :notes)
      end

      def order_response(order)
        {
          id: order.id,
          title: order.title,
          description: order.description,
          status: order.status,
          priority: order.priority,
          estimated_cycles: order.estimated_cycles,
          deadline: order.deadline,
          created_via: order.created_via,
          external_reference: order.external_reference,
          created_at: order.created_at,
          overdue: order.overdue?,
          due_soon: order.due_soon?,
          progress_percentage: order.progress_percentage,
          client: {
            id: order.client.id,
            full_name: order.client.full_name,
            email: order.client.email
          },
          cycle_packs_count: order.cycle_packs.count,
          future_arts_count: order.future_arts.count
        }
      end

      def detailed_order_response(order)
        order_response(order).merge(
          price: order.price,
          metadata: order.metadata,
          cycle_packs: order.cycle_packs.by_pack_number.map { |pack| cycle_pack_response(pack) },
          future_arts: order.future_arts.map { |art| future_art_response(art) },
          refund_requests: order.refund_requests.recent.map { |request| refund_request_response(request) }
        )
      end

      def cycle_pack_response(pack)
        {
          id: pack.id,
          pack_number: pack.pack_number,
          cycles_in_pack: pack.cycles_in_pack,
          status: pack.status,
          started_at: pack.started_at,
          completed_at: pack.completed_at,
          duration_in_days: pack.duration_in_days,
          progress_percentage: pack.progress_percentage,
          notes: pack.notes
        }
      end

      def future_art_response(art)
        {
          id: art.id,
          title: art.title,
          description: art.description,
          status: art.status,
          cycles_spent: art.cycles_spent,
          delivery_date: art.delivery_date,
          quality_rating: art.quality_rating,
          preview_image_url: art.preview_image_url,
          overdue: art.overdue?
        }
      end

      def refund_request_response(request)
        {
          id: request.id,
          reason: request.reason,
          status: request.status,
          refund_amount: request.refund_amount,
          requested_at: request.requested_at,
          processed_at: request.processed_at,
          days_since_request: request.days_since_request
        }
      end

      def create_order_notification(order)
        Notification.create!(
          user: order.client,
          notification_type: 'order_created',
          title: 'New Order Created',
          message: "Your order \"#{order.title}\" has been created and added to the queue.",
          metadata: { order_id: order.id }
        )
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
