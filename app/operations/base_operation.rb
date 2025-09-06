# frozen_string_literal: true

class BaseOperation
  include ActiveModel::Model
  include ActiveModel::Attributes

  attr_reader :result, :errors

  def initialize(params = {})
    @errors = ActiveModel::Errors.new(self)
    super
  end

  def self.call(params = {})
    new(params).call
  end

  def call
    return failure(['Invalid parameters']) unless valid?

    begin
      @result = execute
      success(@result)
    rescue StandardError => e
      Rails.logger.error("#{self.class.name} failed: #{e.message}")
      failure([e.message])
    end
  end

  def success?
    @success == true
  end

  def failure?
    !success?
  end

  private

  def execute
    raise NotImplementedError, "#{self.class.name} must implement #execute method"
  end

  def success(result)
    @success = true
    @result = result
    self
  end

  def failure(error_messages)
    @success = false
    @errors.add(:base, error_messages) if error_messages.is_a?(Array)
    @errors.add(:base, error_messages) if error_messages.is_a?(String)
    self
  end
end
