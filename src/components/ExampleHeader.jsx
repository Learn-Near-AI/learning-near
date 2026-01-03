import React from 'react'
import { difficultyColors, languageIcons } from '../data/examples'

function ExampleHeader({ example, activeLanguage }) {
  const difficultyClass = difficultyColors[example.difficulty] || difficultyColors['Beginner']
  const languageIcon = languageIcons[activeLanguage] || '📄'

  return (
    <div className="bg-white dark:bg-near-dark rounded-xl p-5 md:p-6 border border-gray-200 dark:border-gray-800">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="text-4xl">{languageIcon}</div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {example.name}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {example.category} • {activeLanguage}
            </p>
          </div>
        </div>
        <span
          className={`text-xs md:text-sm px-3 py-1 md:px-4 md:py-2 rounded-full border ${difficultyClass} font-medium whitespace-nowrap`}
        >
          {example.difficulty}
        </span>
      </div>
    </div>
  )
}

export default ExampleHeader

