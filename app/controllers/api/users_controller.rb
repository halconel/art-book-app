# frozen_string_literal: true

module Api
  # API controller for managing users
  class UsersController < ApplicationController
    def show
      @user = User.find(params[:id])
    end

    def create
      @user = User.new(user_params)
      if @user.save
        login(@user)
        render 'api/users/show'
      else
        render json: @user.errors.full_messages, status: :unprocessable_content
      end
    end

    private

    def user_params
      params.require(:user).permit(:username, :password, :email)
    end
  end
end
