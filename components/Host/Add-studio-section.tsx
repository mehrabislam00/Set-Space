import React from 'react'

interface AddStudioSectionProps {
  step: number
  title: string
  hint?: string
  children: React.ReactNode
}

const AddStudioSection = ({ step, title, hint, children }: AddStudioSectionProps) => {
  return (
    <section className='grid gap-6 border-t border-border pt-10 first:border-t-0 first:pt-0 md:grid-cols-[200px_1fr] md:gap-10'>
      <div className='space-y-1.5'>
        <p className='text-xs font-medium uppercase tracking-[0.2em] text-primary'>
          Step {step}
        </p>
        <h2 className='text-lg font-semibold tracking-tight'>{title}</h2>
      </div>
      <div className='min-w-0 space-y-5'>
        {children}
        {hint ? <p className='text-xs text-muted-foreground'>{hint}</p> : null}
      </div>
    </section>
  )
}

export default AddStudioSection