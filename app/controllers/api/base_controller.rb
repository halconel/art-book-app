# frozen_string_literal: true

module Api
  class BaseController < ApplicationController
    include JwtAuthenticatable

    # Отключаем CSRF для API
    skip_before_action :verify_authenticity_token

    # Устанавливаем JSON формат по умолчанию
    before_action :set_default_response_format

    # Обработка ошибок
    rescue_from ActiveRecord::RecordNotFound, with: :render_not_found
    rescue_from ActiveRecord::RecordInvalid, with: :render_unprocessable_entity
    rescue_from ActionController::ParameterMissing, with: :render_bad_request

    private

    def set_default_response_format
      request.format = :json
    end

    def render_not_found(exception = nil)
      render json: {
        error: 'Resource not found',
        message: exception&.message
      }, status: :not_found
    end

    def render_unprocessable_entity(exception)
      render json: {
        error: 'Validation failed',
        errors: exception.record.errors.full_messages
      }, status: :unprocessable_entity
    end

    def render_bad_request(exception)
      render json: {
        error: 'Bad request',
        message: exception.message
      }, status: :bad_request
    end
  end
end
