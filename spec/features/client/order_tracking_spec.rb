# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Client Order Tracking', type: :feature, js: true do
  let(:admin) { create(:admin_user) }
  let(:client) { create(:client_user) }
  let!(:active_pack) { create(:creative_pack, :with_cycles, user: admin) }
  
  let!(:active_order) { create(:future_art, :commission, :in_progress, 
                              client: client, user: admin, creative_pack: active_pack) }
  let!(:completed_order) { create(:future_art, :commission, :completed, 
                                 client: client, user: admin) }
  let!(:pending_order) { create(:future_art, :commission, 
                                client: client, user: admin) }

  before do
    sign_in_as_client(client)
  end

  describe 'Order dashboard and overview' do
    scenario 'Client views all orders with different statuses', :aggregate_failures do
      visit '/client'
      wait_for_react_to_load

      # Should show order summary
      expect(page).to have_content('Active Orders: 2') # in_progress + ordered
      expect(page).to have_content('Completed Orders: 1')
      
      # Should show recent orders list
      within '#recent-orders' do
        expect(page).to have_content(active_order.title)
        expect(page).to have_content(completed_order.title) 
        expect(page).to have_content(pending_order.title)
        
        # Should show status indicators
        expect(page).to have_css('.status-in-progress')
        expect(page).to have_css('.status-completed')
        expect(page).to have_css('.status-ordered')
      end
      
      # Click to view all orders
      click_on 'View All Orders'
      
      expect(page).to have_current_path('/client/orders')
      expect(page).to have_content('My Orders')
    end

    scenario 'Client filters orders by status' do
      visit '/client/orders'
      wait_for_react_to_load
      
      # Default should show all orders
      expect_table_row_with_text(active_order.title)
      expect_table_row_with_text(completed_order.title)
      expect_table_row_with_text(pending_order.title)
      
      # Filter by active orders
      select_from_dropdown 'Status Filter', 'Active'
      
      expect_table_row_with_text(active_order.title)
      expect_table_row_with_text(pending_order.title)
      expect(page).to have_no_content(completed_order.title)
      
      # Filter by completed orders
      select_from_dropdown 'Status Filter', 'Completed'
      
      expect_table_row_with_text(completed_order.title)
      expect(page).to have_no_content(active_order.title)
      expect(page).to have_no_content(pending_order.title)
    end
  end

  describe 'Order details and progress tracking' do
    scenario 'Client views detailed order information', :aggregate_failures do
      visit "/client/orders/#{active_order.id}"
      wait_for_react_to_load

      # Basic order information
      expect(page).to have_content(active_order.title)
      expect(page).to have_content(active_order.description)
      expect(page).to have_content("$#{active_order.commission_price}")
      expect(page).to have_content('Status: In Progress')
      
      # Timeline information
      expect(page).to have_content('Order Placed:')
      expect(page).to have_content('Work Started:')
      expect(page).to have_content(active_order.started_at.strftime('%m/%d/%Y'))
      
      # Progress tracking
      expect(page).to have_content('Assigned to Pack:')
      expect(page).to have_content(active_pack.name)
      
      # Estimated completion
      expect(page).to have_content('Estimated Completion:')
      expect(page).to have_css('[data-testid="estimated-completion"]')
    end

    scenario 'Client views order history and cycle progress', :aggregate_failures do
      # Add some cycles to the pack for this order
      cycles = create_list(:creative_cycle, 3, 
                          creative_pack: active_pack,
                          cycle_date: [3.days.ago, 2.days.ago, 1.day.ago])
      
      visit "/client/orders/#{active_order.id}"
      
      # Should show progress timeline
      expect(page).to have_content('Work Progress')
      
      within '#progress-timeline' do
        expect(page).to have_css('.timeline-item', count: 3)
        
        # Should show cycle information
        cycles.each do |cycle|
          expect(page).to have_content(cycle.cycle_date.strftime('%m/%d'))
          expect(page).to have_content("#{cycle.hours_worked} hours")
        end
      end
      
      # Should show total hours worked
      total_hours = cycles.sum(&:hours_worked)
      expect(page).to have_content("Total Hours: #{total_hours}")
      
      # Should show progress images if available
      expect(page).to have_css('.progress-image', count: cycles.count)
    end

    scenario 'Client sees status change notifications in order history' do
      # Create status change notifications
      notifications = [
        create(:notification, :order_created, user: client, created_at: 5.days.ago),
        create(:notification, :order_started, user: client, created_at: 3.days.ago),
        create(:notification, user: client,
               notification_type: 'order_progress',
               title: 'Sketching Phase Complete',
               message: 'Initial concept sketches finished',
               created_at: 1.day.ago)
      ]
      
      visit "/client/orders/#{active_order.id}"
      
      within '#order-history' do
        expect(page).to have_css('.history-item', count: 3)
        
        # Should be in chronological order
        expect(page).to have_content('Order Created')
        expect(page).to have_content('Work Started')
        expect(page).to have_content('Sketching Phase Complete')
      end
    end
  end

  describe 'Workload calendar integration' do
    scenario 'Client views artist workload from order page', :aggregate_failures do
      visit "/client/orders/#{active_order.id}"
      
      click_on 'View Artist Workload'
      
      expect(page).to have_current_path('/client/workload')
      expect(page).to have_content('Artist Workload Calendar')
      
      # Should show GitHub-style calendar
      expect(page).to have_css('.workload-calendar')
      expect(page).to have_css('.calendar-day', minimum: 365) # Full year
      
      # Should show legend
      expect(page).to have_content('Less Active')
      expect(page).to have_content('More Active')
      
      # Should show statistics
      expect(page).to have_content('Current Pack:')
      expect(page).to have_content(active_pack.name)
      expect(page).to have_content('Pack Progress:')
    end

    scenario 'Client understands workload patterns for planning' do
      visit '/client/workload'
      wait_for_react_to_load
      
      # Should show helpful information
      expect(page).to have_content('Understanding the Calendar')
      expect(page).to have_content('High Intensity')
      expect(page).to have_content('Medium Intensity') 
      expect(page).to have_content('Low Intensity')
      expect(page).to have_content('Rest Day')
      
      # Should show planning guidance
      expect(page).to have_content('Best Times for New Orders')
      expect(page).to have_content('When you see lighter periods')
      expect(page).to have_content('Allow extra time during high-intensity periods')
      
      # Should show current queue information
      expect(page).to have_content('Current Queue Status')
      expect(page).to have_content('Orders Ahead of Queue')
    end
  end

  describe 'Order cancellation and refund logic' do
    scenario 'Client can cancel order within allowed timeframe', :aggregate_failures do
      # Order placed recently, within cancellation window
      recent_order = create(:future_art, :commission, 
                           client: client, user: admin,
                           created_at: 1.day.ago,
                           status: 'ordered')
      
      visit "/client/orders/#{recent_order.id}"
      
      expect(page).to have_button('Cancel Order')
      
      click_on 'Cancel Order'
      
      within_modal do
        expect(page).to have_content('Cancel Order')
        expect(page).to have_content('Full refund will be processed')
        
        fill_in_react_field 'Cancellation Reason', 'Changed my mind about the project'
        
        click_button 'Confirm Cancellation'
      end

      expect_success_notification('Order cancelled successfully. Refund will be processed within 3-5 business days.')
      
      recent_order.reload
      expect(recent_order.status).to eq('cancelled')
      expect(recent_order.refund_eligible).to be true
      expect(recent_order.cancellation_reason).to be_present
      
      expect(page).to have_content('Status: Cancelled')
      expect(page).to have_content('Refund Status: Processing')
    end

    scenario 'Client sees no-refund warning for late cancellation', :aggregate_failures do
      # Order placed long ago, work has started
      old_order = create(:future_art, :commission, :in_progress,
                        client: client, user: admin,
                        created_at: 10.days.ago,
                        started_at: 5.days.ago)
      
      visit "/client/orders/#{old_order.id}"
      
      expect(page).to have_button('Cancel Order')
      
      click_on 'Cancel Order'
      
      within_modal do
        expect(page).to have_content('Late Cancellation')
        expect(page).to have_content('Work has already begun on this order')
        expect(page).to have_content('No refund will be issued')
        expect(page).to have_css('.warning-message')
        
        fill_in_react_field 'Cancellation Reason', 'Personal circumstances changed'
        
        # Should require explicit confirmation
        check 'I understand no refund will be issued'
        
        click_button 'Confirm Cancellation'
      end

      expect_success_notification('Order cancelled. No refund will be issued as work has already begun.')
      
      old_order.reload
      expect(old_order.status).to eq('cancelled')
      expect(old_order.refund_eligible).to be false
    end

    scenario 'Client cannot cancel completed orders' do
      visit "/client/orders/#{completed_order.id}"
      
      expect(page).to have_no_button('Cancel Order')
      expect(page).to have_content('Status: Completed')
      expect(page).to have_button('Download Final Artwork')
    end

    scenario 'Client sees refund timeline when eligible', :aggregate_failures do
      # Create recently cancelled order with refund
      cancelled_order = create(:future_art, :commission, :cancelled,
                              client: client, user: admin,
                              refund_eligible: true,
                              refund_processed_at: nil)
      
      visit "/client/orders/#{cancelled_order.id}"
      
      expect(page).to have_content('Refund Status: Processing')
      expect(page).to have_content('Expected Processing Time: 3-5 business days')
      
      # Simulate refund processing
      cancelled_order.update!(refund_processed_at: Time.current)
      
      visit "/client/orders/#{cancelled_order.id}"
      
      expect(page).to have_content('Refund Status: Completed')
      expect(page).to have_content('Refund Processed:')
    end
  end

  describe 'Email notifications for status changes' do
    scenario 'Client receives email when order status changes', :aggregate_failures do
      perform_enqueued_jobs do
        # Simulate admin changing order status
        active_order.update!(status: 'completed', completed_at: Time.current)
        
        # Create completion notification
        create(:notification, :order_completed, 
               user: client, 
               message: "Your order '#{active_order.title}' has been completed!")
      end
      
      # Check that email was sent
      expect(ActionMailer::Base.deliveries.count).to be > 0
      
      completion_email = ActionMailer::Base.deliveries.find do |email|
        email.to.include?(client.email) && email.subject.include?('Completed')
      end
      
      expect(completion_email).to be_present
      expect(completion_email.body.to_s).to include(active_order.title)
      
      # Client should see notification in dashboard
      visit '/client'
      
      expect(page).to have_css('.notification-badge')
      
      click_on 'Notifications'
      
      expect(page).to have_content('Order Completed')
      expect(page).to have_content(active_order.title)
    end

    scenario 'Client manages email notification preferences' do
      visit '/client/profile'
      
      expect(page).to have_content('Notification Preferences')
      
      within '#notification-preferences' do
        expect(page).to have_field('Email for Order Status Changes', checked: true)
        expect(page).to have_field('Email for Progress Updates', checked: true)
        expect(page).to have_field('Email for New Messages', checked: true)
        
        # Turn off progress updates
        uncheck 'Email for Progress Updates'
        
        click_button 'Save Preferences'
      end

      expect_success_notification('Notification preferences updated')
      
      # Verify setting was saved
      client.reload
      expect(client.email_notifications['progress_updates']).to be false
      expect(client.email_notifications['status_changes']).to be true
    end
  end
end