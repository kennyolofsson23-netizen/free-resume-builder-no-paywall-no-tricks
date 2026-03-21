import { useResumeStore } from '@/store/resume-store'
import {
  personalInfoSchema,
  experienceSchema,
  skillSchema,
} from '@/lib/schemas/resume-schema'

// Reset store before each test
beforeEach(() => {
  useResumeStore.setState({
    resume: null,
    pastStates: [],
    futureStates: [],
  })
  vi.clearAllMocks()
})

describe('Form Editor — Personal Info', () => {
  it('personal info starts with empty fields after createNewResume', () => {
    useResumeStore.getState().createNewResume()
    const { resume } = useResumeStore.getState()

    expect(resume).toBeDefined()
    expect(resume?.personalInfo.fullName).toBe('')
    expect(resume?.personalInfo.email).toBe('')
    expect(resume?.personalInfo.phone).toBe('')
    expect(resume?.personalInfo.location).toBe('')
    expect(resume?.personalInfo.website).toBe('')
    expect(resume?.personalInfo.linkedin).toBe('')
    expect(resume?.personalInfo.github).toBe('')
    expect(resume?.personalInfo.summary).toBe('')
  })

  it('updatePersonalInfo updates fields individually', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updatePersonalInfo({ fullName: 'Jane Doe' })

    const { resume } = useResumeStore.getState()
    expect(resume?.personalInfo.fullName).toBe('Jane Doe')
    // Other fields unchanged
    expect(resume?.personalInfo.email).toBe('')
  })

  it('updatePersonalInfo can update multiple fields at once', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updatePersonalInfo({
      fullName: 'John Smith',
      email: 'john@example.com',
      phone: '555-1234',
    })

    const { resume } = useResumeStore.getState()
    expect(resume?.personalInfo.fullName).toBe('John Smith')
    expect(resume?.personalInfo.email).toBe('john@example.com')
    expect(resume?.personalInfo.phone).toBe('555-1234')
  })
})

describe('Form Editor — Add Experience', () => {
  it('addExperience adds a new empty experience entry', () => {
    useResumeStore.getState().createNewResume()
    expect(useResumeStore.getState().resume?.experiences).toHaveLength(0)

    useResumeStore.getState().addExperience()

    const { resume } = useResumeStore.getState()
    expect(resume?.experiences).toHaveLength(1)
  })

  it('new experience entry has empty required fields', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addExperience()

    const exp = useResumeStore.getState().resume?.experiences[0]
    expect(exp).toBeDefined()
    expect(exp?.jobTitle).toBe('')
    expect(exp?.company).toBe('')
    expect(exp?.currentlyWorking).toBe(false)
    expect(exp?.description).toBe('')
  })

  it('addExperience can be called multiple times', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addExperience()
    useResumeStore.getState().addExperience()
    useResumeStore.getState().addExperience()

    expect(useResumeStore.getState().resume?.experiences).toHaveLength(3)
  })

  it('removeExperience removes the correct entry', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addExperience()
    useResumeStore.getState().addExperience()

    const experiences = useResumeStore.getState().resume?.experiences ?? []
    expect(experiences).toHaveLength(2)

    const firstExp = experiences[0]
    if (!firstExp) throw new Error('Expected first experience to exist')
    useResumeStore.getState().removeExperience(firstExp.id)

    const remaining = useResumeStore.getState().resume?.experiences ?? []
    expect(remaining).toHaveLength(1)
    expect(remaining[0]?.id).not.toBe(firstExp.id)
  })
})

