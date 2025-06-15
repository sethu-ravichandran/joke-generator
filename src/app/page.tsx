'use client'

import { ThemeToggle } from '@/components/HomePage/components/ThemeToggle'
import { JokeGenerator } from '@/components/HomePage/components/JokeGenerator'
import { FaceSmileIcon } from '@heroicons/react/24/outline'
import { Github, Heart } from 'lucide-react'

const Home = () => {
  return (
    <div className="min-h-screen w-full bg-white dark:bg-black text-purple-800 dark:text-white transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-4xl min-h-screen flex flex-col">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-3">
            <FaceSmileIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            <h1 className="text-3xl font-bold text-purple-800 dark:text-white">
              Joke Generator
            </h1>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex-1">
          <div className="text-center mb-8">
            <h2 className="text-xl text-purple-600 dark:text-purple-400 mb-2">
              Need a good laugh?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Choose a category and get ready to laugh! Our joke generator pulls
              from a variety of categories to keep you entertained.
            </p>
          </div>

          <JokeGenerator />
        </main>

        <footer className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
          <div className="flex justify-center items-center space-x-4 mt-2">
            <span className="flex items-center">
              Built with <Heart className="w-4 h-4 mx-1 text-red-500" /> by
              Sethu Ravichandran
            </span>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Home
