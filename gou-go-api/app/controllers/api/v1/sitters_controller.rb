class Api::V1::SittersController < ApplicationController
  before_action :authorize_user, only: %i[create edit]
  before_action :sitter_user, only: %i[destroy]
  before_action :find_sitter, only: %i[show]

  def index
    price_min = params[:price_min].to_i
    price_max = params[:price_max].to_i
    weight = params[:weight].to_f
    walks_per_day = params[:per_day].to_i

    @sitters = Sitter.all

    @sitters =
      @sitters.where("price BETWEEN ? AND ?", price_min, price_max) if (
      price_max > price_min && price_max > 0
    )
    @sitters = @sitters.where("dog_weight >= ?", weight) if (weight > 0.0)
    @sitters = @sitters.where("walks_per_day >= ?", walks_per_day) if (
      walks_per_day > 0
    )

    render json:
             Resp.success(@sitters.map { |sitter| sitter.json_with_reviews })
  end

  def show
    render json: Resp.success(@sitter.json_with_reviews)
  end

  def edit
    @sitter = @current_user.sitter || Sitter.new(sitter_params)
    @sitter.assign_attributes(sitter_params)
    if @sitter.save
      render json: Resp.success(@sitter)
    else
      render json: Resp.error(@sitter.errors.full_messages),
             status: :unprocessable_entity
    end
  end

  def destroy
    @current_user.sitter?.destroy
    render json: Resp.success
  end

  private

  def find_sitter
    @sitter = Sitter.find_by!(id: params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { errors: "Sitter not found" }, status: :not_found
  end

  def sitter_params
    params.permit(
      :img_url,
      :first_name,
      :last_name,
      :price,
      :description,
      :postcode,
      :walks_per_day,
      :dog_weight
    )
  end
end
