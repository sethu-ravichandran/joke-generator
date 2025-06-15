import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { CategorySelector } from '@/components/HomePage/components/CategorySelector'
import { JokeCategory } from '@/components/HomePage/types/joke'

describe('CategorySelector', () => {
  const mockOnCategoryChange = jest.fn()
  const defaultProps = {
    selectedCategory: 'Any' as JokeCategory,
    onCategoryChange: mockOnCategoryChange
  }

  beforeEach(() => {
    mockOnCategoryChange.mockClear()
  })

  it('renders all category options', () => {
    render(<CategorySelector {...defaultProps} />)

    expect(screen.getByTestId('category-any')).toBeInTheDocument()
    expect(screen.getByTestId('category-programming')).toBeInTheDocument()
    expect(screen.getByTestId('category-misc')).toBeInTheDocument()
    expect(screen.getByTestId('category-pun')).toBeInTheDocument()
  })

  it('highlights selected category', () => {
    render(
      <CategorySelector {...defaultProps} selectedCategory="Programming" />
    )

    const programmingButton = screen.getByTestId('category-programming')
    expect(programmingButton).toHaveClass('bg-purple-600', 'text-white')
  })

  it('calls onCategoryChange when category is clicked', () => {
    render(<CategorySelector {...defaultProps} />)

    const programmingButton = screen.getByTestId('category-programming')
    fireEvent.click(programmingButton)

    expect(mockOnCategoryChange).toHaveBeenCalledWith('Programming')
  })

  it('displays category label', () => {
    render(<CategorySelector {...defaultProps} />)

    expect(screen.getByText('Category')).toBeInTheDocument()
  })
})
