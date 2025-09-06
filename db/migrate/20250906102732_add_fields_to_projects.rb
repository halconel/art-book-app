class AddFieldsToProjects < ActiveRecord::Migration[7.1]
  def change
    add_reference :projects, :user, null: true, foreign_key: true
    add_column :projects, :status, :integer, default: 0
    add_column :projects, :is_personal, :boolean, default: true
    add_reference :projects, :cycle_pack, null: true, foreign_key: true

    add_index :projects, [:user_id, :is_personal]
    add_index :projects, :status
  end
end
