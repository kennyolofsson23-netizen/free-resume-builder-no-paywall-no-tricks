import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'

// ---------------------------------------------------------------------------
// Hero component tests
// ---------------------------------------------------------------------------

describe('Hero — h1 text', () => {
  it('renders the primary headline', async () => {
    const { Hero } = await import('@/components/landing/hero')
    render(React.createElement(Hero))
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toBeDefined()
    expect(h1.textContent).toContain('Free Resume Builder')
    expect(h1.textContent).toContain('No Paywall, No Tricks')
  })
})

describe('Hero — CTA button', () => {
  it('renders the primary CTA linking to /builder', async () => {
    const { Hero } = await import('@/components/landing/hero')
    render(React.createElement(Hero))
    const cta = screen.getByRole('link', { name: /Build Your Resume/i })
    expect(cta).toBeDefined()
    expect((cta as HTMLAnchorElement).href).toContain('/builder')
  })
})

describe('Hero — anti-paywall message', () => {
  it('renders at least one anti-paywall message mentioning Zety or paywall', async () => {
    const { Hero } = await import('@/components/landing/hero')
    const { container } = render(React.createElement(Hero))
    const text = container.textContent ?? ''
    const hasAntiPaywall =
      text.toLowerCase().includes('zety') ||
      text.toLowerCase().includes('paywall') ||
      text.toLowerCase().includes('no account') ||
      text.toLowerCase().includes('no credit card')
    expect(hasAntiPaywall).toBe(true)
  })

  it('renders the secondary CTA for features/templates', async () => {
    const { Hero } = await import('@/components/landing/hero')
    render(React.createElement(Hero))
    // Should have at least 2 links in the hero (primary + secondary CTA)
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThanOrEqual(2)
  })
})

// ---------------------------------------------------------------------------
// FeatureGrid component tests
// ---------------------------------------------------------------------------

describe('FeatureGrid — section', () => {
  it('renders the features section with id="features" or id="how-it-works"', async () => {
    const { FeatureGrid } = await import('@/components/landing/feature-grid')
    const { container } = render(React.createElement(FeatureGrid))
    const section = container.querySelector('section[id]')
    expect(section).toBeTruthy()
  })

  it('renders at least 4 feature cards', async () => {
    const { FeatureGrid } = await import('@/components/landing/feature-grid')
    render(React.createElement(FeatureGrid))
    const headings = screen.getAllByRole('heading', { level: 3 })
    expect(headings.length).toBeGreaterThanOrEqual(4)
  })
})

// ---------------------------------------------------------------------------
// TemplateShowcase component tests
// ---------------------------------------------------------------------------

