import { render, fireEvent, act } from '@testing-library/react'
import * as React from 'react'

// Mock the theme-provider module so ThemeToggle doesn't need a real context.
// vi.mock is hoisted to the top of the file by vitest automatically.
vi.mock('@/components/shared/theme-provider', () => ({
  useTheme: vi.fn(() => ({ theme: 'light', setTheme: vi.fn() })),
}))

describe('ThemeToggle', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    // Default: light mode
    const { useTheme } = await import('@/components/shared/theme-provider')
    vi.mocked(useTheme).mockReturnValue({ theme: 'light', setTheme: vi.fn() })
  })

  it('renders without crashing', async () => {
    const { ThemeToggle } = await import('@/components/shared/theme-toggle')
    const { container } = render(React.createElement(ThemeToggle))
    await act(async () => {})
    expect(container.firstChild).not.toBeNull()
  })

  it('shows Sun icon in dark mode', async () => {
    const { useTheme } = await import('@/components/shared/theme-provider')
    const setTheme = vi.fn()
    vi.mocked(useTheme).mockReturnValue({ theme: 'dark', setTheme })
    const { ThemeToggle } = await import('@/components/shared/theme-toggle')
    const { getByRole } = render(React.createElement(ThemeToggle))
    await act(async () => {})
    const button = getByRole('button')
    // In dark mode, the button says "Switch to light mode" (Sun icon shown)
    expect(button.getAttribute('aria-label')).toBe('Switch to light mode')
  })

  it('shows Moon icon in light mode', async () => {
    const { useTheme } = await import('@/components/shared/theme-provider')
    const setTheme = vi.fn()
    vi.mocked(useTheme).mockReturnValue({ theme: 'light', setTheme })
    const { ThemeToggle } = await import('@/components/shared/theme-toggle')
    const { getByRole } = render(React.createElement(ThemeToggle))
    await act(async () => {})
    const button = getByRole('button')
    // In light mode, the button says "Switch to dark mode" (Moon icon shown)
    expect(button.getAttribute('aria-label')).toBe('Switch to dark mode')
  })

  it('clicking toggle calls setTheme with opposite theme', async () => {
    const { useTheme } = await import('@/components/shared/theme-provider')
    const setTheme = vi.fn()
    vi.mocked(useTheme).mockReturnValue({ theme: 'light', setTheme })
    const { ThemeToggle } = await import('@/components/shared/theme-toggle')
    const { getByRole } = render(React.createElement(ThemeToggle))
    await act(async () => {})
    const button = getByRole('button')
    await act(async () => {
      fireEvent.click(button)
    })
    expect(setTheme).toHaveBeenCalledWith('dark')
  })
})
