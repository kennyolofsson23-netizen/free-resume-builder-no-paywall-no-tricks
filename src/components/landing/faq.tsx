const faqs = [
  {
    question: 'Is this really free?',
    answer:
      'Yes. No credit card, no trial, no paywall. The PDF download is free. The templates are free. Everything is free.',
  },
  {
    question: 'Do I need to create an account?',
    answer:
      "No. The builder works instantly. Your data is saved automatically to your browser's localStorage.",
  },
  {
    question: 'Is my resume data private?',
    answer:
      'Yes. Your data never leaves your browser. We have no server, no database. We literally cannot see your resume.',
  },
  {
    question: 'What happens to my resume if I close the browser?',
    answer:
      'It is automatically saved to localStorage and restored when you return.',
  },
  {
    question: 'Can I use the resume for any job?',
    answer:
      'Yes. All templates are ATS-compatible, meaning they work with applicant tracking systems used by most companies.',
  },
  {
    question: 'How is this different from Zety or Resume.io?',
    answer:
      "Zety and Resume.io show you a preview for free, then ask for your credit card to download. We don't do that. Ever.",
  },
]

export function FAQ() {
  return (
    <section className="border-t border-border px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="rounded-lg border border-border bg-card p-6"
            >
              <h3 className="mb-3 text-lg font-semibold text-foreground">
                {faq.question}
              </h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
