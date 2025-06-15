import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { JokeDisplay } from '@/components/HomePage/components/JokeDisplay'
import { Joke } from '@/components/HomePage/types/joke'

describe('JokeDisplay', () => {
  const mockOnCopyJoke = jest.fn()
  const defaultProps = {
    joke: null,
    isLoading: false,
    onCopyJoke: mockOnCopyJoke
  }

  const singleJoke: Joke = {
    id: 1,
    type: 'single',
    joke: 'Why do programmers prefer dark mode? Because light attracts bugs!',
    category: 'Programming',
    safe: true,
    lang: 'en',
    flags: {
      nsfw: false,
      religious: false,
      political: false,
      racist: false,
      sexist: false,
      explicit: false
    }
  }

  const twoPartJoke: Joke = {
    id: 2,
    type: 'twopart',
    setup: 'Why did the developer go broke?',
    delivery: 'Because he used up all his cache!',
    category: 'Programming',
    safe: true,
    lang: 'en',
    flags: {
      nsfw: false,
      religious: false,
      political: false,
      racist: false,
      sexist: false,
      explicit: false
    }
  }

  beforeEach(() => {
    mockOnCopyJoke.mockClear()
  })

  it('shows loading spinner when loading', () => {
    render(<JokeDisplay {...defaultProps} isLoading={true} />)
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('shows placeholder when no joke is loaded', () => {
    render(<JokeDisplay {...defaultProps} />)
    expect(
      screen.getByText(/Click "Get New Joke" to start laughing!/)
    ).toBeInTheDocument()
  })

  it('displays single joke correctly', () => {
    render(<JokeDisplay {...defaultProps} joke={singleJoke} />)

    expect(screen.getByText(singleJoke.joke!)).toBeInTheDocument()
    expect(screen.getByText('Programming')).toBeInTheDocument()
  })

  it('displays two-part joke correctly', () => {
    render(<JokeDisplay {...defaultProps} joke={twoPartJoke} />)

    expect(screen.getByText('Setup')).toBeInTheDocument()
    expect(screen.getByText('Punchline')).toBeInTheDocument()
    expect(screen.getByText(twoPartJoke.setup!)).toBeInTheDocument()
    expect(screen.getByText(twoPartJoke.delivery!)).toBeInTheDocument()
  })

  it('calls onCopyJoke when copy button is clicked', () => {
    render(<JokeDisplay {...defaultProps} joke={singleJoke} />)

    const copyButton = screen.getByTestId('copy-joke-button')
    fireEvent.click(copyButton)

    expect(mockOnCopyJoke).toHaveBeenCalledTimes(1)
  })

  it('shows category badge', () => {
    render(<JokeDisplay {...defaultProps} joke={singleJoke} />)

    const categoryBadge = screen.getByText('Programming')
    expect(categoryBadge).toHaveClass('bg-purple-100')
  })
})
