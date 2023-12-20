import { TextField } from '@mui/material'

export default function TextFieldUnitAmount({allocation}) {
  const currentValue = allocation?.amount ? allocation.amount : 0
  return (
    <TextField
      label={'Amount'}
      value={currentValue}
      disabled={true}
      variant="outlined"
      autoComplete="off"
    />
  )
}
