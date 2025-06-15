'use client'

import { RecentJoke } from '@/components/HomePage/types/joke'
import { formatDistanceToNow } from 'date-fns'
import { useEffect, useState } from 'react'

interface RecentJokesProps {
  jokes?: RecentJoke[]
  onJokeSelect: (joke: RecentJoke) => void
}

// Utility functions for localStorage operations
const STORAGE_KEY = 'recentJokes'

export const saveJokesToStorage = (jokes: RecentJoke[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jokes))
  } catch (error) {
    console.error('Failed to save jokes to localStorage:', error)
  }
}

export const loadJokesFromStorage = (): RecentJoke[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const jokes = JSON.parse(stored)
      // Convert timestamp strings back to Date objects
      return jokes.map((joke: any) => ({
        ...joke,
        timestamp: new Date(joke.timestamp)
      }))
    }
  } catch (error) {
    console.error('Failed to load jokes from localStorage:', error)
  }
  return []
}

export const RecentJokes: React.FC<RecentJokesProps> = ({
  jokes: externalJokes,
  onJokeSelect
}) => {
  const [localJokes, setLocalJokes] = useState<RecentJoke[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load jokes from localStorage on component mount
  useEffect(() => {
    const savedJokes = loadJokesFromStorage()
    setLocalJokes(savedJokes)
    setIsLoading(false)
  }, [])

  // Save jokes to localStorage whenever external jokes change
  useEffect(() => {
    if (externalJokes && externalJokes.length > 0) {
      saveJokesToStorage(externalJokes)
      setLocalJokes(externalJokes)
    }
  }, [externalJokes])

  // Use external jokes if provided, otherwise use local jokes from localStorage
  const jokesToDisplay = externalJokes || localJokes

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-purple-800 dark:text-white">
            Recent Jokes
          </h3>
        </div>
        <div className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (jokesToDisplay.length === 0) {
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
        {jokesToDisplay.map((joke, index) => (
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