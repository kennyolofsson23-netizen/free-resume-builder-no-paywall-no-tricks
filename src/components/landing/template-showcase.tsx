import Link from 'next/link'

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean lines and a bold accent color. Great for tech roles.',
    placeholderClass: 'bg-blue-500',
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional layout with clear hierarchy. Timeless and ATS-safe.',
    placeholderClass: 'bg-slate-600',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Lots of white space. Lets your content breathe.',
    placeholderClass: 'bg-gray-200',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'A two-column layout with a sidebar. Stands out from the crowd.',
    placeholderClass: 'bg-purple-500',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Structured and formal. Perfect for executive and finance roles.',
    placeholderClass: 'bg-slate-800',
  },
]

export function TemplateShowcase() {
  return (
    <section className="border-t border-border px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-foreground">
          5 Professional Templates, All Free
        </h2>
        <p className="mb-12 text-center text-muted-foreground">
          Other builders charge $29/month for premium templates. Ours are all free.
        </p>

        <div className="flex gap-6 overflow-x-auto pb-4">
          {templates.map((t) => (
            <div
              key={t.id}
              className="w-56 flex-shrink-0 overflow-hidden rounded-lg border border-border bg-card"
            >
              <div className={[`flex h-48 items-center justify-center`, t.placeholderClass].join(" ")}>
                <span className="rounded bg-black/20 px-2 py-1 text-sm font-semibold text-white">
                  {t.name}
                </span>
              </div>

              <div className="p-4">
                <h3 className="mb-1 font-semibold text-foreground">{t.name}</h3>
                <p className="mb-3 text-sm text-muted-foreground">{t.description}</p>
                <Link
                  href={'/builder?template=' + t.id}
                  className="inline-block text-sm font-medium text-foreground underline-offset-4 hover:underline"
                >
                  Use This Template &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
