import { describe, it, expect } from 'vitest'
import * as React from 'react'
import { render, screen } from '@testing-library/react'

describe('Template Gallery Page — module imports', () => {
  it('exports a default page component', async () => {
    const mod = await import('@/app/templates/page')
    expect(typeof mod.default).toBe('function')
  })

  it('exports metadata object', async () => {
    const mod = await import('@/app/templates/page')
    expect(mod.metadata).toBeDefined()
    expect(typeof mod.metadata).toBe('object')
  })
})

describe('Template Gallery Page — SEO metadata', () => {
  it('metadata title targets free resume templates', async () => {
    const { metadata } = await import('@/app/templates/page')
    const title =
      typeof metadata.title === 'string'
        ? metadata.title
        : (metadata.title as { default?: string; absolute?: string })?.absolute ??
          (metadata.title as { default?: string })?.default ??
          ''
    expect(title).toMatch(/free resume templates/i)
  })

  it('metadata description mentions free templates', async () => {
    const { metadata } = await import('@/app/templates/page')
    const description = metadata.description ?? ''
    expect(description).toMatch(/free/i)
    expect(description.toLowerCase()).toMatch(/template/)
  })

  it('metadata keywords include free resume templates', async () => {
    const { metadata } = await import('@/app/templates/page')
    const keywords = metadata.keywords
    const keywordList: string[] = Array.isArray(keywords)
      ? (keywords as string[])
      : typeof keywords === 'string'
        ? [keywords]
        : []
    const hasKeyword = keywordList.some((k) =>
      k.toLowerCase().includes('free resume templates')
    )
    expect(hasKeyword).toBe(true)
  })

  it('metadata includes openGraph data', async () => {
    const { metadata } = await import('@/app/templates/page')
    expect(metadata.openGraph).toBeDefined()
    expect(metadata.openGraph?.title).toBeTruthy()
  })
})

describe('Template Gallery Page — renders all 5 templates', () => {
  it('renders without crashing', async () => {
    const { default: TemplatesPage } = await import('@/app/templates/page')
    const { container } = render(React.createElement(TemplatesPage))
    expect(container.firstChild).not.toBeNull()
  })

  it('renders an h1 heading for the page', async () => {
    const { default: TemplatesPage } = await import('@/app/templates/page')
    const { container } = render(React.createElement(TemplatesPage))
    const h1 = container.querySelector('h1')
    expect(h1).not.toBeNull()
    expect(h1?.textContent).toMatch(/free.*resume.*templates|5 free/i)
  })

  it('renders exactly 5 template article sections with prefixed ids', async () => {
    const { default: TemplatesPage } = await import('@/app/templates/page')
    const { container } = render(React.createElement(TemplatesPage))
    const templateIds = ['modern', 'classic', 'minimal', 'creative', 'professional']
    const found = templateIds.filter((id) =>
      container.querySelector('#template-' + id)
    )
    expect(found.length).toBe(5)
  })

  it('renders at least 5 h2 template name headings', async () => {
    const { default: TemplatesPage } = await import('@/app/templates/page')
    render(React.createElement(TemplatesPage))
    // Page h2 is "Ready to build your resume?", template headings are also h2
    const h2s = screen.getAllByRole('heading', { level: 2 })
    expect(h2s.length).toBeGreaterThanOrEqual(5)
  })

  it('renders each template name as an h2 heading', async () => {
    const { default: TemplatesPage } = await import('@/app/templates/page')
    render(React.createElement(TemplatesPage))
    // Each TemplateGallery card has an h2 with just the template name
    const templateNames = ['Modern', 'Classic', 'Minimal', 'Creative', 'Professional']
    for (const name of templateNames) {
      const h2s = screen.getAllByRole('heading', { level: 2 })
      const match = h2s.find((h) => h.textContent?.trim() === name)
      expect(match).toBeTruthy()
    }
  })
})

