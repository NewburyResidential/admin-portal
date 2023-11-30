'use client';
import React, { useState } from 'react';
import { Autocomplete, TextField, ListSubheader } from '@mui/material';

const glAccounts = [
    { category: 'Travel', label: 'Airfare', id: 'T1' },
    { category: 'Travel', label: 'Hotel', id: 'T2' },
    { category: 'Travel', label: 'Car Rental', id: 'T3' },
    { category: 'Repair', label: 'Equipment Maintenance', id: 'R1' },
    { category: 'Repair', label: 'Vehicle Service', id: 'R2' },
    { category: 'Repair', label: 'Building Repairs', id: 'R3' },
  ];
  

export default function GLDropDown() {
  const [value, setValue] = useState(null);

  return (
    <Autocomplete
    value={value}
    onChange={(event, newValue) => {
      setValue(newValue);
    }}
    id="grouped-gl-accounts"
    options={glAccounts.sort((a, b) => -b.category.localeCompare(a.category))}
    groupBy={(option) => option.category}
    getOptionLabel={(option) => option.label}
    renderInput={(params) => <TextField {...params} label="GL Account" />}
    renderGroup={(params) => (
      <li key={params.key}>
        <ListSubheader sx={{ fontWeight: 'bold', color: 'primary.darker' }}>
          {params.group}
        </ListSubheader>
        {params.children}
      </li>
    )}
  
  />
  );
}
