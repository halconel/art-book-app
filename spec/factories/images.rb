# frozen_string_literal: true

FactoryBot.define do
  factory :image do
    title { 'Test Artwork' }
    description { 'Digital Illustration' }
    width { 1920 }
    height { 1080 }
    file_size { 8_650_000 } # 8.65 MB in bytes
    img_url { 'https://picsum.photos/1920/1080?random=1' }
    show_on_main_page { true }

    association :project

    trait :large_file do
      width { 2560 }
      height { 1440 }
      file_size { 12_000_000 } # 12 MB
      title { 'Second Artwork' }
      description { 'Another Illustration' }
      img_url { 'https://picsum.photos/2560/1440?random=2' }
    end
  end
end
