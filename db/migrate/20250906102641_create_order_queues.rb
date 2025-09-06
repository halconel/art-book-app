class CreateOrderQueues < ActiveRecord::Migration[7.1]
  def change
    create_table :order_queues do |t|
      t.references :client, null: false, foreign_key: { to_table: :users }
      t.string :title, null: false
      t.text :description
      t.integer :estimated_cycles
      t.integer :priority, default: 0
      t.integer :status, default: 0, null: false
      t.string :created_via
      t.string :external_reference
      t.date :deadline
      t.json :metadata
      t.text :encrypted_price
      t.string :encrypted_price_iv

      t.timestamps
    end

    add_index :order_queues, [:client_id, :status]
    add_index :order_queues, :status
    add_index :order_queues, :deadline
  end
end
