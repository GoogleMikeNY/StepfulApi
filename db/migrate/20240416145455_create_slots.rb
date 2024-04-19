class CreateSlots < ActiveRecord::Migration[7.1]
  def change
    create_table :slots do |t|
      t.integer :coach_id, null: false
      t.datetime :start_time, null: false
      t.datetime :end_time
      t.integer :student_id
      t.integer :status, default: 0

      t.timestamps
    end
    add_foreign_key :slots, :users, column: :coach_id
    add_foreign_key :slots, :users, column: :student_id
    add_index :slots, :coach_id
    add_index :slots, :student_id
  end

end


# def change
#   create_table :slots do |t|
#     t.integer :coach_id, null: false
#     t.datetime :start_time, null: false
#     t.datetime :end_time, null: false
#     t.integer :student_id # assuming a slot can be initially unbooked
#     t.string :status, null: false, default: 'available'
#
#     t.timestamps
#   end
#
#   add_foreign_key :slots, :users, column: :coach_id
#   add_foreign_key :slots, :users, column: :student_id
#   add_index :slots, :coach_id
#   add_index :slots, :student_id
# end
