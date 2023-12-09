'use client';
import React, { useState } from 'react';
import { Autocomplete, TextField, ListSubheader } from '@mui/material';


export default function GlDropDown({chartOfAccounts, allocation, handleGlAccountChange, id}) {
console.log(allocation)

    return (
        <Autocomplete
            value={allocation.glAccount === '' ? null : allocation.glAccount}
            defaultValue={null}
            onChange={(event, newValue) => {
              console.log(newValue)
                handleGlAccountChange(id, allocation.id, newValue);
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
