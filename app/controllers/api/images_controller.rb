# frozen_string_literal: true

module Api
  # API controller for managing images
  class ImagesController < BaseController
    def index
      result = ::Images::Index.call(options: { params: params })

      if result.success?
        @images = result.object.list
        @has_more = result.object.has_more
        @after = result.object.after
        render :index
      else
        render json: { errors: result.errors }, status: :unprocessable_entity
      end
    end

    def show
      result = ::Images::Show.call(options: { params: params })

      if result.success?
        @image = result.object
        render :show
      else
        render json: { errors: result.errors }, status: :not_found
      end
    end

    def create
      result = ::Images::Create.call(options: { params: params })

      if result.success?
        @image = result.object
        render :show
      else
        render json: { errors: result.errors }, status: :unprocessable_entity
      end
    end

    def update
      result = ::Images::Update.call(options: { params: params })

      if result.success?
        @image = result.object
        render :show
      else
        render json: { errors: result.errors }, status: :unprocessable_entity
      end
    end

    def destroy
      result = ::Images::Destroy.call(options: { params: params })

      if result.success?
        render json: result.object
      else
        render json: { errors: result.errors }, status: :unprocessable_entity
      end
    end
  end
end
