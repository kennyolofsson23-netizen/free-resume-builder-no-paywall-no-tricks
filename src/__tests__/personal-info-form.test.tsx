/**
 * Component tests for PersonalInfoForm.
 * Covers: rendering, field interaction, blur-based inline validation,
 * URL validation, character counter, and store updates.
 */
import { render, fireEvent, screen, act } from '@testing-library/react'
import React from 'react'
import { useResumeStore } from '@/store/resume-store'
import { PersonalInfoForm } from '@/components/builder/sections/personal-info-form'
import { FIELD_LIMITS } from '@/lib/constants'

// ---------------------------------------------------------------------------
// Store reset
// ---------------------------------------------------------------------------

beforeEach(() => {
  useResumeStore.setState({ resume: null, pastStates: [], futureStates: [] })
  useResumeStore.getState().createNewResume()
})

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

describe('PersonalInfoForm — rendering', () => {
  it('renders without crashing', () => {
    const { container } = render(React.createElement(PersonalInfoForm))
    expect(container.firstChild).not.toBeNull()
  })

  it('renders null when resume is null', () => {
    useResumeStore.setState({ resume: null })
    const { container } = render(React.createElement(PersonalInfoForm))
    expect(container.firstChild).toBeNull()
  })

  it('renders fullName input with correct id', () => {
    render(React.createElement(PersonalInfoForm))
    expect(document.getElementById('fullName')).not.toBeNull()
  })

  it('renders email input with correct id', () => {
    render(React.createElement(PersonalInfoForm))
    expect(document.getElementById('email')).not.toBeNull()
  })

  it('renders phone input with correct id', () => {
    render(React.createElement(PersonalInfoForm))
    expect(document.getElementById('phone')).not.toBeNull()
  })

  it('renders location input with correct id', () => {
    render(React.createElement(PersonalInfoForm))
    expect(document.getElementById('location')).not.toBeNull()
  })

  it('renders website input with correct id', () => {
    render(React.createElement(PersonalInfoForm))
    expect(document.getElementById('website')).not.toBeNull()
  })

  it('renders linkedin input with correct id', () => {
    render(React.createElement(PersonalInfoForm))
    expect(document.getElementById('linkedin')).not.toBeNull()
  })

  it('renders github input with correct id', () => {
    render(React.createElement(PersonalInfoForm))
    expect(document.getElementById('github')).not.toBeNull()
  })

  it('renders summary textarea with correct id', () => {
    render(React.createElement(PersonalInfoForm))
    expect(document.getElementById('summary')).not.toBeNull()
  })

  it('renders summary character counter showing 0 / 2000 initially', () => {
    render(React.createElement(PersonalInfoForm))
    expect(screen.getByText(`0 / ${FIELD_LIMITS.summary}`)).toBeTruthy()
  })

  it('fullName input is aria-required', () => {
    render(React.createElement(PersonalInfoForm))
    const input = document.getElementById('fullName') as HTMLInputElement
    expect(input.getAttribute('aria-required')).toBe('true')
  })

  it('email input is aria-required', () => {
    render(React.createElement(PersonalInfoForm))
    const input = document.getElementById('email') as HTMLInputElement
    expect(input.getAttribute('aria-required')).toBe('true')
  })

  it('fullName has correct maxLength from FIELD_LIMITS', () => {
    render(React.createElement(PersonalInfoForm))
    const input = document.getElementById('fullName') as HTMLInputElement
    expect(Number(input.maxLength)).toBe(FIELD_LIMITS.fullName)
  })

  it('email has correct maxLength from FIELD_LIMITS', () => {
    render(React.createElement(PersonalInfoForm))
    const input = document.getElementById('email') as HTMLInputElement
    expect(Number(input.maxLength)).toBe(FIELD_LIMITS.email)
  })
})

// ---------------------------------------------------------------------------
// Store updates on change
// ---------------------------------------------------------------------------

