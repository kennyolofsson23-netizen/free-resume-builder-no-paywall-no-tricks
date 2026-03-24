export function HowItWorks() {
  return (
    <section className="border-t border-border px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-foreground">
          How the Free Resume Builder Works
        </h2>
        <p className="mb-12 text-center text-muted-foreground">
          Three steps. Under <strong>10 minutes</strong>. No account required.
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">
              1
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Pick a Template
            </h3>
            <p className="text-muted-foreground">
              Choose from <strong>5 ATS-friendly templates</strong> — Modern,
              Classic, Minimal, Creative, or Professional. Each one is designed
              to pass applicant tracking systems like{' '}
              <strong>Taleo, Greenhouse, Lever, and Workday</strong>.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl font-bold text-green-600">
              2
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Fill In Your Details
            </h3>
            <p className="text-muted-foreground">
              Add your experience, education, skills, and projects. The{' '}
              <strong>live preview updates in real time</strong> as you type, so
              you always see exactly what recruiters will see. Your data{' '}
              <strong>auto-saves to your browser</strong> — no risk of losing
              work.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-xl font-bold text-purple-600">
              3
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Download Your PDF
            </h3>
            <p className="text-muted-foreground">
              Click download and get a{' '}
              <strong>print-ready PDF in under 5 seconds</strong>. The file is
              generated entirely in your browser — nothing is uploaded to any
              server. You can also <strong>share via a unique link</strong> with
              all data encoded in the URL.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
