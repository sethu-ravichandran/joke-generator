import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { RecentJokes } from '@/components/HomePage/components/RecentJokes'
import { formatDistanceToNow } from 'date-fns'
import type { RecentJoke } from '@/components/HomePage/types/joke'

describe('RecentJokes Component', () => {
  const mockJokes: RecentJoke[] = [
    {
      id: '1',
      category: 'Programming',
      type: 'single',
      joke: 'Why do programmers prefer dark mode?',
      setup: '',
      delivery: '',
      timestamp: new Date(Date.now() - 1000 * 60 * 5) 
    },
    {
      id: '2',
      category: 'General',
      type: 'twopart',
      joke: '',
      setup: 'Why did the chicken cross the road?',
      delivery: 'To get to the other side!',
      timestamp: new Date(Date.now() - 1000 * 60 * 10) 
    }
  ]

  it('renders nothing if jokes array is empty', () => {
    const { container } = render(
      <RecentJokes jokes={[]} onJokeSelect={() => {}} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders the heading and jokes', () => {
    render(<RecentJokes jokes={mockJokes} onJokeSelect={() => {}} />)

    expect(screen.getByText(/recent jokes/i)).toBeInTheDocument()

    expect(
      screen.getByText(/why do programmers prefer dark mode\?/i)
    ).toBeInTheDocument()
    expect(screen.getByText('Programming')).toBeInTheDocument()

    expect(
      screen.getByText(/why did the chicken cross the road\?/i)
    ).toBeInTheDocument()
    expect(screen.getByText('General')).toBeInTheDocument()
  })

  it('displays relative timestamps correctly', () => {
    render(<RecentJokes jokes={mockJokes} onJokeSelect={() => {}} />)

    expect(
      screen.getByText(
        formatDistanceToNow(mockJokes[0].timestamp, { addSuffix: true })
      )
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        formatDistanceToNow(mockJokes[1].timestamp, { addSuffix: true })
      )
    ).toBeInTheDocument()
  })

  it('calls onJokeSelect when a joke is clicked', () => {
    const handleJokeSelect = jest.fn()
    render(<RecentJokes jokes={mockJokes} onJokeSelect={handleJokeSelect} />)

    const jokeButton = screen.getByTestId('recent-joke-0')
    fireEvent.click(jokeButton)

    expect(handleJokeSelect).toHaveBeenCalledTimes(1)
    expect(handleJokeSelect).toHaveBeenCalledWith(mockJokes[0])
  })
})
