# frozen_string_literal: true

module Api
  class GalleryController < ApplicationController
    # Public endpoint - no authentication required
    skip_before_action :authenticate_user!, only: %i[index show]

    def index
      images = Image.visible
                    .featured_first
                    .includes(:project)
                    .limit(100)

      render json: {
        images: images.map { |image| format_public_image(image) }
      }
    end

    def show
      image = Image.visible.find(params[:id])
      render json: {
        image: format_public_image(image, include_details: true)
      }
    end

    private

    def format_public_image(image, include_details: false)
      {
        id: image.id,
        title: image.title,
        description: image.description,
        url: image.url,
        thumbnail_url: image.thumbnail_url,
        alt_text: image.alt_text,
        tags: image.tags || [],
        is_featured: image.is_featured,
        created_at: image.created_at,
        project: if image.project
                   {
                     id: image.project.id,
                     title: image.project.title
                   }
                 end
      }.tap do |result|
        if include_details
          result[:metadata] = image.metadata
          if image.width && image.height
            result[:dimensions] = {
              width: image.width,
              height: image.height
            }
          end
        end
      end
    end
  end
end
