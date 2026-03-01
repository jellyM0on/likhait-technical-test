class Expense < ApplicationRecord
  belongs_to :category

  validates :description, presence: true, length: { maximum: 255 }
  validates :amount, presence: true, numericality: { greater_than: 0 }
  validates :date, presence: true
  validates :category_id, presence: true
end
