'use client'

import * as React from 'react'
import { useResumeStore } from '@/store/resume-store'
import { PersonalInfoForm } from '@/components/builder/sections/personal-info-form'
import { ExperienceForm } from '@/components/builder/sections/experience-form'
import { EducationForm } from '@/components/builder/sections/education-form'
import { SkillsForm } from '@/components/builder/sections/skills-form'
import { ProjectsForm } from '@/components/builder/sections/projects-form'
import { CertificationsForm } from '@/components/builder/sections/certifications-form'
import { ResumeListPanel } from '@/components/builder/resume-list-panel'

export function FormPanel() {
  const resume = useResumeStore((state) => state.resume)
  const resumeName = resume?.personalInfo?.fullName?.trim() || 'My Resume'
  const [showResumes, setShowResumes] = React.useState(false)

  if (showResumes) {
    return (
      <div className="flex h-full flex-col overflow-hidden">
        <div className="shrink-0 border-b border-border bg-background px-4 py-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">My Resumes</h2>
          <button
            type="button"
            onClick={() => setShowResumes(false)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            ← Editor
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ResumeListPanel />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 border-b border-border bg-background px-4 py-3 flex items-center justify-between">
        <h2
          className="truncate text-sm font-semibold text-foreground"
          title={resumeName}
        >
          {resumeName}
        </h2>
        <button
          type="button"
          onClick={() => setShowResumes(true)}
          className="text-xs text-muted-foreground hover:text-foreground whitespace-nowrap ml-2"
        >
          My Resumes
        </button>
      </div>

      {/* Scrollable Content — all sections always visible */}
      <div className="flex-1 overflow-y-auto">
        <section className="border-b border-border">
          <h3 className="px-4 pt-4 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Personal Info
          </h3>
          <div className="px-4 pb-4">
            <PersonalInfoForm />
          </div>
        </section>

        <section className="border-b border-border">
          <h3 className="px-4 pt-4 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Experience
          </h3>
          <div className="px-4 pb-4">
            <ExperienceForm />
          </div>
        </section>

        <section className="border-b border-border">
          <h3 className="px-4 pt-4 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Education
          </h3>
          <div className="px-4 pb-4">
            <EducationForm />
          </div>
        </section>

        <section className="border-b border-border">
          <h3 className="px-4 pt-4 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Skills
          </h3>
          <div className="px-4 pb-4">
            <SkillsForm />
          </div>
        </section>

        <section className="border-b border-border">
          <h3 className="px-4 pt-4 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Projects
          </h3>
          <div className="px-4 pb-4">
            <ProjectsForm />
          </div>
        </section>

        <section>
          <h3 className="px-4 pt-4 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Certifications
          </h3>
          <div className="px-4 pb-4">
            <CertificationsForm />
          </div>
        </section>
      </div>
    </div>
  )
}
