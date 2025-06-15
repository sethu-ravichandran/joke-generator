import React from 'react'
import { render, screen } from '@testing-library/react'
import Footer from '@/components/HomePage/components/Footer'

jest.mock('lucide-react', () => ({
  Heart: () => <svg data-testid="heart-icon" />
}))

describe('Footer Component', () => {
  it('renders the correct footer text', () => {
    render(<Footer />)
    const text = screen.getByText(/Built with/i)
    expect(text).toBeInTheDocument()
    expect(text).toHaveTextContent('Built with')
    expect(text).toHaveTextContent('Sethu Ravichandran')
  })

  it('renders the Heart icon', () => {
    render(<Footer />)
    const heartIcon = screen.getByTestId('heart-icon')
    expect(heartIcon).toBeInTheDocument()
  })
})
