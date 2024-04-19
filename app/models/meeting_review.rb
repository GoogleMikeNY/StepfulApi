class MeetingReview < ApplicationRecord
  belongs_to :slot, dependent: :destroy
end
