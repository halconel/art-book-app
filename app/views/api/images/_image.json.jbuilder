# frozen_string_literal: true

json.extract! image, :id, :caption, :project_id, :img_url, :crop_x, :crop_y, :crop_width, :crop_height
json.crop_style image.crop_style
json.crop_css_properties image.crop_css_properties
json.has_custom_crop image.has_custom_crop?
