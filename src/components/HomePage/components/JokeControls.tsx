'use client'

import { ArrowPathIcon } from '@heroicons/react/24/outline'

interface JokeControlsProps {
  onGetNewJoke: () => void
  isLoading: boolean
}

export const JokeControls: React.FC<JokeControlsProps> = ({
  onGetNewJoke,
  isLoading
}) => {
  return (
    <div className="flex justify-center">
      <button
        onClick={onGetNewJoke}
        disabled={isLoading}
        className="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none transition-all duration-200"
        data-testid="get-new-joke-button"
      >
        <ArrowPathIcon
          className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`}
        />
        <span>{isLoading ? 'Loading...' : 'Get New Joke'}</span>
      </button>
    </div>
  )
}
