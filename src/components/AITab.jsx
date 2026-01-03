import React, { useState, useRef, useEffect } from 'react'
import { GoogleGenAI } from '@google/genai'
import { Loader2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

function AITab({ code, example, activeLanguage }) {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  // Get API key - try environment variable first, then fallback
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBKKgDl1L3m3gZNAB9pDfPjdI3Wxc3rzJA'
  
  // Initialize Gemini AI client
  // The client reads from GEMINI_API_KEY environment variable
  // For browser usage, we'll set it via import.meta.env or pass directly if supported
  const ai = new GoogleGenAI({
    apiKey: API_KEY
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Function to limit text to 500 words
  const limitWords = (text, maxWords = 500) => {
    const words = text.split(/\s+/)
    if (words.length <= maxWords) {
      return text
    }
    return words.slice(0, maxWords).join(' ') + '...'
  }

  const handleAskAI = async () => {
    if (!question.trim() || isLoading) return

    const userQuestion = question.trim()
    setQuestion('')
    setIsLoading(true)

    // Add user message
    const userMessage = { role: 'user', content: userQuestion }
    setMessages(prev => [...prev, userMessage])

    try {
      // Create context about the code and example
      const context = `You are a helpful AI assistant explaining NEAR Protocol smart contracts.

Example: ${example.name}
Language: ${activeLanguage}
Difficulty: ${example.difficulty}

Current code:
\`\`\`${activeLanguage.toLowerCase()}
${code}
\`\`\`

IMPORTANT: 
- Format your response using Markdown (use **bold**, *italic*, code blocks, lists, etc.)
- Keep your response concise and under 500 words maximum
- Be clear and helpful in explaining the code

Please answer the user's question about this code in a clear and helpful way using Markdown formatting.`

      const contents = `${context}\n\nUser question: ${userQuestion}`

      // Use gemini-2.5-flash or gemini-3-pro-preview
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
      })

      let text = response.text

      // Limit response to 300 words
      text = limitWords(text, 300)

      // Add AI response
      setMessages(prev => [...prev, { role: 'assistant', content: text }])
    } catch (error) {
      console.error('AI Error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleAskAI()
    }
  }

  const suggestedQuestions = [
    'What does this contract do?',
    `How does this ${activeLanguage} code work?`,
    'Can you explain the main functions?',
    'What are the key concepts demonstrated here?'
  ]

  return (
    <div className="flex flex-col flex-1 gap-4 min-h-0">
      {/* Chat messages area */}
      <div className="bg-gray-50 dark:bg-near-darker rounded-lg p-3 text-xs text-gray-600 dark:text-gray-300 space-y-3 flex-1 overflow-auto min-h-0">
        {messages.length === 0 ? (
          <>
            <p className="font-semibold mb-2">Ask about this code...</p>
            <div className="space-y-1">
              <p className="text-gray-500 dark:text-gray-400">Suggested questions:</p>
              <ul className="list-disc list-inside space-y-1">
                {suggestedQuestions.map((q, idx) => (
                  <li key={idx} className="cursor-pointer hover:text-near-primary" onClick={() => setQuestion(q)}>
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-near-primary/10 text-gray-800 dark:text-gray-100 ml-4'
                    : 'bg-white dark:bg-near-dark text-gray-700 dark:text-gray-300 mr-4'
                }`}
              >
                <div className="font-semibold mb-1 text-[0.7rem] opacity-70">
                  {msg.role === 'user' ? 'You' : 'AI Assistant'}
                </div>
                {msg.role === 'assistant' ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none leading-relaxed">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                        li: ({ children }) => <li className="ml-2">{children}</li>,
                        code: ({ children, className }) => {
                          const isInline = !className
                          return isInline ? (
                            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-[0.7rem]">{children}</code>
                          ) : (
                            <code className="block bg-gray-200 dark:bg-gray-700 p-2 rounded text-[0.7rem] overflow-x-auto">{children}</code>
                          )
                        },
                        pre: ({ children }) => <pre className="bg-gray-200 dark:bg-gray-700 p-2 rounded text-[0.7rem] overflow-x-auto mb-2">{children}</pre>,
                        h1: ({ children }) => <h1 className="text-base font-bold mb-2 mt-2">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-sm font-bold mb-2 mt-2">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-xs font-bold mb-1 mt-2">{children}</h3>,
                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                        em: ({ children }) => <em className="italic">{children}</em>,
                        blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-2 italic mb-2">{children}</blockquote>,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 p-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>AI is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-2 flex flex-col gap-2 bg-white dark:bg-near-dark">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={handleKeyPress}
          rows={3}
          className="w-full bg-transparent text-xs text-gray-800 dark:text-gray-100 outline-none resize-none"
          placeholder="💬 Ask a question about this example..."
          disabled={isLoading}
        />
        <div className="flex justify-end pt-1">
          <button
            onClick={handleAskAI}
            disabled={isLoading || !question.trim()}
            className="px-3 py-1.5 text-xs bg-near-primary text-near-darker font-semibold rounded-md hover:bg-[#00D689] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Asking...
              </>
            ) : (
              'Ask AI'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AITab
