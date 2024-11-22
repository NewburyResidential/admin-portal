import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import { fDate, fToLocaleDate } from 'src/utils/format-time';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';

export default function ExactDatePicker({ 
  label = 'Select Date',
  views = ['year', 'month', 'day'],
  value = null,
  onChange,
  error,
  helperText 
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormControl error={!!error} fullWidth variant="outlined">
        <MuiDatePicker
          views={views}
          value={value ? fToLocaleDate(value) : null}
          label={label}
          slotProps={{ textField: { variant: 'outlined', error: !!error } }}
          onChange={(date) => {
            const isValidDate = date instanceof Date && !Number.isNaN(date.getTime());
            const formattedDate = isValidDate ? fDate(date) : null;
            if (onChange) {
              onChange(formattedDate);
            }
          }}
        />
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </LocalizationProvider>
  );
} 