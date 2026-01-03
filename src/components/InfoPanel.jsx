import React from 'react'
import { TestTube } from 'lucide-react'
import { hasTestFunctions } from '../data/testFunctions'
import ExplanationTab from './ExplanationTab'
import AITab from './AITab'
import TestPanel from './TestPanel'

function InfoPanel({
  example,
  activeInfoTab,
  setActiveInfoTab,
  testParams,
  setTestParams,
  testResults,
  isTesting,
  onTestCall,
  code,
  activeLanguage,
}) {
  const tabs = ['Explanation', 'AI']
  if (hasTestFunctions(example.id)) {
    tabs.push('fn Test')
  }

  return (
    <div className="lg:basis-2/5 bg-white dark:bg-near-dark rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden">
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-800 px-3 pt-3 flex text-xs md:text-sm">
        {tabs.map((label) => {
          const key = label.toLowerCase().split(' ')[0]
          const normalizedKey = key === 'ai' ? 'ai' : key === 'fn' ? 'test' : key
          const isActive = activeInfoTab === normalizedKey
          return (
            <button
              key={label}
              onClick={() => setActiveInfoTab(normalizedKey)}
              className={`flex-1 px-3 py-2 rounded-t-lg border-b-2 -mb-px flex items-center justify-center gap-1.5 ${
                isActive
                  ? 'border-near-primary text-near-primary font-semibold'
                  : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              {label === 'fn Test' && <TestTube className="h-3.5 w-3.5" />}
              {label}
            </button>
          )
        })}
      </div>

      <div className="flex-1 p-4 text-sm flex flex-col">
        {activeInfoTab === 'explanation' && <ExplanationTab example={example} />}
        {activeInfoTab === 'ai' && <AITab code={code} example={example} activeLanguage={activeLanguage} />}
        {activeInfoTab === 'test' && hasTestFunctions(example.id) && (
          <TestPanel
            exampleId={example.id}
            testParams={testParams}
            setTestParams={setTestParams}
            testResults={testResults}
            isTesting={isTesting}
            onTestCall={onTestCall}
          />
        )}
      </div>
    </div>
  )
}

export default InfoPanel