describe('Form Editor — Currently Working checkbox', () => {
  it('setting currentlyWorking to true clears endDate', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addExperience()

    const expArr = useResumeStore.getState().resume!.experiences
    const exp = expArr[0]
    if (!exp) throw new Error('Expected experience to exist')

    // Set an end date first
    useResumeStore.getState().updateExperience(exp.id, { endDate: '2023-12' })
    expect(useResumeStore.getState().resume?.experiences[0]?.endDate).toBe(
      '2023-12'
    )

    // Check "currently working" — should clear end date
    useResumeStore.getState().updateExperience(exp.id, {
      currentlyWorking: true,
      endDate: '',
    })

    const updated = useResumeStore.getState().resume?.experiences[0]
    expect(updated?.currentlyWorking).toBe(true)
    expect(updated?.endDate).toBe('')
  })

  it('unchecking currentlyWorking allows setting endDate again', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addExperience()

    const expArr2 = useResumeStore.getState().resume!.experiences
    const exp = expArr2[0]
    if (!exp) throw new Error('Expected experience to exist')

    // Set currently working
    useResumeStore.getState().updateExperience(exp.id, {
      currentlyWorking: true,
      endDate: '',
    })

    // Uncheck currently working and provide end date
    useResumeStore.getState().updateExperience(exp.id, {
      currentlyWorking: false,
      endDate: '2024-06',
    })

    const updated = useResumeStore.getState().resume?.experiences[0]
    expect(updated?.currentlyWorking).toBe(false)
    expect(updated?.endDate).toBe('2024-06')
  })
})

describe('Form Editor — Education', () => {
  it('addEducation adds a new empty education entry', () => {
    useResumeStore.getState().createNewResume()
    expect(useResumeStore.getState().resume?.education).toHaveLength(0)

    useResumeStore.getState().addEducation()

    const { resume } = useResumeStore.getState()
    expect(resume?.education).toHaveLength(1)
  })

  it('new education entry has empty required fields', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addEducation()

    const edu = useResumeStore.getState().resume?.education[0]
    expect(edu).toBeDefined()
    expect(edu?.school).toBe('')
    expect(edu?.degree).toBe('')
  })

  it('updateEducation updates fields', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addEducation()

    const edu = useResumeStore.getState().resume!.education[0]
    if (!edu) throw new Error('Expected education entry to exist')

    useResumeStore.getState().updateEducation(edu.id, {
      school: 'State University',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
    })

    const updated = useResumeStore.getState().resume?.education[0]
    expect(updated?.school).toBe('State University')
    expect(updated?.degree).toBe('Bachelor of Science')
    expect(updated?.field).toBe('Computer Science')
  })

  it('removeEducation removes the correct entry', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addEducation()
    useResumeStore.getState().addEducation()

    const entries = useResumeStore.getState().resume?.education ?? []
    expect(entries).toHaveLength(2)

    const first = entries[0]
    if (!first) throw new Error('Expected first education entry')
    useResumeStore.getState().removeEducation(first.id)

    const remaining = useResumeStore.getState().resume?.education ?? []
    expect(remaining).toHaveLength(1)
    expect(remaining[0]?.id).not.toBe(first.id)
  })

  it('reorderEducation changes the order', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addEducation()
    useResumeStore.getState().addEducation()

    const entries = useResumeStore.getState().resume?.education ?? []
    const [first, second] = entries
    if (!first || !second) throw new Error('Expected two education entries')

    useResumeStore.getState().reorderEducation([second.id, first.id])

    const reordered = useResumeStore.getState().resume?.education ?? []
    expect(reordered[0]?.id).toBe(second.id)
    expect(reordered[1]?.id).toBe(first.id)
  })
})

describe('Form Editor — Skills', () => {
  it('addSkill adds a new skill entry', () => {
    useResumeStore.getState().createNewResume()
    expect(useResumeStore.getState().resume?.skills).toHaveLength(0)

    useResumeStore.getState().addSkill()

    expect(useResumeStore.getState().resume?.skills).toHaveLength(1)
  })

  it('new skill has an empty name', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addSkill()

    const skill = useResumeStore.getState().resume?.skills[0]
    expect(skill?.name).toBe('')
  })

  it('updateSkill updates the skill name', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addSkill()

    const skill = useResumeStore.getState().resume!.skills[0]
    if (!skill) throw new Error('Expected skill entry')

    useResumeStore.getState().updateSkill(skill.id, { name: 'TypeScript' })

    const updated = useResumeStore.getState().resume?.skills[0]
    expect(updated?.name).toBe('TypeScript')
  })

  it('updateSkill can set skill level', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addSkill()

    const skill = useResumeStore.getState().resume!.skills[0]
    if (!skill) throw new Error('Expected skill entry')

    useResumeStore.getState().updateSkill(skill.id, { level: 'advanced' })

    const updated = useResumeStore.getState().resume?.skills[0]
    expect(updated?.level).toBe('advanced')
  })

  it('removeSkill removes the correct entry', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addSkill()
    useResumeStore.getState().addSkill()

    const skills = useResumeStore.getState().resume?.skills ?? []
    expect(skills).toHaveLength(2)

    const first = skills[0]
    if (!first) throw new Error('Expected first skill')
    useResumeStore.getState().removeSkill(first.id)

    const remaining = useResumeStore.getState().resume?.skills ?? []
    expect(remaining).toHaveLength(1)
    expect(remaining[0]?.id).not.toBe(first.id)
  })
})

