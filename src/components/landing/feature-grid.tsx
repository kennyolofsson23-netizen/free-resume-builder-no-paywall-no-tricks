import {
  Download,
  Eye,
  Layout,
  Shield,
  Share2,
  Wifi,
  Check,
  X,
} from 'lucide-react'
import { cn } from '@/lib/cn'

const FEATURES = [
  {
    icon: Download,
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400',
    title: 'No Paywall, Ever',
    description:
      'Your PDF is free. No credit card, no \u201cfree trial\u201d, no surprises.',
  },
  {
    icon: Eye,
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
    title: 'Real-Time Preview',
    description:
      'See your resume update instantly as you type. What you see is what downloads.',
  },
  {
    icon: Layout,
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
    title: '5 Professional Templates',
    description:
      'Modern, Classic, Minimal, Creative, or Professional. Switch anytime.',
  },
  {
    icon: Shield,
    iconBg: 'bg-slate-100 dark:bg-slate-700/50',
    iconColor: 'text-slate-600 dark:text-slate-400',
    title: '100% Private',
    description:
      'Your data never leaves your browser. Zero servers. Zero tracking.',
  },
  {
    icon: Share2,
    iconBg: 'bg-cyan-100 dark:bg-cyan-900/30',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    title: 'Share a Link',
    description: 'Generate a shareable link to your resume. No account needed.',
  },
  {
    icon: Wifi,
    iconBg: 'bg-amber-100 dark:bg-amber-900/30',
    iconColor: 'text-amber-600 dark:text-amber-400',
    title: 'Works Offline',
    description:
      'Once loaded, the builder works without internet. Your data, your device.',
  },
]

interface ComparisonEntry {
  value: string
  positive: boolean
}

interface ComparisonRow {
  feature: string
  us: ComparisonEntry
  zety: ComparisonEntry
  resumeIo: ComparisonEntry
}

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    feature: 'PDF Download Free',
    us: { value: 'Free', positive: true },
    zety: { value: 'Paywall', positive: false },
    resumeIo: { value: 'Paywall', positive: false },
  },
  {
    feature: 'No Account Required',
    us: { value: 'Yes', positive: true },
    zety: { value: 'No', positive: false },
    resumeIo: { value: 'No', positive: false },
  },
  {
    feature: 'Data Stays Private',
    us: { value: 'Yes', positive: true },
    zety: { value: 'No', positive: false },
    resumeIo: { value: 'No', positive: false },
  },
  {
    feature: 'No Auto-Renewal',
    us: { value: 'Yes', positive: true },
    zety: { value: 'No', positive: false },
    resumeIo: { value: 'No', positive: false },
  },
  {
    feature: 'Price',
    us: { value: '$0', positive: true },
    zety: { value: '$25.90/mo', positive: false },
    resumeIo: { value: '$19.95/mo', positive: false },
  },
]

function CellValue({ entry }: { entry: ComparisonEntry }) {
  return (
    <td className="px-6 py-4 text-center">
      <span
        className={cn(
          'inline-flex items-center gap-1 font-semibold',
          entry.positive
            ? 'text-green-600 dark:text-green-400'
            : 'text-red-500 dark:text-red-400'
        )}
      >
        {entry.positive ? (
          <Check className="h-4 w-4" aria-hidden="true" />
        ) : (
          <X className="h-4 w-4" aria-hidden="true" />
        )}
        {entry.value}
      </span>
    </td>
  )
}

export function FeatureGrid() {
  return (
    <section id="how-it-works" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything You Need. Nothing You Don&apos;t.
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            We built the resume builder we wished existed — simple, fast, and
            actually free.
          </p>
        </div>

        {/* Feature cards grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(
            ({ icon: Icon, iconBg, iconColor, title, description }) => (
              <div
                key={title}
                className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div
                  className={cn(
                    'mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg',
                    iconBg
                  )}
                >
                  <Icon
                    className={cn('h-6 w-6', iconColor)}
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            )
          )}
        </div>

        {/* Comparison table */}
        <div className="mt-24">
          <div className="mb-10 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              How We Compare
            </h2>
            <p className="text-muted-foreground">
              Spoiler: we&apos;re the only one that doesn&apos;t charge you to
              download your own resume.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left font-semibold text-foreground">
                    Feature
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-green-600 dark:text-green-400">
                    Us (Free)
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-muted-foreground">
                    Zety
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-muted-foreground">
                    Resume.io
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={cn(
                      'border-b border-border last:border-b-0',
                      i % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                    )}
                  >
                    <td className="px-6 py-4 font-medium text-foreground">
                      {row.feature}
                    </td>
                    <CellValue entry={row.us} />
                    <CellValue entry={row.zety} />
                    <CellValue entry={row.resumeIo} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
