'use client'

import * as React from 'react'
import { Plus } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useResumeStore } from '@/store/resume-store'
import { FIELD_LIMITS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { SectionEntry } from '@/components/builder/section-entry'
import type { Experience } from '@/types/resume'

interface ExperienceFieldErrors {
  jobTitle?: string
  company?: string
  startDate?: string
}

interface ExperienceEntryProps {
  exp: Experience
  onUpdate: (id: string, data: Partial<Experience>) => void
  onDelete: (id: string) => void
  onMoveUp: () => void
  onMoveDown: () => void
  isFirst: boolean
  isLast: boolean
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>
  isDragging?: boolean
}

function ExperienceEntryFields({
  exp,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  dragHandleProps,
  isDragging,
}: ExperienceEntryProps) {
  const [errors, setErrors] = React.useState<ExperienceFieldErrors>({})

  const handleBlur = (field: keyof ExperienceFieldErrors, value: string) => {
    const newErrors = { ...errors }
    if (!value.trim()) {
      if (field === 'jobTitle')
        newErrors.jobTitle =
          "Add a job title — even 'Marketing Intern' or 'Freelancer' works"
      else if (field === 'company')
        newErrors.company =
          "Add the company name — use 'Freelance' or 'Self-Employed' if you worked for yourself"
      else if (field === 'startDate')
        newErrors.startDate = 'Pick a start date for this role'
    } else {
      delete newErrors[field]
    }
    setErrors(newErrors)
  }

  const title = exp.jobTitle || 'New Experience'
  const subtitle = exp.company || ''

  return (
    <SectionEntry
      title={title}
      subtitle={subtitle}
      onDelete={() => onDelete(exp.id)}
      isDragging={isDragging ?? false}
      dragHandleProps={{
        ...dragHandleProps,
        onKeyDown: (e) => {
          dragHandleProps?.onKeyDown?.(e)
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

        <div className="grid grid-cols-2 gap-3">
          {/* Job Title */}
          <div className="space-y-1.5">
            <Label
              htmlFor={`jobTitle-${exp.id}`}
              className="text-sm font-medium"
            >
              Job Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id={`jobTitle-${exp.id}`}
              value={exp.jobTitle}
              maxLength={FIELD_LIMITS.jobTitle}
              onChange={(e) => onUpdate(exp.id, { jobTitle: e.target.value })}
              onBlur={(e) => handleBlur('jobTitle', e.target.value)}
              placeholder="Software Engineer"
              aria-required="true"
              aria-invalid={!!errors.jobTitle}
              aria-describedby={
                errors.jobTitle ? `jobTitle-error-${exp.id}` : undefined
              }
              className={errors.jobTitle ? 'border-destructive' : ''}
            />
            {errors.jobTitle && (
              <p
                id={`jobTitle-error-${exp.id}`}
                className="text-sm text-destructive"
              >
                {errors.jobTitle}
              </p>
            )}
          </div>

          {/* Company */}
          <div className="space-y-1.5">
            <Label
              htmlFor={`company-${exp.id}`}
              className="text-sm font-medium"
            >
              Company <span className="text-destructive">*</span>
            </Label>
            <Input
              id={`company-${exp.id}`}
              value={exp.company}
              maxLength={FIELD_LIMITS.company}
              onChange={(e) => onUpdate(exp.id, { company: e.target.value })}
              onBlur={(e) => handleBlur('company', e.target.value)}
              placeholder="Acme Corp"
              aria-required="true"
              aria-invalid={!!errors.company}
              aria-describedby={
                errors.company ? `company-error-${exp.id}` : undefined
              }
              className={errors.company ? 'border-destructive' : ''}
            />
            {errors.company && (
              <p
                id={`company-error-${exp.id}`}
                className="text-sm text-destructive"
              >
                {errors.company}
              </p>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="space-y-1.5">
          <Label
            htmlFor={`exp-location-${exp.id}`}
            className="text-sm font-medium"
          >
            Location
          </Label>
          <Input
            id={`exp-location-${exp.id}`}
            value={exp.location ?? ''}
            maxLength={FIELD_LIMITS.location}
            onChange={(e) => onUpdate(exp.id, { location: e.target.value })}
            placeholder="San Francisco, CA"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Start Date */}
          <div className="space-y-1.5">
            <Label
              htmlFor={`startDate-${exp.id}`}
              className="text-sm font-medium"
            >
              Start Date
            </Label>
            <Input
              id={`startDate-${exp.id}`}
              type="month"
              value={exp.startDate}
              onChange={(e) => onUpdate(exp.id, { startDate: e.target.value })}
              onBlur={(e) => handleBlur('startDate', e.target.value)}
              aria-invalid={!!errors.startDate}
              aria-describedby={
                errors.startDate ? `startDate-error-${exp.id}` : undefined
              }
              className={errors.startDate ? 'border-destructive' : ''}
            />
            {errors.startDate && (
              <p
                id={`startDate-error-${exp.id}`}
                className="text-sm text-destructive"
              >
                {errors.startDate}
              </p>
            )}
          </div>

          {/* End Date */}
          {!exp.currentlyWorking && (
            <div className="space-y-1.5">
              <Label
                htmlFor={`endDate-${exp.id}`}
                className="text-sm font-medium"
              >
                End Date
              </Label>
              <Input
                id={`endDate-${exp.id}`}
                type="month"
                value={exp.endDate ?? ''}
                onChange={(e) => onUpdate(exp.id, { endDate: e.target.value })}
              />
            </div>
          )}
        </div>

        {/* Currently Working */}
        <div className="flex items-center gap-2">
          <input
            id={`currentlyWorking-${exp.id}`}
            type="checkbox"
            checked={exp.currentlyWorking}
            onChange={(e) =>
              onUpdate(exp.id, {
                currentlyWorking: e.target.checked,
                endDate: e.target.checked ? '' : (exp.endDate ?? ''),
              })
            }
            className="h-4 w-4 rounded border-border"
          />
          <Label
            htmlFor={`currentlyWorking-${exp.id}`}
            className="text-sm font-medium cursor-pointer"
          >
            Currently Working Here
          </Label>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label htmlFor={`exp-desc-${exp.id}`} className="text-sm font-medium">
            Description
          </Label>
          <Textarea
            id={`exp-desc-${exp.id}`}
            value={exp.description}
            maxLength={FIELD_LIMITS.description}
            onChange={(e) => onUpdate(exp.id, { description: e.target.value })}
            placeholder="• Led a team of 5 engineers to ship a new checkout flow, cutting cart abandonment by 22%&#10;• Reduced API response time by 40% through query optimization&#10;• Mentored 3 junior developers through weekly code reviews&#10;&#10;Start each bullet with an action verb. Add numbers wherever you can."
            rows={4}
          />
          <p className="text-xs text-muted-foreground text-right">
            {exp.description.length} / {FIELD_LIMITS.description}
          </p>
        </div>
      </div>
    </SectionEntry>
  )
}

interface SortableExperienceEntryProps {
  exp: Experience
  onUpdate: (id: string, data: Partial<Experience>) => void
  onDelete: (id: string) => void
  onMoveUp: () => void
  onMoveDown: () => void
  isFirst: boolean
  isLast: boolean
  activeId: string | null
}

function SortableExperienceEntry({
  exp,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  activeId,
}: SortableExperienceEntryProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: exp.id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <ExperienceEntryFields
        exp={exp}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        isFirst={isFirst}
        isLast={isLast}
        dragHandleProps={
          {
            ...attributes,
            ...listeners,
          } as React.HTMLAttributes<HTMLDivElement>
        }
        isDragging={Boolean(isDragging) || activeId === exp.id}
      />
    </div>
  )
}

export function ExperienceForm() {
  const resume = useResumeStore((state) => state.resume)
  const addExperience = useResumeStore((state) => state.addExperience)
  const updateExperience = useResumeStore((state) => state.updateExperience)
  const removeExperience = useResumeStore((state) => state.removeExperience)
  const reorderExperiences = useResumeStore((state) => state.reorderExperiences)

  const experiences = resume?.experiences ?? []
  const [activeId, setActiveId] = React.useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const newIds = experiences.map((e) => e.id)
    const tmp = newIds[index - 1]!
    newIds[index - 1] = newIds[index]!
    newIds[index] = tmp
    reorderExperiences(newIds)
  }

  const handleMoveDown = (index: number) => {
    if (index === experiences.length - 1) return
    const newIds = experiences.map((e) => e.id)
    const tmp = newIds[index]!
    newIds[index] = newIds[index + 1]!
    newIds[index + 1] = tmp
    reorderExperiences(newIds)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)
    if (over && active.id !== over.id) {
      const oldIndex = experiences.findIndex((e) => e.id === active.id)
      const newIndex = experiences.findIndex((e) => e.id === over.id)
      const newIds = arrayMove(
        experiences.map((e) => e.id),
        oldIndex,
        newIndex
      )
      reorderExperiences(newIds)
    }
  }

  return (
    <div className="space-y-3">
      {experiences.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-6">
          Your work history belongs here — even one entry makes a real
          difference.
          <br />
          <span className="text-xs">
            Internships, part-time roles, freelance gigs, and volunteer work all
            count.
          </span>
        </p>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={(event) => setActiveId(String(event.active.id))}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <SortableContext
          items={experiences.map((e) => e.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {experiences.map((exp, index) => (
              <SortableExperienceEntry
                key={exp.id}
                exp={exp}
                onUpdate={updateExperience}
                onDelete={removeExperience}
                onMoveUp={() => handleMoveUp(index)}
                onMoveDown={() => handleMoveDown(index)}
                isFirst={index === 0}
                isLast={index === experiences.length - 1}
                activeId={activeId}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button
        type="button"
        variant="outline"
        onClick={addExperience}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Experience
      </Button>
    </div>
  )
}
