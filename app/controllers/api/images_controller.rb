# frozen_string_literal: true

module Api
  # API controller for managing images
  class ImagesController < BaseController
    def index
      @images = if params[:project_id]
                  Image.where(project_id: params[:project_id])
                else
                  Image.all
                end
      render :index
    end

    def show
      @image = Image.find(params[:id])
      render :show
    end

    def gallery
      @images = Image.joins(:project).where(projects: { title: 'Beyond Home' })
      render :index
    end

    def main_page
      @images = Image.show_on_main_page.joins(:project).where(projects: { title: 'Beyond Home' })
      render :index
    end

    def create
      @image = Image.new(image_params)
      @image.project_id = params[:project_id] if params[:project_id]

      if @image.save
        render :show
      else
        render json: @image.errors.full_messages, status: :unprocessable_entity
      end
    end

    def update
      @image = Image.find(params[:id])
      if @image.update(image_params)
        render :show
      else
        render json: @image.errors.full_messages, status: :unprocessable_entity
      end
    end

    def destroy
      @image = Image.find(params[:id])
      @image.destroy
      render json: @image
    end

    private

    def image_params
      params.require(:image).permit(:caption, :img_url, :project_id, :show_on_main_page,
                                    :crop_x, :crop_y, :crop_width, :crop_height)
    end
  end
end
