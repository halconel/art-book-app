# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    email { Faker::Internet.unique.email }
    password { 'password123' }
    password_confirmation { 'password123' }
    role { 'client' }
    verified_at { Time.current }
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }

    trait :admin do
      role { 'admin' }
    end

    trait :client do
      role { 'client' }
      contact_info { Faker::Lorem.sentence }
    end

    trait :unverified do
      verified_at { nil }
    end

    factory :admin_user, traits: [:admin]
    factory :client_user, traits: [:client]
  end
end