describe('Template Gallery Page — Use This Template CTAs', () => {
  it('renders 5 Use This Template CTA links', async () => {
    const { default: TemplatesPage } = await import('@/app/templates/page')
    render(React.createElement(TemplatesPage))
    // CTAs have aria-label="Use {name} template" and link text "Use This Template"
    const links = screen.getAllByRole('link', {
      name: /use .+ template/i,
    })
    expect(links.length).toBe(5)
  })

  it('each CTA links to /builder?template={id}', async () => {
    const { default: TemplatesPage } = await import('@/app/templates/page')
    render(React.createElement(TemplatesPage))
    const templateIds = ['modern', 'classic', 'minimal', 'creative', 'professional']
    for (const id of templateIds) {
      const links = screen.getAllByRole('link', {
        name: new RegExp('use ' + id + ' template', 'i'),
      })
      expect(links.length).toBeGreaterThan(0)
      expect(links[0].getAttribute('href')).toBe('/builder?template=' + id)
    }
  })

  it('modern template CTA links to /builder?template=modern', async () => {
    const { default: TemplatesPage } = await import('@/app/templates/page')
    render(React.createElement(TemplatesPage))
    const link = screen.getByRole('link', { name: /use modern template/i })
    expect(link.getAttribute('href')).toBe('/builder?template=modern')
  })

  it('professional template CTA links to /builder?template=professional', async () => {
    const { default: TemplatesPage } = await import('@/app/templates/page')
    render(React.createElement(TemplatesPage))
    const link = screen.getByRole('link', { name: /use professional template/i })
    expect(link.getAttribute('href')).toBe('/builder?template=professional')
  })

  it('creative template CTA links to /builder?template=creative', async () => {
    const { default: TemplatesPage } = await import('@/app/templates/page')
    render(React.createElement(TemplatesPage))
    const link = screen.getByRole('link', { name: /use creative template/i })
    expect(link.getAttribute('href')).toBe('/builder?template=creative')
  })
})

describe('Template Gallery Page — template previews render with sample data', () => {
  it('renders sample resume name Alex Johnson in at least one preview', async () => {
    const { default: TemplatesPage } = await import('@/app/templates/page')
    render(React.createElement(TemplatesPage))
    const names = screen.getAllByText(/Alex Johnson/i)
    expect(names.length).toBeGreaterThan(0)
  })

  it('renders sample job title in previews', async () => {
    const { default: TemplatesPage } = await import('@/app/templates/page')
    render(React.createElement(TemplatesPage))
    const titles = screen.getAllByText(/Senior Software Engineer/i)
    expect(titles.length).toBeGreaterThan(0)
  })

  it('renders scaled preview containers using CSS transform', async () => {
    const { default: TemplatesPage } = await import('@/app/templates/page')
    const { container } = render(React.createElement(TemplatesPage))
    const scaledDivs = Array.from(container.querySelectorAll('[style]')).filter(
      (el) => (el as HTMLElement).style.transform.includes('scale')
    )
    expect(scaledDivs.length).toBeGreaterThanOrEqual(5)
  })
})

describe('Template Gallery Page — anti-paywall messaging', () => {
  it('page references Zety as a competitor', async () => {
    const { default: TemplatesPage } = await import('@/app/templates/page')
    const { container } = render(React.createElement(TemplatesPage))
    expect(container.innerHTML).toMatch(/zety/i)
  })

  it('page references no paywall', async () => {
    const { default: TemplatesPage } = await import('@/app/templates/page')
    const { container } = render(React.createElement(TemplatesPage))
    expect(container.innerHTML).toMatch(/no paywall/i)
  })

  it('page has at least one link to /builder', async () => {
    const { default: TemplatesPage } = await import('@/app/templates/page')
    render(React.createElement(TemplatesPage))
    const builderLinks = screen
      .getAllByRole('link')
      .filter((l) => l.getAttribute('href') === '/builder')
    expect(builderLinks.length).toBeGreaterThan(0)
  })
})

describe('Template Gallery Page — TEMPLATE_LIST constants', () => {
  it('TEMPLATE_LIST has exactly 5 entries', async () => {
    const { TEMPLATE_LIST } = await import('@/lib/constants')
    expect(TEMPLATE_LIST.length).toBe(5)
  })

  it('TEMPLATE_LIST includes all expected template ids', async () => {
    const { TEMPLATE_LIST } = await import('@/lib/constants')
    const ids = TEMPLATE_LIST.map((t) => t.id)
    expect(ids).toContain('modern')
    expect(ids).toContain('classic')
    expect(ids).toContain('minimal')
    expect(ids).toContain('creative')
    expect(ids).toContain('professional')
  })

  it('each TEMPLATE_LIST entry has id, name, and description', async () => {
    const { TEMPLATE_LIST } = await import('@/lib/constants')
    for (const t of TEMPLATE_LIST) {
      expect(typeof t.id).toBe('string')
      expect(typeof t.name).toBe('string')
      expect(typeof t.description).toBe('string')
      expect(t.id.length).toBeGreaterThan(0)
      expect(t.name.length).toBeGreaterThan(0)
      expect(t.description.length).toBeGreaterThan(0)
    }
  })
})
