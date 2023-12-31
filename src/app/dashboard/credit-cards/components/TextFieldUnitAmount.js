import TextField from '@mui/material/TextField';

export default function TextFieldUnitAmount({allocation}) {
  const currentValue = allocation?.amount ? allocation.amount : 0
  return (
    <TextField
      label='Amount'
      value={currentValue}
      disabled
      variant="outlined"
      autoComplete="off"
      fullWidth
    />
  )
}
