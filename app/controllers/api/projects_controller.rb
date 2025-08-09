# frozen_string_literal: true

module Api
  # API controller for managing projects
  class ProjectsController < ApplicationController
    def index
      @projects = Project.all
      render :index
    end

    def show
      @project = Project.find(params[:id])
    end

    def create
      @project = Project.new(project_params)

      if @project.save
        render :show
      else
        render json: @project.errors.full_messages, status: :unprocessable_content
      end
    end

    private

    def project_params
      params.require(:project).permit(:title, :description, :thumbnail_url, :user_id)
    end
  end
end
