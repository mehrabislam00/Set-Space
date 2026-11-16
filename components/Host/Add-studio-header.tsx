import React from 'react'

const AddStudioHeader = () => {
  return (
    <div className='space-y-2'>
      <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>Add a new studio</h1>
      <p className='text-sm text-muted-foreground'>
        Fields marked <span className='text-primary'>*</span> are required to publish. Drafts
        can be saved anytime.
      </p>
    </div>
  )
}

export default AddStudioHeader