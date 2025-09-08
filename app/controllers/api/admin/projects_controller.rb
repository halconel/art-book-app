# frozen_string_literal: true

module Api
  module Admin
    class ProjectsController < BaseController
      def index
        projects = Project.includes(:user, :cycle_pack, :images)
                          .order(updated_at: :desc)
                          .page(params[:page])
                          .per(params[:per_page] || 20)

        # Фильтры
        projects = projects.where(status: params[:status]) if params[:status].present?
        projects = projects.personal if params[:type] == 'personal'
        projects = projects.client_work if params[:type] == 'client'

        render json: {
          projects: projects.map { |project| project_response(project) },
          pagination: pagination_meta(projects),
          total_count: projects.total_count,
          filters: {
            statuses: Project.statuses.keys,
            types: %w[personal client]
          }
        }
      end

      def show
        project = Project.find(params[:id])

        render json: {
          project: detailed_project_response(project)
        }
      end

      def create
        project = Project.new(project_create_params)
        project.user = current_admin

        if project.save
          render json: {
            message: 'Project created successfully',
            project: project_response(project)
          }, status: :created
        else
          render json: {
            error: 'Failed to create project',
            errors: project.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      def update
        project = Project.find(params[:id])

        if project.update(project_update_params)
          render json: {
            message: 'Project updated successfully',
            project: project_response(project)
          }
        else
          render json: {
            error: 'Failed to update project',
            errors: project.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      def destroy
        project = Project.find(params[:id])

        if project.images.any?
          return render json: {
            error: 'Cannot delete project with associated images. Delete images first.'
          }, status: :unprocessable_entity
        end

        project.destroy
        render json: { message: 'Project deleted successfully' }
      end

      private

      def project_create_params
        params.require(:project).permit(:title, :description, :thumbnail_url,
                                        :status, :is_personal, :cycle_pack_id)
      end

      def project_update_params
        params.require(:project).permit(:title, :description, :thumbnail_url,
                                        :status, :is_personal)
      end

      def project_response(project)
        {
          id: project.id,
          title: project.title,
          description: project.description,
          thumbnail_url: project.thumbnail_url,
          status: project.status,
          is_personal: project.is_personal,
          created_at: project.created_at,
          updated_at: project.updated_at,
          images_count: project.images.count,
          main_page_images_count: project.images.where(show_on_main_page: true).count,
          client_info: project.client_project? ? client_project_info(project) : nil
        }
      end

      def detailed_project_response(project)
        project_response(project).merge(
          images: project.images.map { |image| image_response(image) },
          cycle_pack: project.cycle_pack ? cycle_pack_info(project.cycle_pack) : nil
        )
      end

      def client_project_info(project)
        return nil unless project.client_project? && project.cycle_pack

        {
          client_name: project.client&.full_name,
          order_title: project.order&.title,
          pack_number: project.cycle_pack.pack_number,
          deadline: project.order&.deadline
        }
      end

      def cycle_pack_info(pack)
        {
          id: pack.id,
          pack_number: pack.pack_number,
          status: pack.status,
          cycles_in_pack: pack.cycles_in_pack,
          order_title: pack.order.title,
          client_name: pack.client.full_name
        }
      end

      def image_response(image)
        {
          id: image.id,
          img_url: image.img_url,
          caption: image.caption,
          title: image.title,
          description: image.description,
          show_on_main_page: image.show_on_main_page,
          width: image.width,
          height: image.height,
          file_size: image.file_size,
          created_at: image.created_at
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
