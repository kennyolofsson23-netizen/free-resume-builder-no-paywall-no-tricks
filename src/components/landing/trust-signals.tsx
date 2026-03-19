const trustItems = [
  {
    emoji: '🔒',
    title: '100% Private',
    description: 'Data never leaves your browser',
  },
  {
    emoji: '⚡',
    title: '<200ms Updates',
    description: 'Real-time preview performance',
  },
  {
    emoji: '📄',
    title: 'ATS-Friendly',
    description: 'All templates use plain text',
  },
  {
    emoji: '✓',
    title: 'No Account Required',
    description: 'Start building immediately',
  },
]

export function TrustSignals() {
  return (
    <section className="border-t border-border bg-muted/50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {trustItems.map((item) => (
            <div key={item.title} className="text-center">
              <div className="mb-2 text-3xl">{item.emoji}</div>
              <h3 className="mb-1 font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
