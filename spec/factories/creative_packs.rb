# frozen_string_literal: true

FactoryBot.define do
  factory :cycle_pack do
    association :order, factory: :order_queue
    pack_number { Faker::Number.between(from: 1, to: 10) }
    cycles_in_pack { 14 }
    status { 'pending' }
    started_at { Time.current }

    trait :completed do
      status { 'completed' }
      completed_at { 14.days.from_now }
    end

    trait :in_progress do
      status { 'in_progress' }
      started_at { Time.current }
    end

    trait :with_notes do
      notes { Faker::Lorem.paragraph }
    end
  end
end
