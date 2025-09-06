# frozen_string_literal: true

module Images
  # Operation for showing images
  class Index < ApplicationOperation
    def call
      records = Image.order(created_at: :desc)
      records = records.where(project_id: @params[:project_id]) if @params[:project_id]
      records = records.where(show_on_main_page: @params[:show_on_main_page]) if @params[:show_on_main_page]

      paged_response(records:, cursor_column: 'created_at')
    end
  end
end
