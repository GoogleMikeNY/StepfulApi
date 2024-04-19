class User < ApplicationRecord
  enum :user_type, { student: 0, coach: 1}
end
