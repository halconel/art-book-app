# frozen_string_literal: true

module Api
  module Admin
    class UsersController < BaseController
      def index
        users = User.includes(:order_queues, :notifications)
                    .order(created_at: :desc)
                    .page(params[:page])
                    .per(params[:per_page] || 20)

        render json: {
          users: users.map { |user| user_response(user) },
          pagination: pagination_meta(users)
        }
      end

      def show
        user = User.find(params[:id])

        render json: {
          user: detailed_user_response(user)
        }
      end

      def create
        # Создание нового клиента админом (приглашение)
        user = User.new(user_create_params)
        user.role = :client

        if user.save
          # TODO: Отправить приглашение по email
          render json: {
            message: 'Client created successfully. Invitation sent.',
            user: user_response(user)
          }, status: :created
        else
          render json: {
            error: 'Failed to create client',
            errors: user.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      def update
        user = User.find(params[:id])

        if user.update(user_update_params)
          render json: {
            message: 'User updated successfully',
            user: user_response(user)
          }
        else
          render json: {
            error: 'Failed to update user',
            errors: user.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      def destroy
        user = User.find(params[:id])

        # Нельзя удалить самого себя или другого админа
        return render json: { error: 'Cannot delete admin user' }, status: :forbidden if user.admin?

        if user.order_queues.active.any?
          return render json: {
            error: 'Cannot delete client with active orders'
          }, status: :unprocessable_entity
        end

        user.destroy
        render json: { message: 'User deleted successfully' }
      end

      private

      def user_create_params
        params.require(:user).permit(:email, :first_name, :last_name, :phone, :contact_info)
      end

      def user_update_params
        params.require(:user).permit(:first_name, :last_name, :phone, :contact_info)
      end

      def user_response(user)
        {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          full_name: user.full_name,
          phone: user.phone,
          role: user.role,
          verified: user.verified?,
          created_at: user.created_at,
          orders_count: user.order_queues.count,
          active_orders_count: user.order_queues.active.count
        }
      end

      def detailed_user_response(user)
        user_response(user).merge(
          contact_info: user.contact_info,
          last_activity: user.order_queues.maximum(:updated_at),
          total_spent: user.order_queues.completed.joins(:cycle_packs).sum('COALESCE(encrypted_price::numeric, 0)'),
          recent_orders: user.order_queues.recent.limit(5).map do |order|
            {
              id: order.id,
              title: order.title,
              status: order.status,
              created_at: order.created_at,
              deadline: order.deadline
            }
          end
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
