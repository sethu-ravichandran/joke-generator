import { FaceSmileIcon } from '@heroicons/react/24/outline'
import { ThemeToggle } from '@/components/HomePage/components/ThemeToggle'

const Header = () => {
  return (
    <header className="flex items-center justify-between mb-12">
        <div className="flex items-center space-x-3">
        <FaceSmileIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" data-testid="face-smile-icon"/>
        <h1 className="text-3xl font-bold text-purple-800 dark:text-white">
            Joke Generator
        </h1>
        </div>
        <ThemeToggle />
    </header>
  )
}

export default Header