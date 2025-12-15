import React from 'react'
import { difficultyColors, languageIcons } from '../data/examples'

function ExampleCard({ example, isSelected, onClick }) {
  const difficultyClass = difficultyColors[example.difficulty] || difficultyColors['Beginner']
  const languageIcon = languageIcons[example.language] || '📄'

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
        isSelected
          ? 'bg-near-primary/20 border-l-2 border-near-primary text-near-primary'
          : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-sm flex-shrink-0">{languageIcon}</span>
          <span className={`text-sm truncate ${isSelected ? 'font-semibold' : 'font-medium'}`}>
            {example.name}
          </span>
        </div>
        <span
          className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${difficultyClass}`}
        >
          {example.difficulty.charAt(0)}
        </span>
      </div>
    </button>
  )
}

export default ExampleCard

