# frozen_string_literal: true

FactoryBot.define do
  factory :project do
    title { 'Test Project' }
    description { 'Test Description' }
    thumbnail_url { 'https://picsum.photos/300/200?random=0' }
  end
end
