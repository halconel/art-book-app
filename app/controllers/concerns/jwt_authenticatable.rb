# frozen_string_literal: true

module JwtAuthenticatable
  extend ActiveSupport::Concern

  def authenticate_user!
    token = extract_token_from_header
    return render_unauthorized('Token missing') unless token

    decoded_token = decode_token(token)
    @current_user = User.find_by(id: decoded_token[:user_id])

    return render_unauthorized('Invalid token') unless @current_user

    render_unauthorized('Account not verified') unless @current_user.verified?
  rescue JWT::DecodeError => e
    render_unauthorized("Invalid token: #{e.message}")
  end

  def authenticate_admin!
    authenticate_user!
    return if @current_user&.admin?

    render_forbidden('Admin access required')
  end

  def authenticate_client!
    authenticate_user!
    return if @current_user&.client?

    render_forbidden('Client access required')
  end

  def current_user
    @current_user
  end

  def generate_token(user)
    payload = {
      user_id: user.id,
      role: user.role,
      exp: 24.hours.from_now.to_i
    }

    JWT.encode(payload, jwt_secret, 'HS256')
  end

  def generate_refresh_token(user)
    payload = {
      user_id: user.id,
      type: 'refresh',
      exp: 7.days.from_now.to_i
    }

    JWT.encode(payload, jwt_secret, 'HS256')
  end

  private

  def extract_token_from_header
    auth_header = request.headers['Authorization']
    return nil unless auth_header&.start_with?('Bearer ')

    auth_header.split.last
  end

  def decode_token(token)
    JWT.decode(token, jwt_secret, true, algorithm: 'HS256')[0].with_indifferent_access
  end

  def jwt_secret
    Rails.application.credentials.secret_key_base
  end

  def render_unauthorized(message = 'Unauthorized')
    render json: { error: message }, status: :unauthorized
  end

  def render_forbidden(message = 'Forbidden')
    render json: { error: message }, status: :forbidden
  end
end
