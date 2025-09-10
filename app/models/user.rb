# frozen_string_literal: true

class User < ApplicationRecord
  has_secure_password

  enum :role, { client: 0, admin: 1 }

  has_many :notifications, dependent: :destroy
  has_many :projects, dependent: :nullify
  has_many :order_queues, foreign_key: :client_id, dependent: :destroy, inverse_of: :client

  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :first_name, :last_name, presence: true
  validates :phone, format: { with: /\A[\+]?[\d\s\-\(\)]+\z/ }, allow_blank: true
  validates :role, presence: true

  before_create :generate_verification_token

  attr_encrypted :contact_info,
                 key: ENV['ENCRYPTION_KEY'] || 'default_key_for_development_only_123',
                 algorithm: 'aes-256-gcm'

  scope :verified, -> { where.not(verified_at: nil) }
  scope :unverified, -> { where(verified_at: nil) }
  scope :admins, -> { where(role: :admin) }
  scope :clients, -> { where(role: :client) }

  def verified?
    verified_at.present?
  end

  def full_name
    "#{first_name} #{last_name}".strip
  end

  def verify!
    update!(verified_at: Time.current, verification_token: nil)
  end

  def generate_reset_password_token!
    self.reset_password_token = SecureRandom.urlsafe_base64
    self.reset_password_sent_at = Time.current
    save!
  end

  def password_reset_expired?
    reset_password_sent_at < 2.hours.ago
  end

  def generate_verification_token!
    self.verification_token = SecureRandom.urlsafe_base64
    save!
  end

  private

  def generate_verification_token
    self.verification_token = SecureRandom.urlsafe_base64
  end
end
