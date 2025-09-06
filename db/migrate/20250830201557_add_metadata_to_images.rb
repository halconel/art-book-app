class AddMetadataToImages < ActiveRecord::Migration[7.1]
  def change
    add_column :images, :title, :string
    add_column :images, :description, :string
    add_column :images, :width, :integer
    add_column :images, :height, :integer
    add_column :images, :file_size, :bigint
  end
end
