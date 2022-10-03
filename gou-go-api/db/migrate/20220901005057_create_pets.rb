class CreatePets < ActiveRecord::Migration[7.0]
  def change
    create_table :pets do |t|
      t.string :name
      t.integer :age
      t.text :breed
      t.float :weight
      t.integer :sex
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
