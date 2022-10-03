class Api::V1::UsersController < ApplicationController
  before_action :authorize_user, except: :create
  # before_action :find_user, only: %i[update show destroy]

  # GET /users
  def index
    @users = User.all
    render json: Resp.success(@users)
  end

  # GET /users/{username}
  def show
    render json: Resp.success(JsonWebToken.userJson(@current_user))
  end

  # POST /users
  def create
    @user = User.new(user_params)
    if @user.save
      render json: Resp.success(JsonWebToken.userJson(@user)), status: :created
    else
      render json: Resp.error(@user.errors.full_messages),
             status: :unprocessable_entity
    end
  end

  # PUT /users/{username}
  def update
    if @current_user.update(user_edit_params)
      render json: Resp.success(JsonWebToken.userJson(@current_user))
    else
      render json: Resp.error(@user.errors.full_messages),
             status: :unprocessable_entity
    end
  end

  # def update_password
  #   if @current_user.update(user_edit_params)
  #     render json: Resp.success
  #   else
  #     render json: Resp.error(@user.errors.full_messages),
  #            status: :unprocessable_entity
  #   end
  # end

  # DELETE /users/{username}
  # def destroy
  #   @user.destroy
  # end

  private

  # def find_user
  #   @user = User.find_by_email!(params[:_email])
  # rescue ActiveRecord::RecordNotFound
  #   render json: Resp.error("User not found"), status: :unprocessable_entity
  # end

  def user_params
    params.permit(
      :profile_img_url,
      :first_name,
      :last_name,
      :email,
      :address,
      :password,
      :password_confirmation
    )
  end
  def user_edit_params
    params.permit(:profile_img_url, :first_name, :last_name, :address)
  end
end
