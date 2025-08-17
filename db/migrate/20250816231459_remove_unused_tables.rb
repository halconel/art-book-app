class RemoveUnusedTables < ActiveRecord::Migration[7.1]
  def change
    # Remove foreign key constraint from projects table
    remove_reference :projects, :user, foreign_key: true, if_exists: true
    
    # Remove unused tables
    drop_table :users if table_exists?(:users)
  end
end
