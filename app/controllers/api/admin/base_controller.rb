# frozen_string_literal: true

module Api
  module Admin
    class BaseController < Api::BaseController
      before_action :authenticate_admin!

      private

      def current_admin
        current_user
      end
    end
  end
end
