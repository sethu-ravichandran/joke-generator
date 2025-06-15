interface BaseJoke {
  id: number
  category: string
  safe: boolean
  lang: string
  flags: {
    nsfw: boolean
    religious: boolean
    political: boolean
    racist: boolean
    sexist: boolean
    explicit: boolean
  }
}

interface SingleJoke extends BaseJoke {
  type: 'single'
  joke: string
  setup?: never
  delivery?: never
}

interface TwoPartJoke extends BaseJoke {
  type: 'twopart'
  setup: string
  delivery: string
  joke?: never
}

export type Joke = SingleJoke | TwoPartJoke

export interface JokeResponse {
  error: boolean
  amount: number
  jokes?: Joke[]
  id?: number
  type?: 'single' | 'twopart'
  setup?: string
  delivery?: string
  joke?: string
  category?: string
  safe?: boolean
  lang?: string
  flags?: {
    nsfw: boolean
    religious: boolean
    political: boolean
    racist: boolean
    sexist: boolean
    explicit: boolean
  }
}

export interface RecentJoke extends BaseJoke {
  type: 'single' | 'twopart'
  setup?: string
  delivery?: string
  joke?: string
  timestamp: Date
}

export type JokeCategory =
  | 'Any'
  | 'Programming'
  | 'Misc'
  | 'Dark'
  | 'Pun'
  | 'Spooky'
  | 'Christmas'

export const isSingleJoke = (joke: Joke): joke is SingleJoke => {
  return joke.type === 'single'
}

export const isTwoPartJoke = (joke: Joke): joke is TwoPartJoke => {
  return joke.type === 'twopart'
}

export const getJokeText = (joke: Joke): string => {
  if (isSingleJoke(joke)) {
    return joke.joke
  } else {
    return `${joke.setup}\n${joke.delivery}`
  }
}
