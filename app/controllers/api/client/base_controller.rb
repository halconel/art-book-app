# frozen_string_literal: true

module Api
  module Client
    class BaseController < Api::BaseController
      before_action :authenticate_client!

      private

      def current_client
        current_user
      end

      # Clients can only see their own data
      def scope_to_current_client(relation)
        relation.where(client: current_client)
      end
    end
  end
end
