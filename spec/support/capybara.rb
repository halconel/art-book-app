# frozen_string_literal: true

require 'capybara/rails'
require 'capybara/rspec'
require 'selenium-webdriver'

# Configure Capybara with Chrome for Testing
Capybara.register_driver :chrome_headless do |app|
  options = Selenium::WebDriver::Chrome::Options.new
  options.add_argument('--headless')
  options.add_argument('--no-sandbox')
  options.add_argument('--disable-dev-shm-usage')
  options.add_argument('--disable-gpu')
  options.add_argument('--disable-features=VizDisplayCompositor')
  options.add_argument('--window-size=1400,1400')

  # Use Chrome for Testing if available
  chrome_path = File.expand_path('~/chrome-for-testing/chrome-linux64/chrome')
  chromedriver_path = File.expand_path('~/chrome-for-testing/chromedriver-linux64/chromedriver')
  
  if File.exist?(chrome_path) && File.exist?(chromedriver_path)
    options.binary = chrome_path
    service = Selenium::WebDriver::Service.chrome(path: chromedriver_path)
    Capybara::Selenium::Driver.new(app, browser: :chrome, options: options, service: service)
  else
    # Fallback to system Chrome
    Capybara::Selenium::Driver.new(app, browser: :chrome, options: options)
  end
end

Capybara.register_driver :chrome do |app|
  options = Selenium::WebDriver::Chrome::Options.new
  options.add_argument('--no-sandbox')
  options.add_argument('--disable-dev-shm-usage')
  options.add_argument('--window-size=1400,1400')

  # Use Chrome for Testing if available
  chrome_path = File.expand_path('~/chrome-for-testing/chrome-linux64/chrome')
  chromedriver_path = File.expand_path('~/chrome-for-testing/chromedriver-linux64/chromedriver')
  
  if File.exist?(chrome_path) && File.exist?(chromedriver_path)
    options.binary = chrome_path
    service = Selenium::WebDriver::Service.chrome(path: chromedriver_path)
    Capybara::Selenium::Driver.new(app, browser: :chrome, options: options, service: service)
  else
    # Fallback to system Chrome
    Capybara::Selenium::Driver.new(app, browser: :chrome, options: options)
  end
end

# Use headless Chrome by default
Capybara.default_driver = :chrome_headless
Capybara.javascript_driver = :chrome_headless

# For debugging, you can switch to regular Chrome:
# Capybara.default_driver = :chrome if ENV['DEBUG']

# Configure Capybara settings
Capybara.default_max_wait_time = 10
Capybara.server_port = 3001

# Asset compilation for testing
Capybara.asset_host = 'http://localhost:3001'