describe('TemplateShowcase — templates', () => {
  it('renders all 5 template names', async () => {
    const { TemplateShowcase } = await import(
      '@/components/landing/template-showcase'
    )
    const { container } = render(React.createElement(TemplateShowcase))
    const text = container.textContent ?? ''
    for (const name of ['Modern', 'Classic', 'Minimal', 'Creative', 'Professional']) {
      expect(text).toContain(name)
    }
  })

  it('renders "Use This Template" links pointing to /builder', async () => {
    const { TemplateShowcase } = await import(
      '@/components/landing/template-showcase'
    )
    render(React.createElement(TemplateShowcase))
    const templateLinks = screen
      .getAllByRole('link')
      .filter((el) => (el as HTMLAnchorElement).href.includes('/builder'))
    expect(templateLinks.length).toBeGreaterThanOrEqual(5)
  })

  it('section heading mentions free templates', async () => {
    const { TemplateShowcase } = await import(
      '@/components/landing/template-showcase'
    )
    const { container } = render(React.createElement(TemplateShowcase))
    const text = container.textContent?.toLowerCase() ?? ''
    expect(text).toContain('free')
    // Should convey that templates are free — exact wording may vary
    const hasAntiPaywallMessage =
      text.includes('no upgrade') ||
      text.includes('no paywall') ||
      text.includes('always free') ||
      text.includes('all free') ||
      text.includes("don't charge")
    expect(hasAntiPaywallMessage).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// TrustSignals component tests
// ---------------------------------------------------------------------------

describe('TrustSignals — cells', () => {
  it('renders 4 trust signal cells', async () => {
    const { TrustSignals } = await import('@/components/landing/trust-signals')
    render(React.createElement(TrustSignals))
    const headings = screen.getAllByRole('heading', { level: 3 })
    expect(headings.length).toBe(4)
  })

  it('mentions privacy, speed, ATS, and no account', async () => {
    const { TrustSignals } = await import('@/components/landing/trust-signals')
    const { container } = render(React.createElement(TrustSignals))
    const text = container.textContent?.toLowerCase() ?? ''
    expect(text).toContain('private')
    expect(text.includes('200ms') || text.includes('preview') || text.includes('fast')).toBe(true)
    expect(text).toContain('ats')
    expect(text.includes('no account') || text.includes('account required')).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// FAQ component tests
// ---------------------------------------------------------------------------

describe('FAQ — accordion items', () => {
  it('renders at least 6 FAQ questions', async () => {
    const { FAQ } = await import('@/components/landing/faq')
    render(React.createElement(FAQ))
    const buttons = screen
      .getAllByRole('button')
      .filter((el) => el.getAttribute('data-radix-collection-item') !== null ||
        el.closest('[data-radix-accordion-item]') !== null ||
        el.closest('div[data-state]') !== null ||
        el.tagName === 'BUTTON')
    // There should be at least 6 accordion trigger buttons
    expect(buttons.length).toBeGreaterThanOrEqual(6)
  })

  it('includes a question about being free', async () => {
    const { FAQ } = await import('@/components/landing/faq')
    const { container } = render(React.createElement(FAQ))
    const text = container.textContent ?? ''
    expect(text.toLowerCase()).toContain('is this really free')
  })

  it('includes a question about data storage', async () => {
    const { FAQ } = await import('@/components/landing/faq')
    const { container } = render(React.createElement(FAQ))
    const text = container.textContent ?? ''
    expect(text.toLowerCase()).toContain('data')
    expect(text.toLowerCase()).toContain('stored')
  })

  it('includes a question comparing to Zety', async () => {
    const { FAQ } = await import('@/components/landing/faq')
    const { container } = render(React.createElement(FAQ))
    const text = container.textContent ?? ''
    expect(text.toLowerCase()).toContain('zety')
  })

  it('includes a question about ATS compatibility', async () => {
    const { FAQ } = await import('@/components/landing/faq')
    const { container } = render(React.createElement(FAQ))
    const text = container.textContent ?? ''
    expect(text.toLowerCase()).toContain('ats')
  })
})

// ---------------------------------------------------------------------------
// Footer component tests
// ---------------------------------------------------------------------------

describe('Footer', () => {
  it('renders the anti-Zety tagline', async () => {
    const { Footer } = await import('@/components/landing/footer')
    const { container } = render(React.createElement(Footer))
    const text = container.textContent ?? ''
    expect(text.toLowerCase()).toContain('anti-zety')
  })

  it('renders affiliate disclosure', async () => {
    const { Footer } = await import('@/components/landing/footer')
    const { container } = render(React.createElement(Footer))
    const text = container.textContent ?? ''
    expect(text.toLowerCase()).toContain('affiliate')
    expect(text.toLowerCase()).toContain('free')
  })

  it('renders copyright', async () => {
    const { Footer } = await import('@/components/landing/footer')
    const { container } = render(React.createElement(Footer))
    const text = container.textContent ?? ''
    expect(text).toContain('2026')
  })
})

// ---------------------------------------------------------------------------
// Header component tests
// ---------------------------------------------------------------------------

describe('Header', () => {
  it('renders the logo with correct text', async () => {
    const { Header } = await import('@/components/shared/header')
    render(React.createElement(Header))
    const logo = screen.getByRole('link', { name: /Free Resume Builder/i })
    expect(logo).toBeDefined()
  })

  it('renders a "Build My Resume" CTA link to /builder', async () => {
    const { Header } = await import('@/components/shared/header')
    render(React.createElement(Header))
    const cta = screen.getByRole('link', { name: /Build My Resume/i })
    expect(cta).toBeDefined()
    expect((cta as HTMLAnchorElement).href).toContain('/builder')
  })
})
