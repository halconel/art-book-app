# frozen_string_literal: true

module Api
  module Admin
    class ResumeController < Api::Admin::BaseController
      before_action :find_resume, only: %i[show update]

      def show
        render json: {
          content: @resume&.content || '',
          updated_at: @resume&.updated_at
        }
      end

      def update
        content = resume_params[:content]

        if @resume
          @resume.update!(content: content)
        else
          @resume = ArtistResume.create!(
            content: content,
            user: current_user
          )
        end

        render json: {
          content: @resume.content,
          updated_at: @resume.updated_at
        }
      end

      private

      def find_resume
        @resume = ArtistResume.find_by(user: current_user)
      end

      def resume_params
        params.require(:resume).permit(:content)
      end
    end
  end
end
