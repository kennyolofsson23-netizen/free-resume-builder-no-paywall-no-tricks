/**
 * Component tests for SkillsForm.
 * Covers: rendering empty state, Add Skill button, skill row rendering,
 * updating skill name/level, deleting a skill.
 */
import { render, fireEvent, screen, act } from '@testing-library/react'
import React from 'react'
import { useResumeStore } from '@/store/resume-store'
import { SkillsForm } from '@/components/builder/sections/skills-form'

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

describe('SkillsForm — empty state', () => {
  it('renders without crashing when skills list is empty', () => {
    const { container } = render(React.createElement(SkillsForm))
    expect(container.firstChild).not.toBeNull()
  })

  it('shows empty state message when no skills added', () => {
    const { container } = render(React.createElement(SkillsForm))
    expect(container.textContent).toMatch(/list what you know/i)
  })

  it('renders "Add Skill" button', () => {
    render(React.createElement(SkillsForm))
    expect(screen.getByText('Add Skill')).toBeTruthy()
  })
})

// ---------------------------------------------------------------------------
// Add Skill
// ---------------------------------------------------------------------------

describe('SkillsForm — adding a skill', () => {
  it('clicking "Add Skill" adds a skill to the store', () => {
    render(React.createElement(SkillsForm))
    act(() => {
      fireEvent.click(screen.getByText('Add Skill'))
    })
    expect(useResumeStore.getState().resume?.skills).toHaveLength(1)
  })

  it('clicking "Add Skill" twice adds two skills', () => {
    render(React.createElement(SkillsForm))
    act(() => {
      fireEvent.click(screen.getByText('Add Skill'))
      fireEvent.click(screen.getByText('Add Skill'))
    })
    expect(useResumeStore.getState().resume?.skills).toHaveLength(2)
  })

  it('hides empty state message after adding a skill', () => {
    render(React.createElement(SkillsForm))
    act(() => {
      fireEvent.click(screen.getByText('Add Skill'))
    })
    expect(screen.queryByText(/list what you know/i)).toBeNull()
  })

  it('renders skill name input after adding a skill', () => {
    render(React.createElement(SkillsForm))
    act(() => {
      fireEvent.click(screen.getByText('Add Skill'))
    })
    const skillInputs = screen.getAllByLabelText(/skill name/i)
    expect(skillInputs).toHaveLength(1)
  })

  it('renders skill level selector after adding a skill', () => {
    render(React.createElement(SkillsForm))
    act(() => {
      fireEvent.click(screen.getByText('Add Skill'))
    })
    const levelSelects = screen.getAllByLabelText(/skill level/i)
    expect(levelSelects).toHaveLength(1)
  })
})

// ---------------------------------------------------------------------------
// Update skill
// ---------------------------------------------------------------------------

describe('SkillsForm — updating a skill', () => {
  it('typing in skill name input updates the store', () => {
    render(React.createElement(SkillsForm))
    act(() => {
      fireEvent.click(screen.getByText('Add Skill'))
    })

    const input = screen.getByLabelText(/skill name/i) as HTMLInputElement
    act(() => {
      fireEvent.change(input, { target: { value: 'TypeScript' } })
    })

    expect(useResumeStore.getState().resume?.skills[0]?.name).toBe('TypeScript')
  })

  it('skill level selector shows Proficiency option as default', () => {
    render(React.createElement(SkillsForm))
    act(() => {
      fireEvent.click(screen.getByText('Add Skill'))
    })

    const select = screen.getByLabelText(/skill level/i) as HTMLSelectElement
    expect(select.value).toBe('')
  })

  it('selecting a skill level updates the store', () => {
    render(React.createElement(SkillsForm))
    act(() => {
      fireEvent.click(screen.getByText('Add Skill'))
    })

    const skillId = useResumeStore.getState().resume!.skills[0]!.id
    const select = screen.getByLabelText(/skill level/i) as HTMLSelectElement
    act(() => {
      fireEvent.change(select, { target: { value: 'expert' } })
    })

    expect(useResumeStore.getState().resume?.skills[0]?.level).toBe('expert')
  })

  it('skill level selector contains all 4 levels', () => {
    render(React.createElement(SkillsForm))
    act(() => {
      fireEvent.click(screen.getByText('Add Skill'))
    })

    const select = screen.getByLabelText(/skill level/i) as HTMLSelectElement
    const options = Array.from(select.options).map((o) => o.value)
    expect(options).toContain('beginner')
    expect(options).toContain('intermediate')
    expect(options).toContain('advanced')
    expect(options).toContain('expert')
  })
})

// ---------------------------------------------------------------------------
// Delete skill
// ---------------------------------------------------------------------------

describe('SkillsForm — deleting a skill', () => {
  it('clicking delete removes the skill from the store', () => {
    render(React.createElement(SkillsForm))
    act(() => {
      fireEvent.click(screen.getByText('Add Skill'))
    })

    // Update skill name so we can identify delete button by aria-label
    const skillId = useResumeStore.getState().resume!.skills[0]!.id
    act(() => {
      useResumeStore.getState().updateSkill(skillId, { name: 'Python' })
    })

    const deleteBtn = screen.getByLabelText(/delete skill Python/i)
    act(() => {
      fireEvent.click(deleteBtn)
    })

    expect(useResumeStore.getState().resume?.skills).toHaveLength(0)
  })

  it('empty state is shown again after all skills deleted', () => {
    render(React.createElement(SkillsForm))
    act(() => {
      fireEvent.click(screen.getByText('Add Skill'))
    })

    const skillId = useResumeStore.getState().resume!.skills[0]!.id
    act(() => {
      useResumeStore.getState().updateSkill(skillId, { name: 'Go' })
    })

    act(() => {
      fireEvent.click(screen.getByLabelText(/delete skill Go/i))
    })

    expect(screen.getByText(/list what you know/i)).toBeTruthy()
  })
})

// ---------------------------------------------------------------------------
// Multiple skills
// ---------------------------------------------------------------------------

describe('SkillsForm — multiple skills', () => {
  it('renders one row per skill in the store', () => {
    act(() => {
      useResumeStore.getState().addSkill()
      useResumeStore.getState().addSkill()
      useResumeStore.getState().addSkill()
    })

    render(React.createElement(SkillsForm))
    const inputs = screen.getAllByLabelText(/skill name/i)
    expect(inputs).toHaveLength(3)
  })

  it('correctly reflects pre-populated skill names', () => {
    act(() => {
      useResumeStore.getState().addSkill()
      const id = useResumeStore.getState().resume!.skills[0]!.id
      useResumeStore.getState().updateSkill(id, { name: 'React' })
    })

    render(React.createElement(SkillsForm))
    const input = screen.getByLabelText(/skill name/i) as HTMLInputElement
    expect(input.value).toBe('React')
  })
})
