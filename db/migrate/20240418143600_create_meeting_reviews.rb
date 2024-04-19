class CreateMeetingReviews < ActiveRecord::Migration[7.1]
  def change
    create_table :meeting_reviews do |t|
      t.integer :rating
      t.text :notes
      t.references :slot, null: false, foreign_key: true

      t.timestamps
    end
  end
end
