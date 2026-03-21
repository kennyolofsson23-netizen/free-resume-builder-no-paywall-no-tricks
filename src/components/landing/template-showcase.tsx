'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TemplateRenderer } from '@/components/templates/template-renderer'
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

export function TemplateShowcase() {
  const [activeTemplate, setActiveTemplate] = useState<ResumeTemplate>('modern')

  const activeData = TEMPLATE_LIST.find((t) => t.id === activeTemplate)
  const resume = {
    ...sampleResume,
    id: `showcase-${activeTemplate}`,
    template: activeTemplate,
    accentColor: TEMPLATE_ACCENT_COLORS[activeTemplate] ?? '#2563eb',
  }

  return (
    <section className="border-t border-border px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-foreground">
          5 Professional Templates, All Free
        </h2>
        <p className="mb-10 text-center text-muted-foreground">
          Other builders charge $29/month for premium templates. Ours are all
          free.
        </p>

        {/* Tab bar */}
        <div
          className="mb-6 flex overflow-x-auto rounded-lg border border-border bg-muted p-1"
          role="tablist"
          aria-label="Resume templates"
        >
          {TEMPLATE_LIST.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={activeTemplate === t.id}
              aria-controls={`template-panel-${t.id}`}
              id={`template-tab-${t.id}`}
              onClick={() => setActiveTemplate(t.id)}
              className={`flex-1 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                activeTemplate === t.id
                  ? 'bg-background text-foreground shadow'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Full-size preview */}
        <div
          id={`template-panel-${activeTemplate}`}
          role="tabpanel"
          aria-labelledby={`template-tab-${activeTemplate}`}
          className="overflow-hidden rounded-lg border border-border bg-white shadow-lg"
        >
          <div className="relative overflow-hidden" style={{ paddingBottom: '129.4%' }}>
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ pointerEvents: 'none' }}
            >
              <div
                style={{
                  transform: 'scale(var(--preview-scale, 1))',
                  transformOrigin: 'top left',
                  width: '816px',
                }}
                className="[--preview-scale:calc(100vw/816)] sm:[--preview-scale:calc(min(100vw-3rem,672px)/816)] lg:[--preview-scale:calc(min(100vw-4rem,960px)/816)]"
              >
                <TemplateRenderer resume={resume} />
              </div>
            </div>
          </div>
        </div>

        {/* Template info + CTA */}
        {activeData && (
          <div className="mt-6 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">{activeData.name}</h3>
              <p className="text-sm text-muted-foreground">{activeData.description}</p>
            </div>
            <Link
              href={`/builder?template=${activeTemplate}`}
              className="inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Use This Template &rarr;
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
