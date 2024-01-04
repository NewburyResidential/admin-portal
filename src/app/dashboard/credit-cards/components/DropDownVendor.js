import { useState } from 'react';

import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';

import { isMissingValue } from 'src/utils/expense-calculations/missing-value';
import Iconify from 'src/components/iconify';

export default function DropDownVendor({ handleOpen, vendors, handleVendorChange, item, isVendorRequired }) {
  const currentValue = item.vendor ? item.vendor : null;
  const merchantName = item.merchant ? item.merchant : '*Not Provided*';
  const [inputValue, setInputValue] = useState('');

  const optionsLimit = 7;

  const filterOptions = (options, { inputValue }) => {
    const filtered = options.filter((option) => option.name.toLowerCase().includes(inputValue.toLowerCase()));

    const limitedFiltered = filtered.slice(0, optionsLimit - 1);
    return [...limitedFiltered, { name: 'Add Vendor', id: 'add-vendor' }];
  };

  return isVendorRequired ? (
    <FormControl fullWidth>
      <Autocomplete
        filterOptions={filterOptions}
        PopperComponent={({ style, ...props }) => <Popper {...props} sx={{ ...style, height: 0 }} />}
        id="vendor-autocomplete"
        options={vendors}
        getOptionLabel={(option) => option.name}
        value={currentValue}
        isOptionEqualToValue={(option, selected) => option.id === selected.id}
        onChange={(event, newValue) => {
          if (newValue && newValue.id === 'add-vendor') {
            handleOpen(inputValue);
          } else {
            handleVendorChange(item.id, newValue);
          }
        }}
        onInputChange={(event, newInputValue) => {
          if (newInputValue.id !== 'add-vendor') {
            setInputValue(newInputValue);
          } else {
            setInputValue(null);
          }
        }}
        renderInput={(params) => {
          const { ...rest } = params;
          return (
            <TextField
              {...rest}
              label={currentValue ? 'Vendor' : `Add ${merchantName} Vendor`}
              variant="filled"
              error={item?.isSubmitted && isMissingValue(currentValue)}
            />
          );
        }}
        renderOption={(props, option) => {
          if (option.id === 'add-vendor') {
            return (
              <li
                {...props}
                key={option.id}
                style={{
                  fontWeight: 'bold',
                }}
              >
                <Box key={option.id} sx={{ mr: 1, mt: '5px' }}>
                  <Iconify icon="humbleicons:user-add" />
                </Box>
                {option.name}
              </li>
            );
          }
          return (
            <li {...props} key={option.id}>
              {option.name}
            </li>
          );
        }}
      />
    </FormControl>
  ) : (
    <Box
      sx={{
        height: '54px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {merchantName}
    </Box>
  );
}
