class Api::V1::BookingsController < ApplicationController
  before_action :authorize_user
  before_action :find_sitter, only: :create
  before_action :find_booking, only: %i[show destroy]
  before_action :find_bookings, only: :index

  def index
    render json: Resp.success(@bookings.map { |booking| booking.json })
  end

  def show
    render json: Resp.success(@booking.json)
  end

  def create
    if params[:pets] == nil
      render json: Resp.error("[pets] parameter required"),
             status: :unprocessable_entity
      return
    end
    p params[:pets]
    pets = Pet.where(id: params[:pets])
    if pets.count <= 0
      render json: Resp.error("Can not find the pets"),
             status: :unprocessable_entity
      return
    end

    @booking = Booking.new(booking_params)
    @booking.sitter = @sitter
    @booking.user = @current_user
    @booking.price = (@sitter.price / 60 * params[:duration].to_i).round()
    @booking.pets = pets
    if @booking.save
      render json: Resp.success(@booking.json), status: :created
    else
      render json: Resp.error(@booking.errors.full_messages),
             status: :unprocessable_entity
    end
    # p params[:pets]
    # p JSON.parse(params[:pets]).join(", ")
  end

  def destroy
    if @booking.destroy
      render json: Resp.success
    else
      render json: Resp.error(@booking.errors.full_messages),
             status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    render json: Resp.error("Booking not found"), status: :unprocessable_entity
  end

  private

  def find_sitter
    if params[:sitter_id] == nil
      render json: Resp.error(sitter_id needs to be provided),
             status: :unprocessable_entity
      return
    end
    @sitter = Sitter.find_by!(id: params[:sitter_id])
  rescue ActiveRecord::RecordNotFound
    render json: Resp.error("Sitter not found"), status: :unprocessable_entity
  end

  def find_booking
    if params[:id] == nil
      render json: Resp.error("id is required"), status: :unprocessable_entity
      return
    end
    if @current_user.is_sitter
      @booking = @current_user.sitter.bookings.find_by!(id: params[:id])
    else
      @booking = @current_user.bookings.find_by!(id: params[:id])
    end
  rescue ActiveRecord::RecordNotFound
    render json: Resp.error("Booking not found"), status: :not_found
  end

  def find_bookings
    if (@current_user.is_sitter)
      @bookings = @current_user.sitter.bookings.to_set
    else
      @bookings = @current_user.bookings.to_set
    end
  end

  def booking_params
    params.permit(:time, :duration, :sitter_id)
  end
end
