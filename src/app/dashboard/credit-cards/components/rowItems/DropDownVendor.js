'use client';

import { useState, useMemo } from 'react';
import { useFormContext, Controller, useWatch } from 'react-hook-form';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';

import Iconify from 'src/components/iconify';
import VendorDialog from '../addVendor/Dialog';

export default function DropDownVendor({ vendors, setVendors, merchant }) {
  const { control, setValue } = useFormContext();
  
  // Memoize the allocations watch to prevent unnecessary recalculations
  const allocations = useWatch({
    control,
    name: `allocations`,
  });

  // Memoize this calculation
  const isVendorRequired = useMemo(() => 
    allocations.some(
      (allocation) =>
        (allocation.asset && allocation.asset.accountingSoftware === 'entrata') ||
        (allocation.asset && allocation.asset.accountingSoftware === 'pre-entrata')
    ),
    [allocations]
  );

  const merchantName = merchant || '*Not Provided*';
  const optionsLimit = 7;

  // Memoize the filter function
  const filterOptions = useMemo(() => 
    (options, { inputValue }) => {
      const filtered = options.filter((option) => 
        option.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      const limitedFiltered = filtered.slice(0, optionsLimit - 1);
      return [...limitedFiltered, { name: 'Add Vendor', id: 'add-vendor' }];
    },
    [optionsLimit]
  );

  const [inputValue, setInputValue] = useState('');
  const [vendorDialog, setVendorDialog] = useState({ open: false, defaultValue: '' });

  // Memoize the handleClose function
  const handleClose = useMemo(() => 
    ({ vendor = null }) => {
      if (vendor) {
        setVendors((prev) => [...prev, vendor]);
        setValue(`vendor`, vendor);
      }
      setVendorDialog({ open: false, defaultValue: '' });
    },
    [setVendors, setValue]
  );

  // Move renderOption outside of the render prop and memoize it separately
  const renderOption = useMemo(() => {
    return (props, { id, name }) => {
      const { ...otherProps } = props;
      
      if (id === 'add-vendor') {
        return (
          <li
            {...otherProps}
            key={id}
            style={{ fontWeight: 'bold' }}
          >
            <Box key={id} sx={{ mr: 1, mt: '5px' }}>
              <Iconify icon="humbleicons:user-add" />
            </Box>
            {name}
          </li>
        );
      }
      return (
        <li {...otherProps} key={id}>
          {name}
        </li>
      );
    };
  }, []);

  if (!isVendorRequired) {
    return (
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

  return (
    <>
      <VendorDialog 
        open={vendorDialog.open} 
        defaultValue={vendorDialog?.defaultValue} 
        handleClose={handleClose} 
      />
      <FormControl fullWidth>
        <Controller
          name="vendor"
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
                <TextField
                  {...params}
                  sx={{ '& .MuiInputBase-root': { height: '54px' } }}
                  label={field.value ? 'Vendor' : `Add ${merchantName} Vendor`}
                  variant="filled" 
                  error={!!error}
                />
              )}
              renderOption={renderOption}
            />
          )}
        />
      </FormControl>
    </>
  );
}
