'use client';

import { assetItems } from 'src/assets/data/assets';

import Popper from '@mui/material/Popper';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import ListSubheader from '@mui/material/ListSubheader';

export default function DropDownAssets({ asset, setAsset }) {
  const currentValue = asset || null;
  return (
    <Autocomplete
      value={currentValue}
      sx={{ width: 200 }}
      PopperComponent={({ style, ...props }) => <Popper {...props} sx={{ ...style, height: 0 }} />}
      defaultValue={null}
      onChange={(event, newValue) => {
        setAsset(newValue);
      }}
      id="grouped-assets"
      options={assetItems.sort((a, b) => b.category.localeCompare(a.category))}
      groupBy={(option) => option.category}
      getOptionLabel={(option) => option.label}
      renderInput={(params) => <TextField {...params} label='Location' />}
      isOptionEqualToValue={(option, selected) => option.id === selected.id}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          {option.label}
        </li>
      )}
      renderGroup={(params) => (
        <div key={params.key}>
          <ListSubheader
            sx={{ fontWeight: 'bold', color: (theme) => (theme.palette.mode === 'light' ? 'primary.darker' : theme.palette.grey[500]) }}
          >
            {params.group}
          </ListSubheader>
          {params.children}
        </div>
      )}
    />
  );
}
