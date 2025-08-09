# frozen_string_literal: true

module Api
  # API controller for managing images
  class ImagesController < ApplicationController
    def index
      @images = if params[:project_id]
                  Project.find(params[:project_id]).images
                elsif params[:user_id]
                  User.find(params[:user_id]).images
                else
                  Image.all
                end
    end

    def show
      @image = Image.find(params[:id])
    end

    private

    def image_params
      params.require(:image).permit(:img_url, :caption, :project_id, :user_id)
    end
  end
end
