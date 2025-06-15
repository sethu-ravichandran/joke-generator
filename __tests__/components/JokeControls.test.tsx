import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { JokeControls } from '@/components/HomePage/components/JokeControls'

describe('JokeControls', () => {
  const mockOnGetNewJoke = jest.fn()
  const defaultProps = {
    onGetNewJoke: mockOnGetNewJoke,
    isLoading: false
  }

  beforeEach(() => {
    mockOnGetNewJoke.mockClear()
  })

  it('renders get new joke button', () => {
    render(<JokeControls {...defaultProps} />)
    expect(screen.getByTestId('get-new-joke-button')).toBeInTheDocument()
  })

  it('calls onGetNewJoke when button is clicked', () => {
    render(<JokeControls {...defaultProps} />)

    const button = screen.getByTestId('get-new-joke-button')
    fireEvent.click(button)

    expect(mockOnGetNewJoke).toHaveBeenCalledTimes(1)
  })

  it('shows loading state when isLoading is true', () => {
    render(<JokeControls {...defaultProps} isLoading={true} />)

    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('disables button when loading', () => {
    render(<JokeControls {...defaultProps} isLoading={true} />)

    const button = screen.getByTestId('get-new-joke-button')
    expect(button).toBeDisabled()
  })

  it('shows normal state when not loading', () => {
    render(<JokeControls {...defaultProps} />)

    expect(screen.getByText('Get New Joke')).toBeInTheDocument()
    expect(document.querySelector('.animate-spin')).not.toBeInTheDocument()
  })
})
