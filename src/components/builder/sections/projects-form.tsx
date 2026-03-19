'use client'

import * as React from 'react'
import { Plus } from 'lucide-react'
import { useResumeStore } from '@/store/resume-store'
import { FIELD_LIMITS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { SectionEntry } from '@/components/builder/section-entry'
import type { Project } from '@/types/resume'

interface ProjectFieldErrors {
  title?: string
  link?: string
}

interface ProjectEntryProps {
  project: Project
  onUpdate: (id: string, data: Partial<Project>) => void
  onDelete: (id: string) => void
}

function isValidUrl(value: string): boolean {
  if (!value) return true
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

function ProjectEntryFields({ project, onUpdate, onDelete }: ProjectEntryProps) {
  const [errors, setErrors] = React.useState<ProjectFieldErrors>({})

  const handleBlur = (field: keyof ProjectFieldErrors, value: string) => {
    const newErrors = { ...errors }
    if (field === 'title' && !value.trim()) {
      newErrors.title = 'Project title is required'
    } else if (field === 'link' && value && !isValidUrl(value)) {
      newErrors.link = 'Invalid URL'
    } else {
      delete newErrors[field]
    }
    setErrors(newErrors)
  }

  const technologiesString = project.technologies?.join(', ') ?? ''

  const handleTechnologiesChange = (value: string) => {
    const techs = value
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    onUpdate(project.id, { technologies: techs })
  }

  return (
    <SectionEntry
      title={project.title || 'New Project'}
      onDelete={() => onDelete(project.id)}
    >
      <div className="space-y-4">
        {/* Title */}
        <div className="space-y-1.5">
          <Label htmlFor={`proj-title-${project.id}`} className="text-sm font-medium">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`proj-title-${project.id}`}
            value={project.title}
            maxLength={FIELD_LIMITS.projectTitle}
            onChange={(e) => onUpdate(project.id, { title: e.target.value })}
            onBlur={(e) => handleBlur('title', e.target.value)}
            placeholder="My Awesome Project"
            aria-required="true"
            aria-invalid={!!errors.title}
            className={errors.title ? 'border-destructive' : ''}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label htmlFor={`proj-desc-${project.id}`} className="text-sm font-medium">
            Description
          </Label>
          <Textarea
            id={`proj-desc-${project.id}`}
            value={project.description}
            maxLength={FIELD_LIMITS.projectDescription}
            onChange={(e) => onUpdate(project.id, { description: e.target.value })}
            placeholder="Describe what this project does..."
            rows={3}
          />
          <p className="text-xs text-muted-foreground text-right">
            {project.description.length} / {FIELD_LIMITS.projectDescription}
          </p>
        </div>

        {/* Link */}
        <div className="space-y-1.5">
          <Label htmlFor={`proj-link-${project.id}`} className="text-sm font-medium">
            Link
          </Label>
          <Input
            id={`proj-link-${project.id}`}
            type="url"
            value={project.link ?? ''}
            maxLength={FIELD_LIMITS.url}
            onChange={(e) => onUpdate(project.id, { link: e.target.value })}
            onBlur={(e) => handleBlur('link', e.target.value)}
            placeholder="https://github.com/you/project"
            aria-invalid={!!errors.link}
            className={errors.link ? 'border-destructive' : ''}
          />
          {errors.link && (
            <p className="text-sm text-destructive">{errors.link}</p>
          )}
        </div>

        {/* Technologies */}
        <div className="space-y-1.5">
          <Label htmlFor={`proj-tech-${project.id}`} className="text-sm font-medium">
            Technologies
          </Label>
          <Input
            id={`proj-tech-${project.id}`}
            value={technologiesString}
            onChange={(e) => handleTechnologiesChange(e.target.value)}
            placeholder="React, TypeScript, Node.js"
          />
          <p className="text-xs text-muted-foreground">
            Separate technologies with commas
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Start Date */}
          <div className="space-y-1.5">
            <Label htmlFor={`proj-start-${project.id}`} className="text-sm font-medium">
              Start Date
            </Label>
            <Input
              id={`proj-start-${project.id}`}
              type="month"
              value={project.startDate ?? ''}
              onChange={(e) => onUpdate(project.id, { startDate: e.target.value })}
            />
          </div>

          {/* End Date */}
          <div className="space-y-1.5">
            <Label htmlFor={`proj-end-${project.id}`} className="text-sm font-medium">
              End Date
            </Label>
            <Input
              id={`proj-end-${project.id}`}
              type="month"
              value={project.endDate ?? ''}
              onChange={(e) => onUpdate(project.id, { endDate: e.target.value })}
            />
          </div>
        </div>
      </div>
    </SectionEntry>
  )
}

export function ProjectsForm() {
  const resume = useResumeStore((state) => state.resume)
  const addProject = useResumeStore((state) => state.addProject)
  const updateProject = useResumeStore((state) => state.updateProject)
  const removeProject = useResumeStore((state) => state.removeProject)

  const projects = resume?.projects ?? []

  return (
    <div className="space-y-3">
      {projects.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-6">
          No projects yet. Click &quot;Add Project&quot; to get started.
        </p>
      )}

      {projects.map((project) => (
        <ProjectEntryFields
          key={project.id}
          project={project}
          onUpdate={updateProject}
          onDelete={removeProject}
        />
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addProject}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Project
      </Button>
    </div>
  )
}
