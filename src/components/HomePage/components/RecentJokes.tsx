'use client'

import { RecentJoke } from '@/components/HomePage/types/joke'
import { formatDistanceToNow } from 'date-fns'

interface RecentJokesProps {
  jokes: RecentJoke[]
  onJokeSelect: (joke: RecentJoke) => void
}

export const RecentJokes: React.FC<RecentJokesProps> = ({
  jokes,
  onJokeSelect
}) => {
  if (jokes.length === 0) {
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-purple-800 dark:text-white">
          Recent Jokes
        </h3>
      </div>
      <div className="max-h-64 overflow-y-auto">
        {jokes.map((joke, index) => (
          <button
            key={`${joke.id}-${index}`}
            onClick={() => onJokeSelect(joke)}
            className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            data-testid={`recent-joke-${index}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-purple-800 dark:text-white truncate">
                  {joke.type === 'twopart' ? joke.setup : joke.joke}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                    {joke.category}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(joke.timestamp, { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
