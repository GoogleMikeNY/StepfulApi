class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.string :name
      t.string :phone_number
      t.string :email
      t.integer :user_type

      t.timestamps
    end
  end
end
