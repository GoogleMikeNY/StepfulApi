class Slot < ApplicationRecord
  enum :status, { available: 0, booked: 1}

end
