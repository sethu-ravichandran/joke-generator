import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeToggle } from '../../src/components/HomePage/components/ThemeToggle'
import { useTheme } from '../../src/components/HomePage/contexts/ThemeContext'

jest.mock('../../src/components/HomePage/contexts/ThemeContext', () => ({
  useTheme: jest.fn()
}))

jest.mock('@heroicons/react/24/outline', () => ({
  SunIcon: ({ className, ...props }: any) => (
    <svg className={className} data-testid="sun-icon" {...props} />
  ),
  MoonIcon: ({ className, ...props }: any) => (
    <svg className={className} data-testid="moon-icon" {...props} />
  )
}))

const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>

describe('ThemeToggle', () => {
  const mockToggleTheme = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Loading state', () => {
    it('renders loading skeleton when not mounted', () => {
      mockUseTheme.mockReturnValue({
        theme: 'light',
        toggleTheme: mockToggleTheme,
        mounted: false
      })

      render(<ThemeToggle />)

      const skeleton = document.querySelector('.animate-pulse')
      expect(skeleton).toBeInTheDocument()
      expect(skeleton).toHaveClass(
        'w-9',
        'h-9',
        'p-2',
        'rounded-lg',
        'border',
        'border-gray-300',
        'bg-white'
      )
    })
  })

  describe('Light theme', () => {
    beforeEach(() => {
      mockUseTheme.mockReturnValue({
        theme: 'light',
        toggleTheme: mockToggleTheme,
        mounted: true
      })
    })

    it('renders moon icon when theme is light', () => {
      render(<ThemeToggle />)

      expect(screen.getByTestId('moon-icon')).toBeInTheDocument()
      expect(screen.queryByTestId('sun-icon')).not.toBeInTheDocument()
    })

    it('moon icon has correct styling', () => {
      render(<ThemeToggle />)

      const moonIcon = screen.getByTestId('moon-icon')
      expect(moonIcon).toHaveClass(
        'h-5',
        'w-5',
        'text-purple-800',
        'dark:text-white'
      )
    })
  })

  describe('Dark theme', () => {
    beforeEach(() => {
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        toggleTheme: mockToggleTheme,
        mounted: true
      })
    })

    it('renders sun icon when theme is dark', () => {
      render(<ThemeToggle />)

      expect(screen.getByTestId('sun-icon')).toBeInTheDocument()
      expect(screen.queryByTestId('moon-icon')).not.toBeInTheDocument()
    })

    it('sun icon has correct styling', () => {
      render(<ThemeToggle />)

      const sunIcon = screen.getByTestId('sun-icon')
      expect(sunIcon).toHaveClass(
        'h-5',
        'w-5',
        'text-purple-800',
        'dark:text-white'
      )
    })
  })

  describe('Interactions', () => {
    beforeEach(() => {
      mockUseTheme.mockReturnValue({
        theme: 'light',
        toggleTheme: mockToggleTheme,
        mounted: true
      })
    })

    it('calls toggleTheme when button is clicked', () => {
      render(<ThemeToggle />)

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(mockToggleTheme).toHaveBeenCalledTimes(1)
    })

    it('is keyboard accessible', () => {
      render(<ThemeToggle />)

      const button = screen.getByRole('button')
      button.focus()

      fireEvent.click(button)

      expect(mockToggleTheme).toHaveBeenCalledTimes(1)
    })
  })

  describe('Accessibility', () => {
    beforeEach(() => {
      mockUseTheme.mockReturnValue({
        theme: 'light',
        toggleTheme: mockToggleTheme,
        mounted: true
      })
    })

    it('has proper aria-label', () => {
      render(<ThemeToggle />)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Toggle theme')
    })

    it('has test id for testing', () => {
      render(<ThemeToggle />)

      const button = screen.getByTestId('theme-toggle')
      expect(button).toBeInTheDocument()
    })

    it('is focusable', () => {
      render(<ThemeToggle />)

      const button = screen.getByRole('button')
      button.focus()
      expect(button).toHaveFocus()
    })
  })

  describe('Theme transitions', () => {
    it('updates icon when theme changes from light to dark', async () => {
      const { rerender } = render(<ThemeToggle />)

      mockUseTheme.mockReturnValue({
        theme: 'light',
        toggleTheme: mockToggleTheme,
        mounted: true
      })
      rerender(<ThemeToggle />)
      expect(screen.getByTestId('moon-icon')).toBeInTheDocument()

      mockUseTheme.mockReturnValue({
        theme: 'dark',
        toggleTheme: mockToggleTheme,
        mounted: true
      })
      rerender(<ThemeToggle />)

      await waitFor(() => {
        expect(screen.getByTestId('sun-icon')).toBeInTheDocument()
        expect(screen.queryByTestId('moon-icon')).not.toBeInTheDocument()
      })
    })

    it('updates icon when theme changes from dark to light', async () => {
      const { rerender } = render(<ThemeToggle />)

      mockUseTheme.mockReturnValue({
        theme: 'dark',
        toggleTheme: mockToggleTheme,
        mounted: true
      })
      rerender(<ThemeToggle />)
      expect(screen.getByTestId('sun-icon')).toBeInTheDocument()

      mockUseTheme.mockReturnValue({
        theme: 'light',
        toggleTheme: mockToggleTheme,
        mounted: true
      })
      rerender(<ThemeToggle />)

      await waitFor(() => {
        expect(screen.getByTestId('moon-icon')).toBeInTheDocument()
        expect(screen.queryByTestId('sun-icon')).not.toBeInTheDocument()
      })
    })
  })
})
