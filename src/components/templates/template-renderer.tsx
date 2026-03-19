'use client'

import type { Resume } from '@/types/resume'
import { ModernTemplate } from './modern-template'
import { ClassicTemplate } from './classic-template'
import { MinimalTemplate } from './minimal-template'
import { CreativeTemplate } from './creative-template'
import { ProfessionalTemplate } from './professional-template'

interface TemplateRendererProps {
  resume: Resume
}

export function TemplateRenderer({ resume }: TemplateRendererProps) {
  switch (resume.template) {
    case 'classic':
      return <ClassicTemplate resume={resume} />
    case 'minimal':
      return <MinimalTemplate resume={resume} />
    case 'creative':
      return <CreativeTemplate resume={resume} />
    case 'professional':
      return <ProfessionalTemplate resume={resume} />
    case 'modern':
    default:
      return <ModernTemplate resume={resume} />
  }
}
