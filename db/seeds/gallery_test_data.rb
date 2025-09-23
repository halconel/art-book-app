# frozen_string_literal: true

# Update existing images with tags and featured status
puts "Updating existing images with tags..."

project = Project.find_by(title: "Beyond Home")

if project
  # Update existing images with relevant tags
  images_data = [
    { title: "Tourism V2", tags: ["futuristic", "travel", "sci-fi", "landscape"], featured: true },
    { title: "Laserscope", tags: ["technology", "sci-fi", "weapon", "detailed"], featured: false },
    { title: "For NoData", tags: ["abstract", "digital", "void", "conceptual"], featured: false },
    { title: "Liminality", tags: ["surreal", "dimensional", "space", "conceptual"], featured: true },
    { title: "Civit", tags: ["urban", "civilization", "nature", "harmony"], featured: false },
    { title: "Out There", tags: ["landscape", "frontier", "exploration", "vast"], featured: false },
    { title: "Drifting", tags: ["space", "cosmic", "solitude", "atmospheric"], featured: true }
  ]

  images_data.each do |image_data|
    image = project.images.find_by(title: image_data[:title])
    if image
      image.update!(
        tags: image_data[:tags],
        is_featured: image_data[:featured]
      )
      puts "Updated #{image.title} with tags: #{image_data[:tags].join(', ')}"
    end
  end
end

# Add some free test images from Unsplash (royalty-free)
puts "Adding additional test images..."

test_images = [
  {
    title: "Digital Landscape",
    description: "A vibrant digital landscape with neon colors and futuristic elements.",
    url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop",
    tags: ["digital", "landscape", "neon", "futuristic"],
    is_featured: false
  },
  {
    title: "Abstract Geometry",
    description: "Abstract geometric patterns in blue and purple tones.",
    url: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop",
    tags: ["abstract", "geometry", "patterns", "blue"],
    is_featured: false
  },
  {
    title: "Cosmic Nebula",
    description: "Beautiful cosmic nebula with stars and colorful gas clouds.",
    url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=600&fit=crop",
    tags: ["space", "nebula", "cosmic", "stars"],
    is_featured: true
  },
  {
    title: "Tech Network",
    description: "Network connections and data visualization in a tech environment.",
    url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop",
    tags: ["technology", "network", "data", "connections"],
    is_featured: false
  },
  {
    title: "Mountain Vista",
    description: "Stunning mountain landscape with dramatic lighting and clouds.",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    tags: ["landscape", "mountains", "nature", "dramatic"],
    is_featured: false
  },
  {
    title: "Urban Night",
    description: "City skyline at night with illuminated buildings and light trails.",
    url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&h=600&fit=crop",
    tags: ["urban", "night", "city", "lights"],
    is_featured: false
  },
  {
    title: "Ocean Waves",
    description: "Powerful ocean waves crashing against rocks under stormy sky.",
    url: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop",
    tags: ["nature", "ocean", "waves", "dramatic"],
    is_featured: false
  },
  {
    title: "Forest Path",
    description: "Misty forest path with sunlight filtering through tall trees.",
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    tags: ["nature", "forest", "path", "misty"],
    is_featured: false
  },
  {
    title: "Retro Synthwave",
    description: "80s retro synthwave aesthetic with neon grids and geometric shapes.",
    url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    tags: ["retro", "synthwave", "80s", "neon"],
    is_featured: true
  },
  {
    title: "Architecture Modern",
    description: "Modern architectural structure with clean lines and geometric design.",
    url: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=600&fit=crop",
    tags: ["architecture", "modern", "geometric", "design"],
    is_featured: false
  }
]

if project
  test_images.each do |image_data|
    image = project.images.create!(
      title: image_data[:title],
      description: image_data[:description],
      img_url: image_data[:url],
      alt_text: image_data[:title],
      tags: image_data[:tags],
      is_featured: image_data[:is_featured],
      show_on_main_page: false,
      width: 800,
      height: 600
    )
    puts "Created #{image.title} with tags: #{image_data[:tags].join(', ')}"
  end
end

puts "Gallery test data updated! Total images: #{Image.count}"
puts "Featured images: #{Image.where(is_featured: true).count}"
puts "Available tags: #{Image.where.not(tags: []).distinct.pluck(:tags).flatten.uniq.sort}"