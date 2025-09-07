# frozen_string_literal: true

module UIHelpers
  def wait_for_page_load
    expect(page).to have_css('body')
  end

  def wait_for_react_to_load
    expect(page).to have_css('[data-testid="app-loaded"]', wait: 10)
  rescue Capybara::ElementNotFound
    # If no test id, wait for common React elements
    expect(page).to have_css('.MuiBox-root, .react-app, #root *', wait: 10)
  end

  def wait_for_turbo_load
    expect(page).to have_css('[data-turbo-loaded]', wait: 10)
  rescue Capybara::ElementNotFound
    # Fallback if no turbo
    sleep 1
  end

  def fill_in_react_field(label, value)
    # For Material-UI text fields
    field = find("label:contains('#{label}')").find(:xpath, '..//input')
    field.fill_in with: value
  end

  def click_react_button(text)
    find('button', text: text).click
  end

  def upload_test_image(field_name, filename = 'test_image.png')
    file_path = Rails.root.join('spec', 'fixtures', 'files', filename)
    attach_file(field_name, file_path)
  end

  def expect_success_notification(message = nil)
    if message
      expect(page).to have_css('.MuiAlert-standardSuccess', text: message)
    else
      expect(page).to have_css('.MuiAlert-standardSuccess')
    end
  end

  def expect_error_notification(message = nil)
    if message
      expect(page).to have_css('.MuiAlert-standardError', text: message)
    else
      expect(page).to have_css('.MuiAlert-standardError')
    end
  end

  def expect_loading_indicator
    expect(page).to have_css('.MuiCircularProgress-root')
  end

  def wait_for_no_loading
    expect(page).to have_no_css('.MuiCircularProgress-root', wait: 10)
  end

  def within_modal(&)
    within('.MuiDialog-container', &)
  end

  def close_modal
    find('.MuiDialog-container .MuiIconButton-root[aria-label="close"]').click
  end

  def select_from_dropdown(label, option)
    click_on label
    within('.MuiMenu-list') do
      click_on option
    end
  end

  def expect_table_row_with_text(text)
    expect(page).to have_css('.MuiTableRow-root', text: text)
  end

  def click_table_action_button(row_text, action_button)
    within(find('.MuiTableRow-root', text: row_text)) do
      find("button[aria-label*='#{action_button}'], button[title*='#{action_button}']").click
    end
  end
end

RSpec.configure do |config|
  config.include UIHelpers, type: :feature
end
