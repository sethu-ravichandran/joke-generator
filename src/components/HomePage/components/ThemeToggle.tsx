'use client'

import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { useTheme } from '@/components/HomePage/contexts/ThemeContext'

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, mounted } = useTheme()

  if (!mounted) {
    return (
      <div className="p-2 rounded-lg border border-gray-300 bg-white w-9 h-9 animate-pulse" />
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
      aria-label="Toggle theme"
      data-testid="theme-toggle"
    >
      {theme === 'light' ? (
        <MoonIcon className="h-5 w-5 text-purple-800 dark:text-white" />
      ) : (
        <SunIcon className="h-5 w-5 text-purple-800 dark:text-white" />
      )}
    </button>
  )
}
