/**
 * Tests for Zod schema validation — resume-schema.ts
 * Covers all individual schemas and the root resumeSchema.
 */
import { describe, it, expect } from 'vitest'
import {
  personalInfoSchema,
  experienceSchema,
  educationSchema,
  skillSchema,
  projectSchema,
  certificationSchema,
  resumeTemplateSchema,
  resumeSchema,
} from '@/lib/schemas/resume-schema'

// ---------------------------------------------------------------------------
// personalInfoSchema
// ---------------------------------------------------------------------------

describe('personalInfoSchema — valid data', () => {
  const base = {
    fullName: 'Jane Doe',
    email: 'jane@example.com',
    phone: '555-0100',
    location: 'New York, NY',
    website: '',
    linkedin: '',
    github: '',
    summary: '',
  }

  it('accepts a fully-populated personal info object', () => {
    expect(personalInfoSchema.safeParse(base).success).toBe(true)
  })

  it('accepts valid website URL', () => {
    expect(
      personalInfoSchema.safeParse({
        ...base,
        website: 'https://janedoe.dev',
      }).success
    ).toBe(true)
  })

  it('accepts valid linkedin URL', () => {
    expect(
      personalInfoSchema.safeParse({
        ...base,
        linkedin: 'https://linkedin.com/in/janedoe',
      }).success
    ).toBe(true)
  })

  it('accepts valid github URL', () => {
    expect(
      personalInfoSchema.safeParse({
        ...base,
        github: 'https://github.com/janedoe',
      }).success
    ).toBe(true)
  })

  it('accepts summary up to 2000 characters', () => {
    expect(
      personalInfoSchema.safeParse({ ...base, summary: 'x'.repeat(2000) })
        .success
    ).toBe(true)
  })
})

