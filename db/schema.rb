# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2024_04_18_143600) do
  create_table "meeting_reviews", force: :cascade do |t|
    t.integer "rating"
    t.text "notes"
    t.integer "slot_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["slot_id"], name: "index_meeting_reviews_on_slot_id"
  end

  create_table "slots", force: :cascade do |t|
    t.integer "coach_id", null: false
    t.datetime "start_time", null: false
    t.datetime "end_time"
    t.integer "student_id"
    t.integer "status", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["coach_id"], name: "index_slots_on_coach_id"
    t.index ["student_id"], name: "index_slots_on_student_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "phone_number"
    t.string "email"
    t.integer "user_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "meeting_reviews", "slots"
  add_foreign_key "slots", "users", column: "coach_id"
  add_foreign_key "slots", "users", column: "student_id"
end
