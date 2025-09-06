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

    # Public Gallery
    resources :gallery, only: [:index, :show], controller: 'gallery'
    
    # Artist Info (public)
    get 'artist/info', to: 'artist#info'
    get 'artist/resume', to: 'artist#resume'
    get 'artist/stats', to: 'artist#stats'

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
      
      resources :cycle_packs, only: [:index, :show, :update] do
        member do
          patch :start
          patch :complete
        end
      end
      
      resources :workload_calendar, only: [:index, :create, :update, :destroy]
      
      resource :resume, only: [:show, :update]
      
      resources :logs, only: [:index, :show]
    end

    # Client routes
    namespace :client do
      resource :dashboard, only: [:show], controller: 'dashboard', action: 'index'
      
      resources :orders, only: [:index, :show]
      
      resources :workload, only: [:index]
      
      resources :notifications, only: [:index, :show, :update] do
        collection do
          patch :bulk_update
        end
      end
      
      resources :refund_requests, only: [:index, :show, :create]
    end
  end
end
