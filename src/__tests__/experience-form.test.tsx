/**
 * Component tests for ExperienceForm.
 * Covers: empty state, Add Experience button, field rendering,
 * inline blur validation, "Currently Working" checkbox, and delete.
 *
 * @dnd-kit is mocked to a simple passthrough to avoid complex pointer/sensor
 * setup in jsdom.
 */
import { render, fireEvent, screen, act } from '@testing-library/react'
import React from 'react'
import { useResumeStore } from '@/store/resume-store'

// ---------------------------------------------------------------------------
// Mock @dnd-kit so ExperienceForm renders without pointer/sensor APIs
// ---------------------------------------------------------------------------

vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', null, children),
  closestCenter: vi.fn(),
  KeyboardSensor: class {},
  PointerSensor: class {},
  useSensor: vi.fn(),
  useSensors: vi.fn(() => []),
}))

vi.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', null, children),
  sortableKeyboardCoordinates: vi.fn(),
  useSortable: vi.fn(() => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  })),
  verticalListSortingStrategy: vi.fn(),
  arrayMove: (arr: unknown[], from: number, to: number) => {
    const result = [...arr]
    const [item] = result.splice(from, 1)
    result.splice(to, 0, item)
    return result
  },
}))

vi.mock('@dnd-kit/utilities', () => ({
  CSS: { Transform: { toString: () => '' } },
}))

// Import the component after mocks
import { ExperienceForm } from '@/components/builder/sections/experience-form'

// ---------------------------------------------------------------------------
// Store reset
// ---------------------------------------------------------------------------

beforeEach(() => {
  useResumeStore.setState({ resume: null, pastStates: [], futureStates: [] })
  useResumeStore.getState().createNewResume()
})

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

describe('ExperienceForm — empty state', () => {
  it('renders without crashing when experience list is empty', () => {
    const { container } = render(React.createElement(ExperienceForm))
    expect(container.firstChild).not.toBeNull()
  })

  it('shows empty state message when no experience added', () => {
    const { container } = render(React.createElement(ExperienceForm))
    expect(container.textContent).toMatch(/work history/i)
  })

  it('renders "Add Experience" button', () => {
    render(React.createElement(ExperienceForm))
    expect(screen.getByText('Add Experience')).toBeTruthy()
  })
})

// ---------------------------------------------------------------------------
// Adding experience
// ---------------------------------------------------------------------------

