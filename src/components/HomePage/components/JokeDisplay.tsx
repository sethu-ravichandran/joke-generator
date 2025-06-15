'use client'

import { DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import { Joke } from '@/components/HomePage/types/joke'

interface JokeDisplayProps {
  joke: Joke | null
  isLoading: boolean
  onCopyJoke: () => void
}

export const JokeDisplay: React.FC<JokeDisplayProps> = ({
  joke,
  isLoading,
  onCopyJoke
}) => {
  const getJokeText = () => {
    if (!joke) return ''
    if (joke.type === 'twopart') {
      return `${joke.setup}\n\n${joke.delivery}`
    }
    return joke.joke || ''
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4 min-h-[200px] relative border border-gray-200 dark:border-gray-700">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : joke ? (
        <>
          <div className="flex items-start justify-between">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
              {joke.category}
            </span>
            <button
              onClick={onCopyJoke}
              className="p-1.5 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
              aria-label="Copy joke"
              data-testid="copy-joke-button"
            >
              <DocumentDuplicateIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            {joke.type === 'twopart' ? (
              <>
                <div>
                  <div className="text-xs uppercase tracking-wide text-purple-600 dark:text-purple-400 font-semibold mb-2">
                    Setup
                  </div>
                  <p className="text-lg text-purple-800 dark:text-white leading-relaxed">
                    {joke.setup}
                  </p>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-purple-600 dark:text-purple-400 font-semibold mb-2">
                    Punchline
                  </div>
                  <p className="text-lg text-purple-800 dark:text-white leading-relaxed font-medium">
                    {joke.delivery}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-lg text-purple-800 dark:text-white leading-relaxed">
                {joke.joke}
              </p>
            )}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          <p className="text-center">
            Click "Get New Joke" to start laughing! 😄
          </p>
        </div>
      )}
    </div>
  )
}
