import { Download, Eye, Layout, Shield, UserX, WifiOff } from 'lucide-react'

export function FeatureGrid() {
  return (
    <section id="features" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground">
          Everything You Need to Build a Great Resume
        </h2>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 inline-block rounded-lg bg-blue-100 p-3">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Real-time Preview
            </h3>
            <p className="text-muted-foreground">
              See your resume update live as you type. No save button needed.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 inline-block rounded-lg bg-green-100 p-3">
              <Download className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Instant PDF Download
            </h3>
            <p className="text-muted-foreground">
              Download your resume instantly. No waiting room. No email
              confirmation. No upgrade prompt.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 inline-block rounded-lg bg-purple-100 p-3">
              <Layout className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              5 ATS-Friendly Templates
            </h3>
            <p className="text-muted-foreground">
              Modern, Classic, Minimal, Creative, Professional. All templates
              pass ATS screening — all free.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 inline-block rounded-lg bg-amber-100 p-3">
              <Shield className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Your Data Stays Private
            </h3>
            <p className="text-muted-foreground">
              Everything happens in your browser. We have no server. Your resume
              never leaves your device.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 inline-block rounded-lg bg-slate-100 p-3">
              <UserX className="h-6 w-6 text-slate-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              No Account Required
            </h3>
            <p className="text-muted-foreground">
              Build, preview, and download without creating an account or giving
              us your email.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 inline-block rounded-lg bg-slate-100 p-3">
              <WifiOff className="h-6 w-6 text-slate-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Works Offline
            </h3>
            <p className="text-muted-foreground">
              Once loaded, this builder works offline. Your data is saved to
              your browser automatically.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
