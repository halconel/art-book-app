class Api::ArtistController < ApplicationController
  # Public endpoints - no authentication required
  skip_before_action :authenticate_user!, only: [:info, :resume, :stats]

  def info
    # Return basic artist information
    admin_user = User.admins.first
    
    render json: {
      artist: {
        name: admin_user&.display_name || 'Digital Artist',
        title: 'Professional Digital Artist',
        bio: 'Passionate about bringing imagination to life through digital art and creative storytelling.',
        avatar: admin_user&.avatar_url,
        location: 'Creative Studio',
        social: {
          email: admin_user&.email,
          website: 'https://artist-portfolio.com',
          instagram: '@digitalartist',
          twitter: '@digitalartist'
        }
      }
    }
  end

  def resume
    resume = ArtistResume.joins(:user).where(users: { role: 'admin' }).first
    
    render json: {
      content: resume&.content || default_resume_content,
      updated_at: resume&.updated_at
    }
  end

  def stats
    # Calculate public statistics
    stats = {
      totalArtworks: Image.visible.count,
      yearsExperience: calculate_years_experience,
      clientProjects: FutureArt.where(art_type: 'commission', status: 'completed').count,
      awards: 12 # This could be stored in a separate model
    }

    render json: { stats: stats }
  end

  private

  def calculate_years_experience
    admin_user = User.admins.first
    return 5 unless admin_user&.created_at
    
    ((Time.current - admin_user.created_at) / 1.year).to_i
  end

  def default_resume_content
    <<~MARKDOWN
      # Professional Digital Artist

      ## About Me
      I'm a passionate digital artist specializing in character design, concept art, and digital illustration. With years of experience in the creative industry, I bring stories to life through compelling visuals.

      ## Skills & Expertise
      - **Digital Illustration** - Advanced proficiency in industry-standard software
      - **Character Design** - Creating memorable and unique characters
      - **Concept Art** - Environmental and prop design for games and media
      - **3D Modeling** - Basic to intermediate 3D artwork

      ## Services
      - Custom character commissions
      - Concept art for games and media
      - Digital portraits and illustrations
      - Logo and brand design

      ## Philosophy
      Every piece of art tells a story. My goal is to create visuals that not only look beautiful but also convey emotion and meaning.

      ---
      *Ready to bring your vision to life? Let's create something amazing together.*
    MARKDOWN
  end
end