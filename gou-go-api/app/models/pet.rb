class Pet < ApplicationRecord
  belongs_to :user
  has_many :pet_bookings, dependent: :destroy
  has_many :bookings, through: :pet_bookings
  validates :name, presence: true
  validates :age, presence: true
  validates :breed, presence: true
  validates :weight, presence: true
  validates :sex, presence: true
  def json_with_bookings
    {
      **self.attributes,
      bookings: self.bookings.to_set.map { |booking| booking.json }
    }
  end
end
