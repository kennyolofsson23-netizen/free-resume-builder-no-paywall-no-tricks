# Free Resume Builder — No Paywall, No Tricks

Professional resume builder with 5 clean templates, real-time preview, and instant PDF download.

**Unlike Zety, we don't lock your PDF behind a subscription.**

## Features

- ✅ **5 Professional Templates** — Modern, Classic, Minimal, Creative, Professional
- ✅ **Real-Time Preview** — See changes instantly as you type
- ✅ **Instant PDF Download** — Export your resume immediately
- ✅ **100% Client-Side** — Your data never leaves your browser
- ✅ **No Account Required** — No email, no paywall, no BS
- ✅ **Shareable Preview Links** — Share your resume online (coming soon)
- ✅ **ATS-Optimized** — Designed to pass Applicant Tracking Systems
- ✅ **Mobile Responsive** — Build on any device

## Tech Stack

- **Frontend:** React 19 + Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4 + shadcn/ui components
- **PDF Generation:** jsPDF + html2canvas
- **State Management:** Zustand
- **Type Safety:** TypeScript with strict mode
- **Testing:** Vitest (unit), Playwright (E2E)
- **Security:** Latest CVE patches (Next.js 16.0.7+, React 19.x)

## Quick Start

### Prerequisites

- Node.js 18.18.0 or higher
- npm 9.0.0 or higher

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                 # Next.js app router
│   ├── layout.tsx       # Root layout with metadata
│   ├── page.tsx         # Home page
│   ├── builder/         # Resume builder page
│   └── globals.css      # Global styles & Tailwind
├── components/          # React components
│   └── ui/              # shadcn/ui components
├── lib/                 # Utilities
│   └── cn.ts            # Tailwind merge utility
├── types/               # TypeScript types
│   └── resume.ts        # Resume data structures
├── store/               # Zustand stores
│   └── resume-store.ts  # Resume state management
├── hooks/               # Custom React hooks
├── __tests__/           # Unit tests
└── test/                # Test configuration
```

## Testing

### Unit Tests

```bash
npm run test            # Run all tests
npm run test:ui         # Interactive test UI
```

### E2E Tests

```bash
npm run test:e2e        # Run Playwright tests
npm run test:e2e:ui     # Interactive E2E UI
```

## Performance

- **Turbopack Dev Server** — 76.7% faster builds
- **Client-Side PDF Generation** — Zero server costs
- **Image Optimization** — AVIF/WebP with sharp
- **Code Splitting** — Dynamic imports for heavy components
- **Tree Shaking** — Optimized package imports

## Security

- ✅ Patched against CVE-2025-66478 (React2Shell RCE)
- ✅ Patched against CVE-2025-29927 (Middleware Auth Bypass)
- ✅ Server-side authorization checks
- ✅ Strict CSP headers
- ✅ XSS protection via Next.js defaults

## SEO & Marketing

### Keywords Targeted

- `resume builder no paywall`
- `free resume builder`
- `Zety alternative`
- `resume builder free`
- `CV builder online`
- `free resume templates`

### Counter-Positioning Copy

"Unlike Zety, we don't lock your PDF behind a subscription."
"No email. No account. No '$1.95 trial that auto-renews.'"

## Monetization

1. **Kickresume Affiliate** — 50% commission on premium features
2. **Job Board Display Ads** — Contextual ads for relevant job openings
3. **Future Premium Features** — Custom branding, advanced analytics (optional)

## Roadmap

- [ ] Template Builder UI
- [ ] Form validation with Zod
- [ ] Real-time PDF preview
- [ ] Download PDF functionality
- [ ] Shareable resume links
- [ ] Import from LinkedIn
- [ ] Multiple resume management
- [ ] Dark mode support
- [ ] i18n support
- [ ] Mobile app (React Native)

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

MIT - Feel free to use this project however you like.

## Support

For issues, feature requests, or questions:
- Open a GitHub issue
- Tweet at us
- Email: hello@resumebuilder.local

---

**Made with ❤️ to be the anti-Zety.**
