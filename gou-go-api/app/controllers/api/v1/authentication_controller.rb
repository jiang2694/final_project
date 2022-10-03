class Api::V1::AuthenticationController < ApplicationController
  before_action :authorize_user, except: :login

  def login
    @user = User.find_by_email(params[:email])
    if @user&.authenticate(params[:password])
      render json: Resp.success(JsonWebToken.userJson(@user))
    else
      render json: Resp.error("Invalid credential"), status: :unauthorized
    end
  end

  private

  def login_params
    params.permit(:email, :password)
  end
end