describe('Form Editor — Projects', () => {
  it('addProject adds a new project entry', () => {
    useResumeStore.getState().createNewResume()
    expect(useResumeStore.getState().resume?.projects).toHaveLength(0)

    useResumeStore.getState().addProject()

    expect(useResumeStore.getState().resume?.projects).toHaveLength(1)
  })

  it('new project has an empty title', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addProject()

    const project = useResumeStore.getState().resume?.projects[0]
    expect(project?.title).toBe('')
  })

  it('updateProject updates fields', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addProject()

    const project = useResumeStore.getState().resume!.projects[0]
    if (!project) throw new Error('Expected project entry')

    useResumeStore.getState().updateProject(project.id, {
      title: 'My Portfolio',
      description: 'A personal portfolio website',
    })

    const updated = useResumeStore.getState().resume?.projects[0]
    expect(updated?.title).toBe('My Portfolio')
    expect(updated?.description).toBe('A personal portfolio website')
  })

  it('removeProject removes the correct entry', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addProject()
    useResumeStore.getState().addProject()

    const projects = useResumeStore.getState().resume?.projects ?? []
    expect(projects).toHaveLength(2)

    const first = projects[0]
    if (!first) throw new Error('Expected first project')
    useResumeStore.getState().removeProject(first.id)

    const remaining = useResumeStore.getState().resume?.projects ?? []
    expect(remaining).toHaveLength(1)
    expect(remaining[0]?.id).not.toBe(first.id)
  })

  it('removeProject removes all entries when called twice', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addProject()
    useResumeStore.getState().addProject()

    const projects = useResumeStore.getState().resume?.projects ?? []
    const [first, second] = projects
    if (!first || !second) throw new Error('Expected two project entries')

    useResumeStore.getState().removeProject(first.id)
    useResumeStore.getState().removeProject(second.id)

    const remaining = useResumeStore.getState().resume?.projects ?? []
    expect(remaining).toHaveLength(0)
  })
})

describe('Form Editor — Certifications', () => {
  it('addCertification adds a new certification entry', () => {
    useResumeStore.getState().createNewResume()
    expect(useResumeStore.getState().resume?.certifications).toHaveLength(0)

    useResumeStore.getState().addCertification()

    expect(useResumeStore.getState().resume?.certifications).toHaveLength(1)
  })

  it('new certification has empty required fields', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addCertification()

    const cert = useResumeStore.getState().resume?.certifications[0]
    expect(cert).toBeDefined()
    expect(cert?.name).toBe('')
    expect(cert?.issuer).toBe('')
  })

  it('updateCertification updates fields', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addCertification()

    const cert = useResumeStore.getState().resume!.certifications[0]
    if (!cert) throw new Error('Expected certification entry')

    useResumeStore.getState().updateCertification(cert.id, {
      name: 'AWS Solutions Architect',
      issuer: 'Amazon Web Services',
      issueDate: '2024-01',
    })

    const updated = useResumeStore.getState().resume?.certifications[0]
    expect(updated?.name).toBe('AWS Solutions Architect')
    expect(updated?.issuer).toBe('Amazon Web Services')
    expect(updated?.issueDate).toBe('2024-01')
  })

  it('removeCertification removes the correct entry', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addCertification()
    useResumeStore.getState().addCertification()

    const certs = useResumeStore.getState().resume?.certifications ?? []
    expect(certs).toHaveLength(2)

    const first = certs[0]
    if (!first) throw new Error('Expected first certification')
    useResumeStore.getState().removeCertification(first.id)

    const remaining = useResumeStore.getState().resume?.certifications ?? []
    expect(remaining).toHaveLength(1)
    expect(remaining[0]?.id).not.toBe(first.id)
  })
})

