'use client'

import * as React from 'react'
import { Plus } from 'lucide-react'
import { useResumeStore } from '@/store/resume-store'
import { FIELD_LIMITS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SectionEntry } from '@/components/builder/section-entry'
import type { Education } from '@/types/resume'

interface EducationFieldErrors {
  school?: string
  degree?: string
  startDate?: string
}

interface EducationEntryProps {
  edu: Education
  onUpdate: (id: string, data: Partial<Education>) => void
  onDelete: (id: string) => void
  onMoveUp: () => void
  onMoveDown: () => void
  isFirst: boolean
  isLast: boolean
}

function EducationEntryFields({
  edu,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: EducationEntryProps) {
  const [errors, setErrors] = React.useState<EducationFieldErrors>({})

  const handleBlur = (field: keyof EducationFieldErrors, value: string) => {
    const newErrors = { ...errors }
    if (!value.trim()) {
      if (field === 'school') newErrors.school = 'School is required'
      else if (field === 'degree') newErrors.degree = 'Degree is required'
      else if (field === 'startDate')
        newErrors.startDate = 'Start date is required'
    } else {
      delete newErrors[field]
    }
    setErrors(newErrors)
  }

  const title = edu.school || 'New Education'
  const subtitle = edu.degree
    ? edu.field
      ? `${edu.degree} in ${edu.field}`
      : edu.degree
    : undefined

  return (
    <SectionEntry
      title={title}
      subtitle={subtitle}
      onDelete={() => onDelete(edu.id)}
      dragHandleProps={{
        onKeyDown: (e) => {
          if (e.key === 'ArrowUp') {
            e.preventDefault()
            onMoveUp()
          }
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            onMoveDown()
          }
        },
      }}
    >
      <div className="space-y-4">
        {/* Reorder buttons */}
        <div className="flex gap-1 justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onMoveUp}
            disabled={isFirst}
            aria-label="Move up"
          >
            ↑
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onMoveDown}
            disabled={isLast}
            aria-label="Move down"
          >
            ↓
          </Button>
        </div>

        {/* School */}
        <div className="space-y-1.5">
          <Label htmlFor={`school-${edu.id}`} className="text-sm font-medium">
            School <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`school-${edu.id}`}
            value={edu.school}
            maxLength={FIELD_LIMITS.school}
            onChange={(e) => onUpdate(edu.id, { school: e.target.value })}
            onBlur={(e) => handleBlur('school', e.target.value)}
            placeholder="University of California"
            aria-required="true"
            aria-invalid={!!errors.school}
            className={errors.school ? 'border-destructive' : ''}
          />
          {errors.school && (
            <p className="text-sm text-destructive">{errors.school}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Degree */}
          <div className="space-y-1.5">
            <Label htmlFor={`degree-${edu.id}`} className="text-sm font-medium">
              Degree <span className="text-destructive">*</span>
            </Label>
            <Input
              id={`degree-${edu.id}`}
              value={edu.degree}
              maxLength={FIELD_LIMITS.degree}
              onChange={(e) => onUpdate(edu.id, { degree: e.target.value })}
              onBlur={(e) => handleBlur('degree', e.target.value)}
              placeholder="Bachelor of Science"
              aria-required="true"
              aria-invalid={!!errors.degree}
              className={errors.degree ? 'border-destructive' : ''}
            />
            {errors.degree && (
              <p className="text-sm text-destructive">{errors.degree}</p>
            )}
          </div>

          {/* Field of Study */}
          <div className="space-y-1.5">
            <Label htmlFor={`field-${edu.id}`} className="text-sm font-medium">
              Field of Study
            </Label>
            <Input
              id={`field-${edu.id}`}
              value={edu.field}
              maxLength={FIELD_LIMITS.field}
              onChange={(e) => onUpdate(edu.id, { field: e.target.value })}
              placeholder="Computer Science"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Start Date */}
          <div className="space-y-1.5">
            <Label
              htmlFor={`edu-startDate-${edu.id}`}
              className="text-sm font-medium"
            >
              Start Date
            </Label>
            <Input
              id={`edu-startDate-${edu.id}`}
              type="month"
              value={edu.startDate}
              onChange={(e) => onUpdate(edu.id, { startDate: e.target.value })}
              onBlur={(e) => handleBlur('startDate', e.target.value)}
              aria-invalid={!!errors.startDate}
              className={errors.startDate ? 'border-destructive' : ''}
            />
            {errors.startDate && (
              <p className="text-sm text-destructive">{errors.startDate}</p>
            )}
          </div>

          {/* End Date */}
          <div className="space-y-1.5">
            <Label
              htmlFor={`edu-endDate-${edu.id}`}
              className="text-sm font-medium"
            >
              End Date
            </Label>
            <Input
              id={`edu-endDate-${edu.id}`}
              type="month"
              value={edu.endDate ?? ''}
              onChange={(e) => onUpdate(edu.id, { endDate: e.target.value })}
            />
          </div>
        </div>

        {/* GPA */}
        <div className="space-y-1.5">
          <Label htmlFor={`gpa-${edu.id}`} className="text-sm font-medium">
            GPA{' '}
            <span className="text-xs text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id={`gpa-${edu.id}`}
            value={edu.gpa ?? ''}
            maxLength={FIELD_LIMITS.gpa}
            onChange={(e) => onUpdate(edu.id, { gpa: e.target.value })}
            placeholder="3.8"
            className="max-w-24"
          />
        </div>
      </div>
    </SectionEntry>
  )
}

export function EducationForm() {
  const resume = useResumeStore((state) => state.resume)
  const addEducation = useResumeStore((state) => state.addEducation)
  const updateEducation = useResumeStore((state) => state.updateEducation)
  const removeEducation = useResumeStore((state) => state.removeEducation)
  const reorderEducation = useResumeStore((state) => state.reorderEducation)

  const education = resume?.education ?? []

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const ids = education.map((e) => e.id)
    const newIds = [...ids]
    ;[newIds[index - 1], newIds[index]] = [newIds[index], newIds[index - 1]]
    reorderEducation(newIds)
  }

  const handleMoveDown = (index: number) => {
    if (index === education.length - 1) return
    const ids = education.map((e) => e.id)
    const newIds = [...ids]
    ;[newIds[index], newIds[index + 1]] = [newIds[index + 1], newIds[index]]
    reorderEducation(newIds)
  }

  return (
    <div className="space-y-3">
      {education.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-6">
          No education entries yet. Click &quot;Add Education&quot; to get
          started.
        </p>
      )}

      {education.map((edu, index) => (
        <EducationEntryFields
          key={edu.id}
          edu={edu}
          onUpdate={updateEducation}
          onDelete={removeEducation}
          onMoveUp={() => handleMoveUp(index)}
          onMoveDown={() => handleMoveDown(index)}
          isFirst={index === 0}
          isLast={index === education.length - 1}
        />
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addEducation}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Education
      </Button>
    </div>
  )
}
