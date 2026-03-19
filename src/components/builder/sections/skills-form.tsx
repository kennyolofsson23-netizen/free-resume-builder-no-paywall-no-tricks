'use client'

import * as React from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useResumeStore } from '@/store/resume-store'
import { FIELD_LIMITS, SKILL_LEVELS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Skill } from '@/types/resume'

interface SkillRowProps {
  skill: Skill
  onUpdate: (id: string, data: Partial<Skill>) => void
  onDelete: (id: string) => void
}

function SkillRow({ skill, onUpdate, onDelete }: SkillRowProps) {
  return (
    <div className="flex items-center gap-2">
      <Input
        value={skill.name}
        maxLength={FIELD_LIMITS.skillName}
        onChange={(e) => onUpdate(skill.id, { name: e.target.value })}
        placeholder="Skill name"
        aria-label="Skill name"
        className="flex-1"
      />
      <select
        value={skill.level ?? ''}
        onChange={(e) => {
          if (e.target.value) {
            onUpdate(skill.id, {
              level: e.target.value as NonNullable<Skill['level']>,
            })
          } else {
            // Remove level by omitting the field entirely (exactOptionalPropertyTypes)
            onUpdate(skill.id, { name: skill.name })
          }
        }}
        aria-label="Skill level"
        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="">Level</option>
        {SKILL_LEVELS.map((level) => (
          <option key={level.value} value={level.value}>
            {level.label}
          </option>
        ))}
      </select>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onDelete(skill.id)}
        aria-label={`Delete skill ${skill.name}`}
        className="shrink-0 text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function SkillsForm() {
  const resume = useResumeStore((state) => state.resume)
  const addSkill = useResumeStore((state) => state.addSkill)
  const updateSkill = useResumeStore((state) => state.updateSkill)
  const removeSkill = useResumeStore((state) => state.removeSkill)

  const skills = resume?.skills ?? []

  return (
    <div className="space-y-3">
      {skills.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-6">
          No skills yet. Click &quot;Add Skill&quot; to get started.
        </p>
      )}

      {skills.map((skill) => (
        <SkillRow
          key={skill.id}
          skill={skill}
          onUpdate={updateSkill}
          onDelete={removeSkill}
        />
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addSkill}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Skill
      </Button>
    </div>
  )
}
