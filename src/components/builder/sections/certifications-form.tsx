'use client'

import * as React from 'react'
import { Plus } from 'lucide-react'
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
}

function CertificationEntryFields({
  cert,
  onUpdate,
  onDelete,
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

  const title = cert.name || 'New Certification'
  const subtitle = cert.issuer || ''

  return (
    <SectionEntry
      title={title}
      subtitle={subtitle}
      onDelete={() => onDelete(cert.id)}
    >
      <div className="space-y-4">
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
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
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
            className={errors.issuer ? 'border-destructive' : ''}
          />
          {errors.issuer && (
            <p className="text-sm text-destructive">{errors.issuer}</p>
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
              className={errors.issueDate ? 'border-destructive' : ''}
            />
            {errors.issueDate && (
              <p className="text-sm text-destructive">{errors.issueDate}</p>
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

export function CertificationsForm() {
  const resume = useResumeStore((state) => state.resume)
  const addCertification = useResumeStore((state) => state.addCertification)
  const updateCertification = useResumeStore(
    (state) => state.updateCertification
  )
  const removeCertification = useResumeStore(
    (state) => state.removeCertification
  )

  const certifications = resume?.certifications ?? []

  return (
    <div className="space-y-3">
      {certifications.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-6">
          Add licenses, professional certifications, or credentials that
          strengthen your application.
        </p>
      )}

      {certifications.map((cert) => (
        <CertificationEntryFields
          key={cert.id}
          cert={cert}
          onUpdate={updateCertification}
          onDelete={removeCertification}
        />
      ))}

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
