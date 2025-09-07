# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Client Registration and First Order', type: :feature, js: true do
  let(:admin) { create(:admin_user) }

  describe 'Self-registration workflow' do
    scenario 'New client registers independently', :aggregate_failures do
      visit '/register'
      wait_for_react_to_load

      expect(page).to have_content('Create Account')

      within '#registration-form' do
        fill_in 'Email', with: 'newclient@example.com'
        fill_in 'Password', with: 'securepassword123'
        fill_in 'Confirm Password', with: 'securepassword123'
        fill_in 'First Name', with: 'Sarah'
        fill_in 'Last Name', with: 'Connor'
        fill_in_react_field 'Contact Information', 'Preferred contact via email, interested in character portraits'
        
        click_button 'Create Account'
      end

      expect_success_notification('Account created! Please check your email to verify your account.')
      
      # Should redirect to verification pending page
      expect(page).to have_current_path('/verify-email')
      expect(page).to have_content('Email Verification Required')
      
      # Verify user was created but unverified
      user = User.find_by(email: 'newclient@example.com')
      expect(user).to be_present
      expect(user.role).to eq('client')
      expect(user.email_verified_at).to be_nil
      expect(user.first_name).to eq('Sarah')
      expect(user.last_name).to eq('Connor')
      
      # Verify verification email was sent
      expect(ActionMailer::Base.deliveries.last.to).to include('newclient@example.com')
      expect(ActionMailer::Base.deliveries.last.subject).to include('Verify')
    end

    scenario 'Client completes email verification process', :aggregate_failures do
      # Create unverified client
      client = create(:client_user, :unverified, email: 'verify@example.com')
      verification_token = 'verification_token_123'
      
      # Simulate clicking verification link from email
      visit "/verify-email?token=#{verification_token}&email=#{client.email}"
      wait_for_react_to_load

      expect(page).to have_content('Email Verified Successfully!')
      expect(page).to have_button('Continue to Dashboard')
      
      click_on 'Continue to Dashboard'
      
      # Should be automatically signed in and redirected to client dashboard
      expect(page).to have_current_path('/client')
      expect(page).to have_content("Welcome, #{client.first_name}!")
      
      # Client should be verified
      client.reload
      expect(client.email_verified_at).to be_present
    end

    scenario 'Registration validation prevents invalid data' do
      visit '/register'
      
      within '#registration-form' do
        # Submit without required fields
        click_button 'Create Account'
      end

      # Should show validation errors
      expect(page).to have_content('Email is required')
      expect(page).to have_content('Password is required')
      expect(page).to have_content('First name is required')
      expect(page).to have_content('Last name is required')
      
      # Test password confirmation mismatch
      within '#registration-form' do
        fill_in 'Email', with: 'test@example.com'
        fill_in 'Password', with: 'password123'
        fill_in 'Confirm Password', with: 'different123'
        fill_in 'First Name', with: 'Test'
        fill_in 'Last Name', with: 'User'
        
        click_button 'Create Account'
      end

      expect(page).to have_content('Password confirmation does not match')
      expect(page).to have_current_path('/register')
    end
  end

  describe 'Invitation-based registration workflow' do
    scenario 'Client registers via admin invitation', :aggregate_failures do
      # Create invited client (simulating admin invitation)
      invited_client = create(:client_user, :unverified, 
                            email: 'invited@example.com',
                            contact_info: 'VIP client for fantasy art')
      invitation_token = 'invitation_token_456'
      
      # Simulate clicking invitation link
      visit "/register?token=#{invitation_token}&email=#{invited_client.email}&invitation=true"
      wait_for_react_to_load

      expect(page).to have_content('Complete Your Registration')
      expect(page).to have_content('You have been invited to join our commission platform')
      
      # Email should be pre-filled and disabled
      expect(page).to have_field('Email', with: 'invited@example.com', disabled: true)

      within '#invitation-registration-form' do
        fill_in 'Password', with: 'invitedpassword123'
        fill_in 'Confirm Password', with: 'invitedpassword123'
        fill_in 'First Name', with: 'Maria'
        fill_in 'Last Name', with: 'Garcia'
        
        # Contact info should be pre-filled from invitation
        expect(page).to have_field('Contact Information', with: 'VIP client for fantasy art')
        
        click_button 'Complete Registration'
      end

      expect_success_notification('Welcome! Your account has been activated.')
      
      # Should be redirected to client dashboard
      expect(page).to have_current_path('/client')
      expect(page).to have_content('Welcome, Maria!')
      
      # Client should be verified and updated
      invited_client.reload
      expect(invited_client.email_verified_at).to be_present
      expect(invited_client.first_name).to eq('Maria')
      expect(invited_client.last_name).to eq('Garcia')
    end
  end

  describe 'First login and empty dashboard' do
    let(:new_client) { create(:client_user) }

    scenario 'Client sees empty dashboard on first login', :aggregate_failures do
      visit '/login'
      
      within '#login-form' do
        fill_in 'Email', with: new_client.email
        fill_in 'Password', with: new_client.password
        click_button 'Sign In'
      end

      # Should be redirected to client dashboard
      expect(page).to have_current_path('/client')
      expect(page).to have_content("Welcome, #{new_client.first_name}!")
      
      # Should show empty state for orders
      expect(page).to have_content('No Active Orders')
      expect(page).to have_content('You haven\'t placed any orders yet')
      expect(page).to have_css('.empty-state-illustration')
      
      # Should show getting started information
      expect(page).to have_content('Getting Started')
      expect(page).to have_content('Contact the artist to discuss your commission')
      
      # Should show navigation options
      expect(page).to have_link('Workload Calendar')
      expect(page).to have_link('Notifications')
      expect(page).to have_link('Profile')
    end

    scenario 'Client explores available sections from empty dashboard' do
      sign_in_as_client(new_client)
      
      # Navigate to workload calendar
      click_on 'Workload Calendar'
      expect(page).to have_current_path('/client/workload')
      expect(page).to have_content('Artist Workload Calendar')
      
      # Go back to dashboard
      click_on 'Dashboard'
      expect(page).to have_current_path('/client')
      
      # Navigate to notifications
      click_on 'Notifications'
      expect(page).to have_current_path('/client/notifications')
      expect(page).to have_content('Notifications')
      expect(page).to have_content('No notifications yet')
      
      # Navigate to profile
      click_on 'Profile'
      expect(page).to have_current_path('/client/profile')
      expect(page).to have_content('Profile Settings')
      expect(page).to have_field('Email', with: new_client.email)
    end
  end

  describe 'First order notification workflow' do
    let(:client) { create(:client_user) }

    scenario 'Client receives notification about first order creation', :aggregate_failures do
      # Sign in client
      sign_in_as_client(client)
      
      # Simulate admin creating order for this client (in background)
      commission = nil
      perform_enqueued_jobs do
        commission = create(:future_art, :commission, 
                          client: client, 
                          user: admin,
                          title: 'Fantasy Dragon Portrait')
        
        # Create notification
        create(:notification, :order_created, 
               user: client,
               message: "Your order 'Fantasy Dragon Portrait' has been created and added to the queue.")
      end

      # Refresh the dashboard
      visit '/client'
      wait_for_react_to_load

      # Should show notification badge
      expect(page).to have_css('.notification-badge', text: '1')
      
      # Should show active order on dashboard
      expect(page).to have_content('Active Orders: 1')
      expect(page).to have_content('Fantasy Dragon Portrait')
      expect(page).to have_content('Status: Ordered')
      
      # Check notifications
      click_on 'Notifications'
      
      within '#notifications-list' do
        expect(page).to have_content('New Order Created')
        expect(page).to have_content('Fantasy Dragon Portrait')
        expect(page).to have_css('.notification-unread')
      end
      
      # Click on notification to view order details
      click_on 'New Order Created'
      
      expect(page).to have_current_path("/client/orders/#{commission.id}")
      expect(page).to have_content('Fantasy Dragon Portrait')
      expect(page).to have_content(commission.description)
      expect(page).to have_content("$#{commission.commission_price}")
    end

    scenario 'Client receives multiple order updates via notifications', :aggregate_failures do
      commission = create(:future_art, :commission, client: client, user: admin)
      
      # Create multiple notifications
      notifications = [
        create(:notification, :order_created, user: client, message: 'Order created and queued'),
        create(:notification, :order_started, user: client, message: 'Artist started working on your order'),
        create(:notification, user: client, 
               notification_type: 'order_progress',
               title: 'Progress Update',
               message: 'Completed initial sketches and concept work')
      ]
      
      sign_in_as_client(client)
      
      click_on 'Notifications'
      
      # Should see all notifications
      expect(page).to have_css('.notification-item', count: 3)
      
      # Should be in reverse chronological order (newest first)
      within '.notification-item:first-child' do
        expect(page).to have_content('Progress Update')
      end
      
      within '.notification-item:last-child' do
        expect(page).to have_content('New Order Created')
      end
      
      # Mark notification as read by clicking
      first('.notification-item').click
      
      # Should update read status
      expect(page).to have_css('.notification-read', count: 1)
    end
  end

  describe 'Contact and communication workflow' do
    let(:client) { create(:client_user) }

    scenario 'Client accesses contact information and external chat guidance' do
      sign_in_as_client(client)
      
      # Should see contact guidance on dashboard
      expect(page).to have_content('Need to discuss a new commission?')
      expect(page).to have_link('Contact Artist')
      
      click_on 'Contact Artist'
      
      within_modal do
        expect(page).to have_content('How to Contact the Artist')
        expect(page).to have_content('Discord')
        expect(page).to have_content('Telegram') 
        expect(page).to have_content('Email')
        
        # Should provide guidance on what to include
        expect(page).to have_content('What to Include in Your Message')
        expect(page).to have_content('Type of artwork')
        expect(page).to have_content('Budget range')
        expect(page).to have_content('Timeline requirements')
        
        expect(page).to have_button('Copy Discord Username')
        expect(page).to have_button('Copy Email Address')
      end
      
      # Test copying contact info
      click_on 'Copy Discord Username'
      expect_success_notification('Discord username copied to clipboard')
    end
  end
end