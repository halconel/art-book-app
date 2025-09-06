class CreateFutureArts < ActiveRecord::Migration[7.1]
  def change
    create_table :future_arts do |t|
      t.references :order, null: false, foreign_key: { to_table: :order_queues }
      t.string :title, null: false
      t.text :description
      t.string :preview_image_url
      t.integer :status, default: 0, null: false
      t.integer :cycles_spent, default: 0
      t.datetime :started_at
      t.datetime :completed_at
      t.date :delivery_date
      t.integer :quality_rating
      t.text :client_feedback

      t.timestamps
    end

    add_index :future_arts, [:order_id, :status]
    add_index :future_arts, :status
    add_index :future_arts, :delivery_date
  end
end
