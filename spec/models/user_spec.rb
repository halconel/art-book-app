# frozen_string_literal: true

require 'rails_helper'

RSpec.describe User, type: :model do
  example = { username: 'anastassia', email: 'test', password: 'topsecret' }

  describe 'password encryption' do
    it 'does not save passwords to the database' do
      described_class.create!(example)
      user = described_class.find_by(username: 'anastassia')
      expect(user.password).not_to be('topsecret')
    end

    it 'encrypts the password using BCrypt' do
      allow(BCrypt::Password).to receive(:create)
      described_class.new(example)
      expect(BCrypt::Password).to have_received(:create)
    end
  end

  describe 'session token' do
    it 'assigns a session_token if one is not given' do
      anastassia = described_class.create(example)
      expect(anastassia.session_token).not_to be_nil
    end
  end
end
