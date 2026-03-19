import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'
import { TemplateRenderer } from '@/components/templates/template-renderer'
import type { Resume } from '@/types/resume'

const baseResume: Resume = {
  id: 'test-resume-1',
  template: 'modern',
  personalInfo: {
    fullName: 'Jane Doe',
    email: 'jane@example.com',
    phone: '555-0100',
    location: 'New York, NY',
    website: 'https://janedoe.dev',
    linkedin: 'https://linkedin.com/in/janedoe',
    github: 'https://github.com/janedoe',
    summary: 'Experienced software engineer with a passion for clean code.',
  },
  experiences: [
    {
      id: 'exp-1',
      jobTitle: 'Senior Engineer',
      company: 'Acme Corp',
      location: 'New York, NY',
      startDate: '2021-01',
      endDate: '2023-06',
      currentlyWorking: false,
      description: 'Led platform migrations and mentored junior engineers.',
    },
    {
      id: 'exp-2',
      jobTitle: 'Staff Engineer',
      company: 'Tech Inc',
      location: 'Remote',
      startDate: '2023-07',
      currentlyWorking: true,
      description: 'Architecting distributed systems at scale.',
    },
  ],
  education: [
    {
      id: 'edu-1',
      school: 'MIT',
      degree: 'BS',
      field: 'Computer Science',
      startDate: '2014-09',
      endDate: '2018-05',
      gpa: '3.9',
    },
  ],
  skills: [
    { id: 'skill-1', name: 'TypeScript', level: 'expert' },
    { id: 'skill-2', name: 'React', level: 'advanced' },
    { id: 'skill-3', name: 'Go' },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Open Source Toolkit',
      description: 'A developer productivity toolkit.',
      link: 'https://github.com/janedoe/toolkit',
      technologies: ['TypeScript', 'Node.js'],
      startDate: '2022-03',
      endDate: '2022-12',
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Solutions Architect',
      issuer: 'Amazon',
      issueDate: '2022-06',
      expirationDate: '2025-06',
    },
  ],
  accentColor: '#2563eb',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

function makeResume(template: Resume['template']): Resume {
  return { ...baseResume, template }
}

describe('TemplateRenderer — renders each template without crashing', () => {
  const templates: Resume['template'][] = [
    'modern',
    'classic',
    'minimal',
    'creative',
    'professional',
  ]

  templates.forEach((template) => {
    it(`renders ${template} template`, () => {
      const resume = makeResume(template)
      const { container } = render(React.createElement(TemplateRenderer, { resume }))
      expect(container.firstChild).not.toBeNull()
    })
  })
})

describe('TemplateRenderer — full name appears in rendered output', () => {
  const templates: Resume['template'][] = [
    'modern',
    'classic',
    'minimal',
    'creative',
    'professional',
  ]

  templates.forEach((template) => {
    it(`shows full name in ${template} template`, () => {
      const resume = makeResume(template)
      const { getByText } = render(React.createElement(TemplateRenderer, { resume }))
      expect(getByText('Jane Doe')).toBeTruthy()
    })
  })
})

describe('TemplateRenderer — root element has required id and class', () => {
  const templates: Resume['template'][] = [
    'modern',
    'classic',
    'minimal',
    'creative',
    'professional',
  ]

  templates.forEach((template) => {
    it(`${template} root has id="resume-preview" and class="resume-preview"`, () => {
      const resume = makeResume(template)
      const { container } = render(React.createElement(TemplateRenderer, { resume }))
      const root = container.querySelector('#resume-preview')
      expect(root).not.toBeNull()
      expect(root?.classList.contains('resume-preview')).toBe(true)
    })
  })
})

describe('TemplateRenderer — experience section content', () => {
  it('renders job title in modern template', () => {
    const resume = makeResume('modern')
    const { getAllByText } = render(React.createElement(TemplateRenderer, { resume }))
    expect(getAllByText(/Senior Engineer/).length).toBeGreaterThan(0)
  })

  it('shows "Present" for currently-working jobs', () => {
    const resume = makeResume('modern')
    const { getAllByText } = render(React.createElement(TemplateRenderer, { resume }))
    expect(getAllByText(/Present/).length).toBeGreaterThan(0)
  })

  it('renders company name', () => {
    const resume = makeResume('classic')
    const { getByText } = render(React.createElement(TemplateRenderer, { resume }))
    expect(getByText(/Acme Corp/)).toBeTruthy()
  })
})

describe('TemplateRenderer — skills section content', () => {
  it('renders skill names in modern template', () => {
    const resume = makeResume('modern')
    const { getByText } = render(React.createElement(TemplateRenderer, { resume }))
    expect(getByText('TypeScript')).toBeTruthy()
  })

  it('renders skill names in professional template', () => {
    const resume = makeResume('professional')
    const { getByText } = render(React.createElement(TemplateRenderer, { resume }))
    expect(getByText('React')).toBeTruthy()
  })
})

describe('TemplateRenderer — education section content', () => {
  it('renders school name', () => {
    const resume = makeResume('creative')
    const { getByText } = render(React.createElement(TemplateRenderer, { resume }))
    expect(getByText('MIT')).toBeTruthy()
  })
})

describe('TemplateRenderer — projects section content', () => {
  it('renders project title', () => {
    const resume = makeResume('minimal')
    const { getByText } = render(React.createElement(TemplateRenderer, { resume }))
    expect(getByText('Open Source Toolkit')).toBeTruthy()
  })
})

describe('TemplateRenderer — certifications section content', () => {
  it('renders certification name', () => {
    const resume = makeResume('professional')
    const { getByText } = render(React.createElement(TemplateRenderer, { resume }))
    expect(getByText('AWS Solutions Architect')).toBeTruthy()
  })
})

describe('TemplateRenderer — empty resume renders without error', () => {
  const emptyResume: Resume = {
    id: 'empty',
    template: 'modern',
    personalInfo: {
      fullName: 'Empty User',
      email: '',
      phone: '',
      location: '',
    },
    experiences: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    accentColor: '#2563eb',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const templates: Resume['template'][] = [
    'modern',
    'classic',
    'minimal',
    'creative',
    'professional',
  ]

  templates.forEach((template) => {
    it(`${template} handles empty sections gracefully`, () => {
      const resume = { ...emptyResume, template }
      const { getByText } = render(React.createElement(TemplateRenderer, { resume }))
      expect(getByText('Empty User')).toBeTruthy()
    })
  })
})