describe('Form Editor — Validation via Zod schemas', () => {
  it('personalInfoSchema rejects invalid email', () => {
    // personalInfoSchema imported at top
    const result = personalInfoSchema.safeParse({
      fullName: 'Jane Doe',
      email: 'not-an-email',
      phone: '',
      location: '',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain('email')
    }
  })

  it('personalInfoSchema accepts valid email', () => {
    // personalInfoSchema imported at top
    const result = personalInfoSchema.safeParse({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      phone: '',
      location: '',
    })
    expect(result.success).toBe(true)
  })

  it('personalInfoSchema rejects empty fullName', () => {
    // personalInfoSchema imported at top
    const result = personalInfoSchema.safeParse({
      fullName: '',
      email: 'jane@example.com',
      phone: '',
      location: '',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain('fullName')
    }
  })

  it('personalInfoSchema rejects invalid URL in website field', () => {
    // personalInfoSchema imported at top
    const result = personalInfoSchema.safeParse({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      website: 'not-a-url',
      phone: '',
      location: '',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const websiteIssue = result.error.issues.find((i: { path: string[] }) =>
        i.path.includes('website')
      )
      expect(websiteIssue).toBeDefined()
    }
  })

  it('personalInfoSchema accepts empty string for optional URL fields', () => {
    // personalInfoSchema imported at top
    const result = personalInfoSchema.safeParse({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      website: '',
      linkedin: '',
      github: '',
      phone: '',
      location: '',
    })
    expect(result.success).toBe(true)
  })

  it('personalInfoSchema accepts valid URLs', () => {
    // personalInfoSchema imported at top
    const result = personalInfoSchema.safeParse({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      website: 'https://janedoe.com',
      linkedin: 'https://linkedin.com/in/janedoe',
      github: 'https://github.com/janedoe',
      phone: '',
      location: '',
    })
    expect(result.success).toBe(true)
  })

  it('skillSchema rejects empty skill name', () => {
    // skillSchema imported at top
    const result = skillSchema.safeParse({ id: '1', name: '' })
    expect(result.success).toBe(false)
  })

  it('experienceSchema requires jobTitle and company', () => {
    // experienceSchema imported at top
    const result = experienceSchema.safeParse({
      id: '1',
      jobTitle: '',
      company: '',
      startDate: '',
      currentlyWorking: false,
      description: '',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const paths = result.error.issues.map(
        (i: { path: string[] }) => i.path[0]
      )
      expect(paths).toContain('jobTitle')
      expect(paths).toContain('company')
    }
  })

  it('experienceSchema accepts valid entry', () => {
    // experienceSchema imported at top
    const result = experienceSchema.safeParse({
      id: 'exp-1',
      jobTitle: 'Software Engineer',
      company: 'Acme Corp',
      startDate: '2022-01',
      currentlyWorking: false,
      description: 'Built great things',
    })
    expect(result.success).toBe(true)
  })
})

describe('Form Editor — Drag-and-drop reorder via store', () => {
  it('reorderExperiences correctly reorders entries', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addExperience()
    useResumeStore.getState().addExperience()
    useResumeStore.getState().addExperience()

    const experiences = useResumeStore.getState().resume?.experiences ?? []
    const [a, b, c] = experiences
    if (!a || !b || !c) throw new Error('Expected three experiences')

    // Reverse order
    useResumeStore.getState().reorderExperiences([c.id, b.id, a.id])

    const reordered = useResumeStore.getState().resume?.experiences ?? []
    expect(reordered[0]?.id).toBe(c.id)
    expect(reordered[1]?.id).toBe(b.id)
    expect(reordered[2]?.id).toBe(a.id)
  })

  it('reorderEducation preserves all entries', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addEducation()
    useResumeStore.getState().addEducation()

    const entries = useResumeStore.getState().resume?.education ?? []
    expect(entries).toHaveLength(2)

    const [first, second] = entries
    if (!first || !second) throw new Error('Expected two education entries')

    useResumeStore.getState().reorderEducation([second.id, first.id])

    const reordered = useResumeStore.getState().resume?.education ?? []
    expect(reordered).toHaveLength(2)
  })
})
