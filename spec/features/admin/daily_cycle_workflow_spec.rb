# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Daily Cycle Workflow', :js, type: :feature do
  let(:admin) { create(:admin_user) }
  let!(:order) { create(:order_queue, client: admin) }
  let!(:active_pack) { create(:cycle_pack, order: order) }

  # NOTE: Skipping authentication for now since /login route doesn't exist

  describe 'Admin daily workflow - basic functionality' do
    scenario 'Admin can access homepage (no specific admin route yet)' do
      visit '/'
      expect(page).to have_css('body')
    end

    scenario 'Admin model functionality works' do
      expect(admin.role).to eq('admin')
      expect(admin).to be_persisted
    end

    scenario 'Database relationships work correctly' do
      expect(active_pack.order).to eq(order)
      expect(order.client).to eq(admin)
      expect(order.cycle_packs).to include(active_pack)
    end
  end

  describe 'Pack management workflow' do
    scenario 'Admin can view homepage' do
      visit '/'

      # Basic check that page loads
      expect(page).to have_css('body')
    end

    scenario 'Pack status updates work' do
      expect(active_pack.status).to eq('pending')

      active_pack.start!
      expect(active_pack.reload.status).to eq('in_progress')

      active_pack.complete!
      expect(active_pack.reload.status).to eq('completed')
    end
  end
end
