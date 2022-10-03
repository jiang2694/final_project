class Resp
  def self.success(data = {})
    { success: true, data: data }
  end

  def self.error(message, code = 100)
    { success: false, code: code, message: message }
  end
end
