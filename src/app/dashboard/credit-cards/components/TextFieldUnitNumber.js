import TextField from '@mui/material/TextField';

export default function TextFieldUnitNumber({allocation}) {
  const currentValue = allocation?.asset ? allocation.asset.units : 0
  return (
    <TextField
      label={'Units'}
      value={currentValue}
      disabled={true}
      variant="outlined"
      autoComplete="off"
      fullWidth={true}
    />
  )
}
