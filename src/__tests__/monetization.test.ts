import { describe, it, expect } from 'vitest'
import * as React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { AffiliateBanner } from '@/components/shared/affiliate-banner'

describe('AffiliateBanner', () => {
  it('renders the partner banner with link to kickresume', () => {
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

  it('has a transparency label (Sponsored)', () => {
    render(React.createElement(AffiliateBanner))
    // Actual text is "Sponsored" not "[Partner]"
    expect(screen.getByText('Sponsored')).toBeDefined()
  })

  it('can be dismissed via the dismiss button', () => {
    render(React.createElement(AffiliateBanner))
    // Actual aria-label is "Dismiss partner banner"
    const dismissBtn = screen.getByRole('button', {
      name: /dismiss partner banner/i,
    })
    fireEvent.click(dismissBtn)
    expect(screen.queryByRole('link')).toBeNull()
  })

  it('has accessible dismiss button', () => {
    render(React.createElement(AffiliateBanner))
    expect(
      screen.getByRole('button', { name: /dismiss partner banner/i })
    ).toBeDefined()
  })

  it('affiliate link opens in new tab', () => {
    render(React.createElement(AffiliateBanner))
    const link = screen.getByRole('link')
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toContain('nofollow')
  })

  it('banner vanishes completely after dismissal', () => {
    const { container } = render(React.createElement(AffiliateBanner))
    // Before dismiss
    expect(container.firstChild).not.toBeNull()

    const dismissBtn = screen.getByRole('button', {
      name: /dismiss partner banner/i,
    })
    fireEvent.click(dismissBtn)

    // After dismiss, component renders null
    expect(container.firstChild).toBeNull()
  })

  it('contains AI writing help messaging', () => {
    render(React.createElement(AffiliateBanner))
    expect(screen.getByText(/AI/i)).toBeDefined()
  })
})
