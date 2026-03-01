require 'rails_helper'

RSpec.describe Category, type: :model do
  describe "associations" do
    it "has many expenses and destroys them when the category is destroyed" do
      category = Category.create!(name: "Food")

      category.expenses.create!(
        description: "Burger",
        amount: 10.0,
        date: Date.today,
      )

      expect { category.destroy }.to change { Expense.count }.by(-1)
    end
  end

  describe "validations" do
    describe "name" do
      it "is required" do
        category = Category.new(name: nil)

        expect(category).not_to be_valid
      end

      it "cannot exceed 100 characters" do
        category = Category.new(name: "a" * 101)

        expect(category).not_to be_valid
      end

      it "must be unique (case-insensitive)" do
        Category.create!(name: "Food")
        duplicate = Category.new(name: "food")

        expect(duplicate).not_to be_valid
      end
    end

    describe "emoji" do
      it "allows emoji to be nil" do
        category = Category.new(name: "Travel", emoji: nil)

        expect(category).to be_valid
      end
    end
  end
end
