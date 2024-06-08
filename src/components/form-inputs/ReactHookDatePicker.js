import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { fDate, fToLocaleDate } from 'src/utils/format-time';

import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';

export default function ReactHookDatePicker({ label = 'Date', views = ['year', 'month', 'day'], name, onChange }) {
  const { control } = useFormContext();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => {
          return (
            <FormControl error={!!error} fullWidth variant="outlined">
              <DatePicker
                {...field}
                views={views}
                value={field.value ? fToLocaleDate(field.value) : null}
                label={label}
                slotProps={{ textField: { variant: 'outlined', error: !!error } }}
                onChange={(date) => {
                  const isValidDate = date instanceof Date && !isNaN(date.getTime());
                  const formattedDate = isValidDate ? fDate(date) : date;
                  field.onChange(formattedDate);
                  onChange && onChange(formattedDate);
                }}
              />
              {error && <FormHelperText>{error.message}</FormHelperText>}
            </FormControl>
          );
        }}
      />
    </LocalizationProvider>
  );
}
