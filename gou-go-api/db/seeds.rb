# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)
def random_bool
  [true, false].sample
end

DEFAULT_PASSWORD = "111111"
CORE_USER_EMAIL = "1@1.com"
CORE_SITTER_EMAIL = "2@2.com"

BREEDS = [
  "Labrador Retriever",
  "French Bulldog",
  "German Shepherd",
  "Golden Retriever",
  "English Bulldog",
  "Poodle",
  "Beagle",
  "Rottweiler"
]

IMAGES = %w[
  https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?cs=srgb&dl=pexels-valeria-boltneva-1805164.jpg&fm=jpg
  https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?cs=srgb&dl=pexels-chevanon-photography-1108099.jpg&fm=jpg
  https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?cs=srgb&dl=pexels-johann-1254140.jpg&fm=jpg
  https://images.pexels.com/photos/220938/pexels-photo-220938.jpeg?cs=srgb&dl=pexels-pixabay-220938.jpg&fm=jpg
  https://images.pexels.com/photos/33053/dog-young-dog-small-dog-maltese.jpg?cs=srgb&dl=pexels-pixabay-33053.jpg&fm=jpg
  https://images.pexels.com/photos/825949/pexels-photo-825949.jpeg?cs=srgb&dl=pexels-gilberto-reyes-825949.jpg&fm=jpg
  https://images.pexels.com/photos/235805/pexels-photo-235805.jpeg?cs=srgb&dl=pexels-pixabay-235805.jpg&fm=jpg
  https://images.pexels.com/photos/1390784/pexels-photo-1390784.jpeg?cs=srgb&dl=pexels-hoy-1390784.jpg&fm=jpg
  https://images.pexels.com/photos/36372/pexels-photo.jpg?cs=srgb&dl=pexels-vladimir-kudinov-36372.jpg&fm=jpg
  https://images.pexels.com/photos/1322182/pexels-photo-1322182.jpeg?cs=srgb&dl=pexels-brett-sayles-1322182.jpg&fm=jpg
  https://images.pexels.com/photos/1458925/pexels-photo-1458925.jpeg?cs=srgb&dl=pexels-poodles-doodles-1458925.jpg&fm=jpg
  https://images.pexels.com/photos/776373/pexels-photo-776373.jpeg?cs=srgb&dl=pexels-leah-kelley-776373.jpg&fm=jpg
  https://images.pexels.com/photos/2248516/pexels-photo-2248516.jpeg?cs=srgb&dl=pexels-andrew-neel-2248516.jpg&fm=jpg
  https://images.pexels.com/photos/3361739/pexels-photo-3361739.jpeg?cs=srgb&dl=pexels-goochie-poochie-grooming-3361739.jpg&fm=jpg
  https://images.pexels.com/photos/2013662/pexels-photo-2013662.jpeg?cs=srgb&dl=pexels-juris-freidenfelds-2013662.jpg&fm=jpg
]
# PetBooking.destroy_all
Review.destroy_all
Pet.destroy_all
Booking.destroy_all
Sitter.destroy_all
User.destroy_all

# Create a core user for testing
core_user =
  User.create(
    first_name: "FirstName",
    last_name: "LastName",
    email: CORE_USER_EMAIL,
    profile_img_url: "https://loremflickr.com/640/640/face?random=16",
    password: DEFAULT_PASSWORD,
    address: Faker::Address.full_address
  )

# Create pets for core user
4.times do |n|
  Pet.create(
    name: Faker::Name.first_name,
    age: rand(1..10),
    breed: BREEDS.sample,
    weight: rand(1.0..100.0).round(2).to_f,
    sex: rand(1..2),
    user_id: core_user.id
  )
end

core_user = User.find_by(id: core_user.id)

# Create core sitter user
core_sitter_user =
  User.create(
    first_name: "SitterName",
    last_name: "SitterLastName",
    email: CORE_SITTER_EMAIL,
    profile_img_url: IMAGES.sample,
    password: DEFAULT_PASSWORD,
    address: Faker::Address.full_address
  )

# Create core sitter
core_sitter =
  Sitter.create(
    img_url: IMAGES.sample,
    first_name: core_sitter_user.first_name,
    last_name: core_sitter_user.last_name,
    price: rand(1000..15_000),
    description: Faker::Hipster.sentence,
    postcode: Faker::Address.postcode,
    walks_per_day: rand(1..5),
    dog_weight: rand(1.0..100.0).round(2).to_f,
    user_id: core_sitter_user.id
  )

# Create reviews for core sitter
rand(4..5).times do |n|
  Review.create(
    rating: rand(1..5),
    body: Faker::Hipster.sentence,
    user_id: core_sitter_user.id,
    sitter_id: core_sitter.id
  )
end

4.times do |n|
  booking =
    Booking.create(
      price: rand(1000..9000),
      time: Faker::Time.forward(days: rand(1..20)),
      duration: [30, 60, 90, 120].sample,
      user_id: core_user.id,
      sitter_id: core_sitter.id,
      pets: core_user.pets
    )
  # user.pets.each do |pet|
  #   pet_booking = PetBooking.create(pet_id: pet.id, booking_id: booking.id)
  # end
end

100.times do |n|
  username = Faker::Name.first_name
  user =
    User.create(
      first_name: Faker::Name.first_name,
      last_name: Faker::Name.last_name,
      email: "#{username}@1.com",
      profile_img_url: "https://loremflickr.com/640/640/face?random=#{n + 1}",
      password: DEFAULT_PASSWORD,
      address: Faker::Address.full_address
    )
  if random_bool
    sitter =
      Sitter.create(
        img_url: IMAGES.sample,
        first_name: user.first_name,
        last_name: user.last_name,
        price: rand(100..5000),
        description: Faker::Hipster.sentence,
        postcode: Faker::Address.postcode,
        walks_per_day: rand(1..5),
        dog_weight: rand(1.0..100.0).round(2).to_f,
        user_id: user.id
      )
  else
    rand(1..4).times do |n|
      pet =
        Pet.create(
          name: Faker::Name.first_name,
          age: rand(1..10),
          breed: BREEDS.sample,
          weight: rand(1.0..100.0).round(2).to_f,
          sex: rand(1..2),
          user_id: user.id
        )
    end
  end
end

users = User.all
sitters = Sitter.all
pets = Pet.all

sitters.each do |sitter|
  rand(1..5).times do |n|
    Review.create(
      rating: rand(1..5),
      body: Faker::Hipster.sentence,
      user_id: users.sample.id,
      sitter_id: sitter.id
    )
  end
end

reviews = Review.all

users.each do |user|
  p user.sitter
  if (user.pets.count > 0)
    rand(1..4).times do |n|
      booking =
        Booking.create(
          price: rand(1000..9000),
          time: Faker::Time.forward(days: rand(1..20)),
          duration: [30, 60, 90, 120].sample,
          user_id: user.id,
          sitter_id: sitters.sample.id,
          pets: user.pets
        )
      # user.pets.each do |pet|
      #   pet_booking = PetBooking.create(pet_id: pet.id, booking_id: booking.id)
      # end
    end
  end
end
# 200.time do |n|
#   Booking.create()
# end

bookings = Booking.all
# petbookings = PetBooking

p "Create #{users.count} users, #{sitters.count} sitters, #{pets.count} pets, #{reviews.count} reviews, #{bookings.count} bookings,"
