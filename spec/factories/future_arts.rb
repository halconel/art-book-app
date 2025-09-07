# frozen_string_literal: true

FactoryBot.define do
  factory :future_art do
    association :order, factory: :order_queue
    title { Faker::Lorem.words(number: 3).join(' ').titleize }
    description { Faker::Lorem.paragraph }
    status { 'draft' }
    cycles_spent { 0 }
    delivery_date { Faker::Date.forward(days: 30) }

    trait :in_progress do
      status { 'in_progress' }
      started_at { Time.current }
      cycles_spent { Faker::Number.between(from: 1, to: 5) }
    end

    trait :ready_for_review do
      status { 'ready_for_review' }
      cycles_spent { Faker::Number.between(from: 3, to: 8) }
    end

    trait :approved do
      status { 'approved' }
      completed_at { Time.current }
      cycles_spent { Faker::Number.between(from: 5, to: 15) }
      quality_rating { Faker::Number.between(from: 3, to: 5) }
    end

    trait :delivered do
      status { 'delivered' }
      completed_at { Time.current }
      cycles_spent { Faker::Number.between(from: 5, to: 15) }
      quality_rating { Faker::Number.between(from: 4, to: 5) }
    end

    trait :needs_revision do
      status { 'revision_requested' }
      client_feedback { Faker::Lorem.paragraph }
    end

    trait :overdue do
      delivery_date { 1.week.ago }
    end
  end
end
