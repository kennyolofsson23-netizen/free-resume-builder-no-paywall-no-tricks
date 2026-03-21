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

export function FormPanel() {
  const resume = useResumeStore((state) => state.resume)
  const resumeName = resume?.personalInfo?.fullName?.trim() || 'My Resume'
  const [showResumes, setShowResumes] = React.useState(false)

  // Compute counts for tab badges
  const expCount = resume?.experiences?.length ?? 0
  const eduCount = resume?.education?.length ?? 0
  const skillCount = resume?.skills?.length ?? 0
  const projCount = resume?.projects?.length ?? 0
  const certCount = resume?.certifications?.length ?? 0

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

      {/* Tabbed sections */}
      <Tabs defaultValue="personal" className="flex flex-1 flex-col overflow-hidden">
        {/* Scrollable tab bar */}
        <div className="shrink-0 border-b border-border bg-background overflow-x-auto">
          <TabsList className="inline-flex h-10 rounded-none bg-transparent p-0 w-max">
            <TabsTrigger
              value="personal"
              className="rounded-none border-b-2 border-transparent px-4 py-2 text-xs font-medium data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none whitespace-nowrap"
            >
              Personal
            </TabsTrigger>
            <TabsTrigger
              value="experience"
              className="rounded-none border-b-2 border-transparent px-4 py-2 text-xs font-medium data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none whitespace-nowrap"
            >
              Experience{expCount > 0 && ` (${expCount})`}
            </TabsTrigger>
            <TabsTrigger
              value="education"
              className="rounded-none border-b-2 border-transparent px-4 py-2 text-xs font-medium data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none whitespace-nowrap"
            >
              Education{eduCount > 0 && ` (${eduCount})`}
            </TabsTrigger>
            <TabsTrigger
              value="skills"
              className="rounded-none border-b-2 border-transparent px-4 py-2 text-xs font-medium data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none whitespace-nowrap"
            >
              Skills{skillCount > 0 && ` (${skillCount})`}
            </TabsTrigger>
            <TabsTrigger
              value="projects"
              className="rounded-none border-b-2 border-transparent px-4 py-2 text-xs font-medium data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none whitespace-nowrap"
            >
              Projects{projCount > 0 && ` (${projCount})`}
            </TabsTrigger>
            <TabsTrigger
              value="certifications"
              className="rounded-none border-b-2 border-transparent px-4 py-2 text-xs font-medium data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none whitespace-nowrap"
            >
              Certs{certCount > 0 && ` (${certCount})`}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="personal" className="flex-1 overflow-y-auto mt-0 px-4 py-4">
          <PersonalInfoForm />
        </TabsContent>
        <TabsContent value="experience" className="flex-1 overflow-y-auto mt-0 px-4 py-4">
          <ExperienceForm />
        </TabsContent>
        <TabsContent value="education" className="flex-1 overflow-y-auto mt-0 px-4 py-4">
          <EducationForm />
        </TabsContent>
        <TabsContent value="skills" className="flex-1 overflow-y-auto mt-0 px-4 py-4">
          <SkillsForm />
        </TabsContent>
        <TabsContent value="projects" className="flex-1 overflow-y-auto mt-0 px-4 py-4">
          <ProjectsForm />
        </TabsContent>
        <TabsContent value="certifications" className="flex-1 overflow-y-auto mt-0 px-4 py-4">
          <CertificationsForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
