'use client'

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
  return (
    <section className="border-t border-border px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-foreground">
          5 Professional Templates, All Free
        </h2>
        <p className="mb-12 text-center text-muted-foreground">
          Other builders charge $29/month for premium templates. Ours are all
          free.
        </p>

        <div className="flex gap-6 overflow-x-auto pb-4">
          {TEMPLATE_LIST.map((t) => {
            const resume = {
              ...sampleResume,
              id: `showcase-${t.id}`,
              template: t.id,
              accentColor: TEMPLATE_ACCENT_COLORS[t.id] ?? '#2563eb',
            }

            return (
              <div
                key={t.id}
                className="w-56 flex-shrink-0 overflow-hidden rounded-lg border border-border bg-card"
              >
                {/* Scaled template preview */}
                <div className="h-48 overflow-hidden bg-white relative">
                  <div
                    style={{
                      transform: 'scale(0.29)',
                      transformOrigin: 'top left',
                      width: '816px',
                      pointerEvents: 'none',
                    }}
                  >
                    <TemplateRenderer resume={resume} />
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="mb-1 font-semibold text-foreground">{t.name}</h3>
                  <p className="mb-3 text-sm text-muted-foreground">
                    {t.description}
                  </p>
                  <Link
                    href={'/builder?template=' + t.id}
                    className="inline-block text-sm font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Use This Template &rarr;
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
