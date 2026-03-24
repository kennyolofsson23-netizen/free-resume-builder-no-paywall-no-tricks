export function ComparisonTable() {
  return (
    <section className="border-t border-border px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-foreground">
          Why ATS Compatibility Matters
        </h2>
        <p className="mb-12 text-center text-muted-foreground">
          Over <strong>75% of resumes</strong> are rejected by applicant
          tracking systems before a human ever reads them. Here is how our
          builder compares to popular alternatives.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 font-semibold text-foreground">
                  Feature
                </th>
                <th className="px-4 py-3 font-semibold text-foreground">
                  Free Resume Builder
                </th>
                <th className="px-4 py-3 font-semibold text-muted-foreground">
                  Zety
                </th>
                <th className="px-4 py-3 font-semibold text-muted-foreground">
                  Resume.io
                </th>
                <th className="px-4 py-3 font-semibold text-muted-foreground">
                  Canva
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="px-4 py-3 font-medium text-foreground">
                  Free PDF download
                </td>
                <td className="px-4 py-3 text-green-600 dark:text-green-400">
                  <strong>Yes — always</strong>
                </td>
                <td className="px-4 py-3 text-red-600 dark:text-red-400">
                  No — $29.99/mo
                </td>
                <td className="px-4 py-3 text-red-600 dark:text-red-400">
                  No — $7.99/mo
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  Limited — Pro for premium
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 font-medium text-foreground">
                  Account required
                </td>
                <td className="px-4 py-3 text-green-600 dark:text-green-400">
                  <strong>No</strong>
                </td>
                <td className="px-4 py-3 text-red-600 dark:text-red-400">
                  Yes
                </td>
                <td className="px-4 py-3 text-red-600 dark:text-red-400">
                  Yes
                </td>
                <td className="px-4 py-3 text-red-600 dark:text-red-400">
                  Yes (Google)
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 font-medium text-foreground">
                  ATS-compatible templates
                </td>
                <td className="px-4 py-3 text-green-600 dark:text-green-400">
                  <strong>5 templates — all ATS-safe</strong>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  Yes — paid only
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  Yes — paid only
                </td>
                <td className="px-4 py-3 text-red-600 dark:text-red-400">
                  Most use images — not ATS-safe
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 font-medium text-foreground">
                  Data privacy
                </td>
                <td className="px-4 py-3 text-green-600 dark:text-green-400">
                  <strong>100% local — no server</strong>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  Stored on their servers
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  Stored on their servers
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  Stored on Google servers
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 font-medium text-foreground">
                  Works offline
                </td>
                <td className="px-4 py-3 text-green-600 dark:text-green-400">
                  <strong>Yes</strong>
                </td>
                <td className="px-4 py-3 text-red-600 dark:text-red-400">
                  No
                </td>
                <td className="px-4 py-3 text-red-600 dark:text-red-400">
                  No
                </td>
                <td className="px-4 py-3 text-red-600 dark:text-red-400">
                  No
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-foreground">
                  Real-time preview
                </td>
                <td className="px-4 py-3 text-green-600 dark:text-green-400">
                  <strong>Yes — instant</strong>
                </td>
                <td className="px-4 py-3 text-muted-foreground">Yes</td>
                <td className="px-4 py-3 text-muted-foreground">Yes</td>
                <td className="px-4 py-3 text-muted-foreground">Yes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
