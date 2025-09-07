# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Order Acceptance Workflow', :js, type: :feature do
  let(:admin) { create(:admin_user) }
  let(:client) { create(:client_user) }
  let!(:active_pack) { create(:cycle_pack, user: admin) }

  before do
    sign_in_as_admin(admin)
  end

  describe 'New commission order workflow' do
    scenario 'Admin creates new commission order for existing client', :aggregate_failures do
      visit '/admin/orders'
      wait_for_react_to_load

      click_on 'New Commission'

      within '#commission-form' do
        # Basic order details
        fill_in 'Title', with: 'Fantasy Character Portrait'
        fill_in_react_field 'Description', 'Detailed portrait of an elven warrior with magical armor and glowing weapons.'

        # Select client
        select_from_dropdown 'Client', client.email

        # Set pricing and timeline
        fill_in 'Commission Price', with: '1500'
        fill_in 'Estimated Hours', with: '40'

        # Set priority and deadline
        select_from_dropdown 'Priority', 'High'
        fill_in 'Deadline', with: 1.month.from_now.strftime('%Y-%m-%d')

        click_button 'Create Commission'
      end

      expect_success_notification('Commission created successfully')

      # Should be redirected to orders list
      expect(page).to have_current_path('/admin/orders')

      # Verify commission was created
      commission = FutureArt.find_by(title: 'Fantasy Character Portrait')
      expect(commission).to be_present
      expect(commission.art_type).to eq('commission')
      expect(commission.client).to eq(client)
      expect(commission.commission_price).to eq(1500)
      expect(commission.status).to eq('ordered')

      # Should appear in orders list
      expect_table_row_with_text('Fantasy Character Portrait')
      expect_table_row_with_text(client.full_name)
      expect_table_row_with_text('$1,500')
      expect_table_row_with_text('Ordered')
    end

    scenario 'Admin creates commission and invites new client', :aggregate_failures do
      visit '/admin/orders/new'
      wait_for_react_to_load

      within '#commission-form' do
        fill_in 'Title', with: 'Sci-Fi Mech Design'
        fill_in_react_field 'Description', 'Futuristic mech suit design for game project.'

        # Create new client
        click_on 'Invite New Client'
      end

      within_modal do
        fill_in 'Email', with: 'newclient@example.com'
        fill_in 'First Name', with: 'John'
        fill_in 'Last Name', with: 'Smith'
        fill_in 'Contact Info', with: 'Preferred contact via email'

        click_button 'Send Invitation'
      end

      expect_success_notification('Invitation sent to newclient@example.com')

      # Should return to commission form with client pre-selected
      within '#commission-form' do
        expect(page).to have_field('Client', with: 'newclient@example.com')

        fill_in 'Commission Price', with: '2000'
        fill_in 'Estimated Hours', with: '60'

        click_button 'Create Commission'
      end

      expect_success_notification('Commission created successfully')

      # Verify new client was created
      new_client = User.find_by(email: 'newclient@example.com')
      expect(new_client).to be_present
      expect(new_client.role).to eq('client')
      expect(new_client.email_verified_at).to be_nil # Pending verification

      # Verify commission links to new client
      commission = FutureArt.find_by(title: 'Sci-Fi Mech Design')
      expect(commission.client).to eq(new_client)
    end

    scenario 'System calculates estimated start date based on queue', :aggregate_failures do
      # Create existing orders in queue
      create(:future_art, :commission, user: admin, estimated_hours: 20, status: 'ordered')
      create(:future_art, :commission, user: admin, estimated_hours: 30, status: 'ordered')

      visit '/admin/orders/new'

      within '#commission-form' do
        fill_in 'Title', with: 'Portrait Commission'
        select_from_dropdown 'Client', client.email
        fill_in 'Commission Price', with: '800'
        fill_in 'Estimated Hours', with: '25'

        click_button 'Create Commission'
      end

      commission = FutureArt.find_by(title: 'Portrait Commission')

      # Visit order details to see calculated start date
      visit "/admin/orders/#{commission.id}"

      # Should show estimated start date based on queue
      expect(page).to have_content('Estimated Start Date')
      expect(page).to have_content('Queue Position: 3')
      expect(page).to have_content('Hours Ahead: 50') # 20 + 30 hours

      # Should show reasonable estimate (assuming 8 hours per day)
      expect(page).to have_css('[data-testid="estimated-start"]')
    end

    scenario 'Client receives email notification about new order', :aggregate_failures do
      perform_enqueued_jobs do
        visit '/admin/orders/new'

        within '#commission-form' do
          fill_in 'Title', with: 'Logo Design'
          select_from_dropdown 'Client', client.email
          fill_in 'Commission Price', with: '500'
          fill_in 'Estimated Hours', with: '15'

          click_button 'Create Commission'
        end
      end

      # Verify notification was created
      notification = Notification.find_by(
        user: client,
        notification_type: 'order_created'
      )
      expect(notification).to be_present
      expect(notification.title).to include('New Order Created')
      expect(notification.message).to include('Logo Design')

      # Verify email was queued/sent
      expect(notification.email_sent).to be true
      expect(ActionMailer::Base.deliveries.last.to).to include(client.email)
      expect(ActionMailer::Base.deliveries.last.subject).to include('New Order')
    end

    scenario 'Admin adds order to specific position in queue' do
      existing_order = create(:future_art, :commission, user: admin, status: 'ordered')

      visit '/admin/orders/new'

      within '#commission-form' do
        fill_in 'Title', with: 'Rush Order'
        select_from_dropdown 'Client', client.email
        fill_in 'Commission Price', with: '1000'

        # Set as high priority / rush order
        check 'Rush Order (Insert at Top of Queue)'

        click_button 'Create Commission'
      end

      # Visit queue management
      visit '/admin/queue'

      # Rush order should be first in queue
      within '.queue-item:first-child' do
        expect(page).to have_content('Rush Order')
      end

      # Existing order should be moved down
      within '.queue-item:nth-child(2)' do
        expect(page).to have_content(existing_order.title)
      end
    end

    scenario 'Form validation prevents invalid commission data' do
      visit '/admin/orders/new'

      within '#commission-form' do
        # Submit without required fields
        click_button 'Create Commission'
      end

      # Should show validation errors
      expect(page).to have_content('Title is required')
      expect(page).to have_content('Client must be selected')
      expect(page).to have_content('Commission price must be greater than 0')
      expect(page).to have_content('Estimated hours is required')

      # Form should not submit
      expect(page).to have_current_path('/admin/orders/new')
    end
  end

  describe 'Order status management' do
    let!(:commission) { create(:future_art, :commission, user: admin, client: client) }

    scenario 'Admin starts work on commissioned order' do
      visit '/admin/orders'

      click_table_action_button(commission.title, 'Start Work')

      within_modal do
        select_from_dropdown 'Assign to Pack', active_pack.name
        click_button 'Start Work'
      end

      expect_success_notification('Work started on commission')

      commission.reload
      expect(commission.status).to eq('in_progress')
      expect(commission.cycle_pack).to eq(active_pack)
      expect(commission.started_at).to be_present

      # Client should receive notification
      notification = Notification.find_by(
        user: client,
        notification_type: 'order_started'
      )
      expect(notification).to be_present
    end

    scenario 'Admin marks commission as completed with final artwork' do
      commission.update!(status: 'in_progress', cycle_pack: active_pack)

      visit "/admin/orders/#{commission.id}"

      click_on 'Mark Complete'

      within_modal do
        upload_test_image('final_artwork', 'test_image.png')
        fill_in_react_field 'Completion Notes', 'Completed as requested. Client will receive high-res files via email.'

        click_button 'Complete Order'
      end

      expect_success_notification('Order completed successfully')

      commission.reload
      expect(commission.status).to eq('completed')
      expect(commission.completed_at).to be_present
      expect(commission.final_image).to be_attached

      # Client notification
      notification = Notification.find_by(
        user: client,
        notification_type: 'order_completed'
      )
      expect(notification).to be_present
    end
  end
end
