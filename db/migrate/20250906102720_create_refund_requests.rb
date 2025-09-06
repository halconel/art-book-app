class CreateRefundRequests < ActiveRecord::Migration[7.1]
  def change
    create_table :refund_requests do |t|
      t.references :order, null: false, foreign_key: { to_table: :order_queues }
      t.text :reason, null: false
      t.datetime :requested_at, null: false
      t.integer :status, default: 0, null: false
      t.datetime :processed_at
      t.decimal :refund_amount, precision: 10, scale: 2
      t.text :admin_notes

      t.timestamps
    end

    add_index :refund_requests, [:order_id, :status]
    add_index :refund_requests, :status
  end
end
