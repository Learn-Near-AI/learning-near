import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { difficultyColors, languageIcons } from '../data/examples'

function FeaturedCarousel({ examples, onExampleSelect }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerPage = 3
  const totalPages = Math.ceil(examples.length / itemsPerPage)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const currentExamples = examples.slice(
    currentIndex * itemsPerPage,
    currentIndex * itemsPerPage + itemsPerPage
  )

  if (examples.length === 0) return null

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currentExamples.map((example) => {
          const difficultyClass = difficultyColors[example.difficulty] || difficultyColors['Beginner']
          const languageIcon = languageIcons[example.language] || '📄'

          return (
            <button
              key={example.id}
              onClick={() => onExampleSelect(example)}
              className="bg-white dark:bg-near-dark rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:border-near-primary transition-all duration-300 transform hover:-translate-y-2 text-left group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{languageIcon}</span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-near-primary transition-colors">
                    {example.name}
                  </h3>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full border ${difficultyClass}`}
                >
                  {example.difficulty}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {example.category}
              </p>
              <div className="flex items-center text-near-primary text-sm font-medium group-hover:gap-2 transition-all">
                View Example
                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          )
        })}
      </div>

      {/* Navigation Arrows */}
      {totalPages > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white dark:bg-near-dark border border-gray-200 dark:border-gray-800 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-lg"
            aria-label="Previous examples"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white dark:bg-near-dark border border-gray-200 dark:border-gray-800 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-lg"
            aria-label="Next examples"
          >
            <ChevronRight className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-near-primary w-8'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default FeaturedCarousel



