import { fetchJoke, copyToClipboard } from '@/lib/jokeApi'
import {
  JokeResponse,
  Joke,
  JokeCategory
} from '@/components/HomePage/types/joke'

global.fetch = jest.fn()

Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn()
  }
})

document.createElement = jest.fn()
document.body.appendChild = jest.fn()
document.body.removeChild = jest.fn()
document.execCommand = jest.fn()

describe('fetchJoke', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    console.error = jest.fn()
  })

  describe('fetches joke successfully', () => {
    it('should fetch a single-type joke successfully', async () => {
      const mockResponse: JokeResponse = {
        error: false,
        id: 123,
        type: 'single',
        joke: 'Why did the chicken cross the road? To get to the other side!',
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

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      const result = await fetchJoke('Misc')

      expect(fetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_JOKE_API_URL}/Misc?safe-mode`
      )
      expect(result).toEqual({
        id: 123,
        type: 'single',
        setup: undefined,
        delivery: undefined,
        joke: 'Why did the chicken cross the road? To get to the other side!',
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
      })
    })

    it('should fetch a two-part joke successfully', async () => {
      const mockResponse: JokeResponse = {
        error: false,
        id: 456,
        type: 'twopart',
        setup: "Why don't scientists trust atoms?",
        delivery: 'Because they make up everything!',
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

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      const result = await fetchJoke('Programming')

      expect(fetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_JOKE_API_URL}/Programming?safe-mode`
      )
      expect(result).toEqual({
        id: 456,
        type: 'twopart',
        setup: "Why don't scientists trust atoms?",
        delivery: 'Because they make up everything!',
        joke: undefined,
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
      })
    })

    it('should use "Any" category by default', async () => {
      const mockResponse: JokeResponse = {
        error: false,
        id: 789,
        type: 'single',
        joke: 'Default joke',
        category: 'Any',
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

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      await fetchJoke()

      expect(fetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_JOKE_API_URL}/Any?safe-mode`
      )
    })

    it('should handle response with jokes array', async () => {
      const mockResponse: JokeResponse = {
        error: false,
        jokes: [
          {
            id: 999,
            type: 'single',
            joke: 'Joke from array',
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
        ]
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      const result = await fetchJoke()

      expect(result.id).toBe(999)
      expect(result.joke).toBe('Joke from array')
    })

    it('should provide default values for missing properties', async () => {
      const mockResponse: JokeResponse = {
        error: false,
        type: 'single',
        joke: 'Minimal joke data'
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      const result = await fetchJoke('Misc')

      expect(result).toEqual({
        id: expect.any(Number),
        type: 'single',
        setup: undefined,
        delivery: undefined,
        joke: 'Minimal joke data',
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
      })
    })
  })

  describe('handles API errors', () => {
    it('should throw error when API returns error response', async () => {
      const mockResponse: JokeResponse = {
        error: true,
        message: 'API Error'
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      await expect(fetchJoke()).rejects.toThrow(
        'Failed to fetch joke. Please try again.'
      )
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching joke:',
        expect.any(Error)
      )
    })

    it('should throw error when HTTP response is not ok', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404
      })

      await expect(fetchJoke()).rejects.toThrow(
        'Failed to fetch joke. Please try again.'
      )
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching joke:',
        expect.any(Error)
      )
    })

    it('should throw error when response JSON is invalid', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON')
        }
      })

      await expect(fetchJoke()).rejects.toThrow(
        'Failed to fetch joke. Please try again.'
      )
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching joke:',
        expect.any(Error)
      )
    })
  })

  describe('handles network errors', () => {
    it('should throw error when fetch fails', async () => {
      ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      await expect(fetchJoke()).rejects.toThrow(
        'Failed to fetch joke. Please try again.'
      )
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching joke:',
        expect.any(Error)
      )
    })

    it('should throw error when fetch is rejected', async () => {
      ;(fetch as jest.Mock).mockRejectedValueOnce(
        new TypeError('Failed to fetch')
      )

      await expect(fetchJoke()).rejects.toThrow(
        'Failed to fetch joke. Please try again.'
      )
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching joke:',
        expect.any(Error)
      )
    })
  })
})

describe('copyToClipboard', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Reset mocks
    const mockTextArea = {
      value: '',
      select: jest.fn()
    }

    ;(document.createElement as jest.Mock).mockReturnValue(mockTextArea)
    ;(document.execCommand as jest.Mock).mockReturnValue(true)
  })

  describe('copies text to clipboard successfully', () => {
    it('should use navigator.clipboard.writeText when available', async () => {
      const testText = 'Test clipboard text'
      ;(navigator.clipboard.writeText as jest.Mock).mockResolvedValueOnce(
        undefined
      )

      await copyToClipboard(testText)

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(testText)
      expect(document.createElement).not.toHaveBeenCalled()
    })

    it('should resolve without error when clipboard API succeeds', async () => {
      ;(navigator.clipboard.writeText as jest.Mock).mockResolvedValueOnce(
        undefined
      )

      await expect(copyToClipboard('test')).resolves.toBeUndefined()
    })
  })

  describe('uses fallback when clipboard API fails', () => {
    it('should use fallback method when clipboard API throws error', async () => {
      const testText = 'Fallback test text'
      ;(navigator.clipboard.writeText as jest.Mock).mockRejectedValueOnce(
        new Error('Clipboard API failed')
      )

      const mockTextArea = {
        value: '',
        select: jest.fn()
      }
      ;(document.createElement as jest.Mock).mockReturnValue(mockTextArea)

      await copyToClipboard(testText)

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(testText)
      expect(document.createElement).toHaveBeenCalledWith('textarea')
      expect(mockTextArea.value).toBe(testText)
      expect(mockTextArea.select).toHaveBeenCalled()
      expect(document.body.appendChild).toHaveBeenCalledWith(mockTextArea)
      expect(document.execCommand).toHaveBeenCalledWith('copy')
      expect(document.body.removeChild).toHaveBeenCalledWith(mockTextArea)
    })

    it('should use fallback method when clipboard API is not available', async () => {
      // Temporarily remove clipboard API
      const originalClipboard = navigator.clipboard
      delete (navigator as any).clipboard

      const testText = 'No clipboard API test'
      const mockTextArea = {
        value: '',
        select: jest.fn()
      }
      ;(document.createElement as jest.Mock).mockReturnValue(mockTextArea)

      await copyToClipboard(testText)

      expect(document.createElement).toHaveBeenCalledWith('textarea')
      expect(mockTextArea.value).toBe(testText)
      expect(mockTextArea.select).toHaveBeenCalled()
      expect(document.body.appendChild).toHaveBeenCalledWith(mockTextArea)
      expect(document.execCommand).toHaveBeenCalledWith('copy')
      expect(document.body.removeChild).toHaveBeenCalledWith(mockTextArea)

      Object.assign(navigator, { clipboard: originalClipboard })
    })

    it('should complete fallback process even if execCommand fails', async () => {
      ;(navigator.clipboard.writeText as jest.Mock).mockRejectedValueOnce(
        new Error('Clipboard failed')
      )
      ;(document.execCommand as jest.Mock).mockReturnValue(false)

      const mockTextArea = {
        value: '',
        select: jest.fn()
      }
      ;(document.createElement as jest.Mock).mockReturnValue(mockTextArea)

      await expect(copyToClipboard('test')).resolves.toBeUndefined()

      expect(document.body.removeChild).toHaveBeenCalledWith(mockTextArea)
    })
  })
})
