import React from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import ExampleCard from './ExampleCard'

function CategorySidebar({
  groupedExamples,
  expandedCategories,
  toggleCategory,
  selectedExample,
  handleExampleSelect,
  categoryIcons
}) {
  const categories = Object.keys(groupedExamples).sort()

  if (categories.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        <p>No examples found</p>
        <p className="text-sm mt-2">Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <div className="p-4 mt-4 rounded-lg">
      <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
        Categories
      </h2>
      <div className="space-y-1">
        {categories.map(category => {
          const examples = groupedExamples[category]
          const isExpanded = expandedCategories[category]
          const icon = categoryIcons[category] || '📁'

          return (
            <div key={category} className="mb-2">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-lg flex-shrink-0">{icon}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {category}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                    ({examples.length})
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                )}
              </button>

              {/* Category Items */}
              {isExpanded && (
                <div className="ml-6 mt-1 space-y-1">
                  {examples.map(example => (
                    <ExampleCard
                      key={example.id}
                      example={example}
                      isSelected={selectedExample?.id === example.id}
                      onClick={() => handleExampleSelect(example)}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CategorySidebar

