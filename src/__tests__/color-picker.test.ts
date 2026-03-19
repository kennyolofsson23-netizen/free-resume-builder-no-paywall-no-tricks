/**
 * Tests for F012 — Custom Accent Color Picker
 * Verifies color picker renders and handles color selection.
 */
/// <reference types="vitest/globals" />
import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent, screen, act } from '@testing-library/react'
import * as React from 'react'

// Mock Radix Popover to render inline
vi.mock('@radix-ui/react-popover', () => ({
  Root: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', null, children),
  Trigger: ({
    children,
    asChild,
  }: {
    children: React.ReactNode
    asChild?: boolean
  }) => (asChild ? children : React.createElement('div', null, children)),
  Portal: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', null, children),
  Content: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', { 'data-testid': 'popover-content' }, children),
  Arrow: () => null,
}))

import { ColorPicker } from '@/components/ui/color-picker'
import { PRESET_ACCENT_COLORS } from '@/lib/constants'

describe('ColorPicker', () => {
  it('renders trigger button with aria-label', async () => {
    const onChange = vi.fn()
    const { getByLabelText } = render(
      React.createElement(ColorPicker, {
        value: '#2563eb',
        onChange,
        label: 'Pick accent color',
      })
    )
    await act(async () => {})
    const button = getByLabelText('Pick accent color')
    expect(button).toBeDefined()
    expect(button.tagName).toBe('BUTTON')
  })

  it('renders popover content with preset colors', async () => {
    const onChange = vi.fn()
    render(
      React.createElement(ColorPicker, {
        value: '#2563eb',
        onChange,
      })
    )
    await act(async () => {})
    const content = screen.getByTestId('popover-content')
    expect(content).toBeDefined()
  })

  it('PRESET_ACCENT_COLORS has 12 entries', () => {
    expect(PRESET_ACCENT_COLORS).toHaveLength(12)
  })

  it('all preset colors are valid hex codes', () => {
    const hexPattern = /^#[0-9a-fA-F]{6}$/
    PRESET_ACCENT_COLORS.forEach((color) => {
      expect(hexPattern.test(color)).toBe(true)
    })
  })

  it('calls onChange with new hex when hex input changes to valid value', async () => {
    const onChange = vi.fn()
    render(
      React.createElement(ColorPicker, {
        value: '#2563eb',
        onChange,
      })
    )
    await act(async () => {})

    const hexInput = screen.getByRole('textbox')
    await act(async () => {
      fireEvent.change(hexInput, { target: { value: '#dc2626' } })
    })

    expect(onChange).toHaveBeenCalledWith('#dc2626')
  })

  it('shows contrast warning for very light colors (contrast < 3:1 against white)', async () => {
    const onChange = vi.fn()
    // #ffffff = white = contrast ratio 1:1 against white background
    render(
      React.createElement(ColorPicker, {
        value: '#ffffff',
        onChange,
      })
    )
    await act(async () => {})
    // Should show a contrast warning in the popover content
    expect(
      screen.getByTestId('popover-content').textContent?.toLowerCase()
    ).toContain('hard to read')
  })
})
