# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Client Management Workflow', :js, type: :feature do
  let(:admin) { create(:admin_user) }
  let(:existing_client) { create(:client_user) }

  before do
    sign_in_as_admin(admin)
  end

  describe 'Client invitation and registration workflow' do
    scenario 'Admin sends email invitation to new client', :aggregate_failures do
      perform_enqueued_jobs do
        visit '/admin/clients'
        wait_for_react_to_load

        click_on 'Invite Client'

        within_modal do
          fill_in 'Email Address', with: 'invited@example.com'
          fill_in_react_field 'Contact Information', 'Potential client for fantasy art commissions'

          click_button 'Send Invitation'
        end

        expect_success_notification('Invitation sent successfully')
      end

      # Verify client was created with pending status
      invited_client = User.find_by(email: 'invited@example.com')
      expect(invited_client).to be_present
      expect(invited_client.role).to eq('client')
      expect(invited_client.email_verified_at).to be_nil
      expect(invited_client.contact_info).to eq('Potential client for fantasy art commissions')

      # Verify invitation email was sent
      expect(ActionMailer::Base.deliveries.last.to).to include('invited@example.com')
      expect(ActionMailer::Base.deliveries.last.subject).to include('Invitation')

      # Should appear in clients list with pending status
      expect(page).to have_current_path('/admin/clients')
      expect_table_row_with_text('invited@example.com')
      expect_table_row_with_text('Pending')
    end

    scenario 'Client registers using invitation link', :aggregate_failures do
      # Create unverified client (simulating invitation sent)
      invited_client = create(:client_user, :unverified, email: 'newbie@example.com')
      invitation_token = 'sample_token_123'

      # Simulate clicking invitation link
      visit "/register?token=#{invitation_token}&email=#{invited_client.email}"
      wait_for_react_to_load

      expect(page).to have_content('Complete Your Registration')
      expect(page).to have_field('Email', with: 'newbie@example.com', disabled: true)

      within '#registration-form' do
        fill_in 'Password', with: 'securepassword123'
        fill_in 'Confirm Password', with: 'securepassword123'
        fill_in 'First Name', with: 'Jane'
        fill_in 'Last Name', with: 'Doe'

        click_button 'Complete Registration'
      end

      expect_success_notification('Registration completed successfully')

      # Should be redirected to client dashboard
      expect(page).to have_current_path('/client')
      expect(page).to have_content('Welcome, Jane!')

      # Client should be verified
      invited_client.reload
      expect(invited_client.email_verified_at).to be_present
      expect(invited_client.first_name).to eq('Jane')
      expect(invited_client.last_name).to eq('Doe')
    end

    scenario 'Admin views updated client in list after registration' do
      # Client before registration
      visit '/admin/clients'
      expect_table_row_with_text('Pending')

      # Simulate client registration
      existing_client.update!(
        email_verified_at: Time.current,
        first_name: 'John',
        last_name: 'Smith'
      )

      # Refresh page
      visit '/admin/clients'
      wait_for_react_to_load

      # Should show verified status
      expect_table_row_with_text(existing_client.email)
      expect_table_row_with_text('Verified')
      expect_table_row_with_text('John Smith')

      # Should show registration date
      within find('.MuiTableRow-root', text: existing_client.email) do
        expect(page).to have_content(existing_client.created_at.strftime('%m/%d/%Y'))
      end
    end
  end

  describe 'Client profile and order management' do
    let!(:client_order) { create(:future_art, :commission, client: existing_client, user: admin) }
    let!(:completed_order) { create(:future_art, :commission, :completed, client: existing_client, user: admin) }

    scenario 'Admin views client profile with order history', :aggregate_failures do
      visit '/admin/clients'

      click_table_action_button(existing_client.email, 'View')

      expect(page).to have_current_path("/admin/clients/#{existing_client.id}")
      expect(page).to have_content(existing_client.full_name)
      expect(page).to have_content(existing_client.email)

      # Should show order statistics
      expect(page).to have_content('Total Orders: 2')
      expect(page).to have_content('Active Orders: 1')
      expect(page).to have_content('Completed Orders: 1')

      # Should show order history table
      within '#orders-history' do
        expect_table_row_with_text(client_order.title)
        expect_table_row_with_text(completed_order.title)
        expect_table_row_with_text('Ordered')
        expect_table_row_with_text('Completed')
      end

      # Should show total value
      total_value = client_order.commission_price + completed_order.commission_price
      expect(page).to have_content("Total Order Value: $#{total_value}")
    end

    scenario 'Admin manages client orders from profile page', :aggregate_failures do
      visit "/admin/clients/#{existing_client.id}"

      within '#orders-history' do
        click_table_action_button(client_order.title, 'Edit')
      end

      within_modal do
        fill_in 'Commission Price', with: '1200'
        select_from_dropdown 'Priority', 'High'

        click_button 'Update Order'
      end

      expect_success_notification('Order updated successfully')

      client_order.reload
      expect(client_order.commission_price).to eq(1200)
      expect(client_order.priority).to eq(10) # High priority value
    end

    scenario 'Admin sends direct email to client', :aggregate_failures do
      perform_enqueued_jobs do
        visit "/admin/clients/#{existing_client.id}"

        click_on 'Send Email'

        within_modal do
          fill_in 'Subject', with: 'Update on your commission'
          fill_in_react_field 'Message', 'Hi! Just wanted to give you an update on your commission progress...'

          click_button 'Send Email'
        end

        expect_success_notification('Email sent successfully')
      end

      # Verify email was sent
      expect(ActionMailer::Base.deliveries.last.to).to include(existing_client.email)
      expect(ActionMailer::Base.deliveries.last.subject).to eq('Update on your commission')

      # Should create notification record
      notification = Notification.find_by(user: existing_client, notification_type: 'direct_message')
      expect(notification).to be_present
    end

    scenario 'Admin can deactivate/reactivate client account' do
      visit "/admin/clients/#{existing_client.id}"

      click_on 'Account Actions'
      click_on 'Deactivate Account'

      within_modal do
        fill_in_react_field 'Reason for Deactivation', 'Client requested account suspension'
        click_button 'Deactivate'
      end

      expect_success_notification('Client account deactivated')

      existing_client.reload
      expect(existing_client.active).to be false
      expect(existing_client.deactivation_reason).to be_present

      # Should show reactivation option
      expect(page).to have_content('Account Status: Inactive')
      expect(page).to have_button('Reactivate Account')

      # Test reactivation
      click_on 'Reactivate Account'

      within_modal do
        click_button 'Reactivate'
      end

      expect_success_notification('Client account reactivated')

      existing_client.reload
      expect(existing_client.active).to be true
    end
  end

  describe 'Client search and filtering' do
    let!(:verified_client) { create(:client_user, first_name: 'Alice', last_name: 'Johnson') }
    let!(:pending_client) { create(:client_user, :unverified, first_name: 'Bob', last_name: 'Wilson') }

    scenario 'Admin searches clients by name or email' do
      visit '/admin/clients'
      wait_for_react_to_load

      # Search by name
      fill_in 'Search clients...', with: 'Alice'
      click_button 'Search'

      expect_table_row_with_text('Alice Johnson')
      expect(page).to have_no_content('Bob Wilson')

      # Clear search and search by email
      fill_in 'Search clients...', with: verified_client.email
      click_button 'Search'

      expect_table_row_with_text(verified_client.email)
      expect(page).to have_no_content(pending_client.email)

      # Clear search to see all clients
      fill_in 'Search clients...', with: ''
      click_button 'Search'

      expect_table_row_with_text('Alice Johnson')
      expect_table_row_with_text('Bob Wilson')
    end

    scenario 'Admin filters clients by status' do
      visit '/admin/clients'

      # Filter by verified clients only
      select_from_dropdown 'Status Filter', 'Verified'

      expect_table_row_with_text(verified_client.full_name)
      expect(page).to have_no_content(pending_client.full_name)

      # Filter by pending clients
      select_from_dropdown 'Status Filter', 'Pending'

      expect_table_row_with_text(pending_client.full_name)
      expect(page).to have_no_content(verified_client.full_name)

      # Show all
      select_from_dropdown 'Status Filter', 'All'

      expect_table_row_with_text(verified_client.full_name)
      expect_table_row_with_text(pending_client.full_name)
    end
  end

  describe 'Bulk client actions' do
    let!(:clients) { create_list(:client_user, 3) }

    scenario 'Admin performs bulk email to multiple clients', :aggregate_failures do
      perform_enqueued_jobs do
        visit '/admin/clients'

        # Select multiple clients
        clients.each do |client|
          within find('.MuiTableRow-root', text: client.email) do
            check 'select-client'
          end
        end

        click_on 'Bulk Actions'
        click_on 'Send Email to Selected'

        within_modal do
          fill_in 'Subject', with: 'Monthly Newsletter'
          fill_in_react_field 'Message', 'Here is your monthly update on artwork progress...'

          click_button 'Send to All Selected'
        end

        expect_success_notification("Email sent to #{clients.count} clients")
      end

      # Verify all clients received email
      clients.each do |client|
        notification = Notification.find_by(user: client, notification_type: 'newsletter')
        expect(notification).to be_present
      end

      expect(ActionMailer::Base.deliveries.count).to eq(clients.count)
    end
  end
end
