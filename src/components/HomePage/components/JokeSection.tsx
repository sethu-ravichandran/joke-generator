
import { JokeGenerator } from '@/components/HomePage/components/JokeGenerator'

const JokeSection = () => {
  return (
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
  )
}

export default JokeSection