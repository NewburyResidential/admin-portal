'use client';
import { Autocomplete, TextField, ListSubheader, Popper } from '@mui/material';
import { isMissingValue } from 'src/utils/missing-value';

const assetItems = [
    { category: 'Properties', label: 'The Landing', id: 'P1' },
    { category: 'Properties', label: 'Edge At 1010', id: 'P2' },
    { category: 'Properties', label: '2100 Springport', id: 'P3' },
    { category: 'Properties', label: 'Sycamore Place', id: 'P4' },
    { category: 'Home Office', label: 'Newbury Residential', id: 'H1' },
  ];

export default function AssetDropDown({ allocation, handleAssetsChange, item }) {
  const currentValue = allocation.asset ? allocation.asset : null;
  return (
    <Autocomplete
      PopperComponent={({ style, ...props }) => <Popper {...props} sx={{ ...style, height: 0 }} />}
      value={currentValue}
      defaultValue={null}
      onChange={(event, newValue) => {
        console.log(newValue);
        handleAssetsChange(item.id, allocation.id, newValue);
      }}
      id="grouped-asset-accounts"
      options={assetItems.sort((a, b) => b.category.localeCompare(a.category))}
      groupBy={(option) => option.category}
      getOptionLabel={(option) => option.label}
      renderInput={(params) => <TextField {...params} label="Location" error={item?.isSubmitted && isMissingValue(currentValue)} />}
      renderOption={(props, option) => {
        return (
          <li {...props} key={option.accountNumber}>
            {option.label}
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
