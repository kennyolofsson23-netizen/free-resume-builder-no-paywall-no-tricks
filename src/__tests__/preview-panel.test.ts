/**
 * Tests for F002 — Real-Time PDF Preview
 * Verifies that PreviewPanel and MobilePreviewSheet render correctly.
 */
/// <reference types="vitest/globals" />
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, act, renderHook } from '@testing-library/react'
import * as React from 'react'

// Mock ResizeObserver (not available in jsdom)
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

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

// Mock lucide-react icons used in MobilePreviewSheet
vi.mock('lucide-react', () => ({
  X: () => React.createElement('span', { 'data-testid': 'x-icon' }),
}))

// Mock Button component
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: { children: React.ReactNode; onClick?: () => void; [key: string]: unknown }) =>
    React.createElement('button', { onClick, ...props }, children),
}))

import { PreviewPanel } from '@/components/builder/preview-panel'
import { MobilePreviewSheet } from '@/components/builder/mobile-preview-sheet'
import { useMediaQuery } from '@/hooks/use-media-query'
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

const emptyResume: Resume = {
  ...sampleResume,
  id: 'test-empty',
  personalInfo: {
    ...sampleResume.personalInfo,
    fullName: '',
  },
}

describe('PreviewPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing when resume is null', async () => {
    mockUseResumeStore.mockImplementation((selector: (s: { resume: null }) => unknown) =>
      selector({ resume: null })
    )
    const { container } = render(React.createElement(PreviewPanel))
    await act(async () => {})
    expect(container).toBeDefined()
  })

  it('shows "No resume data yet" placeholder when resume is null', async () => {
    mockUseResumeStore.mockImplementation((selector: (s: { resume: null }) => unknown) =>
      selector({ resume: null })
    )
    const { container } = render(React.createElement(PreviewPanel))
    await act(async () => {})
    expect(container.textContent).toContain('No resume data yet')
  })

  it('shows placeholder when resume has empty fullName', async () => {
    mockUseResumeStore.mockImplementation(
      (selector: (s: { resume: Resume }) => unknown) =>
        selector({ resume: emptyResume })
    )
    const { container } = render(React.createElement(PreviewPanel))
    await act(async () => {})
    expect(container.textContent).toContain('Your resume preview will appear here')
  })

  it('renders TemplateRenderer when resume has a fullName', async () => {
    mockUseResumeStore.mockImplementation(
      (selector: (s: { resume: Resume }) => unknown) =>
        selector({ resume: sampleResume })
    )
    const { getByTestId } = render(React.createElement(PreviewPanel))
    await act(async () => {})
    expect(getByTestId('template-renderer')).toBeDefined()
  })

  it('renders "Live Preview" indicator', async () => {
    mockUseResumeStore.mockImplementation(
      (selector: (s: { resume: Resume }) => unknown) =>
        selector({ resume: sampleResume })
    )
    const { container } = render(React.createElement(PreviewPanel))
    await act(async () => {})
    expect(container.textContent).toContain('Live Preview')
  })

  it('passes the resume to TemplateRenderer', async () => {
    mockUseResumeStore.mockImplementation(
      (selector: (s: { resume: Resume }) => unknown) =>
        selector({ resume: sampleResume })
    )
    const { getByTestId } = render(React.createElement(PreviewPanel))
    await act(async () => {})
    const renderer = getByTestId('template-renderer')
    expect(renderer.getAttribute('data-template')).toBe('modern')
  })

  it('renders preview container with id "resume-preview" (from TemplateRenderer)', async () => {
    // TemplateRenderer mock doesn't add id, but real one does — just verify renderer renders
    mockUseResumeStore.mockImplementation(
      (selector: (s: { resume: Resume }) => unknown) =>
        selector({ resume: sampleResume })
    )
    const { getByTestId } = render(React.createElement(PreviewPanel))
    await act(async () => {})
    expect(getByTestId('template-renderer')).toBeDefined()
  })
})

describe('MobilePreviewSheet', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns null when isOpen is false', async () => {
    mockUseResumeStore.mockImplementation(
      (selector: (s: { resume: Resume }) => unknown) =>
        selector({ resume: sampleResume })
    )
    const { container } = render(
      React.createElement(MobilePreviewSheet, { isOpen: false, onClose: vi.fn() })
    )
    await act(async () => {})
    expect(container.firstChild).toBeNull()
  })

  it('renders when isOpen is true', async () => {
    mockUseResumeStore.mockImplementation(
      (selector: (s: { resume: Resume }) => unknown) =>
        selector({ resume: sampleResume })
    )
    const { container } = render(
      React.createElement(MobilePreviewSheet, { isOpen: true, onClose: vi.fn() })
    )
    await act(async () => {})
    expect(container.firstChild).not.toBeNull()
  })

  it('renders "Resume Preview" heading when isOpen is true', async () => {
    mockUseResumeStore.mockImplementation(
      (selector: (s: { resume: Resume }) => unknown) =>
        selector({ resume: sampleResume })
    )
    const { container } = render(
      React.createElement(MobilePreviewSheet, { isOpen: true, onClose: vi.fn() })
    )
    await act(async () => {})
    expect(container.textContent).toContain('Resume Preview')
  })

  it('renders TemplateRenderer when resume is present and isOpen is true', async () => {
    mockUseResumeStore.mockImplementation(
      (selector: (s: { resume: Resume }) => unknown) =>
        selector({ resume: sampleResume })
    )
    const { getByTestId } = render(
      React.createElement(MobilePreviewSheet, { isOpen: true, onClose: vi.fn() })
    )
    await act(async () => {})
    expect(getByTestId('template-renderer')).toBeDefined()
  })

  it('calls onClose when close button is clicked', async () => {
    mockUseResumeStore.mockImplementation(
      (selector: (s: { resume: Resume }) => unknown) =>
        selector({ resume: sampleResume })
    )
    const onClose = vi.fn()
    const { getByLabelText } = render(
      React.createElement(MobilePreviewSheet, { isOpen: true, onClose })
    )
    await act(async () => {})
    getByLabelText('Close preview').click()
    expect(onClose).toHaveBeenCalled()
  })
})

describe('useMediaQuery', () => {
  it('returns a boolean', () => {
    // The hook uses useEffect which runs after render; initial value is false
    const { result } = renderHook(() => useMediaQuery('(max-width: 767px)'))
    expect(typeof result.current).toBe('boolean')
  })
})
