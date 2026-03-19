'use client'

import { useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { Check } from 'lucide-react'
import { PRESET_ACCENT_COLORS } from '@/lib/constants'
import { cn } from '@/lib/cn'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  label?: string
}

/**
 * Calculate relative luminance of a hex color.
 * Formula from WCAG 2.1.
 */
function getLuminance(hex: string): number {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16) / 255
  const g = parseInt(clean.slice(2, 4), 16) / 255
  const b = parseInt(clean.slice(4, 6), 16) / 255

  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

/**
 * Calculate contrast ratio against white (luminance = 1).
 */
function getContrastAgainstWhite(hex: string): number {
  const luminance = getLuminance(hex)
  return (1 + 0.05) / (luminance + 0.05)
}

function isValidHex(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value)
}

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const [hexInput, setHexInput] = useState(value)
  const [hexError, setHexError] = useState(false)

  const contrastRatio = isValidHex(value) ? getContrastAgainstWhite(value) : 4.5
  const showContrastWarning = contrastRatio < 3

  const handlePresetClick = (color: string) => {
    onChange(color)
    setHexInput(color)
    setHexError(false)
  }

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setHexInput(raw)

    if (isValidHex(raw)) {
      setHexError(false)
      onChange(raw)
    } else {
      setHexError(true)
    }
  }

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label={label ?? 'Pick accent color'}
          className={cn(
            'flex items-center gap-2 rounded-md border border-border px-3 py-2',
            'text-sm hover:border-border/80 transition-colors focus:outline-none',
            'focus:ring-2 focus:ring-ring'
          )}
        >
          <span
            className="inline-block h-5 w-5 rounded-full border border-border flex-shrink-0"
            style={{ backgroundColor: value }}
          />
          {label && <span className="text-foreground">{label}</span>}
          <span className="text-muted-foreground font-mono text-xs">
            {value}
          </span>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          sideOffset={6}
          className={cn(
            'z-50 w-64 rounded-lg border border-border bg-popover p-4 shadow-lg',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95'
          )}
        >
          <div className="mb-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Preset Colors
            </p>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_ACCENT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handlePresetClick(color)}
                  title={color}
                  aria-label={`Select color ${color}`}
                  className={cn(
                    'relative h-8 w-8 rounded-full border-2 transition-transform hover:scale-110',
                    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring',
                    value === color ? 'border-foreground' : 'border-transparent'
                  )}
                  style={{ backgroundColor: color }}
                >
                  {value === color && (
                    <Check
                      className="absolute inset-0 m-auto text-white"
                      size={14}
                      strokeWidth={3}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="hex-color-input"
              className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1"
            >
              Custom Hex
            </label>
            <input
              id="hex-color-input"
              type="text"
              value={hexInput}
              onChange={handleHexChange}
              placeholder="#rrggbb"
              maxLength={7}
              className={cn(
                'w-full rounded-md border px-3 py-1.5 text-sm font-mono',
                'focus:outline-none focus:ring-2 focus:ring-ring',
                hexError ? 'border-red-400 focus:ring-red-400' : 'border-input'
              )}
            />
            {hexError && (
              <p className="mt-1 text-xs text-red-500">
                Enter a valid hex color (e.g. #2563eb)
              </p>
            )}
          </div>

          {showContrastWarning && !hexError && (
            <p className="mt-3 text-xs text-amber-600 bg-amber-50 rounded px-2 py-1.5">
              This color may be hard to read on white backgrounds.
            </p>
          )}

          <Popover.Arrow className="fill-popover stroke-border stroke-1" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
