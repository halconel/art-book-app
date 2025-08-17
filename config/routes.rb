# frozen_string_literal: true

Rails.application.routes.draw do
  root 'static_pages#root'

  namespace :api, defaults: { format: :json } do
    # Main pages
    get 'project/beyond-home', to: 'projects#beyond_home'
    get 'artist/atom-sergal', to: 'users#atom_sergal'
    get 'gallery', to: 'images#gallery'
    get 'main-page-images', to: 'images#main_page'

    # Auth
    post 'auth/login', to: 'sessions#create'
    post 'auth/refresh', to: 'sessions#refresh'
    delete 'auth/logout', to: 'sessions#destroy'

    # Projects
    resources :projects, only: [:show]

    # Images
    resources :images, only: [:index, :show, :update]

    # Admin functions
    namespace :admin do
      resources :users, only: [:create, :show]
      resources :projects, only: [:update, :create]
      resources :images, only: [:create, :destroy]
    end
  end
end
