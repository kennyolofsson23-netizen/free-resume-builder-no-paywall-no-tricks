'use client'

import * as React from 'react'
import Link from 'next/link'
import { TemplateRenderer } from './template-renderer'
import { sampleResume } from '@/lib/templates/sample-data'
import { TEMPLATE_LIST } from '@/lib/constants'
import type { ResumeTemplate } from '@/types/resume'

const TEMPLATE_ACCENT_COLORS: Record<ResumeTemplate, string> = {
  modern: '#2563eb',
  classic: '#1e3a5f',
  minimal: '#111827',
  creative: '#7c3aed',
  professional: '#1e3a5f',
}

export function TemplateGallery() {
  return (
    <div className="grid gap-12">
      {TEMPLATE_LIST.map((template) => {
        const resume = {
          ...sampleResume,
          id: `gallery-${template.id}`,
          template: template.id,
          accentColor: TEMPLATE_ACCENT_COLORS[template.id] ?? '#2563eb',
        }

        return (
          <article
            key={template.id}
            id={`template-${template.id}`}
            className="bg-white rounded-2xl shadow-md overflow-hidden"
          >
            {/* Template header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {template.name}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {template.description}
                </p>
              </div>
              <Link
                href={`/builder?template=${template.id}`}
                className="bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                aria-label={`Use ${template.name} template`}
              >
                Use This Template
              </Link>
            </div>

            {/* Template preview */}
            <div className="bg-gray-50 p-6 overflow-hidden">
              <div
                className="mx-auto bg-white shadow-lg"
                style={{
                  width: '816px',
                  transformOrigin: 'top center',
                  transform: 'scale(0.55)',
                  marginBottom: '-220px',
                }}
              >
                <TemplateRenderer resume={resume} />
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
