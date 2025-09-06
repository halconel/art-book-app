# frozen_string_literal: true

module Api
  # Base API controller with JWT authentication
  class BaseController < ApplicationController
    include JwtAuthenticatable

    skip_before_action :verify_authenticity_token
  end
end
