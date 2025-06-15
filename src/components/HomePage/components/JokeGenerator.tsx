'use client'

import React, { useState, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { CategorySelector } from './CategorySelector'
import { JokeDisplay } from './JokeDisplay'
import { JokeControls } from './JokeControls'
import { RecentJokes } from './RecentJokes'
import { fetchJoke, copyToClipboard } from '@/lib/jokeApi'
import {
  Joke,
  RecentJoke,
  JokeCategory
} from '@/components/HomePage/types/joke'

export const JokeGenerator: React.FC = () => {
  const [currentJoke, setCurrentJoke] = useState<Joke | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<JokeCategory>('Any')
  const [recentJokes, setRecentJokes] = useState<RecentJoke[]>([])

  const handleGetNewJoke = useCallback(async () => {
    setIsLoading(true)
    try {
      const joke = await fetchJoke(selectedCategory)
      setCurrentJoke(joke)

      const recentJoke: RecentJoke = {
        ...joke,
        timestamp: new Date()
      }
      setRecentJokes((prev) => [recentJoke, ...prev.slice(0, 9)])

      toast.success('New joke loaded!')
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch joke'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [selectedCategory])

  const handleCopyJoke = useCallback(async () => {
    if (!currentJoke) return

    try {
      let jokeText = ''
      if (currentJoke.type === 'twopart') {
        jokeText = `${currentJoke.setup}\n\n${currentJoke.delivery}`
      } else {
        jokeText = currentJoke.joke || ''
      }

      await copyToClipboard(jokeText)
      toast.success('Joke copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy joke')
    }
  }, [currentJoke])

  const handleJokeSelect = useCallback((joke: RecentJoke) => {
    setCurrentJoke(joke)
    setSelectedCategory(joke.category as JokeCategory)
  }, [])

  return (
    <div className="space-y-8">
      <CategorySelector
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <JokeDisplay
        joke={currentJoke}
        isLoading={isLoading}
        onCopyJoke={handleCopyJoke}
      />

      <JokeControls onGetNewJoke={handleGetNewJoke} isLoading={isLoading} />

      <RecentJokes jokes={recentJokes} onJokeSelect={handleJokeSelect} />
    </div>
  )
}
