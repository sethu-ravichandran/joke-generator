export interface Joke {
  id: number
  type: 'single' | 'twopart'
  setup?: string
  delivery?: string
  joke?: string
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

export interface JokeResponse {
  error: boolean
  amount: number
  jokes?: Joke[]
  joke?: Joke
  category?: string
  type?: string
  setup?: string
  delivery?: string
  id?: number
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

export interface RecentJoke extends Joke {
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
