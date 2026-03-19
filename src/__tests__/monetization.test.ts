import { describe, it, expect } from 'vitest'
import * as React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { AffiliateBanner } from '@/components/shared/affiliate-banner'

describe('AffiliateBanner', () => {
  it('renders the partner banner with link', () => {
    render(React.createElement(AffiliateBanner))
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      expect.stringContaining('kickresume.com')
    )
    expect(screen.getByRole('link')).toHaveAttribute('target', '_blank')
    expect(screen.getByRole('link')).toHaveAttribute(
      'rel',
      expect.stringContaining('noopener')
    )
  })

  it('has Partner label for transparency', () => {
    render(React.createElement(AffiliateBanner))
    expect(screen.getByText('[Partner]')).toBeDefined()
  })

  it('can be dismissed', () => {
    render(React.createElement(AffiliateBanner))
    const dismissBtn = screen.getByRole('button', { name: /dismiss/i })
    fireEvent.click(dismissBtn)
    expect(screen.queryByRole('link')).toBeNull()
  })

  it('has accessible dismiss button', () => {
    render(React.createElement(AffiliateBanner))
    expect(screen.getByRole('button', { name: /dismiss/i })).toBeDefined()
  })

  it('affiliate link opens in new tab', () => {
    render(React.createElement(AffiliateBanner))
    const link = screen.getByRole('link')
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toContain('nofollow')
  })
})
