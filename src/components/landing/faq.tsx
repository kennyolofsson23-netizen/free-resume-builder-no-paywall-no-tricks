import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'

const faqs = [
  {
    question: 'Is this actually free, or is there a catch?',
    answer:
      'No catch. No credit card. No trial period that auto-renews. The PDF download is free. All five templates are free. Sharing your resume is free. We make money through optional partner links — never by charging you.',
  },
  {
    question: 'Do I need to create an account?',
    answer:
      "No. Open the builder and start typing. Your work saves automatically to your browser's local storage, so it's still there when you come back — no login required.",
  },
  {
    question: 'Is my resume data private?',
    answer:
      "Yes. Your resume lives entirely in your browser. We have no server, no database, and no way to access your data. When you close the tab, your information doesn't go anywhere except your own device.",
  },
  {
    question: 'What if I close the tab or lose my internet connection?',
    answer:
      'Your resume is automatically saved to your browser as you type. When you return to the page — even after closing your laptop — it picks up exactly where you left off. No internet needed after the initial load.',
  },
  {
    question: 'Will my resume get past applicant tracking systems (ATS)?',
    answer:
      'Yes. All five templates are ATS-compatible: the text is fully selectable, sections use standard headings, and nothing is rendered as an image. Your resume will parse correctly through systems like Taleo, Greenhouse, Lever, and Workday.',
  },
  {
    question: 'How is this different from Zety or Resume.io?',
    answer:
      "Zety and Resume.io let you build your resume for free, then lock the PDF behind a $29.99/month subscription. You only find out at the last step, after you've invested real time. We never do that — the download is always free, no matter what.",
  },
  {
    question: 'Can I share my resume with someone else?',
    answer:
      'Yes. Hit the Share button in the builder and a link is generated instantly. Anyone with the link can view your resume — read-only, no account needed. All the data is encoded in the URL itself, so nothing is ever sent to a server.',
  },
]

export function FAQ() {
  return (
    <section className="border-t border-border px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground">
          Frequently Asked Questions
        </h2>

        <Accordion type="multiple" className="rounded-lg border border-border bg-card px-6">
          {faqs.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger className="text-base font-semibold text-foreground">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
