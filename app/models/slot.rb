class Slot < ApplicationRecord
  enum :status, { available: 0, booked: 1}

  has_one :meeting_review, dependent: :destroy
  scope :available_or_student, -> (student_id) {
    where("status = ? OR student_id = ?", 0, student_id)
  }


end
