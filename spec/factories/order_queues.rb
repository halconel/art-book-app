# frozen_string_literal: true

FactoryBot.define do
  factory :order_queue do
    association :client, factory: :client_user
    title { Faker::Lorem.words(number: 3).join(' ').titleize }
    description { Faker::Lorem.paragraph }
    estimated_cycles { Faker::Number.between(from: 5, to: 20) }
    priority { 'medium' }
    status { 'pending' }
    deadline { Faker::Date.forward(days: 30) }
    created_via { 'admin_panel' }
    price { Faker::Number.between(from: 100, to: 2000) }

    trait :high_priority do
      priority { 'high' }
    end

    trait :urgent do
      priority { 'urgent' }
    end

    trait :in_progress do
      status { 'in_progress' }
    end

    trait :completed do
      status { 'completed' }
    end

    trait :cancelled do
      status { 'cancelled' }
    end

    trait :with_external_ref do
      external_reference { "EXT-#{Faker::Number.number(digits: 6)}" }
    end

    trait :overdue do
      deadline { 1.week.ago }
    end
  end
end
