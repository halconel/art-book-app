# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Daily Cycle Workflow', type: :feature, js: true do
  let(:admin) { create(:admin_user) }
  let!(:active_pack) { create(:creative_pack, user: admin, current_cycles: 8) }

  before do
    sign_in_as_admin(admin)
  end

  describe 'Admin daily workflow - adding a new cycle' do
    scenario 'Admin sees current pack widget on dashboard' do
      visit '/admin'
      wait_for_react_to_load

      # Should see current pack widget
      expect(page).to have_content("#{active_pack.name}: #{active_pack.current_cycles}/#{active_pack.target_cycles} cycles")
      expect(page).to have_css('.pack-progress')
    end

    scenario 'Admin adds new cycle to current pack', :aggregate_failures do
      visit '/admin'
      wait_for_react_to_load

      # Navigate to add cycle form
      click_on 'Add Daily Cycle'
      wait_for_react_to_load

      expect(page).to have_current_path('/admin/cycles/new')
      expect(page).to have_content('Add New Creative Cycle')

      # Fill in cycle details
      within '#cycle-form' do
        fill_in 'Hours Worked', with: '10'
        fill_in_react_field 'Work Description', 'Completed character modeling and texturing work. Made significant progress on the main character design.'
        
        # Select activities
        check '3D'
        check 'Photoshop'
        check 'Textures'
        
        # Upload progress image
        upload_test_image('progress_image', 'test_image.png')
        
        click_button 'Add Cycle'
      end

      # Should see success notification
      expect_success_notification('Cycle added successfully')
      
      # Should redirect to admin dashboard
      expect(page).to have_current_path('/admin')
      
      # Pack counter should be updated
      active_pack.reload
      expect(active_pack.current_cycles).to eq(9)
      
      # Should see updated pack widget
      expect(page).to have_content("#{active_pack.name}: 9/#{active_pack.target_cycles} cycles")
    end

    scenario 'Admin completes a pack with 14th cycle' do
      active_pack.update!(current_cycles: 13)
      
      visit '/admin/cycles/new'
      wait_for_react_to_load

      within '#cycle-form' do
        fill_in 'Hours Worked', with: '12'
        fill_in_react_field 'Work Description', 'Final cycle of the pack. Completed all planned work items.'
        
        check '3D'
        check 'Photoshop'
        upload_test_image('progress_image', 'test_image.png')
        
        click_button 'Add Cycle'
      end

      expect_success_notification('Pack completed! Congratulations on finishing 14 cycles.')
      
      # Pack should be marked as completed
      active_pack.reload
      expect(active_pack.status).to eq('completed')
      expect(active_pack.current_cycles).to eq(14)
      expect(active_pack.completed_at).to be_present
      
      # Dashboard should show completion
      visit '/admin'
      expect(page).to have_content('Pack Completed!')
      expect(page).to have_button('Start New Pack')
    end

    scenario 'Admin enters overload cycles (beyond 14)' do
      active_pack.update!(current_cycles: 14, status: 'completed')
      
      # Continue working creates overload cycles
      visit '/admin/cycles/new'
      
      within '#cycle-form' do
        fill_in 'Hours Worked', with: '8'
        fill_in_react_field 'Work Description', 'Overload cycle - continuing work on commission project.'
        
        check 'ClipStudio'
        upload_test_image('progress_image', 'test_image.png')
        
        click_button 'Add Cycle'
      end

      expect_success_notification('Overload cycle added')
      
      active_pack.reload
      expect(active_pack.current_cycles).to eq(15)
      expect(active_pack.status).to eq('overload')
      
      # Should see overload warning on dashboard
      visit '/admin'
      expect(page).to have_css('.overload-warning')
      expect(page).to have_content('Overload: 15/14 cycles')
    end

    scenario 'Validation prevents invalid cycle data' do
      visit '/admin/cycles/new'
      wait_for_react_to_load

      within '#cycle-form' do
        # Submit without required fields
        click_button 'Add Cycle'
      end

      # Should show validation errors
      expect(page).to have_content('Hours worked is required')
      expect(page).to have_content('Description is required')
      expect(page).to have_content('At least one activity must be selected')
      
      # Form should not submit
      expect(page).to have_current_path('/admin/cycles/new')
    end

    scenario 'Admin can interrupt a pack with reason' do
      visit '/admin'
      wait_for_react_to_load

      click_on 'Interrupt Pack'
      
      within_modal do
        fill_in 'Interruption Reason', with: 'Need to take a break due to health issues'
        click_button 'Interrupt Pack'
      end

      expect_success_notification('Pack interrupted')
      
      active_pack.reload
      expect(active_pack.status).to eq('interrupted')
      expect(active_pack.interruption_reason).to eq('Need to take a break due to health issues')
      expect(active_pack.interrupted_at).to be_present
      
      # Should show option to start new pack
      expect(page).to have_button('Start New Pack')
    end
  end

  describe 'Pack management workflow' do
    scenario 'Admin starts new pack after completion' do
      active_pack.update!(status: 'completed')
      
      visit '/admin'
      click_on 'Start New Pack'
      
      within_modal do
        fill_in 'Pack Name', with: 'Summer Sprint Pack'
        fill_in 'Target Cycles', with: '14'
        click_button 'Start Pack'
      end

      expect_success_notification('New pack started')
      
      # Should create new pack
      new_pack = CreativePack.find_by(name: 'Summer Sprint Pack')
      expect(new_pack).to be_present
      expect(new_pack.status).to eq('active')
      expect(new_pack.target_cycles).to eq(14)
      
      # Dashboard should show new pack
      expect(page).to have_content('Summer Sprint Pack: 0/14 cycles')
    end

    scenario 'Admin views pack history and statistics' do
      # Create some historical packs
      completed_pack = create(:creative_pack, :completed, user: admin, current_cycles: 14)
      interrupted_pack = create(:creative_pack, :interrupted, user: admin, current_cycles: 8)
      
      visit '/admin/packs'
      wait_for_react_to_load

      # Should see all packs
      expect_table_row_with_text(active_pack.name)
      expect_table_row_with_text(completed_pack.name)
      expect_table_row_with_text(interrupted_pack.name)
      
      # Should see statistics
      expect(page).to have_content('Total Packs: 3')
      expect(page).to have_content('Completed: 1')
      expect(page).to have_content('Current Record: 14 cycles')
      
      # Can view pack details
      click_table_action_button(completed_pack.name, 'View')
      
      expect(page).to have_content(completed_pack.name)
      expect(page).to have_content("Completed in #{completed_pack.duration_days} days")
    end
  end
end