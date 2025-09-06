# frozen_string_literal: true

# Base class for all operations in the application's controllers.
# Provides common functionality for handling API operations including
# response formatting and pagination.
class ApplicationOperation
  def self.call(...)
    new(...).call
  end

  def initialize(options:)
    @params = options[:params] || {}
  end

  private

  def response_object(object: nil, success: true, errors: [])
    response_struct = Struct.new(:success?, :object, :errors)
    response_struct.new(success, object, errors)
  end

  def paged_response(records: nil, cursor_column: 'created_at')
    response_struct = Struct.new(:list, :has_more, :after)

    objects = fetch_paged_objects(records:, cursor_column:, cursor:, limit:)
    has_more = objects.length > limit
    results = objects.first(limit)

    response_object(object: response_struct.new(results,
                                                has_more,
                                                format_cursor_value(results.last, cursor_column)))
  end

  def cursor = TimeConvertor.string_to_time(@params[:after])
  def limit = [(@params[:limit] || 10).to_i.abs, 100].min

  def fetch_paged_objects(records:, cursor:, cursor_column:, limit:)
    records.where("#{cursor_column} < ?", cursor)
           .limit(limit + 1)
  end

  def format_cursor_value(last_record, cursor_column)
    TimeConvertor.time_to_string_floor(last_record.try(cursor_column.to_sym))
  end
end
