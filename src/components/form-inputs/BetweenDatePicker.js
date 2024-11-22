import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import { fDate, fToLocaleDate } from 'src/utils/format-time';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';

export default function DatePicker({ 
  fromLabel = 'From Date',
  toLabel = 'To Date',
  views = ['year', 'month', 'day'],
  value = { from: null, to: null },
  onChange,
  error,
  helperText 
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack direction="row" spacing={2}>
        <FormControl error={!!error} fullWidth variant="outlined">
          <MuiDatePicker
            views={views}
            value={value.from ? fToLocaleDate(value.from) : null}
            label={fromLabel}
            slotProps={{ textField: { variant: 'outlined', error: !!error } }}
            onChange={(date) => {
              const isValidDate = date instanceof Date && !Number.isNaN(date.getTime());
              const formattedDate = isValidDate ? fDate(date) : null;
              if (onChange) {
                onChange({ from: formattedDate, to: value.to });
              }
            }}
          />
          {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>

        <FormControl error={!!error} fullWidth variant="outlined">
          <MuiDatePicker
            views={views}
            value={value.to ? fToLocaleDate(value.to) : null}
            label={toLabel}
            slotProps={{ textField: { variant: 'outlined', error: !!error } }}
            onChange={(date) => {
              const isValidDate = date instanceof Date && !Number.isNaN(date.getTime());
              const formattedDate = isValidDate ? fDate(date) : null;
              if (onChange) {
                onChange({ from: value.from, to: formattedDate });
              }
            }}
            minDate={value.from ? fToLocaleDate(value.from) : undefined}
          />
          {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
      </Stack>
    </LocalizationProvider>
  );
}