describe('PersonalInfoForm — store updates on change', () => {
  it('typing in fullName updates the store', () => {
    render(React.createElement(PersonalInfoForm))
    const input = document.getElementById('fullName') as HTMLInputElement
    act(() => {
      fireEvent.change(input, { target: { value: 'Jane Doe' } })
    })
    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe(
      'Jane Doe'
    )
  })

  it('typing in email updates the store', () => {
    render(React.createElement(PersonalInfoForm))
    const input = document.getElementById('email') as HTMLInputElement
    act(() => {
      fireEvent.change(input, { target: { value: 'jane@example.com' } })
    })
    expect(useResumeStore.getState().resume?.personalInfo.email).toBe(
      'jane@example.com'
    )
  })

  it('typing in phone updates the store', () => {
    render(React.createElement(PersonalInfoForm))
    const input = document.getElementById('phone') as HTMLInputElement
    act(() => {
      fireEvent.change(input, { target: { value: '555-1234' } })
    })
    expect(useResumeStore.getState().resume?.personalInfo.phone).toBe(
      '555-1234'
    )
  })

  it('typing in location updates the store', () => {
    render(React.createElement(PersonalInfoForm))
    const input = document.getElementById('location') as HTMLInputElement
    act(() => {
      fireEvent.change(input, { target: { value: 'New York, NY' } })
    })
    expect(useResumeStore.getState().resume?.personalInfo.location).toBe(
      'New York, NY'
    )
  })

  it('typing in website updates the store', () => {
    render(React.createElement(PersonalInfoForm))
    const input = document.getElementById('website') as HTMLInputElement
    act(() => {
      fireEvent.change(input, { target: { value: 'https://example.com' } })
    })
    expect(useResumeStore.getState().resume?.personalInfo.website).toBe(
      'https://example.com'
    )
  })

  it('typing in summary updates the store', () => {
    render(React.createElement(PersonalInfoForm))
    const textarea = document.getElementById('summary') as HTMLTextAreaElement
    act(() => {
      fireEvent.change(textarea, { target: { value: 'Experienced engineer.' } })
    })
    expect(useResumeStore.getState().resume?.personalInfo.summary).toBe(
      'Experienced engineer.'
    )
  })

  it('summary character counter updates as user types', () => {
    render(React.createElement(PersonalInfoForm))
    const textarea = document.getElementById('summary') as HTMLTextAreaElement
    act(() => {
      fireEvent.change(textarea, { target: { value: 'Hello' } })
    })
    expect(screen.getByText(`5 / ${FIELD_LIMITS.summary}`)).toBeTruthy()
  })
})

// ---------------------------------------------------------------------------
// Inline validation — fullName
// ---------------------------------------------------------------------------

describe('PersonalInfoForm — fullName blur validation', () => {
  it('shows error when fullName is blurred empty', () => {
    render(React.createElement(PersonalInfoForm))
    const input = document.getElementById('fullName') as HTMLInputElement
    act(() => {
      fireEvent.blur(input, { target: { value: '' } })
    })
    expect(screen.getByText(/enter your name/i)).toBeTruthy()
  })

  it('shows error when fullName is whitespace only', () => {
    render(React.createElement(PersonalInfoForm))
    const input = document.getElementById('fullName') as HTMLInputElement
    act(() => {
      fireEvent.blur(input, { target: { value: '   ' } })
    })
    expect(screen.getByText(/enter your name/i)).toBeTruthy()
  })

  it('does not show error when fullName has a value', () => {
    render(React.createElement(PersonalInfoForm))
    const input = document.getElementById('fullName') as HTMLInputElement
    act(() => {
      fireEvent.change(input, { target: { value: 'Jane Doe' } })
      fireEvent.blur(input, { target: { value: 'Jane Doe' } })
    })
    expect(screen.queryByText(/enter your name/i)).toBeNull()
  })

  it('fullName input aria-invalid becomes true when empty on blur', () => {
    render(React.createElement(PersonalInfoForm))
    const input = document.getElementById('fullName') as HTMLInputElement
    act(() => {
      fireEvent.blur(input, { target: { value: '' } })
    })
    expect(input.getAttribute('aria-invalid')).toBe('true')
  })
})

// ---------------------------------------------------------------------------
// Inline validation — email
// ---------------------------------------------------------------------------

describe('PersonalInfoForm — email blur validation', () => {
  it('shows error when email is blurred empty', () => {
    render(React.createElement(PersonalInfoForm))
    const input = document.getElementById('email') as HTMLInputElement
    act(() => {
      fireEvent.blur(input, { target: { value: '' } })
    })
    expect(screen.getByText(/enter your email/i)).toBeTruthy()
  })

  it('shows error when email is invalid format', () => {
    render(React.createElement(PersonalInfoForm))
    const input = document.getElementById('email') as HTMLInputElement
    act(() => {
      fireEvent.change(input, { target: { value: 'not-an-email' } })
      fireEvent.blur(input, { target: { value: 'not-an-email' } })
    })
    expect(screen.getByText(/valid email/i)).toBeTruthy()
  })

  it('does not show error when email is valid', () => {
    render(React.createElement(PersonalInfoForm))
    const input = document.getElementById('email') as HTMLInputElement
    act(() => {
      fireEvent.change(input, { target: { value: 'jane@example.com' } })
      fireEvent.blur(input, { target: { value: 'jane@example.com' } })
    })
    expect(screen.queryByText(/valid email/i)).toBeNull()
    expect(screen.queryByText(/enter your email/i)).toBeNull()
  })

  it('email input aria-invalid becomes true when invalid on blur', () => {
    render(React.createElement(PersonalInfoForm))
    const input = document.getElementById('email') as HTMLInputElement
    act(() => {
      fireEvent.change(input, { target: { value: 'bad-email' } })
      fireEvent.blur(input, { target: { value: 'bad-email' } })
    })
    expect(input.getAttribute('aria-invalid')).toBe('true')
  })
})

