# frozen_string_literal: true

module Api
  module Auth
    class SessionsController < Api::BaseController
      def create
        user = User.find_by(email: params[:email]&.downcase)

        unless user&.authenticate(params[:password])
          return render json: { error: 'Invalid email or password' }, status: :unauthorized
        end

        unless user.verified?
          return render json: {
            error: 'Account not verified. Please check your email for verification link.',
            verification_required: true
          }, status: :unauthorized
        end

        token = generate_token(user)
        refresh_token = generate_refresh_token(user)

        render json: {
          user: user_response(user),
          token: token,
          refresh_token: refresh_token
        }
      end

      def refresh
        token = extract_token_from_header
        return render_unauthorized('Token missing') unless token

        decoded_token = decode_token(token)
        return render_unauthorized('Invalid token type') unless decoded_token[:type] == 'refresh'

        user = User.find_by(id: decoded_token[:user_id])
        return render_unauthorized('User not found') unless user&.verified?

        new_token = generate_token(user)
        new_refresh_token = generate_refresh_token(user)

        render json: {
          user: user_response(user),
          token: new_token,
          refresh_token: new_refresh_token
        }
      rescue JWT::DecodeError => e
        render_unauthorized("Invalid refresh token: #{e.message}")
      end

      def destroy
        head :no_content
      end

      private

      def user_response(user)
        {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          verified: user.verified?
        }
      end
    end
  end
end
