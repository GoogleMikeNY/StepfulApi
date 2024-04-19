# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

Slot.destroy_all
User.destroy_all

student_1 = User.create(
  name: Faker::Name.name,
  phone_number: Faker::PhoneNumber.cell_phone,
  user_type: User.user_types[:student]
)
student_2 = User.create(
  name: Faker::Name.name,
  phone_number: Faker::PhoneNumber.cell_phone,
  user_type: User.user_types[:student]
)
student_3 = User.create(
  name: Faker::Name.name,
  phone_number: Faker::PhoneNumber.cell_phone,
  user_type: User.user_types[:student]
)
coach_1 = User.create(
  name: Faker::Name.name,
  phone_number: Faker::PhoneNumber.cell_phone,
  user_type: User.user_types[:coach]
)
coach_2 = User.create(
  name: Faker::Name.name,
  phone_number: Faker::PhoneNumber.cell_phone,
  user_type: User.user_types[:coach]
)
coach_3 = User.create(
  name: Faker::Name.name,
  phone_number: Faker::PhoneNumber.cell_phone,
  user_type: User.user_types[:coach]
)
st1 = Faker::Time.between(from: 4.hour.ago, to: 2.day.ago)
st2 = Faker::Time.between(from: 6.hour.ago, to: 2.day.ago)
st3 = Faker::Time.between(from: 5.day.ago, to: 1.day.ago)
Slot.create(
  coach_id: coach_1.id,
  start_time: st1,
  end_time: st1 + 2.hour,
  status: 'available'
)
Slot.create(
  coach_id: coach_1.id,
  start_time: st1,
  end_time: st1 + 2.hour,
  status: 'available'
)
Slot.create(
  coach_id: coach_2.id,
  start_time: st2,
  end_time: st2 + 2.hour,
  status: 'available'
)
Slot.create(
  coach_id: coach_2.id,
  start_time: st2,
  end_time: st2 + 2.hour,
  status: 'available'
)
Slot.create(
  coach_id: coach_3.id,
  start_time: st3,
  end_time: st3 + 2.hour,
  status: 'available'
)
Slot.create(
  coach_id: coach_3.id,
  start_time: st3,
  end_time: st3 + 2.hour,
  status: 'available'
)