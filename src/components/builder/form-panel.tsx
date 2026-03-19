'use client'

import * as React from 'react'
import { useResumeStore } from '@/store/resume-store'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { PersonalInfoForm } from '@/components/builder/sections/personal-info-form'
import { ExperienceForm } from '@/components/builder/sections/experience-form'
import { EducationForm } from '@/components/builder/sections/education-form'
import { SkillsForm } from '@/components/builder/sections/skills-form'
import { ProjectsForm } from '@/components/builder/sections/projects-form'
import { CertificationsForm } from '@/components/builder/sections/certifications-form'
import { ResumeListPanel } from '@/components/builder/resume-list-panel'

const TABS = [
  { value: 'personal', label: 'Personal' },
  { value: 'experience', label: 'Experience' },
  { value: 'education', label: 'Education' },
  { value: 'skills', label: 'Skills' },
  { value: 'projects', label: 'Projects' },
  { value: 'certifications', label: 'Certifications' },
  { value: 'resumes', label: 'Resumes' },
] as const

export function FormPanel() {
  const resume = useResumeStore((state) => state.resume)
  const resumeName = resume?.personalInfo?.fullName?.trim() || 'Untitled Resume'

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 border-b border-border bg-background px-4 py-3">
        <h2
          className="truncate text-sm font-semibold text-foreground"
          title={resumeName}
        >
          {resumeName}
        </h2>
      </div>

      {/* Tabs Navigation */}
      <Tabs
        defaultValue="personal"
        className="flex flex-1 flex-col overflow-hidden"
      >
        <div className="shrink-0 border-b border-border bg-background px-2 pt-2">
          <TabsList className="flex h-auto w-full flex-wrap gap-1 rounded-none bg-transparent p-0">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-md px-3 py-1.5 text-xs font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <TabsContent value="personal" className="m-0 p-4">
            <PersonalInfoForm />
          </TabsContent>
          <TabsContent value="experience" className="m-0 p-4">
            <ExperienceForm />
          </TabsContent>
          <TabsContent value="education" className="m-0 p-4">
            <EducationForm />
          </TabsContent>
          <TabsContent value="skills" className="m-0 p-4">
            <SkillsForm />
          </TabsContent>
          <TabsContent value="projects" className="m-0 p-4">
            <ProjectsForm />
          </TabsContent>
          <TabsContent value="certifications" className="m-0 p-4">
            <CertificationsForm />
          </TabsContent>
          <TabsContent value="resumes" className="m-0">
            <ResumeListPanel />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
