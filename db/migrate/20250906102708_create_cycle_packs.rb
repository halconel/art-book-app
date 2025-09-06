class CreateCyclePacks < ActiveRecord::Migration[7.1]
  def change
    create_table :cycle_packs do |t|
      t.references :order, null: false, foreign_key: { to_table: :order_queues }
      t.integer :pack_number, null: false
      t.integer :cycles_in_pack, default: 14
      t.integer :status, default: 0, null: false
      t.datetime :started_at
      t.datetime :completed_at
      t.text :notes

      t.timestamps
    end

    add_index :cycle_packs, [:order_id, :pack_number], unique: true
    add_index :cycle_packs, :status
  end
end
