import { render } from '@testing-library/react'
import * as React from 'react'

describe('Landing Page — Hero section', () => {
  it('renders h1 with "Free Resume Builder — No Paywall, No Tricks"', async () => {
    const { Hero } = await import('@/components/landing/hero')
    const { getByRole } = render(React.createElement(Hero))
    const heading = getByRole('heading', { level: 1 })
    expect(heading.textContent).toContain('Free Resume Builder')
    expect(heading.textContent).toContain('No Paywall, No Tricks')
  })

  it('renders CTA button linking to /builder', async () => {
    const { Hero } = await import('@/components/landing/hero')
    const { getByText } = render(React.createElement(Hero))
    const ctaLink = getByText(/Build My Resume|Build.*Resume.*Free/i)
    expect(ctaLink.closest('a')).not.toBeNull()
    expect(ctaLink.closest('a')?.getAttribute('href')).toBe('/builder')
  })

  it('contains at least 3 anti-paywall messages in rendered output', async () => {
    const { Hero } = await import('@/components/landing/hero')
    const { container } = render(React.createElement(Hero))
    const html = container.innerHTML

    const antiPaywallPatterns = [
      /zety/i,
      /\$29\.99/i,
      /no account/i,
      /no email/i,
      /no paywall/i,
    ]
    const matched = antiPaywallPatterns.filter((pattern) => pattern.test(html))
    expect(matched.length).toBeGreaterThanOrEqual(3)
  })
})

describe('Landing Page — FeatureGrid section', () => {
  it('renders section with id="features"', async () => {
    const { FeatureGrid } = await import('@/components/landing/feature-grid')
    const { container } = render(React.createElement(FeatureGrid))
    const section = container.querySelector('#features')
    expect(section).not.toBeNull()
  })

  it('renders section h2 heading', async () => {
    const { FeatureGrid } = await import('@/components/landing/feature-grid')
    const { getByRole } = render(React.createElement(FeatureGrid))
    const heading = getByRole('heading', { level: 2 })
    // Actual heading: "Everything You Need to Build a Great Resume"
    expect(heading.textContent).toMatch(
      /everything you need|build a great resume|job seekers|burned before|free resume/i
    )
  })

  it('renders 6 h3 feature card headings', async () => {
    const { FeatureGrid } = await import('@/components/landing/feature-grid')
    const { getAllByRole } = render(React.createElement(FeatureGrid))
    const h3s = getAllByRole('heading', { level: 3 })
    expect(h3s.length).toBe(6)
  })

  it('mentions no paywalls in feature description', async () => {
    const { FeatureGrid } = await import('@/components/landing/feature-grid')
    const { container } = render(React.createElement(FeatureGrid))
    expect(container.innerHTML).toMatch(/paywall/i)
  })
})

describe('Landing Page — TrustSignals section', () => {
  it('renders 3 competitor comparison columns', async () => {
    const { TrustSignals } = await import('@/components/landing/trust-signals')
    const { getAllByRole } = render(React.createElement(TrustSignals))
    const h3s = getAllByRole('heading', { level: 3 })
    expect(h3s.length).toBe(3)
  })

  it('contains anti-paywall messaging', async () => {
    const { TrustSignals } = await import('@/components/landing/trust-signals')
    const { container } = render(React.createElement(TrustSignals))
    // Actual text: "We collect nothing. Store nothing. Charge nothing."
    expect(container.innerHTML).toMatch(
      /collect nothing|zero sign.in|zero tracking|no account|free/i
    )
  })

  it('mentions Zety as a competitor', async () => {
    const { TrustSignals } = await import('@/components/landing/trust-signals')
    const { container } = render(React.createElement(TrustSignals))
    expect(container.innerHTML).toMatch(/zety/i)
  })

  it('mentions $29.99 paywall', async () => {
    const { TrustSignals } = await import('@/components/landing/trust-signals')
    const { container } = render(React.createElement(TrustSignals))
    expect(container.innerHTML).toMatch(/\$29\.99/i)
  })
})

describe('Landing Page — FAQ section', () => {
  it('renders FAQ items (at least 6)', async () => {
    const { FAQ } = await import('@/components/landing/faq')
    const { getAllByRole } = render(React.createElement(FAQ))
    const h3s = getAllByRole('heading', { level: 3 })
    expect(h3s.length).toBeGreaterThanOrEqual(6)
  })

  it('has a question about being actually free', async () => {
    const { FAQ } = await import('@/components/landing/faq')
    const { container } = render(React.createElement(FAQ))
    expect(container.innerHTML).toMatch(/actually free|catch|credit card/i)
  })

  it('has a question about account creation', async () => {
    const { FAQ } = await import('@/components/landing/faq')
    const { container } = render(React.createElement(FAQ))
    expect(container.innerHTML).toMatch(/account/i)
  })
})

describe('Landing Page — heading hierarchy', () => {
  it('Hero has h1, FeatureGrid has h2 and h3', async () => {
    const { Hero } = await import('@/components/landing/hero')
    const { FeatureGrid } = await import('@/components/landing/feature-grid')

    const heroResult = render(React.createElement(Hero))
    expect(heroResult.container.querySelector('h1')).not.toBeNull()

    const featureResult = render(React.createElement(FeatureGrid))
    expect(featureResult.container.querySelector('h2')).not.toBeNull()
    expect(
      featureResult.container.querySelectorAll('h3').length
    ).toBeGreaterThan(0)
  })
})

describe('Landing Page — Footer section', () => {
  it('renders footer nav links', async () => {
    const { Footer } = await import('@/components/landing/footer')
    const { getByText } = render(React.createElement(Footer))
    expect(getByText('Builder')).not.toBeNull()
    expect(getByText('Templates')).not.toBeNull()
    expect(getByText('Privacy Policy')).not.toBeNull()
  })

  it('renders copyright text and no-paywall messaging', async () => {
    const { Footer } = await import('@/components/landing/footer')
    const { container } = render(React.createElement(Footer))
    expect(container.innerHTML).toContain('Free Resume Builder')
    // Actual text: "No data collected. No accounts. No paywall. Ever."
    expect(container.innerHTML).toMatch(
      /no data collected|no paywall|no accounts/i
    )
  })
})
