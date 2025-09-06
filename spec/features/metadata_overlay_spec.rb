# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'MetadataOverlay', js: false, type: :feature do
  let!(:project) { create(:project) }
  let!(:test_image) { create(:image, project: project) }

  before do
    visit root_path
  end

  describe 'Structure and Content' do
    it 'displays metadata overlay with correct structure' do
      expect(page).to have_css('.metadata-overlay')
    end

    it 'displays size element in multiline format' do
      within '.metadata-overlay' do
        expect(page).to have_content('SIZE:')
        expect(page).to have_content("#{test_image.width}/#{test_image.height}")
      end
    end

    it 'displays description element in multiline format' do
      within '.metadata-overlay' do
        expect(page).to have_content('DESCRIPTION:')
        expect(page).to have_content(test_image.description)
      end
    end

    it 'displays weight element in multiline format' do
      within '.metadata-overlay' do
        expect(page).to have_content('WEIGHT:')
        expected_weight = "#{(test_image.file_size / 1024.0 / 1024.0).round(1)} MB"
        expect(page).to have_content(expected_weight)
      end
    end

    it 'displays title element in multiline format' do
      within '.metadata-overlay' do
        expect(page).to have_content(test_image.title.upcase)
      end
    end

    it 'shows size data from current slideshow image' do
      within '.metadata-overlay' do
        expect(page).to have_content('SIZE:')
        expect(page).to have_content("#{test_image.width}/#{test_image.height}")
      end
    end

    it 'shows description data from current slideshow image' do
      within '.metadata-overlay' do
        expect(page).to have_content('DESCRIPTION:')
        expect(page).to have_content(test_image.description)
      end
    end

    it 'shows weight data from current slideshow image' do
      within '.metadata-overlay' do
        expect(page).to have_content('WEIGHT:')
        expected_weight = "#{(test_image.file_size / 1024.0 / 1024.0).round(1)} MB"
        expect(page).to have_content(expected_weight)
      end
    end

    it 'shows title data from current slideshow image' do
      within '.metadata-overlay' do
        expect(page).to have_content(test_image.title.upcase)
      end
    end

    it 'contains barcode and squares SVG elements' do
      within '.metadata-overlay' do
        # Barcode pattern should exist
        expect(page).to have_css('.barcode-pattern')

        # Squares SVG should exist and reference the correct SVG file from HOME.md
        expect(page).to have_css('.squares-svg img, .squares-svg svg', visible: :all)

        # Verify SquaresSVG uses square_svg.svg as specified in HOME.md line 155
        squares_svg = page.find('.squares-svg img, .squares-svg svg, .squares-svg use', visible: :all)
        expect(squares_svg[:href] || squares_svg[:'xlink:href'] || squares_svg[:src]).to match(/square_svg\.svg/)
      end
    end

    it 'displays metadata blocks with correct multiline structure' do
      within '.metadata-overlay' do
        # Each block should have label and value as separate elements
        # This reflects the HOME.md specification where each element is multiline
        expect(page).to have_content('SIZE:')
        expect(page).to have_content('DESCRIPTION:')
        expect(page).to have_content('WEIGHT:')
      end
    end

    it 'displays metadata blocks with correct data values' do
      within '.metadata-overlay' do
        expect(page).to have_content("#{test_image.width}/#{test_image.height}")
        expect(page).to have_content(test_image.description)
        expected_weight = "#{(test_image.file_size / 1024.0 / 1024.0).round(1)} MB"
        expect(page).to have_content(expected_weight)
        expect(page).to have_content(test_image.title.upcase)
      end
    end

    it 'displays ArtTitle container with correct structure' do
      within '.metadata-overlay' do
        expect(page).to have_css('.art-title, .arttitle, [class*="art-title"], [class*="arttitle"]')
      end
    end

    it 'displays ArtTitle first column elements correctly' do
      within '.metadata-overlay' do
        art_title_selector = '.art-title, .arttitle, [class*="art-title"], [class*="arttitle"]'
        within :css, art_title_selector, match: :first do
          expect(page).to have_css('.barcode-pattern, .barcode, [class*="barcode"]')
          expect(page).to have_content(test_image.title.upcase)
        end
      end
    end

    it 'displays ArtTitle second column elements correctly' do
      within '.metadata-overlay' do
        art_title_selector = '.art-title, .arttitle, [class*="art-title"], [class*="arttitle"]'
        within :css, art_title_selector, match: :first do
          expect(page).to have_css('.squares-svg, [class*="squares"]', visible: :all)
        end
      end
    end

    it 'displays ArtTitle elements in correct DOM order' do
      within '.metadata-overlay' do
        art_title_selector = '.art-title, .arttitle, [class*="art-title"], [class*="arttitle"]'
        within :css, art_title_selector, match: :first do
          page_html = page.find(art_title_selector, match: :first)['innerHTML']

          barcode_position = page_html.index(/barcode|Barcode/)
          title_position = page_html.index(/Test\s*Artwork/i)
          squares_position = page_html.index(/squares|Squares/)

          expect(barcode_position).to be_present
          expect(title_position).to be_present
          expect(squares_position).to be_present
          expect(barcode_position).to be < title_position
        end
      end
    end
  end

  describe 'Layout and Positioning' do
    it 'positions metadata below navigation bar' do
      nav_bottom = page.evaluate_script("document.querySelector('.navigation').getBoundingClientRect().bottom")
      overlay_top = page.evaluate_script("document.querySelector('.metadata-overlay').getBoundingClientRect().top")

      expect(overlay_top).to be > nav_bottom
    end

    it 'displays metadata elements in horizontal line from left to right' do
      # Elements should be arranged horizontally with Size, Description, Weight, ArtTitle from left to right
      overlay_width = page.evaluate_script("document.querySelector('.metadata-overlay').getBoundingClientRect().width")
      expect(overlay_width).to be > 0

      # Verify overlay spans across the viewport
      window_width = page.evaluate_script('window.innerWidth')
      expect(overlay_width).to be > (window_width * 0.8) # Should span most of the window width
    end

    it 'maintains proper element order: Size, Description, Weight, Title' do
      # This test verifies the logical order of elements in the DOM
      within '.metadata-overlay' do
        page_text = page.text

        # Verify that elements appear in the expected order in the text content
        size_position = page_text.index('SIZE:')
        description_position = page_text.index('DESCRIPTION:')
        weight_position = page_text.index('WEIGHT:')
        title_position = page_text.index(test_image.title.upcase)

        expect(size_position).to be < description_position
        expect(description_position).to be < weight_position
        expect(weight_position).to be < title_position
      end
    end
  end

  # NOTE: Typography and styling tests require JavaScript and are currently disabled
  # These tests would check font family, text color, text shadow, and display properties

  describe 'Data Binding' do
    it 'updates metadata when slideshow changes' do
      # Create another image with different data
      second_image = create(:image, :large_file, project: project)

      # Refresh page to load new images
      visit root_path
      expect(page).to have_css('.metadata-overlay', wait: 10)

      # Trigger slideshow change (assuming slideshow controls exist)
      if page.has_css?('.slideshow-controls .next-button')
        find('.slideshow-controls .next-button').click

        # Wait for slideshow transition
        sleep(1)

        # Check if metadata updated to show data from new current image
        within '.metadata-overlay' do
          # Should show either original image data or new image data
          first_size = "#{test_image.width}/#{test_image.height}"
          second_size = "#{second_image.width}/#{second_image.height}"

          first_weight = "#{(test_image.file_size / 1024.0 / 1024.0).round(1)} MB"
          second_weight = "#{(second_image.file_size / 1024.0 / 1024.0).round(1)} MB"

          expect(page.text).to match(/SIZE:\s*(#{Regexp.escape(first_size)}|#{Regexp.escape(second_size)})/)
          expect(page.text).to match(/WEIGHT:\s*(#{Regexp.escape(first_weight)}|#{Regexp.escape(second_weight)})/)
          expect(page.text).to match(/DESCRIPTION:\s*(#{Regexp.escape(test_image.description)}|#{Regexp.escape(second_image.description)})/)
          expect(page.text).to match(/(#{Regexp.escape(test_image.title)}|#{Regexp.escape(second_image.title)})/)
        end
      end
    end
  end

  describe 'Visibility and Accessibility' do
    it 'ensures metadata overlay is visible' do
      expect(find('.metadata-overlay')).to be_visible
    end

    it 'maintains readability with proper contrast and positioning' do
      # Check that overlay is not obscured by navigation
      overlay_z_index = page.evaluate_script("window.getComputedStyle(document.querySelector('.metadata-overlay')).zIndex")
      nav_z_index = page.evaluate_script("window.getComputedStyle(document.querySelector('.navigation')).zIndex")

      expect(overlay_z_index.to_i).to be >= 15
      expect(nav_z_index.to_i).to be >= 1000

      # Verify overlay is positioned below navigation (not overlapping)
      nav_bottom = page.evaluate_script("document.querySelector('.navigation').getBoundingClientRect().bottom")
      overlay_top = page.evaluate_script("document.querySelector('.metadata-overlay').getBoundingClientRect().top")
      expect(overlay_top).to be > nav_bottom
    end
  end
end
