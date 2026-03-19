import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resume Builder - Free Resume Builder',
}

export default function BuilderPage() {
  return (
    <main id="main-content" className="min-h-screen bg-background">
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground">
            Resume Builder
          </h1>
          <p className="text-muted-foreground">
            This page will contain the interactive resume builder interface.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">Coming soon...</p>
        </div>
      </div>
    </main>
  )
}
