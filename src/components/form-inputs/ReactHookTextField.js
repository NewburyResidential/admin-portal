import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';

//TODO modify to liking

export default function ReactHookTextField({ label, name, type = 'text', disabled = false, onChange }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <FormControl error={!!error} fullWidth variant="outlined">
            <>
              <TextField
                {...field}
                type={type}
                label={label}
                variant="outlined"
                fullWidth
                disabled={disabled}
                onChange={(event) => {
                  field.onChange(event);
                  if (onChange) {
                    onChange(event);
                  }
                }}
              />
              {error && <FormHelperText>{error.message}</FormHelperText>}
            </>
          </FormControl>
        );
      }}
    />
  );
}
