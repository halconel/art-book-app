# frozen_string_literal: true

module Api
  # API controller for managing projects
  class ProjectsController < BaseController
    def index
      @projects = Project.all
      render :index
    end

    def show
      @project = Project.find(params[:id])
      render :show
    end

    def beyond_home
      @project = Project.find_by(title: 'Beyond Home')
      if @project
        render :show
      else
        render json: { error: 'Beyond Home project not found' }, status: :not_found
      end
    end

    def create
      @project = Project.new(project_params)
      @project.user_id = current_user.id if current_user

      if @project.save
        render :show
      else
        render json: @project.errors.full_messages, status: :unprocessable_entity
      end
    end

    private

    def project_params
      params.require(:project).permit(:title, :description, :thumbnail_url)
    end
  end
end
