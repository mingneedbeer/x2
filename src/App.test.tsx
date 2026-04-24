import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the Get started heading', () => {
    render(<App />)
    expect(screen.getByText('Get started')).toBeDefined()
  })

  it('renders counter button starting at 0', () => {
    render(<App />)
    expect(screen.getByText('Count is 0')).toBeDefined()
  })

  it('increments counter on button click', () => {
    render(<App />)
    const button = screen.getByRole('button', { name: /count is/i })
    fireEvent.click(button)
    expect(screen.getByText('Count is 1')).toBeDefined()
    fireEvent.click(button)
    expect(screen.getByText('Count is 2')).toBeDefined()
  })

  it('renders Documentation section', () => {
    render(<App />)
    expect(screen.getByText('Documentation')).toBeDefined()
  })

  it('renders Connect with us section', () => {
    render(<App />)
    expect(screen.getByText('Connect with us')).toBeDefined()
  })
})
