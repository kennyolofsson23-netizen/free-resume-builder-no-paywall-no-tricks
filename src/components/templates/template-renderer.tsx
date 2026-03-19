'use client'

import type { Resume } from '@/types/resume'
import { ModernTemplate } from './modern-template'
import { ClassicTemplate } from './classic-template'
import { MinimalTemplate } from './minimal-template'
import { CreativeTemplate } from './creative-template'
import { ProfessionalTemplate } from './professional-template'

interface Props {
  resume: Resume
  className?: string
}

export function TemplateRenderer({ resume, className }: Props) {
  const templateProps = { resume, accentColor: resume.accentColor }

  let content: React.ReactNode

  switch (resume.template) {
    case 'classic':
      content = <ClassicTemplate {...templateProps} />
      break
    case 'minimal':
      content = <MinimalTemplate {...templateProps} />
      break
    case 'creative':
      content = <CreativeTemplate {...templateProps} />
      break
    case 'professional':
      content = <ProfessionalTemplate {...templateProps} />
      break
    case 'modern':
    default:
      content = <ModernTemplate {...templateProps} />
      break
  }

  return (
    <div id="resume-preview" className={`resume-preview bg-white${className ? ' ' + className : ''}`}>
      {content}
    </div>
  )
}
