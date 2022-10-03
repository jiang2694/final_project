class Api::V1::PetsController < ApplicationController
  before_action :authorize_user
  before_action :find_pets, only: :index
  before_action :find_pet, only: %i[show destroy]

  def index
    render json: Resp.success(@pets)
  end

  def show
    render json: Resp.success(@pet.json_with_bookings)
  end

  def edit
    if params[:id] == nil
      create
    else
      find_pet
      update if @pet
    end
  end

  def create
    @pet = Pet.new(pet_params)
    @pet.user = @current_user

    if @pet.save
      render json: Resp.success(@pet.json_with_bookings)
    else
      render json: Resp.error(@pet.errors.full_messages),
             status: :unprocessable_entity
    end
  end

  def update
    if @pet.update(pet_params)
      render json: Resp.success(@pet.json_with_bookings)
    else
      render json: Resp.error(@pet.errors.full_messages),
             status: :unprocessable_entity
    end
  end

  def destroy
    if @pet.destroy
      render json: Resp.success
    else
      render json: Resp.error(@pet.errors.full_messages),
             status: :unprocessable_entity
    end
  end

  private

  def find_pet
    if params[:id] == nil
      render json: Resp.error("id is required"), status: :not_found
      return
    end
    @pet = @current_user.pets.find_by!(id: params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: Resp.error("Pet not found"), status: :not_found
  end

  def find_pets
    @pets = @current_user.pets
  end

  def pet_params
    params.permit(:name, :age, :breed, :weight, :sex)
  end
end
