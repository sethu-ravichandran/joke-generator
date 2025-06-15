import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toast } from 'react-hot-toast'
import { JokeGenerator } from '@/components/HomePage/components/JokeGenerator'
import { fetchJoke, copyToClipboard } from '@/lib/jokeApi'
import { Joke, JokeCategory } from '@/components/HomePage/types/joke'

jest.mock('../../src/lib/jokeApi.ts', () => ({
  fetchJoke: jest.fn(),
  copyToClipboard: jest.fn()
}))

jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}))

jest.mock(
  '../../src/components/HomePage/components/CategorySelector.tsx',
  () => ({
    CategorySelector: ({ selectedCategory, onCategoryChange }: any) => (
      <div data-testid="category-selector">
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value as JokeCategory)}
          data-testid="category-select"
        >
          <option value="Any">Any</option>
          <option value="Programming">Programming</option>
          <option value="Misc">Misc</option>
          <option value="Dark">Dark</option>
          <option value="Pun">Pun</option>
          <option value="Spooky">Spooky</option>
          <option value="Christmas">Christmas</option>
        </select>
      </div>
    )
  })
)

jest.mock('../../src/components/HomePage/components/JokeDisplay', () => ({
  JokeDisplay: ({ joke, isLoading, onCopyJoke }: any) => (
    <div data-testid="joke-display">
      {isLoading && <div data-testid="loading">Loading...</div>}
      {joke && (
        <div data-testid="joke-content">
          {joke.type === 'twopart' ? (
            <div>
              <div data-testid="joke-setup">{joke.setup}</div>
              <div data-testid="joke-delivery">{joke.delivery}</div>
            </div>
          ) : (
            <div data-testid="joke-text">{joke.joke}</div>
          )}
          <button onClick={onCopyJoke} data-testid="copy-button">
            Copy
          </button>
        </div>
      )}
    </div>
  )
}))

jest.mock('../../src/components/HomePage/components/JokeControls', () => ({
  JokeControls: ({ onGetNewJoke, isLoading }: any) => (
    <div data-testid="joke-controls">
      <button
        onClick={onGetNewJoke}
        disabled={isLoading}
        data-testid="get-joke-button"
      >
        {isLoading ? 'Loading...' : 'Get New Joke'}
      </button>
    </div>
  )
}))

jest.mock('../../src/components/HomePage/components/RecentJokes', () => ({
  RecentJokes: ({ jokes, onJokeSelect }: any) => (
    <div data-testid="recent-jokes">
      {jokes.map((joke: any, index: number) => (
        <button
          key={index}
          onClick={() => onJokeSelect(joke)}
          data-testid={`recent-joke-${index}`}
        >
          Recent Joke {index + 1}
        </button>
      ))}
    </div>
  )
}))

const mockFetchJoke = fetchJoke as jest.MockedFunction<typeof fetchJoke>
const mockCopyToClipboard = copyToClipboard as jest.MockedFunction<
  typeof copyToClipboard
>
const mockToast = toast as jest.Mocked<typeof toast>

