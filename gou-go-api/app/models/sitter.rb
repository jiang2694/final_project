class Sitter < ApplicationRecord
  belongs_to :user
  has_many :bookings, dependent: :destroy
  has_many :reviews, dependent: :destroy
  # validates :first_name, presence: true
  # validates :last_name, presence: true
  # validates :price, presence: true
  # validates :img_url, presence: true
  # validates :description, presence: true
  # validates :postcode, presence: true
  # validates :walks_per_day, presence: true
  # validates :dog_weight, presence: true
  def json
    {
      **self.attributes.except("password_digest", "created_at", "updated_at"),
      rating:
        self.reviews.count > 0 ? self.reviews.average(:rating).round(2).to_f : 0
    }
  end

  def json_with_reviews
    {
      **self.attributes.except("password_digest", "created_at", "updated_at"),
      rating:
        (
          if self.reviews.count > 0
            self.reviews.average(:rating).round(2).to_f
          else
            0
          end
        ),
      reviews: self.reviews.map { |review| review.json }
    }
  end
end
