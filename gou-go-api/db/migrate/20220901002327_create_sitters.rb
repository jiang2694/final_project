class CreateSitters < ActiveRecord::Migration[7.0]
  def change
    create_table :sitters do |t|
      t.string :first_name
      t.string :last_name
      t.integer :price
      t.text :img_url
      t.text :description
      t.text :postcode
      t.integer :walks_per_day
      t.integer :dog_weight
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
