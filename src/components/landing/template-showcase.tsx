import Link from 'next/link'

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean lines and a bold accent color. Great for tech roles.',
    accentClass: 'border-t-4 border-blue-500',
    bgClass: 'bg-blue-50 dark:bg-blue-950',
  },
  {
    id: 'classic',
    name: 'Classic',
    description:
      'Traditional layout with clear hierarchy. Timeless and ATS-safe.',
    accentClass: 'border-t-4 border-slate-700',
    bgClass: 'bg-slate-50 dark:bg-slate-900',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Lots of white space. Lets your content breathe.',
    accentClass: 'border-t-4 border-gray-400',
    bgClass: 'bg-gray-50 dark:bg-gray-900',
  },
  {
    id: 'creative',
    name: 'Creative',
    description:
      'A two-column layout with a sidebar. Stands out from the crowd.',
    accentClass: 'border-t-4 border-purple-500',
    bgClass: 'bg-purple-50 dark:bg-purple-950',
  },
  {
    id: 'professional',
    name: 'Professional',
    description:
      'Structured and formal. Perfect for executive and finance roles.',
    accentClass: 'border-t-4 border-emerald-600',
    bgClass: 'bg-emerald-50 dark:bg-emerald-950',
  },
]

export function TemplateShowcase() {
  return (
    <section className="border-t border-border px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-foreground">
          5 Professional Templates — All Free, No Upgrade Required
        </h2>
        <p className="mb-12 text-center text-muted-foreground">
          Every template is ATS-compatible and available to everyone, always.
        </p>

        {/* Template tab-like navigation */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {templates.map((t) => (
            <a
              key={t.id}
              href={`#template-${t.id}`}
              className="rounded-full border border-border px-4 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              {t.name}
            </a>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <div
              key={t.id}
              id={`template-${t.id}`}
              className={`rounded-lg border border-border ${t.bgClass} overflow-hidden`}
            >
              {/* Template thumbnail placeholder */}
              <div
                className={`relative h-48 ${t.accentClass} bg-card px-4 py-3`}
              >
                {/* Simulated resume content lines */}
                <div className="mt-2 space-y-2">
                  <div className="h-3 w-3/4 rounded bg-muted-foreground/20" />
                  <div className="h-2 w-1/2 rounded bg-muted-foreground/15" />
                  <div className="mt-3 h-px w-full bg-border" />
                  <div className="space-y-1.5 pt-1">
                    <div className="h-2 w-full rounded bg-muted-foreground/15" />
                    <div className="h-2 w-5/6 rounded bg-muted-foreground/10" />
                    <div className="h-2 w-4/6 rounded bg-muted-foreground/10" />
                  </div>
                  <div className="mt-2 space-y-1.5">
                    <div className="h-2 w-full rounded bg-muted-foreground/15" />
                    <div className="h-2 w-3/4 rounded bg-muted-foreground/10" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 rounded bg-background/80 px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                  {t.name}
                </div>
              </div>

              <div className="p-4">
                <h3 className="mb-1 font-semibold text-foreground">{t.name}</h3>
                <p className="mb-3 text-sm text-muted-foreground">
                  {t.description}
                </p>
                <Link
                  href={`/builder?template=${t.id}`}
                  className="inline-block rounded-md bg-foreground px-4 py-1.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                >
                  Use This Template →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          All templates are free — no login, no paywall, no upgrade prompt.
        </p>
      </div>
    </section>
  )
}
