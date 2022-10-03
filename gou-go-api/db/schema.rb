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

ActiveRecord::Schema[7.0].define(version: 2022_09_01_175117) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "bookings", force: :cascade do |t|
    t.integer "price"
    t.datetime "time"
    t.integer "duration"
    t.bigint "user_id", null: false
    t.bigint "sitter_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["sitter_id"], name: "index_bookings_on_sitter_id"
    t.index ["user_id"], name: "index_bookings_on_user_id"
  end

  create_table "pet_bookings", force: :cascade do |t|
    t.bigint "pet_id", null: false
    t.bigint "booking_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["booking_id"], name: "index_pet_bookings_on_booking_id"
    t.index ["pet_id"], name: "index_pet_bookings_on_pet_id"
  end

  create_table "pets", force: :cascade do |t|
    t.string "name"
    t.integer "age"
    t.text "breed"
    t.float "weight"
    t.integer "sex"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_pets_on_user_id"
  end

  create_table "reviews", force: :cascade do |t|
    t.integer "rating"
    t.text "body"
    t.bigint "user_id", null: false
    t.bigint "sitter_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["sitter_id"], name: "index_reviews_on_sitter_id"
    t.index ["user_id"], name: "index_reviews_on_user_id"
  end

  create_table "sitters", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.integer "price"
    t.text "img_url"
    t.text "description"
    t.text "postcode"
    t.integer "walks_per_day"
    t.integer "dog_weight"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_sitters_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.string "email"
    t.string "password_digest"
    t.text "profile_img_url"
    t.text "address"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "bookings", "sitters"
  add_foreign_key "bookings", "users"
  add_foreign_key "pet_bookings", "bookings"
  add_foreign_key "pet_bookings", "pets"
  add_foreign_key "pets", "users"
  add_foreign_key "reviews", "sitters"
  add_foreign_key "reviews", "users"
  add_foreign_key "sitters", "users"
end
