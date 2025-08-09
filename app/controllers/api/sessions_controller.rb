# frozen_string_literal: true

module Api
  # API controller for managing sessions
  class SessionsController < ApplicationController
    def create
      @user = User.find_by_credentials(
        params[:user][:username],
        params[:user][:password]
      )

      if @user
        login(@user)
        render 'api/users/show'
      else
        render(json: ['Invalid username/password combination'], status: :unauthorized)
      end
    end

    def destroy
      @user = current_user
      if @user
        logout
        render 'api/users/show'
      else
        render(json: ['Nobody signed in'], status: :not_found)
      end
    end
  end
end
