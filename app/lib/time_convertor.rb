# frozen_string_literal: true

# Utility class for converting time formats in API operations
class TimeConvertor
  def self.string_to_time(time_string)
    return Time.current if time_string.blank?

    Time.zone.parse(time_string)
  rescue ArgumentError
    Time.current
  end

  def self.time_to_string_floor(time)
    return nil if time.nil?

    time.floor(0).iso8601
  end
end
