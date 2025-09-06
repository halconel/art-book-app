# frozen_string_literal: true

Rails.application.routes.draw do
  root 'static_pages#root'

  namespace :api, defaults: { format: :json } do
    # Auth routes
    namespace :auth do
      post 'login', to: 'sessions#create'
      post 'refresh', to: 'sessions#refresh'
      delete 'logout', to: 'sessions#destroy'
      post 'register', to: 'registrations#create'
      get 'verify/:token', to: 'registrations#verify'
      post 'resend_verification', to: 'registrations#resend_verification'
      get 'me', to: 'me#show'
    end

    # Main pages
    get 'project/beyond-home', to: 'projects#beyond_home'
    get 'artist/atom-sergal', to: 'users#atom_sergal'
    get 'main-page-images', to: 'images#main_page'

    # Projects
    resources :projects, only: [:show]

    # Images
    resources :images, only: [:index, :show, :update]

    # Admin routes
    namespace :admin do
      resources :users, only: [:index, :show, :create, :update, :destroy]
      
      resources :orders, only: [:index, :show, :create, :update, :destroy] do
        member do
          post :create_cycle_pack
        end
      end
      
      resources :projects, only: [:index, :show, :create, :update, :destroy]
      
      resources :images, only: [:index, :show, :create, :update, :destroy] do
        collection do
          patch :bulk_update
        end
        member do
          patch :toggle_main_page
        end
      end
    end

    # Client routes
    namespace :client do
      resources :orders, only: [:index, :show]
      
      resource :workload_calendar, only: [:show]
      
      resources :notifications, only: [:index, :show, :update] do
        collection do
          patch :bulk_update
        end
      end
      
      resources :refund_requests, only: [:index, :show, :create]
    end
  end
end
