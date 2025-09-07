# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Simplified Feature Tests', :js, type: :feature do
  let(:admin) { create(:admin_user) }
  let(:client) { create(:client_user) }

  describe 'Admin workflows' do
    before { sign_in_as_admin(admin) }

    scenario 'Admin can access dashboard' do
      visit '/admin'
      expect(page.status_code).to eq(200)
      expect(page).to have_css('body')
    end

    scenario 'Daily cycle workflow - data relationships work' do
      order = create(:order_queue, client: client)
      pack = create(:cycle_pack, order: order)

      expect(pack.order).to eq(order)
      expect(order.client).to eq(client)
      expect(pack.status).to eq('pending')

      pack.start!
      expect(pack.status).to eq('in_progress')
    end

    scenario 'Order acceptance - basic functionality' do
      order = create(:order_queue, client: client, status: 'pending')

      expect(order.client).to eq(client)
      expect(OrderQueue.count).to eq(1)
    end

    scenario 'Client management - basic functionality' do
      expect(admin.role).to eq('admin')
      expect(client.role).to eq('client')
      expect(User.where(role: 'client').count).to eq(1)
    end
  end

  describe 'Client workflows' do
    before { sign_in_as_client(client) }

    scenario 'Client can access their area' do
      visit '/client'
      expect(page.status_code).to eq(200)
      expect(page).to have_css('body')
    end

    scenario 'Registration and first order - data works' do
      expect(client.role).to eq('client')
      expect(client.verified_at).to be_present

      order = create(:order_queue, client: client)
      expect(client.order_queues).to include(order)
    end

    scenario 'Order tracking - basic functionality' do
      order = create(:order_queue, client: client, status: 'pending')
      future_art = create(:future_art, order: order)

      expect(order.future_arts).to include(future_art)
      expect(future_art.status).to eq('draft')
    end

    scenario 'Workload calendar - data relationships' do
      order = create(:order_queue, client: client)
      pack = create(:cycle_pack, :in_progress, order: order)

      expect(pack.status).to eq('in_progress')
      expect(pack.order.client).to eq(client)
    end
  end

  describe 'General functionality' do
    scenario 'Homepage loads' do
      visit '/'
      expect(page.status_code).to eq(200)
      expect(page).to have_css('body')
    end

    scenario 'Factory relationships work correctly' do
      order = create(:order_queue, client: client)
      pack = create(:cycle_pack, order: order)
      art = create(:future_art, order: order)
      notification = create(:notification, user: client)

      # Test all relationships
      expect(order.client).to eq(client)
      expect(order.cycle_packs).to include(pack)
      expect(order.future_arts).to include(art)
      expect(client.notifications).to include(notification)
      expect(pack.client).to eq(client)
    end
  end
end
