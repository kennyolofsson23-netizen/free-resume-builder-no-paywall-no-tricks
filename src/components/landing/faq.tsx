import type { ReactNode } from 'react'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

const faqs: { question: string; answer: ReactNode }[] = [
  {
    question: 'Is this actually free, or is there a catch?',
    answer: (
      <p className="text-muted-foreground">
        No catch. No credit card. No trial period that auto-renews.{' '}
        <strong>The PDF download is free.</strong> All five templates are free.
        Sharing your resume is free. We make money through optional partner
        links — never by charging you.
      </p>
    ),
  },
  {
    question: 'Do I need to create an account?',
    answer: (
      <p className="text-muted-foreground">
        No. Open the builder and start typing. Your work saves automatically to
        your browser&apos;s <strong>local storage</strong>, so it&apos;s still
        there when you come back — no login required.
      </p>
    ),
  },
  {
    question: 'Is my resume data private?',
    answer: (
      <p className="text-muted-foreground">
        Yes. Your resume lives entirely <strong>in your browser</strong>. We
        have no server, no database, and no way to access your data. When you
        close the tab, your information doesn&apos;t go anywhere except your
        own device. See our{' '}
        <a href="/privacy" className="underline hover:text-foreground transition-colors">
          Privacy Policy
        </a>{' '}
        for details.
      </p>
    ),
  },
  {
    question: 'What if I close the tab or lose my internet connection?',
    answer: (
      <p className="text-muted-foreground">
        Your resume is <strong>automatically saved</strong> to your browser as
        you type. When you return to the page — even after closing your laptop
        — it picks up exactly where you left off. No internet needed after the
        initial load.
      </p>
    ),
  },
  {
    question: 'Will my resume get past applicant tracking systems (ATS)?',
    answer: (
      <p className="text-muted-foreground">
        Yes. All five templates are <strong>ATS-compatible</strong>: the text
        is fully selectable, sections use standard headings, and nothing is
        rendered as an image. Your resume will parse correctly through systems
        like <strong>Taleo</strong>, <strong>Greenhouse</strong>,{' '}
        <strong>Lever</strong>, and <strong>Workday</strong>.
      </p>
    ),
  },
  {
    question: 'How is this different from Zety or Resume.io?',
    answer: (
      <p className="text-muted-foreground">
        <strong>Zety</strong> and <strong>Resume.io</strong> let you build your
        resume for free, then lock the PDF behind a $29.99/month subscription.
        You only find out at the last step, after you&apos;ve invested real
        time. We never do that — the{' '}
        <strong>download is always free</strong>, no matter what.
      </p>
    ),
  },
  {
    question: 'Can I share my resume with someone else?',
    answer: (
      <p className="text-muted-foreground">
        Yes. Hit the Share button in the builder and a link is generated
        instantly. Anyone with the link can view your resume — read-only, no
        account needed. All the data is{' '}
        <strong>encoded in the URL itself</strong>, so nothing is ever sent to
        a server.
      </p>
    ),
  },
]

export function FAQ() {
  return (
    <section className="border-t border-border px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground">
          Frequently Asked Questions
        </h2>

        <Accordion
          type="multiple"
          className="rounded-lg border border-border bg-card px-6"
        >
          {faqs.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger className="text-base font-semibold text-foreground">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* SSR-visible FAQ answers for AI crawlers — Radix accordion renders
            answers with hidden="" so crawlers cannot read them */}
        <div className="sr-only" aria-hidden="true">
          <dl>
            <dt>Is this actually free, or is there a catch?</dt>
            <dd>
              No catch. No credit card. No trial period that auto-renews. The
              <strong> PDF download is free</strong>. All five templates are
              free. Sharing your resume is free. We make money through optional
              partner links — never by charging you.
            </dd>
            <dt>Do I need to create an account?</dt>
            <dd>
              No. Open the builder and start typing. Your work saves
              automatically to your browser&apos;s <strong>local storage</strong>
              , so it&apos;s still there when you come back — no login required.
            </dd>
            <dt>Is my resume data private?</dt>
            <dd>
              Yes. Your resume lives entirely <strong>in your browser</strong>.
              We have no server, no database, and no way to access your data.
              When you close the tab, your information stays on your own device
              only.
            </dd>
            <dt>What if I close the tab or lose my internet connection?</dt>
            <dd>
              Your resume is <strong>automatically saved</strong> to your
              browser as you type. When you return to the page — even after
              closing your laptop — it picks up exactly where you left off. No
              internet needed after the initial load.
            </dd>
            <dt>Will my resume get past applicant tracking systems (ATS)?</dt>
            <dd>
              Yes. All five templates are <strong>ATS-compatible</strong>: the
              text is fully selectable, sections use standard headings, and
              nothing is rendered as an image. Your resume will parse correctly
              through systems like <strong>Taleo</strong>,{' '}
              <strong>Greenhouse</strong>, <strong>Lever</strong>, and{' '}
              <strong>Workday</strong>.
            </dd>
            <dt>How is this different from Zety or Resume.io?</dt>
            <dd>
              <strong>Zety</strong> charges $29.99/month and{' '}
              <strong>Resume.io</strong> charges $7.99/month to download your
              PDF. You only find out at the last step, after you&apos;ve
              invested real time. We never do that — the{' '}
              <strong>download is always free</strong>, no matter what.
            </dd>
            <dt>Can I share my resume with someone else?</dt>
            <dd>
              Yes. Hit the Share button in the builder and a link is generated
              instantly. Anyone with the link can view your resume — read-only,
              no account needed. All the data is{' '}
              <strong>encoded in the URL itself</strong>, so nothing is ever
              sent to a server.
            </dd>
          </dl>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Built by{' '}
          <a
            href="https://usetools.dev"
            className="underline hover:text-foreground transition-colors"
          >
            usetools.dev
          </a>{' '}
          &mdash; free tools, no paywalls, no tricks.
        </p>
      </div>
    </section>
  )
}
