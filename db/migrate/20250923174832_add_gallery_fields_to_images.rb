class AddGalleryFieldsToImages < ActiveRecord::Migration[7.1]
  def change
    add_column :images, :tags, :text, array: true, default: []
    add_column :images, :alt_text, :string
    add_column :images, :is_featured, :boolean, default: false

    add_index :images, :tags, using: 'gin'
    add_index :images, :is_featured
  end
end
