import AddStudioForm from '@/components/Host/Add-studio-form'
import AddStudioHeader from '@/components/Host/Add-studio-header'
import React from 'react'


const AddStudio = () => {
  return (
    <div className='space-y-8'>
      <AddStudioHeader />
      <AddStudioForm />
    </div>
  )
}

export default AddStudio