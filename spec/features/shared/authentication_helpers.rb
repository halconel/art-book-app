# frozen_string_literal: true

module AuthenticationHelpers
  def sign_in_as_admin(admin = nil)
    admin ||= create(:user, :admin)
    visit '/login'
    
    within('#login-form') do
      fill_in 'Email', with: admin.email
      fill_in 'Password', with: admin.password
      click_button 'Sign In'
    end

    expect(page).to have_content('Dashboard') # Admin dashboard
    admin
  end

  def sign_in_as_client(client = nil)
    client ||= create(:user, :client)
    visit '/login'
    
    within('#login-form') do
      fill_in 'Email', with: client.email
      fill_in 'Password', with: client.password
      click_button 'Sign In'
    end

    expect(page).to have_content('My Orders') # Client dashboard
    client
  end

  def sign_out
    click_button 'Logout'
    expect(page).to have_content('Sign In')
  end

  def expect_admin_dashboard
    expect(page).to have_current_path('/admin')
    expect(page).to have_content('Admin Dashboard')
  end

  def expect_client_dashboard
    expect(page).to have_current_path('/client')
    expect(page).to have_content('Client Dashboard')
  end

  def expect_unauthorized_access
    expect(page).to have_content('Access Denied').or have_current_path('/login')
  end
end

RSpec.configure do |config|
  config.include AuthenticationHelpers, type: :feature
end