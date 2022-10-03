class Review < ApplicationRecord
  belongs_to :user
  belongs_to :sitter

  def json
    return(
      {
        **self.attributes,
        author_name: self.user.first_name,
        author_img_url: self.user.profile_img_url
      }
    )
  end
end