describe('JokeGenerator', () => {
  const mockSingleJoke: Joke = {
    id: 1,
    type: 'single',
    joke: "Why did the programmer quit his job? Because he didn't get arrays!",
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

  const mockTwoPartJoke: Joke = {
    id: 2,
    type: 'twopart',
    setup: "Why don't scientists trust atoms?",
    delivery: 'Because they make up everything!',
    category: 'Misc',
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
    jest.clearAllMocks()
  })

  describe('renders all components', () => {
    it('should render all child components on initial load', () => {
      render(<JokeGenerator />)

      expect(screen.getByTestId('category-selector')).toBeInTheDocument()
      expect(screen.getByTestId('joke-display')).toBeInTheDocument()
      expect(screen.getByTestId('joke-controls')).toBeInTheDocument()
      expect(screen.getByTestId('recent-jokes')).toBeInTheDocument()
    })

    it('should render with default category selected', () => {
      render(<JokeGenerator />)

      const categorySelect = screen.getByTestId('category-select')
      expect(categorySelect).toHaveValue('Any')
    })

    it('should render get joke button', () => {
      render(<JokeGenerator />)

      const getJokeButton = screen.getByTestId('get-joke-button')
      expect(getJokeButton).toBeInTheDocument()
      expect(getJokeButton).toHaveTextContent('Get New Joke')
      expect(getJokeButton).not.toBeDisabled()
    })
  })

  describe('fetches and displays a joke when button is clicked', () => {
    it('should fetch and display a single-type joke', async () => {
      mockFetchJoke.mockResolvedValueOnce(mockSingleJoke)

      render(<JokeGenerator />)
      const getJokeButton = screen.getByTestId('get-joke-button')

      fireEvent.click(getJokeButton)

      expect(screen.getByTestId('loading')).toBeInTheDocument()
      expect(getJokeButton).toBeDisabled()
      expect(getJokeButton).toHaveTextContent('Loading...')

      await waitFor(() => {
        expect(screen.getByTestId('joke-content')).toBeInTheDocument()
      })

      expect(screen.getByTestId('joke-text')).toHaveTextContent(
        mockSingleJoke.joke!
      )
      expect(mockFetchJoke).toHaveBeenCalledWith('Any')
      expect(mockToast.success).toHaveBeenCalledWith('New joke loaded!')
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
      expect(getJokeButton).not.toBeDisabled()
    })

    it('should fetch and display a two-part joke', async () => {
      mockFetchJoke.mockResolvedValueOnce(mockTwoPartJoke)

      render(<JokeGenerator />)
      const getJokeButton = screen.getByTestId('get-joke-button')

      fireEvent.click(getJokeButton)

      await waitFor(() => {
        expect(screen.getByTestId('joke-content')).toBeInTheDocument()
      })

      expect(screen.getByTestId('joke-setup')).toHaveTextContent(
        mockTwoPartJoke.setup!
      )
      expect(screen.getByTestId('joke-delivery')).toHaveTextContent(
        mockTwoPartJoke.delivery!
      )
      expect(mockFetchJoke).toHaveBeenCalledWith('Any')
      expect(mockToast.success).toHaveBeenCalledWith('New joke loaded!')
    })

    it('should add joke to recent jokes list', async () => {
      mockFetchJoke.mockResolvedValueOnce(mockSingleJoke)

      render(<JokeGenerator />)
      const getJokeButton = screen.getByTestId('get-joke-button')

      fireEvent.click(getJokeButton)

      await waitFor(() => {
        expect(screen.getByTestId('recent-joke-0')).toBeInTheDocument()
      })

      expect(screen.getByTestId('recent-joke-0')).toHaveTextContent(
        'Recent Joke 1'
      )
    })

    it('should limit recent jokes to 10 items', async () => {
      for (let i = 0; i < 12; i++) {
        mockFetchJoke.mockResolvedValueOnce({
          ...mockSingleJoke,
          id: i,
          joke: `Joke ${i}`
        })
      }

      render(<JokeGenerator />)
      const getJokeButton = screen.getByTestId('get-joke-button')

      for (let i = 0; i < 12; i++) {
        fireEvent.click(getJokeButton)
        await waitFor(() => {
          expect(mockFetchJoke).toHaveBeenCalledTimes(i + 1)
        })
      }

      expect(screen.getByTestId('recent-joke-0')).toBeInTheDocument()
      expect(screen.getByTestId('recent-joke-9')).toBeInTheDocument()
      expect(screen.queryByTestId('recent-joke-10')).not.toBeInTheDocument()
    })
  })

  describe('handles API errors gracefully', () => {
    it('should display error toast when API fails', async () => {
      const errorMessage = 'Failed to fetch joke'
      mockFetchJoke.mockRejectedValueOnce(new Error(errorMessage))

      render(<JokeGenerator />)
      const getJokeButton = screen.getByTestId('get-joke-button')

      fireEvent.click(getJokeButton)

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith(errorMessage)
      })

      expect(screen.queryByTestId('joke-content')).not.toBeInTheDocument()
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
      expect(getJokeButton).not.toBeDisabled()
    })

    it('should handle non-Error exceptions', async () => {
      mockFetchJoke.mockRejectedValueOnce('String error')

      render(<JokeGenerator />)
      const getJokeButton = screen.getByTestId('get-joke-button')

      fireEvent.click(getJokeButton)

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('Failed to fetch joke')
      })
    })

    it('should reset loading state after error', async () => {
      mockFetchJoke.mockRejectedValueOnce(new Error('API Error'))

      render(<JokeGenerator />)
      const getJokeButton = screen.getByTestId('get-joke-button')

      fireEvent.click(getJokeButton)

      expect(screen.getByTestId('loading')).toBeInTheDocument()
      expect(getJokeButton).toBeDisabled()

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalled()
      })

      expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
      expect(getJokeButton).not.toBeDisabled()
      expect(getJokeButton).toHaveTextContent('Get New Joke')
    })
  })

  describe('updates category when category selector changes', () => {
    it('should update selected category when dropdown changes', async () => {
      const user = userEvent.setup()
      render(<JokeGenerator />)

      const categorySelect = screen.getByTestId('category-select')

      await user.selectOptions(categorySelect, 'Programming')

      expect(categorySelect).toHaveValue('Programming')
    })

    it('should fetch joke with new category when button is clicked', async () => {
      const user = userEvent.setup()
      mockFetchJoke.mockResolvedValueOnce(mockSingleJoke)

      render(<JokeGenerator />)

      const categorySelect = screen.getByTestId('category-select')
      const getJokeButton = screen.getByTestId('get-joke-button')

      await user.selectOptions(categorySelect, 'Programming')
      fireEvent.click(getJokeButton)

      await waitFor(() => {
        expect(mockFetchJoke).toHaveBeenCalledWith('Programming')
      })
    })

    it('should update category when recent joke is selected', async () => {
      mockFetchJoke.mockResolvedValueOnce({
        ...mockSingleJoke,
        category: 'Misc'
      })

      render(<JokeGenerator />)
      const getJokeButton = screen.getByTestId('get-joke-button')

      fireEvent.click(getJokeButton)

      await waitFor(() => {
        expect(screen.getByTestId('recent-joke-0')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByTestId('recent-joke-0'))

      const categorySelect = screen.getByTestId('category-select')
      expect(categorySelect).toHaveValue('Misc')
    })
  })

  describe('copies joke to clipboard when copy button is clicked', () => {
    it('should copy single-type joke to clipboard', async () => {
      mockFetchJoke.mockResolvedValueOnce(mockSingleJoke)
      mockCopyToClipboard.mockResolvedValueOnce()

      render(<JokeGenerator />)

      fireEvent.click(screen.getByTestId('get-joke-button'))

      await waitFor(() => {
        expect(screen.getByTestId('copy-button')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByTestId('copy-button'))

      await waitFor(() => {
        expect(mockCopyToClipboard).toHaveBeenCalledWith(mockSingleJoke.joke)
        expect(mockToast.success).toHaveBeenCalledWith(
          'Joke copied to clipboard!'
        )
      })
    })

    it('should copy two-part joke to clipboard with proper formatting', async () => {
      mockFetchJoke.mockResolvedValueOnce(mockTwoPartJoke)
      mockCopyToClipboard.mockResolvedValueOnce()

      render(<JokeGenerator />)

      fireEvent.click(screen.getByTestId('get-joke-button'))

      await waitFor(() => {
        expect(screen.getByTestId('copy-button')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByTestId('copy-button'))

      const expectedText = `${mockTwoPartJoke.setup}\n\n${mockTwoPartJoke.delivery}`

      await waitFor(() => {
        expect(mockCopyToClipboard).toHaveBeenCalledWith(expectedText)
        expect(mockToast.success).toHaveBeenCalledWith(
          'Joke copied to clipboard!'
        )
      })
    })

    it('should handle copy failure gracefully', async () => {
      mockFetchJoke.mockResolvedValueOnce(mockSingleJoke)
      mockCopyToClipboard.mockRejectedValueOnce(new Error('Copy failed'))

      render(<JokeGenerator />)

      fireEvent.click(screen.getByTestId('get-joke-button'))

      await waitFor(() => {
        expect(screen.getByTestId('copy-button')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByTestId('copy-button'))

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('Failed to copy joke')
      })
    })

    it('should not attempt to copy when no joke is loaded', async () => {
      render(<JokeGenerator />)

      expect(screen.queryByTestId('copy-button')).not.toBeInTheDocument()
    })
  })
})
