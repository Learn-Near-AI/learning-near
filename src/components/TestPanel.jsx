import React from 'react'
import { Play, Rocket, Loader2 } from 'lucide-react'
import { testFunctions } from '../data/testFunctions'

function TestPanel({ exampleId, testParams, setTestParams, testResults, isTesting, onTestCall }) {
  const functions = testFunctions[exampleId]
  if (!functions) return null

  return (
    <div className="flex flex-col flex-1 gap-4 overflow-auto">
      <div className="space-y-4 flex-1 overflow-auto">
        {/* View Methods */}
        {functions.viewMethods.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              View Methods (Read-Only)
            </h3>
            <div className="space-y-3">
              {functions.viewMethods.map((method) => (
                <div
                  key={method.name}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-near-darker"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-mono text-xs font-semibold text-gray-900 dark:text-white">
                        {method.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                        {method.description}
                      </p>
                    </div>
                  </div>
                  
                  {method.params.length > 0 && (
                    <div className="space-y-2 mb-2">
                      {method.params.map((param) => (
                        <div key={param.name}>
                          <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                            {param.name} ({param.type})
                          </label>
                          <input
                            type={param.type === 'number' ? 'number' : 'text'}
                            value={testParams[`${method.name}_${param.name}`] || ''}
                            onChange={(e) =>
                              setTestParams((prev) => ({
                                ...prev,
                                [`${method.name}_${param.name}`]: e.target.value,
                              }))
                            }
                            placeholder={param.placeholder}
                            className="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-near-dark text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-near-primary"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => onTestCall(method, true)}
                    disabled={isTesting}
                    className="w-full px-3 py-1.5 text-xs bg-near-primary hover:bg-[#00D689] text-near-darker font-semibold rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    {isTesting ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3" />
                        Test {method.name}
                      </>
                    )}
                  </button>

                  {testResults[method.name] && (
                    <div
                      className={`mt-2 p-2 rounded text-xs ${
                        testResults[method.name].success
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                      }`}
                    >
                      {testResults[method.name].success ? (
                        <div>
                          <p className="font-semibold">✓ Success</p>
                          <p className="font-mono mt-1 break-all">
                            {JSON.stringify(testResults[method.name].result)}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-semibold">✗ Error</p>
                          <p className="mt-1">{testResults[method.name].error}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Change Methods */}
        {functions.changeMethods.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Change Methods
            </h3>
            <div className="space-y-3">
              {functions.changeMethods.map((method) => (
                <div
                  key={method.name}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-near-darker"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-mono text-xs font-semibold text-gray-900 dark:text-white">
                        {method.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                        {method.description}
                      </p>
                    </div>
                  </div>

                  {method.params.length > 0 && (
                    <div className="space-y-2 mb-2">
                      {method.params.map((param) => (
                        <div key={param.name}>
                          <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                            {param.name} ({param.type})
                          </label>
                          <input
                            type={param.type === 'number' ? 'number' : 'text'}
                            value={testParams[`${method.name}_${param.name}`] || ''}
                            onChange={(e) =>
                              setTestParams((prev) => ({
                                ...prev,
                                [`${method.name}_${param.name}`]: e.target.value,
                              }))
                            }
                            placeholder={param.placeholder}
                            className="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-near-dark text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-near-primary"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => onTestCall(method, false)}
                    disabled={isTesting}
                    className="w-full px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    {isTesting ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <Rocket className="h-3 w-3" />
                        Call {method.name}
                      </>
                    )}
                  </button>

                  {testResults[method.name] && (
                    <div
                      className={`mt-2 p-2 rounded text-xs ${
                        testResults[method.name].success
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                      }`}
                    >
                      {testResults[method.name].success ? (
                        <div>
                          <p className="font-semibold">✓ Success</p>
                          {testResults[method.name].result?.txHash && (
                            <p className="font-mono mt-1 text-[0.65rem] break-all">
                              Tx: {testResults[method.name].result.txHash}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div>
                          <p className="font-semibold">✗ Error</p>
                          <p className="mt-1">{testResults[method.name].error}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TestPanel

