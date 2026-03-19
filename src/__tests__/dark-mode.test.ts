import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, fireEvent, act } from '@testing-library/react'
import * as React from 'react'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { useTheme } from '@/components/shared/theme-provider'

// Mock the theme-provider module so ThemeToggle doesn't need a real context
vi.mock('@/components/shared/theme-provider', () => ({
  useTheme: vi.fn(() => ({ theme: 'light', setTheme: vi.fn() })),
}))

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Default to light mode
    vi.mocked(useTheme).mockReturnValue({ theme: 'light', setTheme: vi.fn() })
  })

  it('renders without crashing', async () => {
    const { container } = render(React.createElement(ThemeToggle))
    await act(async () => {})
    expect(container.firstChild).not.toBeNull()
  })

  it('shows Sun icon in dark mode', async () => {
    const setTheme = vi.fn()
    vi.mocked(useTheme).mockReturnValue({ theme: 'dark', setTheme })
    const { getByRole } = render(React.createElement(ThemeToggle))
    await act(async () => {})
    const button = getByRole('button')
    expect(button.getAttribute('aria-label')).toBe('Switch to light mode')
    // Sun icon is present (dark mode shows Sun to switch to light)
    expect(button.querySelector('svg')).not.toBeNull()
  })

  it('shows Moon icon in light mode', async () => {
    const setTheme = vi.fn()
    vi.mocked(useTheme).mockReturnValue({ theme: 'light', setTheme })
    const { getByRole } = render(React.createElement(ThemeToggle))
    await act(async () => {})
    const button = getByRole('button')
    expect(button.getAttribute('aria-label')).toBe('Switch to dark mode')
    // Moon icon is present (light mode shows Moon to switch to dark)
    expect(button.querySelector('svg')).not.toBeNull()
  })

  it('clicking toggle calls setTheme with opposite theme', async () => {
    const setTheme = vi.fn()
    vi.mocked(useTheme).mockReturnValue({ theme: 'light', setTheme })
    const { getByRole } = render(React.createElement(ThemeToggle))
    await act(async () => {})
    const button = getByRole('button')
    await act(async () => {
      fireEvent.click(button)
    })
    expect(setTheme).toHaveBeenCalledWith('dark')
  })
})
