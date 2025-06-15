import { render, screen } from '@testing-library/react'
import JokeSection from '@/components/HomePage/components/JokeSection'


jest.mock('../../src/components/HomePage/components/JokeGenerator.tsx', () => ({
  JokeGenerator: () => <div data-testid="joke-generator">MockJokeGenerator</div>,
}))

describe('JokeSection Component', () => {
  it('renders the heading', () => {
    render(<JokeSection />)
    const heading = screen.getByText(/need a good laugh\?/i)
    expect(heading).toBeInTheDocument()
  })

  it('renders the description paragraph', () => {
    render(<JokeSection />)
    const paragraph = screen.getByText(/choose a category and get ready to laugh!/i)
    expect(paragraph).toBeInTheDocument()
  })

  it('renders the JokeGenerator component', () => {
    render(<JokeSection />)
    const generator = screen.getByTestId('joke-generator')
    expect(generator).toBeInTheDocument()
  })
})
