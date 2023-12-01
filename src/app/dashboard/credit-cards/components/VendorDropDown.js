import React, { useState, useMemo } from 'react';
import { Autocomplete } from '@mui/lab';
import { FormControl, TextField } from '@mui/material';

export default function VendorDropDown({ vendors }) {
  const [inputValue, setInputValue] = useState('');
  const [selectedVendor, setSelectedVendor] = useState(null);

  const optionsLimit = 25; 

  const filteredOptions = useMemo(() => {
    return vendors.filter(vendor => 
      vendor.name.toLowerCase().includes(inputValue.toLowerCase())
    ).slice(0, optionsLimit);
  }, [inputValue, vendors]);

  return (
    <FormControl fullWidth>
      <Autocomplete
        id="vendor-autocomplete"
        options={filteredOptions}
        getOptionLabel={(option) => option.name}
        value={selectedVendor}
        onChange={(event, newValue) => {
          setSelectedVendor(newValue);
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        renderInput={(params) => (
          <TextField {...params} label="Vendor" variant="outlined" />
        )}
      />
    </FormControl>
  );
}
