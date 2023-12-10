'use client';
import { Autocomplete, TextField, Checkbox, ListItemText, Chip, ListSubheader, Popper } from '@mui/material';

const assetItems = [
  { category: 'Properties', label: 'The Landing', id: 'P1' },
  { category: 'Properties', label: 'Edge At 1010', id: 'P2' },
  { category: 'Properties', label: '2100 Springport', id: 'P3' },
  { category: 'Home Office', label: 'Acquisitions', id: 'H1' },
];

export default function AssetDropDown({ id, allocation, handleAssetsChange }) {
  const currentValues = allocation.assets ? allocation.assets : [];
  const sortedAssetItems = assetItems.sort((a, b) => {
    if (a.category === 'Properties' && b.category !== 'Properties') {
      return -1;
    }
    if (a.category !== 'Properties' && b.category === 'Properties') {
      return 1;
    }
    return a.id.localeCompare(b.id);
  });

  return (
    <Autocomplete
      PopperComponent={({ style, ...props }) => <Popper {...props} sx={{ ...style, height: 0 }} />}
      fullWidth={true}
      value={currentValues}
      disableClearable={true}
      disableCloseOnSelect={true}
      multiple
      limitTags={1}
      id="asset-dropdown"
      options={sortedAssetItems}
      groupBy={(option) => option.category}
      getOptionLabel={(option) => option.label}
      onChange={(event, newValue) => {
        handleAssetsChange(id, allocation.id, newValue);
      }}
      renderGroup={(params) => (
        <div key={params.key}>
          <ListSubheader component="div" sx={{ fontWeight: 'bold', color: 'primary.darker' }}>
            {params.group}
          </ListSubheader>
          {params.children}
        </div>
      )}
      renderOption={(props, option, { selected }) => (
        <li {...props} key={option.id}>
          <Checkbox checked={selected} />
          {option.label}
        </li>
      )}
      renderInput={(params) => {
        const { key, ...rest } = params;
        return (
          <TextField
            {...rest}
            label="Location"
            variant="outlined"
            sx={{
              '.MuiInputBase-input.MuiOutlinedInput-input': {
                position: currentValues.length !== 0 && 'absolute',
                left: currentValues.length !== 0 && '-9999px',
              },
        
            }}
          />
        );
      }}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => <Chip sx={{ fontSize: '11px', height: '29.2px' }} label={option.label} {...getTagProps({ index })} />)
      }
    />
  );
}
