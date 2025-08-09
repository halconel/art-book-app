# frozen_string_literal: true

module Api
  # API controller for managing comments
  class CommentsController < ApplicationController
    def index
      @comments = if params[:project_id]
                    Project.find(params[:project_id]).comments
                  else
                    Comment.all
                  end
    end

    def create
      @comment = Comment.new(comment_params)
      @comment.user_id = current_user.id
      if @comment.save
        render :show
      else
        render json: @comment.errors.full_messages, status: :unprocessable_content
      end
    end

    def destroy
      @comment = Comment.find(params[:id])
      return unless @comment

      @comment.destroy
      render json: @comment
    end

    private

    def comment_params
      params.require(:comment).permit(:body, :project_id)
    end
  end
end
