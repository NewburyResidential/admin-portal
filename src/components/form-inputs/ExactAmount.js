import React from 'react';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

export default function ExactAmount({ 
  label = 'Amount',
  value = '',
  onChange,
  error,
  helperText 
}) {
  const handleNumberInput = (input) => {
    // Remove any non-digit characters except decimal point
    const cleaned = input.replace(/[^\d.]/g, '');
    // Ensure only one decimal point
    const parts = cleaned.split('.');
    if (parts.length > 2) return `${parts[0]  }.${  parts[1]}`;
    // Limit to 2 decimal places
    if (parts[1]?.length > 2) return `${parts[0]  }.${  parts[1].slice(0, 2)}`;
    return cleaned;
  };

  return (
    <FormControl error={!!error} fullWidth variant="outlined">
      <TextField
        label={label}
        value={value}
        onChange={(e) => {
          const formattedValue = handleNumberInput(e.target.value);
          if (onChange) {
            onChange(formattedValue);
          }
        }}
        error={!!error}
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
} 