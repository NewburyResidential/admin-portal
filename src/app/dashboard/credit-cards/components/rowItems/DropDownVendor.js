'use client';

import { useState } from 'react';
import { useFormContext, Controller, useWatch } from 'react-hook-form';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';

import Iconify from 'src/components/iconify';
import VendorDialog from '../addVendor/Dialog';

export default function DropDownVendor({ transactionIndex, vendors, merchant }) {
  const { control } = useFormContext();
  const allocations = useWatch({
    control,
    name: `transactions[${transactionIndex}].allocations`,
  });

  const isVendorRequired = allocations.some((allocation) => allocation.asset && allocation.asset.accountingSoftware === 'entrata');

  const merchantName = merchant || '*Not Provided*';
  const optionsLimit = 7;

  const filterOptions = (options, { inputValue }) => {
    const filtered = options.filter((option) => option.name.toLowerCase().includes(inputValue.toLowerCase()));

    const limitedFiltered = filtered.slice(0, optionsLimit - 1);
    return [...limitedFiltered, { name: 'Add Vendor', id: 'add-vendor' }];
  };

  const [inputValue, setInputValue] = useState('');
  const [vendorDialog, setVendorDialog] = useState({ open: false, defaultValue: '' });

  return isVendorRequired ? (
    <>
      <VendorDialog
        open={vendorDialog.open}
        defaultValue={vendorDialog?.defaultValue}
        handleClose={() => setVendorDialog({ open: false, defaultValue: '' })}
      />
      <FormControl fullWidth>
        <Controller
          name={`transactions[${transactionIndex}].vendor`}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Autocomplete
              {...field}
              filterOptions={filterOptions}
              id="vendor-autocomplete"
              options={vendors}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, selected) => option.id === selected.id}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
              onChange={(event, newValue) => {
                if (newValue && newValue.id === 'add-vendor') {
                  setVendorDialog({ open: true, defaultValue: inputValue });
                } else {
                  field.onChange(newValue);
                }
              }}
              renderInput={(params) => (
                <TextField {...params} label={field.value ? 'Vendor' : `Add ${merchantName} Vendor`} variant="filled" error={!!error} />
              )}
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
          )}
        />
      </FormControl>
    </>
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
