import React from 'react'
import Link from 'next/link'

const PRIVACY_SECTIONS = [
  {
    id: 'information-we-collect',
    title: 'Information we collect',
    content:
      'Account details you provide (name, email, phone), booking history, studio listings, and basic device data used to keep SetSpace secure.',
  },
  {
    id: 'how-we-use-it',
    title: 'How we use it',
    content:
      'To run bookings, connect renters and hosts, send the notifications you choose, and improve the service.',
  },
  {
    id: 'sharing',
    title: 'Sharing',
    content:
      'We share booking details only between the renter and host involved. We never sell your personal data.',
  },
  {
    id: 'your-choices',
    title: 'Your choices',
    content:
      'You can edit your profile, change notification preferences, or request account deletion at any time from Settings.',
  },
]

const Privacy = () => {
  return (
    <div className='mx-auto max-w-3xl px-4 py-12 md:py-16'>
      {/* Header */}
      <div className='space-y-2'>
        <p className='text-xs font-medium uppercase tracking-[0.2em] text-primary'>Legal</p>
        <h1 className='text-3xl font-bold tracking-tight md:text-4xl'>Privacy Policy</h1>
        <p className='text-sm text-muted-foreground'>Last updated November 1, 2026</p>
      </div>

      {/* Contents */}
      <nav className='mt-8 rounded-2xl border border-border bg-card/50 p-6'>
        <p className='font-semibold'>Contents</p>
        <ol className='mt-3 space-y-1'>
          {PRIVACY_SECTIONS.map((section, index) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className='flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary'
              >
                <span className='tabular-nums'>{index + 1}.</span>
                {section.title}
              </a>
            </li>
          ))}
          <li>
            <a
              href='#contact'
              className='flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary'
            >
              <span className='tabular-nums'>{PRIVACY_SECTIONS.length + 1}.</span>
              Contact
            </a>
          </li>
        </ol>
      </nav>

      {/* Sections */}
      <div className='mt-12 space-y-10'>
        {PRIVACY_SECTIONS.map((section) => (
          <section key={section.id} id={section.id} className='scroll-mt-24 space-y-3'>
            <h2 className='text-xl font-bold tracking-tight'>{section.title}</h2>
            <p className='leading-relaxed text-muted-foreground'>{section.content}</p>
          </section>
        ))}

        <section id='contact' className='scroll-mt-24 space-y-3'>
          <h2 className='text-xl font-bold tracking-tight'>Contact</h2>
          <p className='leading-relaxed text-muted-foreground'>
            Questions about privacy? Reach us through the{' '}
            <Link
              href='/contact'
              className='font-medium text-primary transition-colors hover:underline'
            >
              Contact page
            </Link>
            .
          </p>
        </section>
      </div>

      {/* Disclaimer */}
      <p className='mt-12 text-xs text-muted-foreground/70'>
        This is sample policy text for a demo and is not legal advice.
      </p>
    </div>
  )
}

export default Privacy