class AddCropParametersToImages < ActiveRecord::Migration[7.1]
  def change
    add_column :images, :crop_x, :decimal, precision: 5, scale: 2, default: 0.0
    add_column :images, :crop_y, :decimal, precision: 5, scale: 2, default: 0.0
    add_column :images, :crop_width, :decimal, precision: 5, scale: 2, default: 1.0
    add_column :images, :crop_height, :decimal, precision: 5, scale: 2, default: 1.0
  end
end
