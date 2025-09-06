# frozen_string_literal: true

module Api
  module Auth
    class MeController < ApplicationController
      include JwtAuthenticatable

      before_action :authenticate_user!

      def show
        render json: {
          user: {
            id: current_user.id,
            email: current_user.email,
            role: current_user.role,
            email_verified: current_user.email_verified_at.present?,
            created_at: current_user.created_at
          }
        }
      end
    end
  end
end
