import { useState, useMemo } from 'react';

import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';

import { isMissingValue } from 'src/utils/expense-calculations/missing-value';

export default function DropDownVendor({ vendors, handleVendorChange, item, isVendorRequired }) {
  const currentValue = item.vendor ? item.vendor : null;
  const [inputValue, setInputValue] = useState('');

  const optionsLimit = 7;

  const filteredOptions = useMemo(() => {
    return vendors.filter((vendor) => vendor.name.toLowerCase().includes(inputValue.toLowerCase())).slice(0, optionsLimit);
  }, [inputValue, vendors]);

  return isVendorRequired ? (
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
          return (
            <TextField
              {...rest}
              label={currentValue ? 'Vendor' : `Add ${item.merchant} Vendor`}
              variant="filled"
              error={item?.isSubmitted && isMissingValue(currentValue)}
            />
          );
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
  ) : (
    <Box sx={{ 
      height: '54px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center'
  }}>{item.merchant}</Box>
  );
}
