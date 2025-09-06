class CreateNotifications < ActiveRecord::Migration[7.1]
  def change
    create_table :notifications do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :notification_type, null: false
      t.string :title, null: false
      t.text :message
      t.datetime :read_at
      t.json :metadata

      t.timestamps
    end

    add_index :notifications, [:user_id, :read_at]
    add_index :notifications, :notification_type
  end
end
