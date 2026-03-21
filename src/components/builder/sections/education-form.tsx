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
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>
  isDragging?: boolean
}

function EducationEntryFields({
  edu,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  dragHandleProps,
  isDragging,
}: EducationEntryProps) {
  const [errors, setErrors] = React.useState<EducationFieldErrors>({})

  const handleBlur = (field: keyof EducationFieldErrors, value: string) => {
    const newErrors = { ...errors }
    if (!value.trim()) {
      if (field === 'school')
        newErrors.school =
          'Add your school — bootcamps, community colleges, and online programs all count'
      else if (field === 'degree')
        newErrors.degree =
          "Add your degree — 'B.S.', 'Certificate', or 'Some College' all work"
      else if (field === 'startDate')
        newErrors.startDate = 'Add a start date for this program'
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
    : ''

  return (
    <SectionEntry
      title={title}
      subtitle={subtitle}
      onDelete={() => onDelete(edu.id)}
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
            aria-describedby={
              errors.school ? `school-error-${edu.id}` : undefined
            }
            className={errors.school ? 'border-destructive' : ''}
          />
          {errors.school && (
            <p
              id={`school-error-${edu.id}`}
              className="text-sm text-destructive"
            >
              {errors.school}
            </p>
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
              aria-describedby={
                errors.degree ? `degree-error-${edu.id}` : undefined
              }
              className={errors.degree ? 'border-destructive' : ''}
            />
            {errors.degree && (
              <p
                id={`degree-error-${edu.id}`}
                className="text-sm text-destructive"
              >
                {errors.degree}
              </p>
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
              aria-describedby={
                errors.startDate ? `edu-startDate-error-${edu.id}` : undefined
              }
              className={errors.startDate ? 'border-destructive' : ''}
            />
            {errors.startDate && (
              <p
                id={`edu-startDate-error-${edu.id}`}
                className="text-sm text-destructive"
              >
                {errors.startDate}
              </p>
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

interface SortableEducationEntryProps {
  edu: Education
  onUpdate: (id: string, data: Partial<Education>) => void
  onDelete: (id: string) => void
  onMoveUp: () => void
  onMoveDown: () => void
  isFirst: boolean
  isLast: boolean
  activeId: string | null
}

function SortableEducationEntry({
  edu,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  activeId,
}: SortableEducationEntryProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: edu.id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <EducationEntryFields
        edu={edu}
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
        isDragging={Boolean(isDragging) || activeId === edu.id}
      />
    </div>
  )
}

export function EducationForm() {
  const resume = useResumeStore((state) => state.resume)
  const addEducation = useResumeStore((state) => state.addEducation)
  const updateEducation = useResumeStore((state) => state.updateEducation)
  const removeEducation = useResumeStore((state) => state.removeEducation)
  const reorderEducation = useResumeStore((state) => state.reorderEducation)

  const education = resume?.education ?? []
  const [activeId, setActiveId] = React.useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const newIds = education.map((e) => e.id)
    const tmp = newIds[index - 1]!
    newIds[index - 1] = newIds[index]!
    newIds[index] = tmp
    reorderEducation(newIds)
  }

  const handleMoveDown = (index: number) => {
    if (index === education.length - 1) return
    const newIds = education.map((e) => e.id)
    const tmp = newIds[index]!
    newIds[index] = newIds[index + 1]!
    newIds[index + 1] = tmp
    reorderEducation(newIds)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)
    if (over && active.id !== over.id) {
      const oldIndex = education.findIndex((e) => e.id === active.id)
      const newIndex = education.findIndex((e) => e.id === over.id)
      const newIds = arrayMove(
        education.map((e) => e.id),
        oldIndex,
        newIndex
      )
      reorderEducation(newIds)
    }
  }

  return (
    <div className="space-y-3">
      {education.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-6">
          List your degrees, diplomas, bootcamps, or relevant coursework.
          <br />
          <span className="text-xs">
            No four-year degree? A bootcamp certificate, online course, or
            &ldquo;Some College&rdquo; still belongs here.
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
          items={education.map((e) => e.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {education.map((edu, index) => (
              <SortableEducationEntry
                key={edu.id}
                edu={edu}
                onUpdate={updateEducation}
                onDelete={removeEducation}
                onMoveUp={() => handleMoveUp(index)}
                onMoveDown={() => handleMoveDown(index)}
                isFirst={index === 0}
                isLast={index === education.length - 1}
                activeId={activeId}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

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
