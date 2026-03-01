class Api::CategoriesController < ApplicationController
  def index
    categories = Category.order(:name)
    render json: categories
  end

  def create
    category = Category.new(category_params)

    if category.save
      render json: category, status: :created
    else
      # NOTE: Ideally, standardize validation error formatting across other controllers
      render json: {
        errors: category.errors.to_hash.transform_values do |messages|
          messages.map do |message|
            formatted = message.capitalize
            formatted.end_with?(".") ? formatted : "#{formatted}."
          end
        end
      }, status: :unprocessable_entity
    end
  end

  private

  def category_params
    params.require(:category).permit(:name, :emoji)
  end
end
