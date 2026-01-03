import React from 'react'
import { ExternalLink } from 'lucide-react'

function ConsolePanel({ consoleOutput, deployedContractId, deploymentTxHash }) {
  return (
    <div className="bg-white dark:bg-near-dark rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col gap-4">
      {/* Console Output */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-3 px-4 pt-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Console Output
        </h3>
        <div className="bg-gray-50 dark:bg-near-darker rounded-lg p-3 text-[0.7rem] font-mono text-gray-800 dark:text-gray-100 max-h-60 overflow-auto whitespace-pre-wrap">
          {consoleOutput || 'Console output will appear here when you run or deploy...'}
        </div>
      </div>

      {/* Deployment status */}
      <div className="px-4 pb-4 space-y-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Deployment
        </h3>
        <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
          {deployedContractId ? (
            <>
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
                  {deployedContractId}
                </span>
              </p>
              {deploymentTxHash && (
                <p>
                  Tx Hash:{' '}
                  <span className="font-mono text-[0.7rem] text-gray-800 dark:text-gray-100">
                    {deploymentTxHash}
                  </span>
                </p>
              )}
              <a
                href={`https://explorer.testnet.near.org/accounts/${deployedContractId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-near-primary hover:text-[#00D689]"
              >
                <ExternalLink className="h-3 w-3" />
                View on Explorer
              </a>
            </>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No contract deployed yet. Click "Deploy" to deploy your contract.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ConsolePanel

