import React, { useState, useMemo } from 'react'
import { examplesData, categoryIcons } from '../data/examples'
import CategorySidebar from './CategorySidebar'
import SearchBar from './SearchBar'
import FiltersPanel from './FiltersPanel'
import WelcomeContent from './WelcomeContent'
import ExampleDetail from './ExampleDetail'

function ExamplesBrowser({ isDark, toggleTheme }) {
  const [selectedExample, setSelectedExample] = useState(null)
  const [comingSoonExample, setComingSoonExample] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [expandedCategories, setExpandedCategories] = useState(() => {
    // Initialize all categories as collapsed by default
    return Object.keys(examplesData).reduce((acc, cat) => {
      acc[cat] = false
      return acc
    }, {})
  })

  // Flatten all examples for search
  const allExamples = useMemo(() => {
    return Object.entries(examplesData).flatMap(([category, examples]) =>
      examples.map(example => ({ ...example, category }))
    )
  }, [])

  // Filter examples based on search, difficulty, and categories
  const filteredExamples = useMemo(() => {
    let filtered = allExamples

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(example =>
        example.name.toLowerCase().includes(query) ||
        example.id.toLowerCase().includes(query) ||
        example.category.toLowerCase().includes(query) ||
        example.difficulty.toLowerCase().includes(query) ||
        example.language.toLowerCase().includes(query)
      )
    }

    // Difficulty filter
    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter(example => example.difficulty === selectedDifficulty)
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(example => selectedCategories.includes(example.category))
    }

    return filtered
  }, [allExamples, searchQuery, selectedDifficulty, selectedCategories])

  // Group filtered examples by category for sidebar
  const groupedExamples = useMemo(() => {
    const grouped = {}
    filteredExamples.forEach(example => {
      if (!grouped[example.category]) {
        grouped[example.category] = []
      }
      grouped[example.category].push(example)
    })
    return grouped
  }, [filteredExamples])

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const handleExampleSelect = (example) => {
    const indexInAll = allExamples.findIndex(e => e.id === example.id)

    // Only the first 10 examples show the full learning interface
    if (indexInAll !== -1 && indexInAll >= 10) {
      setComingSoonExample(example)
      setSelectedExample(null)
    } else {
      setSelectedExample(example)
      setComingSoonExample(null)
    }
  }

  const handleBackToBrowse = () => {
    setSelectedExample(null)
    setComingSoonExample(null)
  }

  const availableCategories = Object.keys(examplesData)
  const availableDifficulties = ['All', 'Beginner', 'Intermediate', 'Advanced']

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-near-darker">
      {/* Top Bar with Search and Filters */}
      <div className="sticky top-16 z-40 bg-white dark:bg-near-dark border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex-1">
            <SearchBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
          <FiltersPanel
            selectedDifficulty={selectedDifficulty}
            setSelectedDifficulty={setSelectedDifficulty}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            availableCategories={availableCategories}
            availableDifficulties={availableDifficulties}
           
          />
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Left Sidebar - 20% width */}
        <div className="w-1/5 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-near-dark">
          <CategorySidebar
            groupedExamples={groupedExamples}
            expandedCategories={expandedCategories}
            toggleCategory={toggleCategory}
            selectedExample={selectedExample}
            handleExampleSelect={handleExampleSelect}
            categoryIcons={categoryIcons}
          />
        </div>

        {/* Main Content Area - 80% width */}
        <div className="flex-1 bg-gray-50 dark:bg-near-darker">
          {selectedExample ? (
            <ExampleDetail example={selectedExample} onBack={handleBackToBrowse} />
          ) : comingSoonExample ? (
            <div className="p-8 max-w-3xl mx-auto">
              <button
                onClick={handleBackToBrowse}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-near-primary mb-4"
              >
                ← Back to examples
              </button>
              <div className="bg-white dark:bg-near-dark rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-6 text-center space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {comingSoonExample.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  The full interactive learning interface for this example is coming soon.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  For now, try one of the first 10 examples to access the full{' '}
                  <span className="font-medium">CODE EXAMPLE PAGE (Main Learning Interface)</span>.
                </p>
              </div>
            </div>
          ) : (
            <WelcomeContent filteredExamples={filteredExamples} onExampleSelect={handleExampleSelect} />
          )}
        </div>
      </div>
    </div>
  )
}

export default ExamplesBrowser

