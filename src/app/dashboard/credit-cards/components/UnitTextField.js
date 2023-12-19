import { TextField } from '@mui/material'
import React from 'react'
import { isIncorrectAmounts } from 'src/utils/missing-value'

export default function UnitTextField({item, allocation}) {
    console.log(allocation)
  return (
    <TextField
      label={'Units'}
      value={'0'}
      disabled={true}
      variant="outlined"
      autoComplete="off"
      error={item?.isSubmitted && isIncorrectAmounts(item)}
    />
  )
}
