require "rails_helper"

RSpec.describe Expense, type: :model do
  let!(:category) { Category.create!(name: "Food") }

  describe "associations" do
    it "belongs to a category" do
      expense = Expense.new(
        description: "Lunch",
        amount: 100.00,
        date: Date.current,
        category: category
      )

      expect(expense.category).to eq(category)
    end
  end

  describe "validations" do
    it "is valid with valid attributes" do
      expense = Expense.new(
        description: "Lunch",
        amount: 100.00,
        date: Date.current,
        category: category
      )

      expect(expense).to be_valid
    end

    it "is invalid without a description" do
      expense = Expense.new(
        description: nil,
        amount: 100.00,
        date: Date.current,
        category: category
      )

      expect(expense).not_to be_valid
      expect(expense.errors[:description]).to be_present
    end

    it "is invalid when description is empty" do
      expense = Expense.new(
        description: "",
        amount: 100.00,
        date: Date.current,
        category: category
      )

      expect(expense).not_to be_valid
      expect(expense.errors[:description]).to be_present
    end

    it "is invalid when description is too long" do
      expense = Expense.new(
        description: "a" * 256,
        amount: 100.00,
        date: Date.current,
        category: category
      )

      expect(expense).not_to be_valid
      expect(expense.errors[:description]).to be_present
    end

    it "is invalid without an amount" do
      expense = Expense.new(
        description: "Lunch",
        amount: nil,
        date: Date.current,
        category: category
      )

      expect(expense).not_to be_valid
      expect(expense.errors[:amount]).to be_present
    end

    it "is invalid when amount is 0" do
      expense = Expense.new(
        description: "Lunch",
        amount: 0,
        date: Date.current,
        category: category
      )

      expect(expense).not_to be_valid
      expect(expense.errors[:amount]).to be_present
    end

    it "is invalid when amount is negative" do
      expense = Expense.new(
        description: "Lunch",
        amount: -1,
        date: Date.current,
        category: category
      )

      expect(expense).not_to be_valid
      expect(expense.errors[:amount]).to be_present
    end

    it "is invalid without a date" do
      expense = Expense.new(
        description: "Lunch",
        amount: 100.00,
        date: nil,
        category: category
      )

      expect(expense).not_to be_valid
      expect(expense.errors[:date]).to be_present
    end

    it "is invalid without a category" do
      expense = Expense.new(
        description: "Lunch",
        amount: 100.00,
        date: Date.current,
        category: nil
      )

      expect(expense).not_to be_valid
      expect(expense.errors[:category]).to be_present
    end
  end
end