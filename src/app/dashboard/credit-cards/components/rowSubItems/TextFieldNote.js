import TextField from '@mui/material/TextField';
import { useFormContext, Controller } from 'react-hook-form';

export default function TextFieldNote({ baseFieldName }) {
  const { control } = useFormContext();

  const fieldName = `${baseFieldName}.note`;
  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field }) => (
        <TextField 
          {...field} 
          autoComplete="off" 
          fullWidth 
          label="Notes" 
          variant="outlined" 
        />
      )}
    />
  );
}