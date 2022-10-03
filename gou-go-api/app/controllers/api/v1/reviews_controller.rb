class Api::V1::ReviewsController < ApplicationController
  before_action :authorize_user, only: %i[create destroy]
  before_action :find_sitter, only: :create
  before_action :find_review, only: %i[show destroy]
  before_action :find_reviews, only: :index

  def index
    render json: Resp.success(@reviews.map { |review| review.json })
  end

  def show
    render json: Resp.success(@review.json)
  end

  def create
    @review = Review.new(review_params)
    @review.sitter = @sitter
    @review.user = @current_user
    if @review.save
      render json: Resp.success(@review.json), status: :created
    else
      render json: Resp.error(@review.errors.full_messages),
             status: :unprocessable_entity
    end
  end

  def destroy
    if @review.user_id == @current_user.id
      @review.destroy
      render json: Resp.success
    else
      render json: Resp.error("You can not remove this review"),
             status: :unprocessable_entity
    end
  end

  private

  def find_sitter
    if !params[:sitter_id]
      render json: Resp.error(sitter_id needs to be provided),
             status: :unprocessable_entity
      return
    end
    @sitter = Sitter.find_by!(id: params[:sitter_id])
  rescue ActiveRecord::RecordNotFound
    render json: Resp.error("Sitter not found"), status: :unprocessable_entity
  end

  def find_review
    if !params[:id]
      render json: Resp.error("id is required"), status: :unprocessable_entity
      return
    end
    @review = Review.find_by!(id: params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: Resp.error("Review not found"), status: :not_found
  end

  def find_reviews
    if params[:sitter_id]
      @reviews = Review.where(sitter_id: params[:sitter_id])
    else
      @reviews = Review.all
    end
  end

  def review_params
    params.permit(:rating, :body, :sitter_id)
  end
end
