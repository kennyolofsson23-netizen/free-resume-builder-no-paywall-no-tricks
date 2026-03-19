import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, fireEvent, act } from '@testing-library/react'
import * as React from 'react'

// localStorage is globally mocked as vi.fn() by the test setup.
// We need to use a real Map-backed implementation for these tests.
function installLocalStorage() {
  const store = new Map<string, string>()
  const mock = {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => store.set(key, value)),
    removeItem: vi.fn((key: string) => store.delete(key)),
    clear: vi.fn(() => store.clear()),
  }
  Object.defineProperty(global, 'localStorage', {
    value: mock,
    writable: true,
    configurable: true,
  })
  return mock
}

describe('ThemeToggle component', () => {
  let lsMock: ReturnType<typeof installLocalStorage>

  beforeEach(() => {
    lsMock = installLocalStorage()
    document.documentElement.classList.remove('dark')
  })

  afterEach(() => {
    document.documentElement.classList.remove('dark')
    vi.clearAllMocks()
  })

  it('renders without crashing', async () => {
    const { ThemeToggle } = await import('@/components/shared/theme-toggle')
    const { container } = render(React.createElement(ThemeToggle))
    expect(container.querySelector('button')).not.toBeNull()
  })

  it('shows "Switch to dark mode" label in light mode', async () => {
    document.documentElement.classList.remove('dark')
    const { ThemeToggle } = await import('@/components/shared/theme-toggle')
    const { getByRole } = render(React.createElement(ThemeToggle))
    const btn = getByRole('button')
    expect(btn.getAttribute('aria-label')).toBe('Switch to dark mode')
  })

  it('toggles dark class on click', async () => {
    document.documentElement.classList.remove('dark')
    const { ThemeToggle } = await import('@/components/shared/theme-toggle')
    const { getByRole } = render(React.createElement(ThemeToggle))
    const btn = getByRole('button')

    // Click to go dark
    await act(async () => {
      fireEvent.click(btn)
    })

    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(lsMock.setItem).toHaveBeenCalledWith('theme', 'dark')
  })

  it('toggles back to light mode on second click', async () => {
    document.documentElement.classList.remove('dark')
    const { ThemeToggle } = await import('@/components/shared/theme-toggle')
    const { getByRole } = render(React.createElement(ThemeToggle))
    const btn = getByRole('button')

    // Toggle to dark then back to light
    await act(async () => {
      fireEvent.click(btn)
    })
    await act(async () => {
      fireEvent.click(btn)
    })

    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(lsMock.setItem).toHaveBeenLastCalledWith('theme', 'light')
  })

  it('initializes dark state from DOM when dark class is already present', async () => {
    document.documentElement.classList.add('dark')
    const { ThemeToggle } = await import('@/components/shared/theme-toggle')
    const { getByRole } = render(React.createElement(ThemeToggle))

    // After useEffect fires, the button label should reflect dark mode
    await act(async () => {
      // let effects settle
    })

    const btn = getByRole('button')
    expect(btn.getAttribute('aria-label')).toBe('Switch to light mode')
  })
})

describe('Dark mode localStorage script logic', () => {
  let lsMock: ReturnType<typeof installLocalStorage>

  beforeEach(() => {
    lsMock = installLocalStorage()
    document.documentElement.classList.remove('dark')
  })

  afterEach(() => {
    document.documentElement.classList.remove('dark')
    vi.clearAllMocks()
  })

  it('applies dark class when localStorage theme is "dark"', () => {
    lsMock.setItem('theme', 'dark')

    // Simulate the inline script behavior
    const theme = lsMock.getItem('theme')
    if (
      theme === 'dark' ||
      (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark')
    }

    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('does not apply dark class when localStorage theme is "light"', () => {
    lsMock.setItem('theme', 'light')

    const theme = lsMock.getItem('theme')
    if (
      theme === 'dark' ||
      (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark')
    }

    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('does not apply dark class when no theme is set and prefers-color-scheme is light', () => {
    // matchMedia mock already returns { matches: false } from setup.ts

    const theme = lsMock.getItem('theme')
    if (
      theme === 'dark' ||
      (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark')
    }

    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
