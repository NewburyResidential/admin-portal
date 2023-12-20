import { TextField } from '@mui/material'
import React from 'react'

export default function TextFieldUnitNumber({allocation}) {
  const currentValue = allocation?.asset ? allocation.asset.units : 0
  return (
    <TextField
      label={'Units'}
      value={currentValue}
      disabled={true}
      variant="outlined"
      autoComplete="off"

    />
  )
}
