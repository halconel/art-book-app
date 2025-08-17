class RemoveCropParametersFromImages < ActiveRecord::Migration[7.1]
  def change
    remove_column :images, :crop_x, :decimal
    remove_column :images, :crop_y, :decimal
    remove_column :images, :crop_width, :decimal
    remove_column :images, :crop_height, :decimal
  end
end
