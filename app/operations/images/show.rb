# frozen_string_literal: true

module Images
  # Operation for showing an image
  class Show < ApplicationOperation
    def call
      image = Image.find(@params[:id])
      response_object(object: image)
    rescue ActiveRecord::RecordNotFound
      response_object(success: false, errors: ['Image not found'])
    end
  end
end
