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

ActiveRecord::Schema[7.1].define(version: 2025_09_06_102732) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "cycle_packs", force: :cascade do |t|
    t.bigint "order_id", null: false
    t.integer "pack_number", null: false
    t.integer "cycles_in_pack", default: 14
    t.integer "status", default: 0, null: false
    t.datetime "started_at"
    t.datetime "completed_at"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["order_id", "pack_number"], name: "index_cycle_packs_on_order_id_and_pack_number", unique: true
    t.index ["order_id"], name: "index_cycle_packs_on_order_id"
    t.index ["status"], name: "index_cycle_packs_on_status"
  end

  create_table "future_arts", force: :cascade do |t|
    t.bigint "order_id", null: false
    t.string "title", null: false
    t.text "description"
    t.string "preview_image_url"
    t.integer "status", default: 0, null: false
    t.integer "cycles_spent", default: 0
    t.datetime "started_at"
    t.datetime "completed_at"
    t.date "delivery_date"
    t.integer "quality_rating"
    t.text "client_feedback"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["delivery_date"], name: "index_future_arts_on_delivery_date"
    t.index ["order_id", "status"], name: "index_future_arts_on_order_id_and_status"
    t.index ["order_id"], name: "index_future_arts_on_order_id"
    t.index ["status"], name: "index_future_arts_on_status"
  end

  create_table "images", force: :cascade do |t|
    t.string "img_url", null: false
    t.string "caption"
    t.integer "project_id", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.boolean "show_on_main_page", default: false
    t.string "title"
    t.string "description"
    t.integer "width"
    t.integer "height"
    t.bigint "file_size"
    t.index ["project_id"], name: "index_images_on_project_id"
  end

  create_table "notifications", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.integer "notification_type", null: false
    t.string "title", null: false
    t.text "message"
    t.datetime "read_at"
    t.json "metadata"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["notification_type"], name: "index_notifications_on_notification_type"
    t.index ["user_id", "read_at"], name: "index_notifications_on_user_id_and_read_at"
    t.index ["user_id"], name: "index_notifications_on_user_id"
  end

  create_table "order_queues", force: :cascade do |t|
    t.bigint "client_id", null: false
    t.string "title", null: false
    t.text "description"
    t.integer "estimated_cycles"
    t.integer "priority", default: 0
    t.integer "status", default: 0, null: false
    t.string "created_via"
    t.string "external_reference"
    t.date "deadline"
    t.json "metadata"
    t.text "encrypted_price"
    t.string "encrypted_price_iv"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["client_id", "status"], name: "index_order_queues_on_client_id_and_status"
    t.index ["client_id"], name: "index_order_queues_on_client_id"
    t.index ["deadline"], name: "index_order_queues_on_deadline"
    t.index ["status"], name: "index_order_queues_on_status"
  end

  create_table "projects", force: :cascade do |t|
    t.string "title", null: false
    t.string "description"
    t.string "thumbnail_url", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.bigint "user_id"
    t.integer "status", default: 0
    t.boolean "is_personal", default: true
    t.bigint "cycle_pack_id"
    t.index ["cycle_pack_id"], name: "index_projects_on_cycle_pack_id"
    t.index ["status"], name: "index_projects_on_status"
    t.index ["user_id", "is_personal"], name: "index_projects_on_user_id_and_is_personal"
    t.index ["user_id"], name: "index_projects_on_user_id"
  end

  create_table "refund_requests", force: :cascade do |t|
    t.bigint "order_id", null: false
    t.text "reason", null: false
    t.datetime "requested_at", null: false
    t.integer "status", default: 0, null: false
    t.datetime "processed_at"
    t.decimal "refund_amount", precision: 10, scale: 2
    t.text "admin_notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["order_id", "status"], name: "index_refund_requests_on_order_id_and_status"
    t.index ["order_id"], name: "index_refund_requests_on_order_id"
    t.index ["status"], name: "index_refund_requests_on_status"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", null: false
    t.string "first_name"
    t.string "last_name"
    t.string "phone"
    t.text "contact_info"
    t.text "encrypted_contact_info"
    t.string "encrypted_contact_info_iv"
    t.string "password_digest", null: false
    t.integer "role", default: 0, null: false
    t.datetime "verified_at"
    t.string "verification_token"
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["phone"], name: "index_users_on_phone"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token"
    t.index ["verification_token"], name: "index_users_on_verification_token"
  end

  create_table "workload_calendars", force: :cascade do |t|
    t.date "date", null: false
    t.integer "cycles_completed", default: 0
    t.boolean "is_personal_project", default: false
    t.integer "intensity_level", default: 0
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["date", "is_personal_project"], name: "index_workload_calendars_on_date_and_is_personal_project"
    t.index ["date"], name: "index_workload_calendars_on_date", unique: true
  end

  add_foreign_key "cycle_packs", "order_queues", column: "order_id"
  add_foreign_key "future_arts", "order_queues", column: "order_id"
  add_foreign_key "notifications", "users"
  add_foreign_key "order_queues", "users", column: "client_id"
  add_foreign_key "projects", "cycle_packs"
  add_foreign_key "projects", "users"
  add_foreign_key "refund_requests", "order_queues", column: "order_id"
end
