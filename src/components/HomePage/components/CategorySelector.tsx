'use client'

import { JokeCategory } from '@/components/HomePage/types/joke'

interface CategorySelectorProps {
  selectedCategory: JokeCategory
  onCategoryChange: (category: JokeCategory) => void
}

const categories: JokeCategory[] = [
  'Any',
  'Programming',
  'Misc',
  'Pun',
  'Spooky',
  'Christmas'
]

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-purple-800 dark:text-white">
        Category
      </label>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedCategory === category
                ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                : 'bg-gray-100 dark:bg-gray-700 text-purple-800 dark:text-white hover:bg-purple-100 dark:hover:bg-gray-600'
            }`}
            data-testid={`category-${category.toLowerCase()}`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}
