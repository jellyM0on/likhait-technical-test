class SetEmojisForDefaultCategories < ActiveRecord::Migration[7.2]
  def change
    reversible do |dir|
      dir.up do
        updates = {
          1 => "🍔", # Food
          2 => "🚗", # Transportation
          3 => "🎬", # Entertainment
          4 => "🛍️", # Shopping
          5 => "📄", # Bills
          6 => "🏥", # Healthcare
          7 => "📚", # Education
          8 => "✈️", # Travel
          9 => "💆", # Personal
          10 => "📦" # Other
        }

        updates.each do |id, emoji|
          Category.where(id: id, emoji: nil).update_all(emoji: emoji)
        end
      end

      dir.down do
        Category.where(id: 1..10).update_all(emoji: nil)
      end
    end
  end
end
