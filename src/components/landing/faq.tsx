'use client'

import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

const faqs = [
  {
    question: 'Is this really free?',
    answer:
      'Yes, always. There is no premium tier, no subscription, no "freemium" bait-and-switch. Every feature — including PDF download — is completely free. We earn through optional affiliate links, not by locking your resume behind a paywall.',
  },
  {
    question: 'How is my resume data stored?',
    answer:
      'Your resume data is stored in your browser\'s localStorage only. It is never sent to a server, never uploaded to the cloud, and never shared with third parties. Clearing your browser data will remove it — we recommend downloading your PDF regularly.',
  },
  {
    question: 'Is this better than Zety?',
    answer:
      'We don\'t charge you. Zety shows you a finished resume then requires a subscription to download it. We never do that. You can download your PDF at any point, for free, with no account. Whether the templates are "better" is subjective — but the price difference is not.',
  },
  {
    question: 'Are templates ATS-compatible?',
    answer:
      'Yes. All five templates use standard HTML text — no images, no text boxes, no columns that confuse ATS parsers. Your resume will parse cleanly through Greenhouse, Lever, Workday, and similar systems.',
  },
  {
    question: 'Can I share my resume?',
    answer:
      'Yes. Use the "Share" button in the builder to generate a shareable link. The link encodes your resume data in the URL itself (no server storage), so anyone with the link can view your resume. The link works as long as the URL is intact.',
  },
  {
    question: 'What templates are available?',
    answer:
      'Five templates: Modern (bold and minimal), Classic (traditional layout), Minimal (lots of whitespace), Creative (two-column sidebar), and Professional (structured for senior roles). All are ATS-friendly and all are free.',
  },
  {
    question: 'Do I need to create an account?',
    answer:
      'No. The builder works immediately in your browser with no sign-up required. We never ask for your email address. You will never receive marketing emails from us because we have no way to contact you — and we prefer it that way.',
  },
]

export function FAQ() {
  return (
    <section className="border-t border-border px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-foreground">
          Frequently Asked Questions
        </h2>
        <p className="mb-10 text-center text-muted-foreground">
          Honest answers — no marketing fluff.
        </p>

        <Accordion.Root type="multiple" className="space-y-2">
          {faqs.map((faq, index) => (
            <Accordion.Item
              key={index}
              value={`item-${index}`}
              className="rounded-lg border border-border bg-card"
            >
              <Accordion.Header>
                <Accordion.Trigger
                  className={cn(
                    'flex w-full items-center justify-between px-5 py-4 text-left font-medium text-foreground',
                    'transition-colors hover:bg-muted/50',
                    'data-[state=open]:rounded-t-lg',
                    '[&[data-state=open]>svg]:rotate-180'
                  )}
                >
                  {faq.question}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <p className="px-5 pb-4 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  )
}
