class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.string :email, null: false
      t.string :first_name
      t.string :last_name
      t.string :phone
      t.text :contact_info
      t.text :encrypted_contact_info
      t.string :encrypted_contact_info_iv
      t.string :password_digest, null: false
      t.integer :role, default: 0, null: false
      t.datetime :verified_at
      t.string :verification_token
      t.string :reset_password_token
      t.datetime :reset_password_sent_at

      t.timestamps
    end

    add_index :users, :email, unique: true
    add_index :users, :phone
    add_index :users, :verification_token
    add_index :users, :reset_password_token
  end
end
