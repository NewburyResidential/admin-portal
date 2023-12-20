import React, { useState, useMemo } from 'react';
import { Autocomplete, FormControl, Popper, TextField } from '@mui/material';
import { isMissingValue } from 'src/utils/expense-calculations/missing-value';

export default function DropDownVendor({ vendors, handleVendorChange, item }) {
  const currentValue = item.vendor ? item.vendor : null;
  const [inputValue, setInputValue] = useState('');

  const optionsLimit = 7;

  const filteredOptions = useMemo(() => {
    return vendors.filter((vendor) => vendor.name.toLowerCase().includes(inputValue.toLowerCase())).slice(0, optionsLimit);
  }, [inputValue, vendors]);

  return (
    <FormControl fullWidth>
      <Autocomplete
        PopperComponent={({ style, ...props }) => <Popper {...props} sx={{ ...style, height: 0 }} />}
        id="vendor-autocomplete"
        options={filteredOptions}
        getOptionLabel={(option) => option.name}
        value={currentValue}
        onChange={(event, newValue) => {
          handleVendorChange(item.id, newValue);
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        renderInput={(params) => {
          const { key, ...rest } = params;
          return <TextField {...rest} label={`Add ${item.merchant} Vendor`} variant="filled" error={item?.isSubmitted && isMissingValue(currentValue)} />;
        }}
        renderOption={(props, option) => {
          return (
            <li {...props} key={option.id}>
              {option.name}
            </li>
          );
        }}
      />
    </FormControl>
  );
}
