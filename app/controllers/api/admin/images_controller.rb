# frozen_string_literal: true

module Api
  module Admin
    class ImagesController < BaseController
      def index
        images = Image.includes(:project)
                      .order(created_at: :desc)
                      .page(params[:page])
                      .per(params[:per_page] || 20)

        # Фильтры
        images = images.where(project_id: params[:project_id]) if params[:project_id].present?
        images = images.where(show_on_main_page: true) if params[:main_page] == 'true'

        render json: {
          images: images.map { |image| image_response(image) },
          pagination: pagination_meta(images)
        }
      end

      def show
        image = Image.find(params[:id])

        render json: {
          image: detailed_image_response(image)
        }
      end

      def create
        image = Image.new(image_create_params)

        if image.save
          render json: {
            message: 'Image created successfully',
            image: image_response(image)
          }, status: :created
        else
          render json: {
            error: 'Failed to create image',
            errors: image.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      def update
        image = Image.find(params[:id])

        if image.update(image_update_params)
          render json: {
            message: 'Image updated successfully',
            image: image_response(image)
          }
        else
          render json: {
            error: 'Failed to update image',
            errors: image.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      def destroy
        image = Image.find(params[:id])
        image.destroy

        render json: { message: 'Image deleted successfully' }
      end

      # Bulk operations
      def bulk_update
        image_ids = params[:image_ids] || []
        updates = params[:updates] || {}

        return render json: { error: 'No images selected' }, status: :bad_request if image_ids.empty?

        images = Image.where(id: image_ids)

        begin
          images.update_all(filter_bulk_updates(updates))

          render json: {
            message: "#{images.count} images updated successfully",
            updated_count: images.count
          }
        rescue StandardError => e
          render json: {
            error: 'Bulk update failed',
            message: e.message
          }, status: :unprocessable_entity
        end
      end

      def toggle_main_page
        image = Image.find(params[:id])
        image.update!(show_on_main_page: !image.show_on_main_page)

        render json: {
          message: image.show_on_main_page ? 'Added to main page' : 'Removed from main page',
          image: image_response(image)
        }
      end

      private

      def image_create_params
        params.require(:image).permit(:project_id, :img_url, :caption, :title,
                                      :description, :show_on_main_page, :width,
                                      :height, :file_size)
      end

      def image_update_params
        params.require(:image).permit(:img_url, :caption, :title, :description,
                                      :show_on_main_page, :width, :height, :file_size)
      end

      def filter_bulk_updates(updates)
        allowed_fields = %w[show_on_main_page caption title description]
        updates.slice(*allowed_fields)
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
          created_at: image.created_at,
          updated_at: image.updated_at,
          project: {
            id: image.project.id,
            title: image.project.title,
            is_personal: image.project.is_personal
          }
        }
      end

      def detailed_image_response(image)
        image_response(image).merge(
          project_details: {
            id: image.project.id,
            title: image.project.title,
            description: image.project.description,
            status: image.project.status,
            is_personal: image.project.is_personal,
            client_name: image.project.client&.full_name
          }
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
