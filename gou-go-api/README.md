# README

```rb
User
rails g model user first_name:string last_name:string email:string password_digest:string profile_img_url:text address:text

rails g controller api/v1/users

Sitter
rails g model sitter first_name:string last_name:string price:integer img_url:text description:text postcode:text walks_per_day:integer dog_weight:integer user:references

rails g controller api/v1/sitters

Pet
rails g model pet name:string age:integer breed:text weight:float sex:integer user:references

rails g controller api/v1/pets

Booking
rails g model booking price:integer time:datetime duration:integer user:references sitter:references

rails g controller api/v1/bookings

PetBooking Join Table
rails g model pet_booking pet:references booking:references

For has_and_belongs_to_many
rails g migration CreatePetsBookings
#edit the migration

Review
rails g model review rating:integer body:text user:references sitter:references

rails g controller api/v1/review
```

```rb
# load lib
# config/application.rb
config.autoload_paths << "#{Rails.root}/lib"
```

<!-- This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

- Ruby version

- System dependencies

- Configuration

- Database creation

- Database initialization

- How to run the test suite

- Services (job queues, cache servers, search engines, etc.)

- Deployment instructions

- ... -->