describe('ExperienceForm — adding an experience', () => {
  it('clicking "Add Experience" adds to the store', () => {
    render(React.createElement(ExperienceForm))
    act(() => {
      fireEvent.click(screen.getByText('Add Experience'))
    })
    expect(useResumeStore.getState().resume?.experiences).toHaveLength(1)
  })

  it('clicking "Add Experience" twice creates two entries', () => {
    render(React.createElement(ExperienceForm))
    act(() => {
      fireEvent.click(screen.getByText('Add Experience'))
      fireEvent.click(screen.getByText('Add Experience'))
    })
    expect(useResumeStore.getState().resume?.experiences).toHaveLength(2)
  })

  it('hides empty state message after adding', () => {
    render(React.createElement(ExperienceForm))
    act(() => {
      fireEvent.click(screen.getByText('Add Experience'))
    })
    expect(screen.queryByText(/work history/i)).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// Field rendering after adding
// ---------------------------------------------------------------------------

describe('ExperienceForm — field rendering', () => {
  it('renders Job Title input after adding experience', () => {
    act(() => {
      useResumeStore.getState().addExperience()
    })
    render(React.createElement(ExperienceForm))
    expect(screen.getByText(/Job Title/)).toBeTruthy()
  })

  it('renders Company input after adding experience', () => {
    act(() => {
      useResumeStore.getState().addExperience()
    })
    render(React.createElement(ExperienceForm))
    expect(screen.getByText(/Company/)).toBeTruthy()
  })

  it('renders "Currently Working Here" checkbox', () => {
    act(() => {
      useResumeStore.getState().addExperience()
    })
    render(React.createElement(ExperienceForm))
    expect(screen.getByText('Currently Working Here')).toBeTruthy()
  })

  it('renders Description textarea', () => {
    act(() => {
      useResumeStore.getState().addExperience()
    })
    render(React.createElement(ExperienceForm))
    expect(screen.getByText(/Description/)).toBeTruthy()
  })

  it('shows "New Experience" as the accordion title for a blank entry', () => {
    act(() => {
      useResumeStore.getState().addExperience()
    })
    render(React.createElement(ExperienceForm))
    expect(screen.getByText('New Experience')).toBeTruthy()
  })

  it('shows company name as subtitle when filled', () => {
    act(() => {
      useResumeStore.getState().addExperience()
      const id = useResumeStore.getState().resume!.experiences[0]!.id
      useResumeStore
        .getState()
        .updateExperience(id, { company: 'Acme Corp', jobTitle: 'Engineer' })
    })
    render(React.createElement(ExperienceForm))
    expect(screen.getByText('Acme Corp')).toBeTruthy()
    expect(screen.getByText('Engineer')).toBeTruthy()
  })
})

// ---------------------------------------------------------------------------
// Inline blur validation
// ---------------------------------------------------------------------------

describe('ExperienceForm — blur validation', () => {
  it('shows error when Job Title is blurred empty', () => {
    act(() => {
      useResumeStore.getState().addExperience()
    })
    render(React.createElement(ExperienceForm))

    const expId = useResumeStore.getState().resume!.experiences[0]!.id
    const input = document.getElementById(
      `jobTitle-${expId}`
    ) as HTMLInputElement

    act(() => {
      fireEvent.blur(input, { target: { value: '' } })
    })

    expect(screen.getByText(/add a job title/i)).toBeTruthy()
  })

  it('shows error when Company is blurred empty', () => {
    act(() => {
      useResumeStore.getState().addExperience()
    })
    render(React.createElement(ExperienceForm))

    const expId = useResumeStore.getState().resume!.experiences[0]!.id
    const input = document.getElementById(
      `company-${expId}`
    ) as HTMLInputElement

    act(() => {
      fireEvent.blur(input, { target: { value: '' } })
    })

    expect(screen.getByText(/add the company name/i)).toBeTruthy()
  })

  it('clears Job Title error after value entered', () => {
    act(() => {
      useResumeStore.getState().addExperience()
    })
    render(React.createElement(ExperienceForm))

    const expId = useResumeStore.getState().resume!.experiences[0]!.id
    const input = document.getElementById(
      `jobTitle-${expId}`
    ) as HTMLInputElement

    // Trigger error
    act(() => {
      fireEvent.blur(input, { target: { value: '' } })
    })
    expect(screen.getByText(/add a job title/i)).toBeTruthy()

    // Fix error
    act(() => {
      fireEvent.change(input, { target: { value: 'Engineer' } })
      fireEvent.blur(input, { target: { value: 'Engineer' } })
    })
    expect(screen.queryByText(/add a job title/i)).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// Currently Working checkbox
// ---------------------------------------------------------------------------

describe('ExperienceForm — Currently Working checkbox', () => {
  it('checking Currently Working updates the store', () => {
    act(() => {
      useResumeStore.getState().addExperience()
    })
    render(React.createElement(ExperienceForm))

    const expId = useResumeStore.getState().resume!.experiences[0]!.id
    const checkbox = document.getElementById(
      `currentlyWorking-${expId}`
    ) as HTMLInputElement

    act(() => {
      fireEvent.click(checkbox)
    })

    expect(
      useResumeStore.getState().resume?.experiences[0]?.currentlyWorking
    ).toBe(true)
  })

  it('checking Currently Working hides the End Date input', () => {
    act(() => {
      useResumeStore.getState().addExperience()
    })
    render(React.createElement(ExperienceForm))

    const expId = useResumeStore.getState().resume!.experiences[0]!.id
    const checkbox = document.getElementById(
      `currentlyWorking-${expId}`
    ) as HTMLInputElement

    // End Date visible initially
    expect(document.getElementById(`endDate-${expId}`)).not.toBeNull()

    act(() => {
      fireEvent.click(checkbox)
    })

    // End Date hidden after checking
    expect(document.getElementById(`endDate-${expId}`)).toBeNull()
  })

  it('unchecking Currently Working shows the End Date input again', () => {
    act(() => {
      useResumeStore.getState().addExperience()
      const id = useResumeStore.getState().resume!.experiences[0]!.id
      useResumeStore
        .getState()
        .updateExperience(id, { currentlyWorking: true, endDate: '' })
    })

    render(React.createElement(ExperienceForm))
    const expId = useResumeStore.getState().resume!.experiences[0]!.id
    const checkbox = document.getElementById(
      `currentlyWorking-${expId}`
    ) as HTMLInputElement

    // End Date absent while checked
    expect(document.getElementById(`endDate-${expId}`)).toBeNull()

    act(() => {
      fireEvent.click(checkbox)
    })

    // End Date visible again
    expect(document.getElementById(`endDate-${expId}`)).not.toBeNull()
  })
})

// ---------------------------------------------------------------------------
// Field updates stored correctly
// ---------------------------------------------------------------------------

describe('ExperienceForm — field updates', () => {
  it('typing in Job Title updates the store', () => {
    act(() => {
      useResumeStore.getState().addExperience()
    })
    render(React.createElement(ExperienceForm))

    const expId = useResumeStore.getState().resume!.experiences[0]!.id
    const input = document.getElementById(
      `jobTitle-${expId}`
    ) as HTMLInputElement

    act(() => {
      fireEvent.change(input, { target: { value: 'Senior Engineer' } })
    })

    expect(useResumeStore.getState().resume?.experiences[0]?.jobTitle).toBe(
      'Senior Engineer'
    )
  })

  it('typing in Company updates the store', () => {
    act(() => {
      useResumeStore.getState().addExperience()
    })
    render(React.createElement(ExperienceForm))

    const expId = useResumeStore.getState().resume!.experiences[0]!.id
    const input = document.getElementById(
      `company-${expId}`
    ) as HTMLInputElement

    act(() => {
      fireEvent.change(input, { target: { value: 'Acme Inc' } })
    })

    expect(useResumeStore.getState().resume?.experiences[0]?.company).toBe(
      'Acme Inc'
    )
  })
})

// ---------------------------------------------------------------------------
// Delete experience
// ---------------------------------------------------------------------------

describe('ExperienceForm — delete experience', () => {
  it('clicking delete removes the entry immediately', () => {
    act(() => {
      useResumeStore.getState().addExperience()
      const id = useResumeStore.getState().resume!.experiences[0]!.id
      useResumeStore
        .getState()
        .updateExperience(id, { jobTitle: 'Dev', company: 'Co' })
    })

    render(React.createElement(ExperienceForm))

    // Click the trash icon — removes immediately (undo with Ctrl+Z)
    const deleteBtn = screen.getByLabelText('Remove Dev')
    act(() => {
      fireEvent.click(deleteBtn)
    })

    expect(useResumeStore.getState().resume?.experiences).toHaveLength(0)
  })
})
