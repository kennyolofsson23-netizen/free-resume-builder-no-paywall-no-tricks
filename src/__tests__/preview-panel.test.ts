/**
 * Tests for F002 — Real-Time PDF Preview
 * Verifies that PreviewPanel and MobilePreviewSheet render correctly.
 */
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
  useResumeStore: (selector: (s: unknown) => unknown) =>
    mockUseResumeStore(selector),
}))

vi.mock('@/components/templates/template-renderer', () => ({
  TemplateRenderer: ({ resume }: { resume: { template: string } }) =>
    React.createElement('div', {
      'data-testid': 'template-renderer',
      'data-template': resume.template,
    }),
}))

vi.mock('lucide-react', () => ({
  X: () => React.createElement('span', { 'data-testid': 'x-icon' }),
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    'aria-label': ariaLabel,
  }: {
    children: React.ReactNode
    onClick?: () => void
    'aria-label'?: string
  }) =>
    React.createElement(
      'button',
      { onClick, 'aria-label': ariaLabel },
      children
    ),
}))

const sampleResume = {
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

const emptyResume = {
  ...sampleResume,
  id: 'test-empty',
  personalInfo: { ...sampleResume.personalInfo, fullName: '' },
}

describe('PreviewPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing when resume is null', async () => {
    mockUseResumeStore.mockImplementation((sel) => sel({ resume: null }))
    const { PreviewPanel } = await import('@/components/builder/preview-panel')
    const { container } = render(React.createElement(PreviewPanel))
    await act(async () => {})
    expect(container).toBeDefined()
  })

  it('shows placeholder when resume is null', async () => {
    mockUseResumeStore.mockImplementation((sel) => sel({ resume: null }))
    const { PreviewPanel } = await import('@/components/builder/preview-panel')
    const { container } = render(React.createElement(PreviewPanel))
    await act(async () => {})
    expect(container.textContent).toContain('No resume data yet')
  })

  it('shows placeholder when resume has empty fullName', async () => {
    mockUseResumeStore.mockImplementation((sel) => sel({ resume: emptyResume }))
    const { PreviewPanel } = await import('@/components/builder/preview-panel')
    const { container } = render(React.createElement(PreviewPanel))
    await act(async () => {})
    expect(container.textContent).toContain(
      'Your resume preview will appear here'
    )
  })

  it('renders TemplateRenderer when resume has a fullName', async () => {
    mockUseResumeStore.mockImplementation((sel) =>
      sel({ resume: sampleResume })
    )
    const { PreviewPanel } = await import('@/components/builder/preview-panel')
    const { getByTestId } = render(React.createElement(PreviewPanel))
    await act(async () => {})
    expect(getByTestId('template-renderer')).toBeDefined()
  })

  it('renders "Live Preview" indicator', async () => {
    mockUseResumeStore.mockImplementation((sel) =>
      sel({ resume: sampleResume })
    )
    const { PreviewPanel } = await import('@/components/builder/preview-panel')
    const { container } = render(React.createElement(PreviewPanel))
    await act(async () => {})
    expect(container.textContent).toContain('Live Preview')
  })

  it('passes the resume to TemplateRenderer', async () => {
    mockUseResumeStore.mockImplementation((sel) =>
      sel({ resume: sampleResume })
    )
    const { PreviewPanel } = await import('@/components/builder/preview-panel')
    const { getByTestId } = render(React.createElement(PreviewPanel))
    await act(async () => {})
    expect(getByTestId('template-renderer').getAttribute('data-template')).toBe(
      'modern'
    )
  })
})

describe('MobilePreviewSheet', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns null when isOpen is false', async () => {
    mockUseResumeStore.mockImplementation((sel) =>
      sel({ resume: sampleResume })
    )
    const { MobilePreviewSheet } =
      await import('@/components/builder/mobile-preview-sheet')
    const { container } = render(
      React.createElement(MobilePreviewSheet, {
        isOpen: false,
        onClose: vi.fn(),
      })
    )
    await act(async () => {})
    expect(container.firstChild).toBeNull()
  })

  it('renders when isOpen is true', async () => {
    mockUseResumeStore.mockImplementation((sel) =>
      sel({ resume: sampleResume })
    )
    const { MobilePreviewSheet } =
      await import('@/components/builder/mobile-preview-sheet')
    const { container } = render(
      React.createElement(MobilePreviewSheet, {
        isOpen: true,
        onClose: vi.fn(),
      })
    )
    await act(async () => {})
    expect(container.firstChild).not.toBeNull()
  })

  it('renders "Resume Preview" heading when isOpen is true', async () => {
    mockUseResumeStore.mockImplementation((sel) =>
      sel({ resume: sampleResume })
    )
    const { MobilePreviewSheet } =
      await import('@/components/builder/mobile-preview-sheet')
    const { container } = render(
      React.createElement(MobilePreviewSheet, {
        isOpen: true,
        onClose: vi.fn(),
      })
    )
    await act(async () => {})
    expect(container.textContent).toContain('Resume Preview')
  })

  it('renders TemplateRenderer when resume is present and isOpen is true', async () => {
    mockUseResumeStore.mockImplementation((sel) =>
      sel({ resume: sampleResume })
    )
    const { MobilePreviewSheet } =
      await import('@/components/builder/mobile-preview-sheet')
    const { getByTestId } = render(
      React.createElement(MobilePreviewSheet, {
        isOpen: true,
        onClose: vi.fn(),
      })
    )
    await act(async () => {})
    expect(getByTestId('template-renderer')).toBeDefined()
  })

  it('calls onClose when close button is clicked', async () => {
    mockUseResumeStore.mockImplementation((sel) =>
      sel({ resume: sampleResume })
    )
    const { MobilePreviewSheet } =
      await import('@/components/builder/mobile-preview-sheet')
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
  it('returns a boolean', async () => {
    const { useMediaQuery } = await import('@/hooks/use-media-query')
    const { result } = renderHook(() => useMediaQuery('(max-width: 767px)'))
    expect(typeof result.current).toBe('boolean')
  })

  it('useIsMobile returns a boolean', async () => {
    const { useIsMobile } = await import('@/hooks/use-media-query')
    const { result } = renderHook(() => useIsMobile())
    expect(typeof result.current).toBe('boolean')
  })

  it('useIsDesktop returns a boolean', async () => {
    const { useIsDesktop } = await import('@/hooks/use-media-query')
    const { result } = renderHook(() => useIsDesktop())
    expect(typeof result.current).toBe('boolean')
  })
})
