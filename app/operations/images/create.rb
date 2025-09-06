# frozen_string_literal: true

module Images
  # Operation for creating an image
  class Create < ApplicationOperation
    def call
      image = Image.new(image_params)
      image.project_id = @params[:project_id] if @params[:project_id]

      if image.save
        response_object(object: image)
      else
        response_object(success: false, errors: image.errors.full_messages)
      end
    end

    private

    def image_params
      @params.require(:image).permit(:caption, :img_url, :project_id, :show_on_main_page)
    end
  end
end
