'use client';
import { Autocomplete, TextField, ListSubheader, Popper } from '@mui/material';
import { isMissingValue } from 'src/utils/expense-calculations/missing-value';

export default function DropDownGl({ chartOfAccounts, allocation, handleGlAccountChange, item }) {
  const currentValue = allocation.glAccount ? allocation.glAccount : null;
  return (
    <Autocomplete
      PopperComponent={({ style, ...props }) => <Popper {...props} sx={{ ...style, height: 0 }} />}
      value={currentValue}
      defaultValue={null}
      onChange={(event, newValue) => {
        console.log(newValue);
        handleGlAccountChange(item.id, allocation.id, newValue);
      }}
      id="grouped-gl-accounts"
      options={chartOfAccounts.sort((a, b) => b.category.localeCompare(a.category))}
      groupBy={(option) => option.category}
      getOptionLabel={(option) => option.accountName}
      renderInput={(params) => <TextField {...params} label="GL Account" error={item?.isSubmitted && isMissingValue(currentValue)} />}
      isOptionEqualToValue={(option, value) => option.accountNumber === value.accountNumber}
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
