class AddShowOnMainPageToImages < ActiveRecord::Migration[7.1]
  def change
    add_column :images, :show_on_main_page, :boolean, default: false
  end
end
