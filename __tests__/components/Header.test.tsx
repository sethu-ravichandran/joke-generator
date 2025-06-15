import { render, screen } from '@testing-library/react'
import Header from '@/components/HomePage/components/Header'

jest.mock('../../src/components/HomePage/components/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">MockThemeToggle</div>,
}))

describe('Header Component', () => {
  it('renders the Joke Generator title', () => {
    render(<Header />)
    const heading = screen.getByText(/joke generator/i)
    expect(heading).toBeInTheDocument()
  })

  it('renders the FaceSmileIcon', () => {
    render(<Header />)
    const icon = screen.getByTestId('face-smile-icon')
    expect(icon).toBeInTheDocument()
  })

  it('renders the ThemeToggle component', () => {
    render(<Header />)
    const toggle = screen.getByTestId('theme-toggle')
    expect(toggle).toBeInTheDocument()
  })
})
