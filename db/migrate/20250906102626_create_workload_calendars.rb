class CreateWorkloadCalendars < ActiveRecord::Migration[7.1]
  def change
    create_table :workload_calendars do |t|
      t.date :date, null: false
      t.integer :cycles_completed, default: 0
      t.boolean :is_personal_project, default: false
      t.integer :intensity_level, default: 0
      t.text :notes

      t.timestamps
    end

    add_index :workload_calendars, :date, unique: true
    add_index :workload_calendars, [:date, :is_personal_project]
  end
end