describe('personalInfoSchema — invalid data', () => {
  const base = {
    fullName: 'Jane Doe',
    email: 'jane@example.com',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    summary: '',
  }

  it('rejects empty fullName', () => {
    expect(
      personalInfoSchema.safeParse({ ...base, fullName: '' }).success
    ).toBe(false)
  })

  it('rejects fullName exceeding 100 characters', () => {
    expect(
      personalInfoSchema.safeParse({ ...base, fullName: 'A'.repeat(101) })
        .success
    ).toBe(false)
  })

  it('rejects invalid email format', () => {
    expect(
      personalInfoSchema.safeParse({ ...base, email: 'not-an-email' }).success
    ).toBe(false)
  })

  it('rejects email without domain', () => {
    expect(
      personalInfoSchema.safeParse({ ...base, email: 'user@' }).success
    ).toBe(false)
  })

  it('rejects phone exceeding 20 characters', () => {
    expect(
      personalInfoSchema.safeParse({ ...base, phone: '1'.repeat(21) }).success
    ).toBe(false)
  })

  it('rejects invalid website URL', () => {
    expect(
      personalInfoSchema.safeParse({ ...base, website: 'not-a-url' }).success
    ).toBe(false)
  })

  it('rejects invalid linkedin URL', () => {
    expect(
      personalInfoSchema.safeParse({ ...base, linkedin: 'just-text' }).success
    ).toBe(false)
  })

  it('rejects invalid github URL', () => {
    expect(
      personalInfoSchema.safeParse({ ...base, github: 'github.com/user' }).success
    ).toBe(false)
  })

  it('rejects summary exceeding 2000 characters', () => {
    expect(
      personalInfoSchema.safeParse({ ...base, summary: 'x'.repeat(2001) })
        .success
    ).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// experienceSchema
// ---------------------------------------------------------------------------

describe('experienceSchema — valid data', () => {
  const base = {
    id: 'exp-1',
    jobTitle: 'Software Engineer',
    company: 'Acme Corp',
    location: 'New York',
    startDate: '2021-01',
    endDate: '2023-06',
    currentlyWorking: false,
    description: 'Built things.',
  }

  it('accepts a complete experience object', () => {
    expect(experienceSchema.safeParse(base).success).toBe(true)
  })

  it('accepts empty endDate', () => {
    expect(
      experienceSchema.safeParse({ ...base, endDate: '' }).success
    ).toBe(true)
  })

  it('accepts currentlyWorking: true with no endDate', () => {
    expect(
      experienceSchema.safeParse({
        ...base,
        currentlyWorking: true,
        endDate: '',
      }).success
    ).toBe(true)
  })

  it('accepts description up to 5000 characters', () => {
    expect(
      experienceSchema.safeParse({ ...base, description: 'x'.repeat(5000) })
        .success
    ).toBe(true)
  })

  it('accepts empty location', () => {
    expect(
      experienceSchema.safeParse({ ...base, location: '' }).success
    ).toBe(true)
  })
})

describe('experienceSchema — invalid data', () => {
  const base = {
    id: 'exp-1',
    jobTitle: 'Software Engineer',
    company: 'Acme Corp',
    location: '',
    startDate: '2021-01',
    endDate: '',
    currentlyWorking: false,
    description: '',
  }

  it('rejects empty jobTitle', () => {
    expect(
      experienceSchema.safeParse({ ...base, jobTitle: '' }).success
    ).toBe(false)
  })

  it('rejects jobTitle exceeding 100 characters', () => {
    expect(
      experienceSchema.safeParse({ ...base, jobTitle: 'E'.repeat(101) }).success
    ).toBe(false)
  })

  it('rejects empty company', () => {
    expect(
      experienceSchema.safeParse({ ...base, company: '' }).success
    ).toBe(false)
  })

  it('rejects empty startDate', () => {
    expect(
      experienceSchema.safeParse({ ...base, startDate: '' }).success
    ).toBe(false)
  })

  it('rejects description exceeding 5000 characters', () => {
    expect(
      experienceSchema.safeParse({ ...base, description: 'x'.repeat(5001) })
        .success
    ).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// educationSchema
// ---------------------------------------------------------------------------

describe('educationSchema — valid data', () => {
  const base = {
    id: 'edu-1',
    school: 'MIT',
    degree: 'BS',
    field: 'Computer Science',
    startDate: '2014-09',
    endDate: '2018-05',
    gpa: '3.9',
  }

  it('accepts a complete education object', () => {
    expect(educationSchema.safeParse(base).success).toBe(true)
  })

  it('accepts empty endDate', () => {
    expect(educationSchema.safeParse({ ...base, endDate: '' }).success).toBe(true)
  })

  it('accepts empty gpa', () => {
    expect(educationSchema.safeParse({ ...base, gpa: '' }).success).toBe(true)
  })

  it('accepts empty field', () => {
    expect(educationSchema.safeParse({ ...base, field: '' }).success).toBe(true)
  })
})

describe('educationSchema — invalid data', () => {
  const base = {
    id: 'edu-1',
    school: 'MIT',
    degree: 'BS',
    field: 'CS',
    startDate: '2014-09',
    endDate: '',
    gpa: '',
  }

  it('rejects empty school', () => {
    expect(educationSchema.safeParse({ ...base, school: '' }).success).toBe(false)
  })

  it('rejects school exceeding 100 characters', () => {
    expect(
      educationSchema.safeParse({ ...base, school: 'S'.repeat(101) }).success
    ).toBe(false)
  })

  it('rejects empty degree', () => {
    expect(educationSchema.safeParse({ ...base, degree: '' }).success).toBe(false)
  })

  it('rejects empty startDate', () => {
    expect(
      educationSchema.safeParse({ ...base, startDate: '' }).success
    ).toBe(false)
  })

  it('rejects gpa exceeding 10 characters', () => {
    expect(
      educationSchema.safeParse({ ...base, gpa: '12345678901' }).success
    ).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// skillSchema
// ---------------------------------------------------------------------------

describe('skillSchema — valid data', () => {
  it('accepts a skill with no level', () => {
    expect(
      skillSchema.safeParse({ id: 'skill-1', name: 'TypeScript' }).success
    ).toBe(true)
  })

  it('accepts "beginner" level', () => {
    expect(
      skillSchema.safeParse({
        id: 's1',
        name: 'Python',
        level: 'beginner',
      }).success
    ).toBe(true)
  })

  it('accepts "intermediate" level', () => {
    expect(
      skillSchema.safeParse({ id: 's1', name: 'Go', level: 'intermediate' })
        .success
    ).toBe(true)
  })

  it('accepts "advanced" level', () => {
    expect(
      skillSchema.safeParse({ id: 's1', name: 'Rust', level: 'advanced' })
        .success
    ).toBe(true)
  })

  it('accepts "expert" level', () => {
    expect(
      skillSchema.safeParse({ id: 's1', name: 'TS', level: 'expert' }).success
    ).toBe(true)
  })

  it('accepts skill name up to 50 characters', () => {
    expect(
      skillSchema.safeParse({ id: 's1', name: 'A'.repeat(50) }).success
    ).toBe(true)
  })
})

describe('skillSchema — invalid data', () => {
  it('rejects empty skill name', () => {
    expect(skillSchema.safeParse({ id: 's1', name: '' }).success).toBe(false)
  })

  it('rejects skill name exceeding 50 characters', () => {
    expect(
      skillSchema.safeParse({ id: 's1', name: 'A'.repeat(51) }).success
    ).toBe(false)
  })

  it('rejects invalid level value', () => {
    expect(
      skillSchema.safeParse({ id: 's1', name: 'TypeScript', level: 'ninja' })
        .success
    ).toBe(false)
  })

  it('rejects numeric level value', () => {
    expect(
      skillSchema.safeParse({ id: 's1', name: 'TypeScript', level: 5 }).success
    ).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// projectSchema
// ---------------------------------------------------------------------------

describe('projectSchema — valid data', () => {
  const base = {
    id: 'proj-1',
    title: 'My Project',
    description: 'A useful project.',
    link: '',
    technologies: ['TypeScript', 'React'],
    startDate: '2022-01',
    endDate: '2022-12',
  }

  it('accepts a complete project', () => {
    expect(projectSchema.safeParse(base).success).toBe(true)
  })

  it('accepts empty link', () => {
    expect(projectSchema.safeParse({ ...base, link: '' }).success).toBe(true)
  })

  it('accepts valid link URL', () => {
    expect(
      projectSchema.safeParse({
        ...base,
        link: 'https://github.com/user/project',
      }).success
    ).toBe(true)
  })

  it('accepts empty technologies array', () => {
    expect(
      projectSchema.safeParse({ ...base, technologies: [] }).success
    ).toBe(true)
  })

  it('accepts description up to 2000 characters', () => {
    expect(
      projectSchema.safeParse({ ...base, description: 'x'.repeat(2000) })
        .success
    ).toBe(true)
  })
})

describe('projectSchema — invalid data', () => {
  const base = {
    id: 'proj-1',
    title: 'My Project',
    description: '',
    link: '',
    technologies: [],
    startDate: '',
    endDate: '',
  }

  it('rejects empty title', () => {
    expect(projectSchema.safeParse({ ...base, title: '' }).success).toBe(false)
  })

  it('rejects title exceeding 100 characters', () => {
    expect(
      projectSchema.safeParse({ ...base, title: 'T'.repeat(101) }).success
    ).toBe(false)
  })

  it('rejects invalid link URL (not empty)', () => {
    expect(
      projectSchema.safeParse({ ...base, link: 'not-a-url' }).success
    ).toBe(false)
  })

  it('rejects description exceeding 2000 characters', () => {
    expect(
      projectSchema.safeParse({ ...base, description: 'x'.repeat(2001) })
        .success
    ).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// certificationSchema
// ---------------------------------------------------------------------------

describe('certificationSchema — valid data', () => {
  const base = {
    id: 'cert-1',
    name: 'AWS Solutions Architect',
    issuer: 'Amazon Web Services',
    issueDate: '2022-06',
    expirationDate: '2025-06',
    credentialUrl: '',
  }

  it('accepts a complete certification', () => {
    expect(certificationSchema.safeParse(base).success).toBe(true)
  })

  it('accepts empty expirationDate', () => {
    expect(
      certificationSchema.safeParse({ ...base, expirationDate: '' }).success
    ).toBe(true)
  })

  it('accepts empty credentialUrl', () => {
    expect(
      certificationSchema.safeParse({ ...base, credentialUrl: '' }).success
    ).toBe(true)
  })

  it('accepts valid credentialUrl', () => {
    expect(
      certificationSchema.safeParse({
        ...base,
        credentialUrl: 'https://aws.amazon.com/certification',
      }).success
    ).toBe(true)
  })
})

describe('certificationSchema — invalid data', () => {
  const base = {
    id: 'cert-1',
    name: 'AWS Solutions Architect',
    issuer: 'Amazon',
    issueDate: '2022-06',
    expirationDate: '',
    credentialUrl: '',
  }

  it('rejects empty name', () => {
    expect(
      certificationSchema.safeParse({ ...base, name: '' }).success
    ).toBe(false)
  })

  it('rejects name exceeding 100 characters', () => {
    expect(
      certificationSchema.safeParse({ ...base, name: 'N'.repeat(101) }).success
    ).toBe(false)
  })

  it('rejects empty issuer', () => {
    expect(
      certificationSchema.safeParse({ ...base, issuer: '' }).success
    ).toBe(false)
  })

  it('rejects empty issueDate', () => {
    expect(
      certificationSchema.safeParse({ ...base, issueDate: '' }).success
    ).toBe(false)
  })

  it('rejects invalid credentialUrl', () => {
    expect(
      certificationSchema.safeParse({ ...base, credentialUrl: 'not-a-url' })
        .success
    ).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// resumeTemplateSchema
// ---------------------------------------------------------------------------

describe('resumeTemplateSchema', () => {
  it('accepts "modern"', () => {
    expect(resumeTemplateSchema.safeParse('modern').success).toBe(true)
  })

  it('accepts "classic"', () => {
    expect(resumeTemplateSchema.safeParse('classic').success).toBe(true)
  })

  it('accepts "minimal"', () => {
    expect(resumeTemplateSchema.safeParse('minimal').success).toBe(true)
  })

  it('accepts "creative"', () => {
    expect(resumeTemplateSchema.safeParse('creative').success).toBe(true)
  })

  it('accepts "professional"', () => {
    expect(resumeTemplateSchema.safeParse('professional').success).toBe(true)
  })

  it('rejects unknown template name', () => {
    expect(resumeTemplateSchema.safeParse('fancy').success).toBe(false)
  })

  it('rejects empty string', () => {
    expect(resumeTemplateSchema.safeParse('').success).toBe(false)
  })

  it('rejects numeric value', () => {
    expect(resumeTemplateSchema.safeParse(1).success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// resumeSchema — root schema
// ---------------------------------------------------------------------------

describe('resumeSchema — valid complete resume', () => {
  const now = new Date().toISOString()

  const validResume = {
    id: 'resume-abc',
    template: 'modern',
    personalInfo: {
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      github: '',
      summary: '',
    },
    experiences: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    accentColor: '#2563eb',
    createdAt: now,
    updatedAt: now,
  }

  it('accepts a minimal valid resume', () => {
    expect(resumeSchema.safeParse(validResume).success).toBe(true)
  })

  it('accepts a resume with all sections populated', () => {
    const full = {
      ...validResume,
      experiences: [
        {
          id: 'exp-1',
          jobTitle: 'Engineer',
          company: 'Acme',
          location: 'NYC',
          startDate: '2020-01',
          endDate: '',
          currentlyWorking: true,
          description: 'Built stuff.',
        },
      ],
      education: [
        {
          id: 'edu-1',
          school: 'MIT',
          degree: 'BS',
          field: 'CS',
          startDate: '2014-09',
          endDate: '2018-05',
          gpa: '4.0',
        },
      ],
      skills: [{ id: 'skill-1', name: 'TypeScript', level: 'expert' }],
      projects: [
        {
          id: 'proj-1',
          title: 'App',
          description: '',
          link: '',
          technologies: ['React'],
          startDate: '',
          endDate: '',
        },
      ],
      certifications: [
        {
          id: 'cert-1',
          name: 'AWS',
          issuer: 'Amazon',
          issueDate: '2022-01',
          expirationDate: '',
          credentialUrl: '',
        },
      ],
    }
    expect(resumeSchema.safeParse(full).success).toBe(true)
  })

  it('accepts all valid accentColor hex codes', () => {
    for (const color of ['#000000', '#ffffff', '#2563eb', '#dc2626', '#AABBCC']) {
      const result = resumeSchema.safeParse({ ...validResume, accentColor: color })
      expect(result.success).toBe(true)
    }
  })
})

describe('resumeSchema — invalid data', () => {
  const now = new Date().toISOString()

  const validResume = {
    id: 'resume-abc',
    template: 'modern',
    personalInfo: {
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      github: '',
      summary: '',
    },
    experiences: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    accentColor: '#2563eb',
    createdAt: now,
    updatedAt: now,
  }

  it('rejects invalid accentColor (not a hex)', () => {
    expect(
      resumeSchema.safeParse({ ...validResume, accentColor: 'blue' }).success
    ).toBe(false)
  })

  it('rejects 3-digit hex color', () => {
    expect(
      resumeSchema.safeParse({ ...validResume, accentColor: '#abc' }).success
    ).toBe(false)
  })

  it('rejects invalid template', () => {
    expect(
      resumeSchema.safeParse({ ...validResume, template: 'retro' }).success
    ).toBe(false)
  })

  it('rejects missing id', () => {
    const { id: _, ...noId } = validResume
    expect(resumeSchema.safeParse(noId).success).toBe(false)
  })

  it('rejects missing createdAt', () => {
    const { createdAt: _, ...noDate } = validResume
    expect(resumeSchema.safeParse(noDate).success).toBe(false)
  })

  it('rejects invalid personalInfo (bad email)', () => {
    expect(
      resumeSchema.safeParse({
        ...validResume,
        personalInfo: { ...validResume.personalInfo, email: 'not-an-email' },
      }).success
    ).toBe(false)
  })
})
