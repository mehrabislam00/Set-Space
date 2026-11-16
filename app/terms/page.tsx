import React from 'react'

const TERMS_SECTIONS = [
  {
    id: 'using-setspace',
    title: 'Using SetSpace',
    content:
      'SetSpace is a marketplace that connects renters with independent studio hosts. You must be 18 or older to book or host.',
  },
  {
    id: 'bookings',
    title: 'Bookings',
    content:
      'A booking request becomes a confirmed booking once the host accepts it. Prices shown include the hourly rate and service fee.',
  },
  {
    id: 'cancellations',
    title: 'Cancellations',
    content:
      'Each studio sets a cancellation policy (Flexible, Moderate or Strict). Refunds follow the policy shown on the listing.',
  },
  {
    id: 'host-responsibilities',
    title: 'Host responsibilities',
    content:
      'Hosts must describe their spaces accurately, keep them safe, and honor confirmed bookings.',
  },
  {
    id: 'renter-responsibilities',
    title: 'Renter responsibilities',
    content:
      'Renters must follow studio rules, respect capacity limits, and leave spaces as they found them.',
  },
]

const Term = () => {
  return (
    <div className='mx-auto max-w-3xl px-4 py-12 md:py-16'>
      {/* Header */}
      <div className='space-y-2'>
        <p className='text-xs font-medium uppercase tracking-[0.2em] text-primary'>Legal</p>
        <h1 className='text-3xl font-bold tracking-tight md:text-4xl'>Terms of Service</h1>
        <p className='text-sm text-muted-foreground'>Last updated November 1, 2026</p>
      </div>

      {/* Contents */}
      <nav className='mt-8 rounded-2xl border border-border bg-card/50 p-6'>
        <p className='font-semibold'>Contents</p>
        <ol className='mt-3 space-y-1'>
          {TERMS_SECTIONS.map((section, index) => (
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
        </ol>
      </nav>

      {/* Sections */}
      <div className='mt-12 space-y-10'>
        {TERMS_SECTIONS.map((section) => (
          <section key={section.id} id={section.id} className='scroll-mt-24 space-y-3'>
            <h2 className='text-xl font-bold tracking-tight'>{section.title}</h2>
            <p className='leading-relaxed text-muted-foreground'>{section.content}</p>
          </section>
        ))}
      </div>

      {/* Disclaimer */}
      <p className='mt-12 text-xs text-muted-foreground/70'>
        This is sample policy text for a demo and is not legal advice.
      </p>
    </div>
  )
}

export default Term