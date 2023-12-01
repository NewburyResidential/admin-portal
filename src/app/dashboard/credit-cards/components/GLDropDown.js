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
            options={chartOfAccounts.sort((a, b) => b.Category.localeCompare(a.Category))}
            groupBy={(option) => option.Category}
            getOptionLabel={(option) => option.AccountName}
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
