# frozen_string_literal: true

FactoryBot.define do
  factory :notification do
    association :user, factory: :client_user
    title { Faker::Lorem.words(number: 4).join(' ').titleize }
    message { Faker::Lorem.paragraph }
    notification_type { 'info' }
    read { false }
    sent_at { Time.current }

    trait :order_created do
      notification_type { 'order_created' }
      title { 'New Order Created' }
      message { 'Your order has been created and added to the queue.' }
    end

    trait :order_started do
      notification_type { 'order_started' }
      title { 'Work Started on Your Order' }
      message { 'The artist has started working on your commission.' }
    end

    trait :order_completed do
      notification_type { 'order_completed' }
      title { 'Order Completed' }
      message { 'Your commission has been completed!' }
    end

    trait :order_cancelled do
      notification_type { 'order_cancelled' }
      title { 'Order Cancelled' }
      message { 'Your order has been cancelled.' }
    end

    trait :read do
      read { true }
      read_at { Time.current }
    end

    trait :email_sent do
      email_sent { true }
      email_sent_at { Time.current }
    end
  end
end
