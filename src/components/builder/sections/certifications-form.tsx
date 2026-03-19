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
import type { Certification } from '@/types/resume'

interface CertFieldErrors {
  name?: string
  issuer?: string
  issueDate?: string
}

interface CertEntryProps {
  cert: Certification
  onUpdate: (id: string, data: Partial<Certification>) => void
  onDelete: (id: string) => void
  onMoveUp: () => void
  onMoveDown: () => void
  isFirst: boolean
  isLast: boolean
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>
  isDragging?: boolean
}

function CertificationEntryFields({
  cert,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  dragHandleProps,
  isDragging,
}: CertEntryProps) {
  const [errors, setErrors] = React.useState<CertFieldErrors>({})

  const handleBlur = (field: keyof CertFieldErrors, value: string) => {
    const newErrors = { ...errors }
    if (!value.trim()) {
      if (field === 'name') newErrors.name = 'Certification name is required'
      else if (field === 'issuer') newErrors.issuer = 'Issuer is required'
      else if (field === 'issueDate')
        newErrors.issueDate = 'Issue date is required'
    } else {
      delete newErrors[field]
    }
    setErrors(newErrors)
  }

  const title = cert.name || 'Untitled Certification'
  const subtitle = cert.issuer || ''

  return (
    <SectionEntry
      title={title}
      subtitle={subtitle}
      onDelete={() => onDelete(cert.id)}
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
        {/* Name */}
        <div className="space-y-1.5">
          <Label
            htmlFor={`cert-name-${cert.id}`}
            className="text-sm font-medium"
          >
            Certification Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`cert-name-${cert.id}`}
            value={cert.name}
            maxLength={FIELD_LIMITS.certName}
            onChange={(e) => onUpdate(cert.id, { name: e.target.value })}
            onBlur={(e) => handleBlur('name', e.target.value)}
            placeholder="AWS Certified Solutions Architect"
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={
              errors.name ? `cert-name-error-${cert.id}` : undefined
            }
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && (
            <p
              id={`cert-name-error-${cert.id}`}
              className="text-sm text-destructive"
            >
              {errors.name}
            </p>
          )}
        </div>

        {/* Issuer */}
        <div className="space-y-1.5">
          <Label
            htmlFor={`cert-issuer-${cert.id}`}
            className="text-sm font-medium"
          >
            Issuer <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`cert-issuer-${cert.id}`}
            value={cert.issuer}
            maxLength={FIELD_LIMITS.certIssuer}
            onChange={(e) => onUpdate(cert.id, { issuer: e.target.value })}
            onBlur={(e) => handleBlur('issuer', e.target.value)}
            placeholder="Amazon Web Services"
            aria-required="true"
            aria-invalid={!!errors.issuer}
            aria-describedby={
              errors.issuer ? `cert-issuer-error-${cert.id}` : undefined
            }
            className={errors.issuer ? 'border-destructive' : ''}
          />
          {errors.issuer && (
            <p
              id={`cert-issuer-error-${cert.id}`}
              className="text-sm text-destructive"
            >
              {errors.issuer}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Issue Date */}
          <div className="space-y-1.5">
            <Label
              htmlFor={`cert-issueDate-${cert.id}`}
              className="text-sm font-medium"
            >
              Issue Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id={`cert-issueDate-${cert.id}`}
              type="month"
              value={cert.issueDate}
              onChange={(e) => onUpdate(cert.id, { issueDate: e.target.value })}
              onBlur={(e) => handleBlur('issueDate', e.target.value)}
              aria-required="true"
              aria-invalid={!!errors.issueDate}
              aria-describedby={
                errors.issueDate ? `cert-issueDate-error-${cert.id}` : undefined
              }
              className={errors.issueDate ? 'border-destructive' : ''}
            />
            {errors.issueDate && (
              <p
                id={`cert-issueDate-error-${cert.id}`}
                className="text-sm text-destructive"
              >
                {errors.issueDate}
              </p>
            )}
          </div>

          {/* Expiration Date */}
          <div className="space-y-1.5">
            <Label
              htmlFor={`cert-expDate-${cert.id}`}
              className="text-sm font-medium"
            >
              Expiration Date{' '}
              <span className="text-xs text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id={`cert-expDate-${cert.id}`}
              type="month"
              value={cert.expirationDate ?? ''}
              onChange={(e) =>
                onUpdate(cert.id, { expirationDate: e.target.value })
              }
            />
          </div>
        </div>

        {/* Credential URL */}
        <div className="space-y-1.5">
          <Label
            htmlFor={`cert-url-${cert.id}`}
            className="text-sm font-medium"
          >
            Credential URL{' '}
            <span className="text-xs text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id={`cert-url-${cert.id}`}
            type="url"
            value={cert.credentialUrl ?? ''}
            maxLength={FIELD_LIMITS.url}
            onChange={(e) =>
              onUpdate(cert.id, { credentialUrl: e.target.value })
            }
            placeholder="https://www.credly.com/badges/..."
          />
        </div>
      </div>
    </SectionEntry>
  )
}

