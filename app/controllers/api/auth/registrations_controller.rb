# frozen_string_literal: true

module Api
  module Auth
    class RegistrationsController < Api::BaseController
      def create
        user = User.new(registration_params)
        user.role = :client

        if user.save
          # TODO: Send verification email
          render json: {
            message: 'Registration successful. Please check your email for verification link.',
            user: user_response(user)
          }, status: :created
        else
          render json: {
            error: 'Registration failed',
            errors: user.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      def verify
        user = User.find_by(verification_token: params[:token])

        return render json: { error: 'Invalid verification token' }, status: :not_found unless user

        return render json: { message: 'Account already verified' } if user.verified?

        user.verify!

        # Generate tokens for immediate login after verification
        token = generate_token(user)
        refresh_token = generate_refresh_token(user)

        render json: {
          message: 'Account verified successfully',
          user: user_response(user),
          token: token,
          refresh_token: refresh_token
        }
      end

      def resend_verification
        user = User.find_by(email: params[:email]&.downcase)

        return render json: { error: 'User not found' }, status: :not_found unless user

        return render json: { error: 'Account already verified' } if user.verified?

        user.generate_verification_token!
        # TODO: Send verification email

        render json: { message: 'Verification email sent' }
      end

      private

      def registration_params
        params.permit(:email, :password, :password_confirmation, :first_name, :last_name, :phone, :contact_info)
      end

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
