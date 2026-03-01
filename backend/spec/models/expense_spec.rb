require 'rails_helper'

RSpec.describe Expense, type: :model do
  let!(:category) { Category.create!(name: "Food") }

  describe "validations" do
    it "is invalid if date is in the future" do
      expense = Expense.new(
        description: "Future expense",
        amount: 100.00,
        category: category,
        date: Date.today + 1
      )

      expect(expense).not_to be_valid
      expect(expense.errors[:date]).to include("cannot be in the future")
    end
  end
end
