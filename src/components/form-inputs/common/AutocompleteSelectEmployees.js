import React, { useState, useMemo } from 'react';
import { Autocomplete, TextField, Checkbox, Typography, Box } from '@mui/material';
import { highlightText } from '../utils/modify-text';

//TODO: Add highlightText to the fullName, jobTitle, and costCenter1Label
export default function AutocompleteSelectEmployees({
  employees,
  multiple = false,
  label = 'Select Employee',
  placeholder = null,
  currentValue,
  onChange,
}) {
  const [currentInputValue, setCurrentInputValue] = useState('');

  const minimalEmployees = useMemo(
    () =>
      employees.map(({ pk, fullName, jobTitle, costCenter1Label }) => ({
        pk,
        fullName,
        jobTitle,
        costCenter1Label,
      })),
    [employees]
  );

  const handleChange = (event, newValue) => {
    if (multiple) {
      onChange?.(newValue.map((employee) => employee.pk));
    } else {
      onChange?.(newValue?.pk || null);
    }
  };

  const selectedEmployees = useMemo(() => {
    if (multiple) {
      return minimalEmployees.filter((employee) => currentValue?.includes(employee.pk)) || [];
    }
    return minimalEmployees.find((employee) => employee.pk === currentValue) || null;
  }, [currentValue, minimalEmployees, multiple]);

  return (
    <Autocomplete
      fullWidth
      multiple={multiple}
      id="autocomplete-select-employees"
      options={minimalEmployees}
      getOptionLabel={(employee) => employee.fullName || ''}
      value={selectedEmployees}
      onChange={handleChange}
      inputValue={currentInputValue}
      onInputChange={(event, newInputValue) => setCurrentInputValue(newInputValue)}
      disableCloseOnSelect={multiple}
      isOptionEqualToValue={(option, optionValue) => option.pk === optionValue?.pk}
      renderOption={(props, option, { selected }) => {
        // eslint-disable-next-line no-unused-vars
        const { key: _key, ...otherProps } = props;

        return (
          <Box
            {...otherProps}
            key={option.pk}
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: selected ? '#ECE8EA' : 'inherit',
            }}
          >
            {multiple && <Checkbox key={`checkbox-${option.pk}`} checked={selected} />}
            <Box key={`content-${option.pk}`} ml={1}>
              <Typography key={`name-${option.pk}`} variant="body1">
                {highlightText(option.fullName, currentInputValue)}
              </Typography>
              <Typography key={`details-${option.pk}`} variant="body2" sx={{ fontSize: '0.70rem' }}>
                {highlightText(`${option.jobTitle} (${option.costCenter1Label})`, currentInputValue)}
              </Typography>
            </Box>
          </Box>
        );
      }}
      renderInput={(params) => <TextField {...params} label={label} placeholder={placeholder || ''} />}
      filterOptions={(options, { inputValue }) =>
        options.filter(
          (option) =>
            option.fullName?.toLowerCase().includes(inputValue.toLowerCase()) ||
            option.jobTitle?.toLowerCase().includes(inputValue.toLowerCase()) ||
            option.costCenter1Label?.toLowerCase().includes(inputValue.toLowerCase())
        )
      }
    />
  );
}
