import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Autocomplete, TextField, Checkbox, Typography, Box } from '@mui/material';
import { highlightText } from '../utils/modify-text';

export default function ReactHookSelectEmployees({ name, employees, multiple = false, label = 'Select Employee', placeholder = null }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Autocomplete
          fullWidth
          multiple={multiple}
          id="autocomplete-select-employees"
          options={employees}
          getOptionLabel={(employee) => `${employee.fullName}`}
          value={
            multiple
              ? employees.filter((employee) => value.includes(employee.pk))
              : employees.find((employee) => employee.pk === value) || null
          }
          onChange={(event, newValue) => {
            if (multiple) {
              onChange(newValue.map((employee) => employee.pk));
            } else {
              onChange(newValue ? newValue.pk : null);
            }
          }}
          disableCloseOnSelect={multiple}
          isOptionEqualToValue={(option, optionValue) => optionValue === null || option.pk === optionValue.pk}
          renderOption={(props, option, { inputValue, selected }) => {
            // eslint-disable-next-line no-unused-vars
            const { key, ...otherProps } = props;

            return (
              <Box
                key={option.pk}
                component="li"
                {...otherProps}
                sx={{
                  backgroundColor: selected ? '#ECE8EA' : option.status === 'Terminated' ? 'rgba(255, 0, 0, 0.1)' : 'inherit',
                }}
              >
                {multiple && <Checkbox checked={selected} />}
                <Box ml={1}>
                  <Typography variant="body1" sx={{ width: '500px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {highlightText(option.fullName, inputValue)}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ width: '500px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.70rem' }}
                  >
                    {highlightText(`${option.jobTitle} (${option.costCenter1Label})`, inputValue)}
                  </Typography>
                </Box>
              </Box>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              placeholder={placeholder && placeholder}
              error={!!error}
              helperText={error ? error.message : ''}
            />
          )}
          filterOptions={(options, { inputValue }) =>
            options.filter(
              (option) =>
                option.fullName.toLowerCase().includes(inputValue.toLowerCase()) ||
                option.jobTitle.toLowerCase().includes(inputValue.toLowerCase()) ||
                option.costCenter1Label.toLowerCase().includes(inputValue.toLowerCase())
            )
          }
        />
      )}
    />
  );
}
