/**
 * Tests for F002 — Real-Time PDF Preview
 * Verifies that PreviewPanel renders and updates correctly.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, act } from '@testing-library/react'
import * as React from 'react'

// Mock the Zustand store
const mockUseResumeStore = vi.fn()

vi.mock('@/store/resume-store', () => ({
  useResumeStore: (selector: (state: unknown) => unknown) =>
    mockUseResumeStore(selector),
}))

vi.mock('@/components/templates/template-renderer', () => ({
  TemplateRenderer: ({ resume }: { resume: unknown }) =>
    React.createElement('div', {
      'data-testid': 'template-renderer',
      'data-template': (resume as { template: string }).template,
    }),
}))

import type { Resume } from '@/types/resume'

const sampleResume: Resume = {
  id: 'test-1',
  template: 'modern',
  personalInfo: {
    fullName: 'Test User',
    email: 'test@example.com',
    phone: '',
    location: '',
  },
  experiences: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  accentColor: '#2563eb',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

describe('PreviewPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders "no resume data" message when resume is null', async () => {
    mockUseResumeStore.mockImplementation(
      (selector: (s: { resume: null }) => unknown) => selector({ resume: null })
    )

    const { PreviewPanel } = await import('@/components/builder/preview-panel')
    const { container } = render(React.createElement(PreviewPanel))

    await act(async () => {})
    expect(container.textContent).toContain('No resume data yet')
  })

  it('renders TemplateRenderer when resume is present', async () => {
    mockUseResumeStore.mockImplementation(
      (selector: (s: { resume: Resume }) => unknown) =>
        selector({ resume: sampleResume })
    )

    const { PreviewPanel } = await import('@/components/builder/preview-panel')
    const { getByTestId } = render(React.createElement(PreviewPanel))

    await act(async () => {})
    expect(getByTestId('template-renderer')).toBeDefined()
  })

  it('renders preview container with id "resume-preview"', async () => {
    mockUseResumeStore.mockImplementation(
      (selector: (s: { resume: Resume }) => unknown) =>
        selector({ resume: sampleResume })
    )

    const { PreviewPanel } = await import('@/components/builder/preview-panel')
    const { container } = render(React.createElement(PreviewPanel))

    await act(async () => {})
    const previewEl = container.querySelector('#resume-preview')
    expect(previewEl).not.toBeNull()
  })

  it('renders "Live Preview" indicator', async () => {
    mockUseResumeStore.mockImplementation(
      (selector: (s: { resume: Resume }) => unknown) =>
        selector({ resume: sampleResume })
    )

    const { PreviewPanel } = await import('@/components/builder/preview-panel')
    const { container } = render(React.createElement(PreviewPanel))

    await act(async () => {})
    expect(container.textContent).toContain('Live Preview')
  })

  it('passes the resume to TemplateRenderer', async () => {
    mockUseResumeStore.mockImplementation(
      (selector: (s: { resume: Resume }) => unknown) =>
        selector({ resume: sampleResume })
    )

    const { PreviewPanel } = await import('@/components/builder/preview-panel')
    const { getByTestId } = render(React.createElement(PreviewPanel))

    await act(async () => {})
    const renderer = getByTestId('template-renderer')
    expect(renderer.getAttribute('data-template')).toBe('modern')
  })
})