interface SortableCertEntryProps {
  cert: Certification
  onUpdate: (id: string, data: Partial<Certification>) => void
  onDelete: (id: string) => void
  onMoveUp: () => void
  onMoveDown: () => void
  isFirst: boolean
  isLast: boolean
  activeId: string | null
}

function SortableCertificationEntry({
  cert,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  activeId,
}: SortableCertEntryProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: cert.id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <CertificationEntryFields
        cert={cert}
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
        isDragging={Boolean(isDragging) || activeId === cert.id}
      />
    </div>
  )
}

export function CertificationsForm() {
  const resume = useResumeStore((state) => state.resume)
  const addCertification = useResumeStore((state) => state.addCertification)
  const updateCertification = useResumeStore(
    (state) => state.updateCertification
  )
  const removeCertification = useResumeStore(
    (state) => state.removeCertification
  )
  const reorderCertifications = useResumeStore(
    (state) => state.reorderCertifications
  )

  const certifications = resume?.certifications ?? []
  const [activeId, setActiveId] = React.useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const newIds = certifications.map((c) => c.id)
    const tmp = newIds[index - 1]!
    newIds[index - 1] = newIds[index]!
    newIds[index] = tmp
    reorderCertifications(newIds)
  }

  const handleMoveDown = (index: number) => {
    if (index === certifications.length - 1) return
    const newIds = certifications.map((c) => c.id)
    const tmp = newIds[index]!
    newIds[index] = newIds[index + 1]!
    newIds[index + 1] = tmp
    reorderCertifications(newIds)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)
    if (over && active.id !== over.id) {
      const oldIndex = certifications.findIndex((c) => c.id === active.id)
      const newIndex = certifications.findIndex((c) => c.id === over.id)
      const newIds = arrayMove(
        certifications.map((c) => c.id),
        oldIndex,
        newIndex
      )
      reorderCertifications(newIds)
    }
  }

  return (
    <div className="space-y-3">
      {certifications.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-6">
          Add certifications, licenses, or credentials that back up your skills.
          <br />
          <span className="text-xs">
            AWS, Google Analytics, PMP, SHRM — anything with a credential ID or
            verification URL is worth including.
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
          items={certifications.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {certifications.map((cert, index) => (
              <SortableCertificationEntry
                key={cert.id}
                cert={cert}
                onUpdate={updateCertification}
                onDelete={removeCertification}
                onMoveUp={() => handleMoveUp(index)}
                onMoveDown={() => handleMoveDown(index)}
                isFirst={index === 0}
                isLast={index === certifications.length - 1}
                activeId={activeId}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button
        type="button"
        variant="outline"
        onClick={addCertification}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Certification
      </Button>
    </div>
  )
}
