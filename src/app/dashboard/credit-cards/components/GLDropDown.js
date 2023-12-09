'use client';
import React, { useState } from 'react';
import { Autocomplete, TextField, ListSubheader } from '@mui/material';


export default function GLDropDown({chartOfAccounts}) {
    const [value, setValue] = useState(null);

    return (
        <Autocomplete
            value={value}
            onChange={(event, newValue) => {
                setValue(newValue);
            }}
            id="grouped-gl-accounts"
            options={chartOfAccounts.sort((a, b) => b.category.localeCompare(a.category))}
            groupBy={(option) => option.category}
            getOptionLabel={(option) => option.accountName}
            renderInput={(params) => <TextField {...params} label="GL Account" />}
            renderOption={(props, option) => {
                return (
                  <li {...props} key={option.accountNumber}>
                    {option.accountName}
                  </li>
                );
              }}
            renderGroup={(params) => (
                <div key={params.key}>
                  <ListSubheader sx={{ fontWeight: 'bold', color: 'primary.darker' }}>
                    {params.group}
                  </ListSubheader>
                  {params.children}
                </div>
              )}
              
        />
    );
}
