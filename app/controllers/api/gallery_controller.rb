# frozen_string_literal: true

module Api
  class GalleryController < ApplicationController
    ITEMS_PER_PAGE = 24

    def index
      page = (params[:page] || 1).to_i
      search_query = params[:search]
      tag_filter = params[:tags]

      images = Image.visible
                    .featured_first
                    .includes(:project)

      # Apply search filter
      if search_query.present?
        images = images.where('images.title ILIKE ?', "%#{search_query}%")
      end

      # Apply tag filter
      images = images.by_tags(tag_filter) if tag_filter.present?

      # Pagination
      offset = (page - 1) * ITEMS_PER_PAGE
      paginated_images = images.limit(ITEMS_PER_PAGE).offset(offset)

      # Check if there are more images
      has_more = images.limit(ITEMS_PER_PAGE + 1).offset(offset).count > ITEMS_PER_PAGE

      # Get all available tags for filtering
      all_tags = Image.visible.where.not(tags: []).distinct.pluck(:tags).flatten.uniq.compact.sort

      render json: {
        images: paginated_images.map { |image| format_public_image(image) },
        pagination: {
          current_page: page,
          per_page: ITEMS_PER_PAGE,
          has_more: has_more,
          total_count: images.count
        },
        filters: {
          available_tags: all_tags,
          applied_search: search_query,
          applied_tags: tag_filter
        }
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
        url: image.img_url,
        thumbnail_url: image.thumbnail_url,
        alt_text: image.alt_text,
        tags: image.tags,
        is_featured: image.is_featured,
        aspect_ratio: image.aspect_ratio,
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
          result[:dimensions] = image.dimensions if image.dimensions
        end
      end
    end
  end
end
