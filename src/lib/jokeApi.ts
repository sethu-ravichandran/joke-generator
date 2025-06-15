import {
  JokeResponse,
  Joke,
  JokeCategory,
  isSingleJoke,
  isTwoPartJoke,
  getJokeText
} from '@/components/HomePage/types/joke'

const API_BASE_URL = 'https://v2.jokeapi.dev/joke'

export const fetchJoke = async (
  category: JokeCategory = 'Any'
): Promise<Joke> => {
  try {
    const categoryParam = category === 'Any' ? 'Any' : category
    const response = await fetch(`${API_BASE_URL}/${categoryParam}?safe-mode`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: JokeResponse = await response.json()

    if (data.error) {
      throw new Error('API returned an error')
    }

    if (data.jokes && data.jokes.length > 0) {
      return data.jokes[0]
    }

    // Transform API response to our strict type
    const baseJoke = {
      id: data.id || Math.random(),
      category: data.category || category,
      safe: data.safe ?? true,
      lang: data.lang || 'en',
      flags: data.flags || {
        nsfw: false,
        religious: false,
        political: false,
        racist: false,
        sexist: false,
        explicit: false
      }
    }

    if (data.type === 'twopart' && data.setup && data.delivery) {
      return {
        ...baseJoke,
        type: 'twopart' as const,
        setup: data.setup,
        delivery: data.delivery
      }
    } else if (data.joke) {
      return {
        ...baseJoke,
        type: 'single' as const,
        joke: data.joke
      }
    }

    throw new Error('Invalid joke format received from API')
  } catch (error) {
    console.error('Error fetching joke:', error)
    throw new Error('Failed to fetch joke. Please try again.')
  }
}

// Helper function to get joke text for copying/displaying
export const copyJokeToClipboard = async (joke: Joke): Promise<void> => {
  const jokeText = getJokeText(joke)
  await copyToClipboard(jokeText)
}

export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }
}