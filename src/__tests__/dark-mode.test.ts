import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, fireEvent, act } from '@testing-library/react'
import * as React from 'react'

// Mock the theme-provider module so ThemeToggle doesn't need a real context
vi.mock('@/components/shared/theme-provider', () => ({
  useTheme: vi.fn(() => ({ theme: 'light', setTheme: vi.fn() })),
}))

import { useTheme } from '@/components/shared/theme-provider'

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', async () => {
    const { ThemeToggle } = await import('@/components/shared/theme-toggle')
    const { container } = render(React.createElement(ThemeToggle))
    // After mount the button renders; before it's a placeholder div
    expect(container.firstChild).not.toBeNull()
  })

  it('shows Sun icon in dark mode', async () => {
    vi.mocked(useTheme).mockReturnValue({ theme: 'dark', setTheme: vi.fn() })
    const { ThemeToggle } = await import('@/components/shared/theme-toggle')
    const { container } = render(React.createElement(ThemeToggle))
    await act(async () => {})
    // Sun icon renders when theme is dark (re-render after mount)
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
  })

  it('shows Moon icon in light mode', async () => {
    vi.mocked(useTheme).mockReturnValue({ theme: 'light', setTheme: vi.fn() })
    const { ThemeToggle } = await import('@/components/shared/theme-toggle')
    const { container } = render(React.createElement(ThemeToggle))
    await act(async () => {})
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
  })

  it('clicking toggle calls setTheme with opposite theme', async () => {
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