// ---------------------------------------------------------------------------
// Inline validation — URL fields
// ---------------------------------------------------------------------------

describe('PersonalInfoForm — URL field blur validation', () => {
  it('shows error when website has invalid URL', () => {
    render(React.createElement(PersonalInfoForm))
    const input = document.getElementById('website') as HTMLInputElement
    act(() => {
      fireEvent.change(input, { target: { value: 'not-a-url' } })
      fireEvent.blur(input, { target: { value: 'not-a-url' } })
    })
    expect(screen.getByText(/full URL/i)).toBeTruthy()
  })

  it('does not show error when website is a valid URL', () => {
    render(React.createElement(PersonalInfoForm))
    const input = document.getElementById('website') as HTMLInputElement
    act(() => {
      fireEvent.change(input, { target: { value: 'https://example.com' } })
      fireEvent.blur(input, { target: { value: 'https://example.com' } })
    })
    expect(screen.queryByText(/full URL/i)).toBeNull()
  })

  it('does not show error when website is empty (optional field)', () => {
    render(React.createElement(PersonalInfoForm))
    const input = document.getElementById('website') as HTMLInputElement
    act(() => {
      fireEvent.change(input, { target: { value: '' } })
      fireEvent.blur(input, { target: { value: '' } })
    })
    expect(screen.queryByText(/full URL/i)).toBeNull()
  })

  it('shows error when linkedin has invalid URL', () => {
    render(React.createElement(PersonalInfoForm))
    const input = document.getElementById('linkedin') as HTMLInputElement
    act(() => {
      fireEvent.change(input, { target: { value: 'linkedin.com/in/user' } })
      fireEvent.blur(input, { target: { value: 'linkedin.com/in/user' } })
    })
    // Missing https:// makes this invalid
    expect(screen.getByText(/full URL/i)).toBeTruthy()
  })

  it('shows error when github has invalid URL', () => {
    render(React.createElement(PersonalInfoForm))
    const input = document.getElementById('github') as HTMLInputElement
    act(() => {
      fireEvent.change(input, { target: { value: 'github.com/user' } })
      fireEvent.blur(input, { target: { value: 'github.com/user' } })
    })
    expect(screen.getByText(/full URL/i)).toBeTruthy()
  })

  it('does not show error when github is a valid https URL', () => {
    render(React.createElement(PersonalInfoForm))
    const input = document.getElementById('github') as HTMLInputElement
    act(() => {
      fireEvent.change(input, {
        target: { value: 'https://github.com/janedoe' },
      })
      fireEvent.blur(input, {
        target: { value: 'https://github.com/janedoe' },
      })
    })
    expect(screen.queryByText(/full URL/i)).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// Initial values reflect store state
// ---------------------------------------------------------------------------

describe('PersonalInfoForm — initial values from store', () => {
  it('fullName input reflects store value', () => {
    act(() => {
      useResumeStore.getState().updatePersonalInfo({ fullName: 'Pre-filled' })
    })
    render(React.createElement(PersonalInfoForm))
    const input = document.getElementById('fullName') as HTMLInputElement
    expect(input.value).toBe('Pre-filled')
  })

  it('email input reflects store value', () => {
    act(() => {
      useResumeStore
        .getState()
        .updatePersonalInfo({ email: 'pre@example.com' })
    })
    render(React.createElement(PersonalInfoForm))
    const input = document.getElementById('email') as HTMLInputElement
    expect(input.value).toBe('pre@example.com')
  })

  it('summary textarea reflects store value', () => {
    act(() => {
      useResumeStore
        .getState()
        .updatePersonalInfo({ summary: 'Existing summary text.' })
    })
    render(React.createElement(PersonalInfoForm))
    const textarea = document.getElementById('summary') as HTMLTextAreaElement
    expect(textarea.value).toBe('Existing summary text.')
  })
})
