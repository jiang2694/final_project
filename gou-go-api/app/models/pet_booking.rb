class PetBooking < ApplicationRecord
  belongs_to :pet
  belongs_to :booking
end
