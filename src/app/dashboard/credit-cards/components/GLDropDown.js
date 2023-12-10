'use client';
import { Autocomplete, TextField, ListSubheader, Popper } from '@mui/material';

export default function GlDropDown({ chartOfAccounts, allocation, handleGlAccountChange, id }) {
  return (
    <Autocomplete
      PopperComponent={({ style, ...props }) => <Popper {...props} sx={{ ...style, height: 0 }} />}
      value={allocation.glAccount ? allocation.glAccount : null}
      defaultValue={null}
      onChange={(event, newValue) => {
        console.log(newValue);
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
          <ListSubheader sx={{ fontWeight: 'bold', color: 'primary.darker' }}>{params.group}</ListSubheader>
          {params.children}
        </div>
      )}
    />
  );
}
