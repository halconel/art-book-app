# frozen_string_literal: true

json.images do
  @images.each do |image|
    json.set! image.id do
      json.partial! '/api/images/image', image: image
    end
  end
end

json.pagination do
  json.has_more @has_more
  json.after @after
end
