# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Client Workload Calendar', type: :feature, js: true do
  let(:admin) { create(:admin_user) }
  let(:client) { create(:client_user) }
  
  # Create historical data for the calendar
  let!(:current_pack) { create(:creative_pack, :with_cycles, user: admin, current_cycles: 8) }
  let!(:completed_pack1) { create(:creative_pack, :completed, user: admin, 
                                   started_at: 2.months.ago, 
                                   completed_at: 1.month.ago) }
  let!(:completed_pack2) { create(:creative_pack, :completed, user: admin,
                                   started_at: 4.months.ago,
                                   completed_at: 3.months.ago) }

  before do
    # Create cycles for historical data
    create_cycles_for_pack(completed_pack1, 1.month.ago)
    create_cycles_for_pack(completed_pack2, 3.months.ago)
    create_recent_cycles_for_current_pack
    
    sign_in_as_client(client)
  end

  describe 'Calendar visualization and interaction' do
    scenario 'Client views GitHub-style workload calendar', :aggregate_failures do
      visit '/client/workload'
      wait_for_react_to_load

      expect(page).to have_content('Artist Workload Calendar')
      
      # Should show full year calendar grid
      expect(page).to have_css('.workload-calendar')
      expect(page).to have_css('.calendar-month', count: 12)
      expect(page).to have_css('.calendar-day', minimum: 365)
      
      # Should show month labels
      expect(page).to have_content('Jan')
      expect(page).to have_content('Feb')
      expect(page).to have_content('Dec')
      
      # Should show weekday labels
      expect(page).to have_content('Mon')
      expect(page).to have_content('Wed')
      expect(page).to have_content('Fri')
      expect(page).to have_content('Sun')
      
      # Should show intensity legend
      within '.calendar-legend' do
        expect(page).to have_content('Less Active')
        expect(page).to have_content('More Active')
        expect(page).to have_css('.legend-level', count: 5) # 0-4 intensity levels
      end
    end

    scenario 'Calendar shows different intensity levels based on work hours', :aggregate_failures do
      visit '/client/workload'
      wait_for_react_to_load

      # Should have different CSS classes for different intensities
      expect(page).to have_css('.calendar-day.level-0') # Rest days
      expect(page).to have_css('.calendar-day.level-1') # Light work days
      expect(page).to have_css('.calendar-day.level-2') # Medium work days
      expect(page).to have_css('.calendar-day.level-3') # Heavy work days
      expect(page).to have_css('.calendar-day.level-4') # Maximum intensity days
      
      # Hover over a day to see tooltip
      first('.calendar-day.level-3').hover
      
      expect(page).to have_css('.calendar-tooltip')
      expect(page).to have_content('hours worked')
      expect(page).to have_content(Date.current.strftime('%B %d, %Y'))
    end

    scenario 'Client clicks on calendar day to see detailed information', :aggregate_failures do
      visit '/client/workload'
      wait_for_react_to_load

      # Click on a day with activity
      active_day = find('.calendar-day.level-3', match: :first)
      active_day.click
      
      # Should show day details modal or sidebar
      within_modal do
        expect(page).to have_content('Work Details')
        expect(page).to have_content('Hours Worked:')
        expect(page).to have_content('Activities:')
        
        # Should show activities from that day
        expect(page).to have_content('3D') ||
        expect(page).to have_content('Photoshop') ||
        expect(page).to have_content('Textures')
        
        # Should show pack information
        expect(page).to have_content('Creative Pack:')
      end
    end
  end

  describe 'Workload analysis and insights' do
    scenario 'Client views workload statistics and patterns', :aggregate_failures do
      visit '/client/workload'
      wait_for_react_to_load

      # Should show summary statistics
      within '.workload-stats' do
        expect(page).to have_content('Total Active Days')
        expect(page).to have_content('Average Hours/Day')
        expect(page).to have_content('Current Streak')
        expect(page).to have_content('Longest Streak')
        
        # Should show actual numbers
        expect(page).to have_css('[data-testid="total-active-days"]')
        expect(page).to have_css('[data-testid="average-hours"]')
      end
      
      # Should show current pack information
      within '.current-pack-info' do
        expect(page).to have_content('Current Pack:')
        expect(page).to have_content(current_pack.name)
        expect(page).to have_content("#{current_pack.current_cycles}/#{current_pack.target_cycles} cycles")
        expect(page).to have_css('.pack-progress-bar')
      end
    end

    scenario 'Client sees workload intensity patterns for planning', :aggregate_failures do
      visit '/client/workload'
      wait_for_react_to_load

      # Should show planning insights
      expect(page).to have_content('Planning Your Commission')
      
      within '.planning-insights' do
        expect(page).to have_content('Best Times for New Orders')
        expect(page).to have_content('Artist typically works in 14-day cycles')
        expect(page).to have_content('Lower intensity periods indicate availability')
        expect(page).to have_content('High intensity periods suggest active commissions')
      end
      
      # Should show upcoming availability predictions
      within '.availability-forecast' do
        expect(page).to have_content('Predicted Availability')
        expect(page).to have_css('.availability-indicator')
        
        # Should show next estimated low-activity period
        expect(page).to have_content('Next Expected Break:') ||
        expect(page).to have_content('Currently in Active Cycle')
      end
    end

    scenario 'Client views monthly and yearly trends' do
      visit '/client/workload'
      wait_for_react_to_load

      # Should show trend analysis
      click_on 'View Trends'
      
      within '.trends-analysis' do
        expect(page).to have_content('Monthly Average Hours')
        expect(page).to have_content('Most Active Months')
        expect(page).to have_content('Typical Rest Periods')
        
        # Should show chart or graph
        expect(page).to have_css('.trends-chart')
      end
      
      # Should show yearly comparison if available
      if Date.current.year > current_pack.started_at.year
        expect(page).to have_content('Year-over-Year Comparison')
        expect(page).to have_css('.yearly-comparison')
      end
    end
  end

  describe 'Queue integration and planning tools' do
    scenario 'Client sees current order queue context in calendar', :aggregate_failures do
      # Create some orders in queue
      active_order = create(:future_art, :commission, client: client, user: admin, status: 'ordered')
      other_orders = create_list(:future_art, :commission, user: admin, status: 'ordered', estimated_hours: 20)
      
      visit '/client/workload'
      wait_for_react_to_load

      # Should show queue information
      within '.queue-context' do
        expect(page).to have_content('Order Queue Status')
        expect(page).to have_content('Your Position: 1') # First in queue
        expect(page).to have_content('Orders Ahead: 0')
        expect(page).to have_content('Estimated Hours Ahead: 0')
        
        # Should show estimated start date
        expect(page).to have_content('Estimated Start Date:')
        expect(page).to have_css('[data-testid="estimated-start-date"]')
      end
      
      # Should show impact on calendar
      expect(page).to have_content('Your Order Timeline')
      expect(page).to have_css('.order-timeline-overlay')
    end

    scenario 'Client uses planning tools to understand commission timing' do
      visit '/client/workload'
      wait_for_react_to_load

      click_on 'Commission Planning Tool'
      
      within_modal do
        expect(page).to have_content('Plan Your Commission')
        
        # Should have inputs for planning
        fill_in 'Estimated Hours', with: '30'
        select_from_dropdown 'Priority Level', 'Medium'
        
        # Should show calendar projection
        click_button 'Preview Timeline'
        
        expect(page).to have_content('Projected Start Date:')
        expect(page).to have_content('Projected Completion:')
        expect(page).to have_content('Based on current workload and queue')
        
        # Should show calendar overlay with projected work period
        expect(page).to have_css('.timeline-projection')
      end
    end

    scenario 'Client understands artist work cycles and rest periods' do
      visit '/client/workload'
      wait_for_react_to_load

      # Should show explanation of work patterns
      click_on 'Understanding Work Cycles'
      
      within_modal do
        expect(page).to have_content('How the Artist Works')
        expect(page).to have_content('Creative Pack System')
        expect(page).to have_content('14-day work cycles')
        expect(page).to have_content('Rest periods between packs')
        expect(page).to have_content('Overload cycles for urgent work')
        
        # Should show visual representation
        expect(page).to have_css('.cycle-explanation-diagram')
        
        # Should explain implications for clients
        expect(page).to have_content('What This Means for Your Commission')
        expect(page).to have_content('More consistent progress during active cycles')
        expect(page).to have_content('Natural break points for revisions')
        expect(page).to have_content('Predictable completion estimates')
      end
    end
  end

  describe 'Historical data and trends' do
    scenario 'Client views historical productivity patterns' do
      visit '/client/workload'
      wait_for_react_to_load

      # Should show historical data toggle
      click_on 'Show Historical Trends'
      
      # Calendar should adjust to show longer time period
      expect(page).to have_content('Past 2 Years') ||
      expect(page).to have_content('All Available Data')
      
      # Should show more historical context
      expect(page).to have_css('.calendar-day', minimum: 700) # More days visible
      
      # Should show historical statistics
      within '.historical-stats' do
        expect(page).to have_content('Historical Average')
        expect(page).to have_content('Peak Productivity Periods')
        expect(page).to have_content('Seasonal Patterns')
      end
    end

    scenario 'Client compares different time periods' do
      visit '/client/workload'
      wait_for_react_to_load

      # Should have time period selector
      select_from_dropdown 'Time Period', 'Last 6 Months'
      
      # Calendar should adjust
      expect(page).to have_css('.calendar-month', count: 6)
      
      # Try different period
      select_from_dropdown 'Time Period', 'Last 3 Months'
      expect(page).to have_css('.calendar-month', count: 3)
      
      # Should show period-specific statistics
      within '.period-stats' do
        expect(page).to have_content('Period Average:')
        expect(page).to have_content('Most Active Day:')
        expect(page).to have_content('Total Hours:')
      end
    end
  end

  describe 'Mobile responsiveness and accessibility' do
    scenario 'Calendar is usable on mobile viewport' do
      page.driver.browser.manage.window.resize_to(375, 667) # iPhone size
      
      visit '/client/workload'
      wait_for_react_to_load

      # Calendar should be responsive
      expect(page).to have_css('.workload-calendar.mobile-responsive')
      
      # Should have mobile-specific interactions
      expect(page).to have_css('.calendar-scroll-indicator')
      
      # Touch interactions should work
      first('.calendar-day').click
      expect(page).to have_css('.mobile-day-details')
    end

    scenario 'Calendar has proper accessibility features' do
      visit '/client/workload'
      wait_for_react_to_load

      # Should have proper ARIA labels
      expect(page).to have_css('[aria-label*="Workload calendar"]')
      expect(page).to have_css('[role="grid"]')
      expect(page).to have_css('[role="gridcell"]')
      
      # Should be keyboard navigable
      find('.workload-calendar').send_keys(:tab)
      expect(page).to have_css('.calendar-day:focus')
      
      # Should have screen reader friendly content
      expect(page).to have_css('.sr-only', visible: false)
    end
  end

  private

  def create_cycles_for_pack(pack, base_date)
    14.times do |i|
      create(:creative_cycle, 
             creative_pack: pack, 
             cycle_date: base_date + i.days,
             hours_worked: rand(6..12))
    end
  end

  def create_recent_cycles_for_current_pack
    8.times do |i|
      create(:creative_cycle,
             creative_pack: current_pack,
             cycle_date: i.days.ago,
             hours_worked: rand(8..12))
    end
  end
end