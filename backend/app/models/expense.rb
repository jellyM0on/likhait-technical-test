class Expense < ApplicationRecord
  belongs_to :category

  validate :date_must_not_be_in_future

  private

  def date_must_not_be_in_future
    if date.present? && date > Date.today
      errors.add(:date, "cannot be in the future")
    end
  end
end
