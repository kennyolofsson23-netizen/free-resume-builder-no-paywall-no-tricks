import { Shield, Zap, FileText, UserX } from 'lucide-react'

const stats = [
  {
    icon: Shield,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    value: '100% Private',
    label: 'Your data never leaves your browser',
  },
  {
    icon: Zap,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    value: '<200ms',
    label: 'Preview update speed',
  },
  {
    icon: FileText,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    value: 'ATS-Friendly',
    label: 'All templates pass ATS scanners',
  },
  {
    icon: UserX,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    value: 'No Account Required',
    label: 'No sign-up, no email, no tracking',
  },
]

export function TrustSignals() {
  return (
    <section className="border-y border-border px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 text-center md:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.value} className="flex flex-col items-center gap-2">
              <div className={`rounded-full p-3 ${stat.iconBg}`}>
                <Icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                {stat.value}
              </h3>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
