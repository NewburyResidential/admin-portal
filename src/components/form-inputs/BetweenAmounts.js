import React from 'react';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

export default function BetweenAmounts({
  fromLabel = 'From Amount',
  toLabel = 'To Amount',
  value = { from: '', to: '' },
  onChange,
  error,
  helperText,
}) {
  const handleNumberInput = (input) => {
    // Allow empty string
    if (input === '') return '';

    // Remove any non-digit characters except decimal point
    const cleaned = input.replace(/[^\d.]/g, '');
    // Ensure only one decimal point
    const parts = cleaned.split('.');
    if (parts.length > 2) return `${parts[0]  }.${  parts[1]}`;
    // Limit to 2 decimal places
    if (parts[1]?.length > 2) return `${parts[0]  }.${  parts[1].slice(0, 2)}`;
    return cleaned;
  };

  const handleFromChange = (e) => {
    const formattedValue = handleNumberInput(e.target.value);
    if (onChange) {
      onChange({
        from: formattedValue,
        to: value.to,
      });
    }
  };

  const handleToChange = (e) => {
    const formattedValue = handleNumberInput(e.target.value);
    if (onChange) {
      onChange({
        from: value.from,
        to: formattedValue,
      });
    }
  };

  return (
    <Stack direction="row" spacing={2}>
      <FormControl error={!!error} fullWidth variant="outlined">
        <TextField
          label={fromLabel}
          value={value.from}
          onChange={handleFromChange}
          error={!!error || (value.from && value.to && parseFloat(value.to) < parseFloat(value.from))}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>

      <FormControl error={!!error} fullWidth variant="outlined">
        <TextField
          label={toLabel}
          value={value.to}
          onChange={handleToChange}
          error={!!error || (value.from && value.to && parseFloat(value.to) < parseFloat(value.from))}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </Stack>
  );
}
