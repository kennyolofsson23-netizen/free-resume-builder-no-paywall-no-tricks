'use client'

import * as React from 'react'
import type { Resume } from '@/types/resume'
import { ModernTemplate } from './modern-template'
import { ClassicTemplate } from './classic-template'
import { MinimalTemplate } from './minimal-template'
import { CreativeTemplate } from './creative-template'
import { ProfessionalTemplate } from './professional-template'

interface Props {
  resume: Resume
  scale?: number
}

export function TemplateRenderer({ resume, scale }: Props) {
  let content: React.ReactNode

  switch (resume.template) {
    case 'classic':
      content = <ClassicTemplate resume={resume} />
      break
    case 'minimal':
      content = <MinimalTemplate resume={resume} />
      break
    case 'creative':
      content = <CreativeTemplate resume={resume} />
      break
    case 'professional':
      content = <ProfessionalTemplate resume={resume} />
      break
    case 'modern':
    default:
      content = <ModernTemplate resume={resume} />
      break
  }

  return (
    <div
      id="resume-preview-container"
      style={
        scale !== undefined
          ? { transform: `scale(${scale})`, transformOrigin: 'top left' }
          : undefined
      }
    >
      <div id="resume-preview" className="resume-preview bg-white">
        {content}
      </div>
    </div>
  )
}
