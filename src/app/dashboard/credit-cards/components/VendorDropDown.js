import React, { useState, useMemo } from 'react';
import { Autocomplete, FormControl, Popper, TextField } from '@mui/material';

export default function VendorDropDown({ vendors, handleVendorChange, id, allocation }) {
  const [inputValue, setInputValue] = useState('');

  const optionsLimit = 8;

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
        value={allocation.vendor ? allocation.vendor : null}
        onChange={(event, newValue) => {
          handleVendorChange(id, allocation.id, newValue);
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        renderInput={(params) => {
          const { key, ...rest } = params;
          return <TextField {...rest} label="Vendor" variant="outlined" />;
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
