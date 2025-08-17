# frozen_string_literal: true

# JWT authentication concern for API controllers
module JwtAuthenticatable
  extend ActiveSupport::Concern

  def authenticate_user!
    token = extract_token_from_header
    @current_user = User.find_by(id: decode_token(token)[:user_id])
  rescue JWT::DecodeError
    render json: { error: 'Invalid token' }, status: :unauthorized
  end

  def authenticate_admin!
    authenticate_user!
    return if @current_user.admin?

    render json: { error: 'Admin access required' }, status: :forbidden
  end

  def current_user
    @current_user
  end

  private

  def extract_token_from_header
    request.headers['Authorization']&.split&.last
  end

  def decode_token(token)
    JWT.decode(
      token,
      Rails.application.secrets.secret_key_base,
      true,
      algorithm: 'HS256'
    )[0]
  end
end
