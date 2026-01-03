import React from 'react'

function ExplanationTab({ example }) {
  return (
    <div className="space-y-4 flex-1 overflow-auto">
      <div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
          {example.name}
        </h2>
        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
          What this example covers
        </p>
      </div>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
        This example demonstrates key concepts in NEAR smart contract development for{' '}
        <span className="font-medium">{example.category}</span>. Read the explanation,
        experiment in the editor, then run and deploy your code.
      </p>
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          What you'll learn
        </h3>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
            <span className="text-near-primary mt-0.5">•</span>
            <span>Understanding the core {example.name.toLowerCase()} pattern.</span>
          </li>
          <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
            <span className="text-near-primary mt-0.5">•</span>
            <span>How it fits into {example.category.toLowerCase()} workflows on NEAR.</span>
          </li>
          <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
            <span className="text-near-primary mt-0.5">•</span>
            <span>Best practices for {example.difficulty.toLowerCase()}-level developers.</span>
          </li>
        </ul>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Related examples
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Explore more in the <span className="font-medium">{example.category}</span> category
          from the sidebar to deepen your understanding.
        </p>
      </div>
    </div>
  )
}

export default ExplanationTab

