import React from 'react'
import { ArrowRight, Code2, Sparkles, Rocket } from 'lucide-react'
import FeaturedCarousel from './FeaturedCarousel'

function WelcomeContent({ filteredExamples, onExampleSelect }) {
  const featuredExamples = filteredExamples.slice(0, 6)

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Welcome Message */}
      <div className="text-center mb-12" data-aos="fade-up">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-near-primary/10 rounded-full mb-6">
          <Code2 className="h-10 w-10 text-near-primary" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to NEAR Examples
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Select an example from the sidebar to begin learning. Explore interactive code examples,
          run them in your browser, and deploy to TestNet with one click.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-near-dark rounded-xl p-6 border border-gray-200 dark:border-gray-800 text-center">
          <div className="text-3xl font-bold text-near-primary mb-2">
            {filteredExamples.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredExamples.length === 1 ? 'Example' : 'Examples'} Available
          </div>
        </div>
        <div className="bg-white dark:bg-near-dark rounded-xl p-6 border border-gray-200 dark:border-gray-800 text-center">
          <div className="text-3xl font-bold text-near-primary mb-2">
            {new Set(filteredExamples.map(e => e.category)).size}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
        </div>
        <div className="bg-white dark:bg-near-dark rounded-xl p-6 border border-gray-200 dark:border-gray-800 text-center">
          <div className="text-3xl font-bold text-near-primary mb-2">
            {new Set(filteredExamples.map(e => e.difficulty)).size}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Difficulty Levels</div>
        </div>
      </div>

      {/* Featured Examples Carousel */}
      {featuredExamples.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Featured Examples
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Sparkles className="h-4 w-4" />
              <span>Start with these popular examples</span>
            </div>
          </div>
          <FeaturedCarousel
            examples={featuredExamples}
            onExampleSelect={onExampleSelect}
          />
        </div>
      )}

      {/* Getting Started Guide */}
      <div className="bg-white dark:bg-near-dark rounded-xl p-8 border border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Getting Started
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-near-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-bold text-near-primary">1</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Browse Examples
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Explore examples by category or use the search bar to find specific topics.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-near-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-bold text-near-primary">2</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Learn & Experiment
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Read the code, ask questions, and modify examples to see how they work.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-near-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Rocket className="h-6 w-6 text-near-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Deploy & Build
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Deploy your contracts to TestNet and start building real applications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomeContent


