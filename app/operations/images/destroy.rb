# frozen_string_literal: true

module Images
  # Operation for destroying an image
  class Destroy < ApplicationOperation
    def call
      image = Image.find(@params[:id])
      image.destroy
      response_object(object: image)
    rescue ActiveRecord::RecordNotFound
      response_object(success: false, errors: ['Image not found'])
    end
  end
end
