import { Heart } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        <div className="flex justify-center items-center space-x-4 mt-2">
        <span className="flex items-center">
            Built with <Heart className="w-4 h-4 mx-1 text-red-500" /> by
            Sethu Ravichandran
        </span>
        </div>
    </footer>
  )
}

export default Footer