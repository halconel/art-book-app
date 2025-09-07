# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Minimal Feature Tests', type: :feature do
  describe 'Basic homepage functionality', js: false do
    scenario 'Homepage loads without errors' do
      visit '/'
      expect(page).to have_css('body')
    end
  end

  describe 'Database and factory functionality' do
    scenario 'User factories work correctly' do
      admin = create(:admin_user)
      client = create(:client_user)

      expect(admin.role).to eq('admin')
      expect(client.role).to eq('client')
      expect(admin).to be_persisted
      expect(client).to be_persisted
    end

    scenario 'Order queue factory works correctly' do
      client = create(:client_user)
      order = create(:order_queue, client: client)

      expect(order.client).to eq(client)
      expect(order).to be_persisted
      expect(order.status).to eq('pending')
    end

    scenario 'Cycle pack factory works correctly' do
      client = create(:client_user)
      order = create(:order_queue, client: client)
      pack = create(:cycle_pack, order: order)

      expect(pack.order).to eq(order)
      expect(pack).to be_persisted
      expect(pack.status).to eq('pending')
    end

    scenario 'Future art factory works correctly' do
      client = create(:client_user)
      order = create(:order_queue, client: client)
      art = create(:future_art, order: order)

      expect(art.order).to eq(order)
      expect(art).to be_persisted
      expect(art.status).to eq('draft')
    end

    scenario 'Model relationships work correctly' do
      client = create(:client_user)
      order = create(:order_queue, client: client)
      pack = create(:cycle_pack, order: order)
      art = create(:future_art, order: order)

      # Test relationships
      expect(order.client).to eq(client)
      expect(order.cycle_packs).to include(pack)
      expect(order.future_arts).to include(art)
      expect(pack.client).to eq(client)
    end
  end

  describe 'Model business logic' do
    scenario 'Cycle pack status transitions work' do
      client = create(:client_user)
      order = create(:order_queue, client: client)
      pack = create(:cycle_pack, order: order)

      expect(pack.status).to eq('pending')

      pack.start!
      expect(pack.status).to eq('in_progress')

      pack.complete!
      expect(pack.status).to eq('completed')
    end

    scenario 'Order queue with different statuses' do
      client = create(:client_user)
      order1 = create(:order_queue, client: client, status: 'pending')
      order2 = create(:order_queue, client: client, status: 'in_progress')

      expect(order1.status).to eq('pending')
      expect(order2.status).to eq('in_progress')
    end
  end
end
