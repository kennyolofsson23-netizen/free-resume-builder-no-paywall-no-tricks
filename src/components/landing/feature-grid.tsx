import { Download, Eye, Layout, Lock } from 'lucide-react'

const features = [
  {
    icon: Eye,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    title: 'Real-time Preview',
    description:
      'See your resume update instantly as you type. Switch between templates with one click. No page reloads, no waiting.',
    antiPaywall: 'Preview is free — no account required.',
  },
  {
    icon: Download,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    title: 'Instant PDF Download',
    description:
      'Download your polished resume as a PDF in seconds. No watermarks, no blurred pages, no "upgrade to download."',
    antiPaywall: 'PDF download is always free. Always.',
  },
  {
    icon: Layout,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    title: '5 Professional Templates',
    description:
      'Choose from Modern, Classic, Minimal, Creative, and Professional — all ATS-friendly, all included at zero cost.',
    antiPaywall: 'All 5 templates unlocked. No premium tier.',
  },
  {
    icon: Lock,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    title: '100% Private',
    description:
      'Your resume data never leaves your browser. No servers, no tracking, no data harvesting. Close the tab — your data stays local.',
    antiPaywall: 'We collect nothing. You share nothing.',
  },
]

export function FeatureGrid() {
  return (
    <section id="features" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-foreground">
          Everything You Need — Nothing You Don&apos;t
        </h2>
        <p className="mb-12 text-center text-muted-foreground">
          No upsells. No locked features. No surprises.
        </p>

        <div className="grid gap-8 md:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="rounded-lg border border-border bg-card p-6"
              >
                <div
                  className={`mb-4 inline-block rounded-lg ${feature.iconBg} p-3`}
                >
                  <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mb-3 text-muted-foreground">
                  {feature.description}
                </p>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  ✓ {feature.antiPaywall}
                </p>
              </div>
            )
          })}
        </div>

        <div className="mt-10 rounded-lg border border-green-200 bg-green-50 px-6 py-4 text-center dark:border-green-900 dark:bg-green-950">
          <p className="font-semibold text-green-800 dark:text-green-200">
            Unlike Zety, Resume.io, and Novoresume — we never ask for a credit
            card. Your resume is yours, completely free.
          </p>
        </div>
      </div>
    </section>
  )
}
