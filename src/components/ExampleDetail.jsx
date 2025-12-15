import React, { useState } from 'react'
import { ArrowLeft, Code2, Play, Rocket, ExternalLink, TimerResetIcon, CopyIcon } from 'lucide-react'
import { difficultyColors, languageIcons } from '../data/examples'

function ExampleDetail({ example, onBack }) {
  const difficultyClass = difficultyColors[example.difficulty] || difficultyColors['Beginner']
  const [activeLanguage, setActiveLanguage] = useState(example.language || 'Rust')
  const languageIcon = languageIcons[activeLanguage] || '📄'
  const [activeInfoTab, setActiveInfoTab] = useState('ai') // 'explanation' | 'ai' | 'output' | 'tests'

  return (
    <div className="pl-4 py-6 md:py-4 max-w-5xl mx-auto space-y-6 ">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-near-primary transition-colors mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="font-medium">Back to Examples</span>
      </button>

      {/* Example Header */}
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

      {/* Main 3-panel learning interface */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT PANEL – Code Editor */}
        <div className="lg:basis-3/5 bg-white dark:bg-near-dark rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden">
          {/* Top toolbar */}
          <div className="border-b border-gray-200 dark:border-gray-800 px-3 md:px-4 py-2.5 md:py-3 flex flex-wrap items-center gap-2">
            {/* Language tabs */}
            <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-near-darker overflow-hidden text-[0.65rem] md:text-xs">
              <button
                className={`px-3 py-1.5 font-semibold ${
                  activeLanguage === 'Rust'
                    ? 'bg-near-primary text-near-darker'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => setActiveLanguage('Rust')}
              >
                Rust
              </button>
              <button
                className={`px-3 py-1.5 ${
                  activeLanguage === 'JavaScript'
                    ? 'bg-near-primary text-near-darker font-semibold'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => setActiveLanguage('JavaScript')}
              >
                JavaScript
              </button>
              <button
                className={`px-3 py-1.5 ${
                  activeLanguage === 'TypeScript'
                    ? 'bg-near-primary text-near-darker font-semibold'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => setActiveLanguage('TypeScript')}
              >
                TypeScript
              </button>
            </div>

            <div className="flex-1" />

            {/* Action buttons */}
            <button  className="px-2.5 md:px-3 py-1.5 text-[0.65rem] md:text-xs border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
              <TimerResetIcon className='h-4 w-4'/>
            </button>
            <button className="px-2.5 md:px-3 py-1.5 text-[0.65rem] md:text-xs border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
              <CopyIcon className='h-4 w-4'/>
            </button>
            <button className="px-2.5 md:px-3 py-1.5 text-[0.65rem] md:text-xs bg-near-primary hover:bg-[#00D689] text-near-darker font-semibold rounded-lg inline-flex items-center gap-1">
              <Play className="h-4 w-4" />
              Run
            </button>
            <button className="px-2.5 md:px-3 py-1.5 text-[0.65rem] md:text-xs border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 inline-flex items-center gap-1">
              <Rocket className="h-4 w-4" />
              Deploy
            </button>
          </div>

          {/* Code editor area */}
          <div className="flex-1 bg-[#020617] text-gray-100 font-mono text-xs md:text-sm overflow-auto p-4 space-y-3">
            <div className="flex items-center justify-between text-[0.65rem] text-gray-400">
              <span>Editor (simulated) – connect Monaco/CodeMirror here</span>
                <span>{activeLanguage} • NEAR SDK</span>
            </div>
            <pre className="whitespace-pre overflow-x-auto">
{`1  // ${example.name} example
2  // TODO: Integrate real Monaco/CodeMirror editor here
3  // with NEAR SDK auto-complete, error underlining, etc.
4
5  #[near_bindgen]
6  impl Contract {
7      pub fn hello_world(&self) -> String {
8          "Hello, NEAR!".to_string()
9      }
10 }`}
            </pre>
          </div>

          {/* Bottom status bar */}
          <div className="border-t border-gray-800 bg-[#020617] px-3 md:px-4 py-1.5 md:py-2 text-[0.7rem] text-gray-400 flex items-center justify-between">
            <span>Lines: 10 • Chars: 180 (approx)</span>
            <span>{activeLanguage} • Ready to run ✓</span>
          </div>
        </div>

        {/* MIDDLE PANEL – Docs & AI */}
        <div className="lg:basis-2/5 bg-white dark:bg-near-dark rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-800 px-3 pt-3 flex gap-1.5 md:gap-2 text-xs md:text-sm">
            {['Explanation', 'AI Assistant'].map((label) => {
              const key = label.toLowerCase().split(' ')[0] // explanation, ai, expected, tests
              const normalizedKey = key === 'ai' ? 'ai' : key === 'expected' ? 'output' : key
              const isActive = activeInfoTab === normalizedKey
              return (
                <button
                  key={label}
                  onClick={() => setActiveInfoTab(normalizedKey)}
                  className={`px-3 py-2 rounded-t-lg border-b-2 -mb-px ${
                    isActive
                      ? 'border-near-primary text-near-primary font-semibold'
                      : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>

          <div className="flex-1 p-4 overflow-auto text-sm space-y-4">
            {/* Explanation Tab */}
            {activeInfoTab === 'explanation' && (
              <div className="space-y-4">
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
            )}

            {/* AI Assistant Tab */}
            {activeInfoTab === 'ai' && (
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-near-darker rounded-lg p-3 text-xs text-gray-600 dark:text-gray-300 space-y-2">
                  <p className="font-semibold mb-2">Ask about this code...</p>
                  <div className="space-y-1">
                    <p className="text-gray-500 dark:text-gray-400">Suggested questions:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>What does line 7 do?</li>
                      <li>How does this contract return "Hello, NEAR!"?</li>
                      <li>Why would I use promises in cross-contract calls?</li>
                    </ul>
                  </div>
                </div>

                {/* Chat input (static UI placeholder) */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-2 flex flex-col gap-2 bg-white dark:bg-near-dark">
                  <textarea
                    rows={3}
                    className="w-full bg-transparent text-xs text-gray-800 dark:text-gray-100 outline-none resize-none"
                    placeholder="💬 Ask a question about this example..."
                  />
                  <div className="flex justify-end pt-1">
                    <button className="px-3 py-1.5 text-xs bg-near-primary text-near-darker font-semibold rounded-md hover:bg-[#00D689]">
                      Ask AI
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        
      </div>
      {/* RIGHT PANEL – Execution & Results */}
      <div className="bg-white dark:bg-near-dark rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col gap-4">
          {/* Console Output */}
          <div className="border-b border-gray-200 dark:border-gray-800 pb-3 px-4 pt-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Console Output
            </h3>
            <div className="bg-gray-50 dark:bg-near-darker rounded-lg p-3 text-[0.7rem] font-mono text-gray-800 dark:text-gray-100 max-h-60 overflow-auto">
{`▶ Running contract...

✓ Contract compiled
✓ Deployed to sandbox
✓ Calling hello_world()

Output:
"Hello, NEAR!"

Gas used: 2.4 TGas
Status: Success ✓`}
            </div>
          </div>

          {/* Deployment status */}
          <div className="px-4 pb-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Deployment
            </h3>
            <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
              <p>
                Status:{' '}
                <span className="inline-flex items-center gap-1 text-green-500 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Deployed to TestNet
                </span>
              </p>
              <p>
                Contract ID:{' '}
                <span className="font-mono text-[0.7rem] text-gray-800 dark:text-gray-100">
                  example-contract.testnet
                </span>
              </p>
              <p>
                Tx Hash:{' '}
                <span className="font-mono text-[0.7rem] text-gray-800 dark:text-gray-100">
                  4g7...abc123
                </span>
              </p>
              <p>
                Deployment cost:{' '}
                <span className="font-semibold text-gray-800 dark:text-gray-100">
                  ~0.2 Ⓝ (est.)
                </span>
              </p>
              <a
                href="https://explorer.testnet.near.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-near-primary hover:text-[#00D689]"
              >
                <ExternalLink className="h-3 w-3" />
                View on Explorer
              </a>
            </div>
          </div>
        </div>
    </div>
  )
}

export default ExampleDetail

