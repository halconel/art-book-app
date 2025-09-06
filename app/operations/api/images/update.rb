# frozen_string_literal: true

module Images
  # Operation for updating an image
  class Update < ApplicationOperation
    def call
      image = Image.find(@params[:id])

      if image.update(image_params)
        response_object(object: image)
      else
        response_object(success: false, errors: image.errors.full_messages)
      end
    rescue ActiveRecord::RecordNotFound
      response_object(success: false, errors: ['Image not found'])
    end

    private

    def image_params
      @params.require(:image).permit(:caption, :img_url, :project_id, :show_on_main_page)
    end
  end
end
