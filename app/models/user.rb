# frozen_string_literal: true

# User model for the Beyond Home application
class User < ApplicationRecord
  validates :username, :password_digest, :session_token, presence: true
  validates :username, uniqueness: true
  validates :password, length: { minimum: 8 }, allow_nil: true

  has_many :projects, dependent: :destroy

  has_many :likes, dependent: :destroy
  has_many :liked_projects, through: :likes, source: :project

  has_many :images, through: :projects, source: :images
  has_many :comments, dependent: :destroy

  attr_reader :password

  after_initialize :ensure_session_token
  before_validation :ensure_session_token_uniqueness

  def self.find_by_credentials(username, password)
    user = User.find_by(username: username)
    return nil unless user

    user.password?(password) ? user : nil
  end

  def password?(password)
    BCrypt::Password.new(password_digest).is_password?(password)
  end

  def password=(password)
    @password = password
    self.password_digest = BCrypt::Password.create(password)
  end

  def reset_session_token!
    self.session_token = new_session_token
    ensure_session_token_uniqueness
    save
    session_token
  end

  private

  def ensure_session_token
    self.session_token ||= new_session_token
  end

  def new_session_token
    SecureRandom.base64
  end

  def ensure_session_token_uniqueness
    self.session_token = new_session_token while User.find_by(session_token: self.session_token)
  end
end
