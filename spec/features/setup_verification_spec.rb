# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Feature Testing Setup Verification', :js, type: :feature do
  describe 'Basic infrastructure' do
    scenario 'Capybara and Selenium are working' do
      visit '/'

      # Should be able to visit homepage
      expect(page).to have_css('body')

      # Should be able to interact with page
      expect(page.title).to be_present
    end

    scenario 'FactoryBot factories are working' do
      admin = create(:admin_user)
      client = create(:client_user)
      order = create(:order_queue, client: client)
      pack = create(:cycle_pack, order: order)

      expect(admin).to be_persisted
      expect(admin.role).to eq('admin')
      expect(client.role).to eq('client')
      expect(pack.order.client).to eq(client)
    end

    scenario 'Database cleaning is working between tests' do
      create(:admin_user)
      expect(User.count).to eq(1)

      # This will be cleaned up before next test
    end
  end

  describe 'Helper methods' do
    scenario 'Authentication helpers work' do
      create(:admin_user)

      # This would normally test the actual sign-in process
      # For now, just verify the helper methods exist
      expect(self).to respond_to(:sign_in_as_admin)
      expect(self).to respond_to(:sign_in_as_client)
    end

    scenario 'UI helpers are available' do
      expect(self).to respond_to(:wait_for_react_to_load)
      expect(self).to respond_to(:fill_in_react_field)
      expect(self).to respond_to(:expect_success_notification)
      expect(self).to respond_to(:within_modal)
    end
  end

  describe 'Test files and fixtures' do
    scenario 'Test image file exists and is readable' do
      test_image_path = Rails.root.join('spec', 'fixtures', 'files', 'test_image.png')

      expect(File.exist?(test_image_path)).to be true
      expect(File.size(test_image_path)).to be > 0
    end
  end
end
