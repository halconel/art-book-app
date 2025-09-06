# frozen_string_literal: true

module Api
  module Admin
    class CyclePacksController < BaseController
      def index
        cycle_packs = CyclePack.includes(:order, :projects)
        cycle_packs = cycle_packs.where(status: params[:status]) if params[:status].present?
        cycle_packs = cycle_packs.page(params[:page]).per(params[:per_page] || 20)

        render json: {
          cycle_packs: cycle_packs.map(&method(:cycle_pack_response)),
          current_page: cycle_packs.current_page,
          total_pages: cycle_packs.total_pages,
          total_count: cycle_packs.total_count
        }
      end

      def show
        cycle_pack = CyclePack.includes(:order, :projects).find(params[:id])
        render json: cycle_pack_response(cycle_pack)
      end

      def update
        cycle_pack = CyclePack.find(params[:id])

        if cycle_pack.update(cycle_pack_params)
          render json: cycle_pack_response(cycle_pack)
        else
          render json: { errors: cycle_pack.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def start
        cycle_pack = CyclePack.find(params[:id])

        if cycle_pack.pending?
          cycle_pack.start!
          render json: cycle_pack_response(cycle_pack)
        else
          render json: { error: 'Cycle pack is not in pending status' }, status: :unprocessable_entity
        end
      end

      def complete
        cycle_pack = CyclePack.find(params[:id])

        if cycle_pack.in_progress?
          result = Orders::CompleteCyclePackOperation.call(
            cycle_pack_id: cycle_pack.id,
            admin_user: current_user,
            notes: params[:notes],
            cycles_actually_completed: params[:cycles_actually_completed]
          )

          if result.success?
            render json: cycle_pack_response(result.result)
          else
            render json: { errors: result.errors }, status: :unprocessable_entity
          end
        else
          render json: { error: 'Cycle pack is not in progress' }, status: :unprocessable_entity
        end
      end

      private

      def cycle_pack_params
        params.require(:cycle_pack).permit(:cycles_in_pack, :notes, :status)
      end

      def cycle_pack_response(pack)
        {
          id: pack.id,
          pack_number: pack.pack_number,
          cycles_in_pack: pack.cycles_in_pack,
          status: pack.status,
          started_at: pack.started_at,
          completed_at: pack.completed_at,
          notes: pack.notes,
          duration_in_days: pack.duration_in_days,
          progress_percentage: pack.progress_percentage,
          order: if pack.order
                   {
                     id: pack.order.id,
                     title: pack.order.title,
                     client_email: pack.client.email
                   }
                 end,
          projects_count: pack.projects.count,
          created_at: pack.created_at,
          updated_at: pack.updated_at
        }
      end
    end
  end
end
