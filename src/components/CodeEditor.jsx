import React from 'react'
import { Play, Rocket, TimerResetIcon, CopyIcon, Loader2 } from 'lucide-react'

function CodeEditor({
  code,
  setCode,
  activeLanguage,
  setActiveLanguage,
  isRunning,
  isDeploying,
  onRun,
  onDeploy,
  onCopy,
  onReset,
}) {
  return (
    <div className="lg:basis-3/5 bg-white dark:bg-near-dark rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden">
      {/* Top toolbar */}
      <div className="border-b border-gray-200 dark:border-gray-800 px-3 md:px-4 py-2.5 md:py-3 flex flex-wrap items-center gap-2">
        {/* Language tabs */}
        <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-near-darker overflow-hidden text-[0.65rem] md:text-xs">
          <button
            className={`px-3 py-1.5 font-semibold ${
              activeLanguage === 'JavaScript'
                ? 'bg-near-primary text-near-darker'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            onClick={() => setActiveLanguage('JavaScript')}
          >
            JavaScript
          </button>
          <button
            className={`px-3 py-1.5 ${
              activeLanguage === 'Rust'
                ? 'bg-near-primary text-near-darker font-semibold'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            onClick={() => setActiveLanguage('Rust')}
          >
            Rust
          </button>
        </div>

        <div className="flex-1" />

        {/* Action buttons */}
        <button
          onClick={onReset}
          className="px-2.5 md:px-3 py-1.5 text-[0.65rem] md:text-xs border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
          title="Reset code"
        >
          <TimerResetIcon className="h-4 w-4" />
        </button>
        <button
          onClick={onCopy}
          className="px-2.5 md:px-3 py-1.5 text-[0.65rem] md:text-xs border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
          title="Copy code"
        >
          <CopyIcon className="h-4 w-4" />
        </button>
        <button
          onClick={onRun}
          disabled={isRunning || isDeploying}
          className="px-2.5 md:px-3 py-1.5 text-[0.65rem] md:text-xs bg-near-primary hover:bg-[#00D689] text-near-darker font-semibold rounded-lg inline-flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRunning ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Compiling...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Run
            </>
          )}
        </button>
        <button
          onClick={onDeploy}
          disabled={isRunning || isDeploying}
          className="px-2.5 md:px-3 py-1.5 text-[0.65rem] md:text-xs border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 inline-flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeploying ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Deploying...
            </>
          ) : (
            <>
              <Rocket className="h-4 w-4" />
              Deploy
            </>
          )}
        </button>
      </div>

      {/* Code editor area */}
      <div className="flex-1 bg-[#020617] text-gray-100 font-mono text-xs md:text-sm overflow-auto p-4 space-y-3">
        <div className="flex items-center justify-between text-[0.65rem] text-gray-400">
          <span>Code Editor • {activeLanguage}</span>
          <span>NEAR SDK</span>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-full bg-transparent text-gray-100 font-mono text-xs md:text-sm outline-none resize-none whitespace-pre overflow-x-auto"
          spellCheck={false}
          style={{ minHeight: '300px' }}
        />
      </div>

      {/* Bottom status bar */}
      <div className="border-t border-gray-800 bg-[#020617] px-3 md:px-4 py-1.5 md:py-2 text-[0.7rem] text-gray-400 flex items-center justify-between">
        <span>Lines: 10 • Chars: 180 (approx)</span>
        <span>{activeLanguage} • Ready to run ✓</span>
      </div>
    </div>
  )
}

export default CodeEditor

