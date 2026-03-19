'use client'

import * as React from 'react'
import { useResumeStore } from '@/store/resume-store'
import { FIELD_LIMITS } from '@/lib/constants'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/cn'

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
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

export function PersonalInfoForm() {
  const resume = useResumeStore((state) => state.resume)
  const updatePersonalInfo = useResumeStore((state) => state.updatePersonalInfo)

  const info = resume?.personalInfo

  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const handleBlur = (field: string, value: string) => {
    const newErrors = { ...errors }
    if (field === 'fullName' && !value.trim()) {
      newErrors.fullName = 'Full name is required'
    } else if (field === 'email') {
      if (!value.trim()) {
        newErrors.email = 'Email is required'
      } else if (!isValidEmail(value)) {
        newErrors.email = 'Invalid email address'
      } else {
        delete newErrors.email
      }
    } else if (['website', 'linkedin', 'github'].includes(field)) {
      if (value && !isValidUrl(value)) {
        newErrors[field] = 'Invalid URL'
      } else {
        delete newErrors[field]
      }
    } else {
      delete newErrors[field]
    }
    setErrors(newErrors)
  }

  if (!info) return null

  const summaryLength = info.summary?.length ?? 0

  return (
    <div className="space-y-4">
      {/* Full Name */}
      <div className="space-y-1.5">
        <Label htmlFor="fullName" className="text-sm font-medium">
          Full Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="fullName"
          value={info.fullName}
          maxLength={FIELD_LIMITS.fullName}
          onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
          onBlur={(e) => handleBlur('fullName', e.target.value)}
          placeholder="Jane Doe"
          aria-required="true"
          aria-invalid={!!errors.fullName}
          aria-describedby={errors.fullName ? 'fullName-error' : undefined}
          className={cn(errors.fullName && 'border-destructive')}
        />
        {errors.fullName && (
          <p id="fullName-error" className="text-sm text-destructive">
            {errors.fullName}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-sm font-medium">
          Email <span className="text-destructive">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          value={info.email}
          maxLength={FIELD_LIMITS.email}
          onChange={(e) => updatePersonalInfo({ email: e.target.value })}
          onBlur={(e) => handleBlur('email', e.target.value)}
          placeholder="jane@example.com"
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className={cn(errors.email && 'border-destructive')}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-destructive">
            {errors.email}
          </p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-1.5">
        <Label htmlFor="phone" className="text-sm font-medium">
          Phone
        </Label>
        <Input
          id="phone"
          type="tel"
          value={info.phone}
          maxLength={FIELD_LIMITS.phone}
          onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
          placeholder="+1 (555) 000-0000"
        />
      </div>

      {/* Location */}
      <div className="space-y-1.5">
        <Label htmlFor="location" className="text-sm font-medium">
          Location
        </Label>
        <Input
          id="location"
          value={info.location}
          maxLength={FIELD_LIMITS.location}
          onChange={(e) => updatePersonalInfo({ location: e.target.value })}
          placeholder="San Francisco, CA"
        />
      </div>

      {/* Website */}
      <div className="space-y-1.5">
        <Label htmlFor="website" className="text-sm font-medium">
          Website
        </Label>
        <Input
          id="website"
          type="url"
          value={info.website ?? ''}
          maxLength={FIELD_LIMITS.url}
          onChange={(e) => updatePersonalInfo({ website: e.target.value })}
          onBlur={(e) => handleBlur('website', e.target.value)}
          placeholder="https://yoursite.com"
          aria-invalid={!!errors.website}
          aria-describedby={errors.website ? 'website-error' : undefined}
          className={cn(errors.website && 'border-destructive')}
        />
        {errors.website && (
          <p id="website-error" className="text-sm text-destructive">
            {errors.website}
          </p>
        )}
      </div>

      {/* LinkedIn */}
      <div className="space-y-1.5">
        <Label htmlFor="linkedin" className="text-sm font-medium">
          LinkedIn
        </Label>
        <Input
          id="linkedin"
          type="url"
          value={info.linkedin ?? ''}
          maxLength={FIELD_LIMITS.url}
          onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
          onBlur={(e) => handleBlur('linkedin', e.target.value)}
          placeholder="https://linkedin.com/in/janedoe"
          aria-invalid={!!errors.linkedin}
          aria-describedby={errors.linkedin ? 'linkedin-error' : undefined}
          className={cn(errors.linkedin && 'border-destructive')}
        />
        {errors.linkedin && (
          <p id="linkedin-error" className="text-sm text-destructive">
            {errors.linkedin}
          </p>
        )}
      </div>

      {/* GitHub */}
      <div className="space-y-1.5">
        <Label htmlFor="github" className="text-sm font-medium">
          GitHub
        </Label>
        <Input
          id="github"
          type="url"
          value={info.github ?? ''}
          maxLength={FIELD_LIMITS.url}
          onChange={(e) => updatePersonalInfo({ github: e.target.value })}
          onBlur={(e) => handleBlur('github', e.target.value)}
          placeholder="https://github.com/janedoe"
          aria-invalid={!!errors.github}
          aria-describedby={errors.github ? 'github-error' : undefined}
          className={cn(errors.github && 'border-destructive')}
        />
        {errors.github && (
          <p id="github-error" className="text-sm text-destructive">
            {errors.github}
          </p>
        )}
      </div>

      {/* Summary */}
      <div className="space-y-1.5">
        <Label htmlFor="summary" className="text-sm font-medium">
          Summary
        </Label>
        <Textarea
          id="summary"
          value={info.summary ?? ''}
          maxLength={FIELD_LIMITS.summary}
          onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
          placeholder="e.g. 'Software engineer with 5 years of experience building web applications. Passionate about clean code and great user experiences.'"
          rows={4}
        />
        <p className="text-xs text-muted-foreground text-right">
          {summaryLength} / {FIELD_LIMITS.summary}
        </p>
      </div>
    </div>
  )
}
