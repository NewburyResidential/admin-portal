'use client';
import React, { useState } from 'react';
import { Autocomplete, TextField, Checkbox, ListItemText, Chip } from '@mui/material';


const assetItems = [
    { category: 'Properties', label: 'The Landing', id: 'P1' },
    { category: 'Properties', label: 'Edge At 1010', id: 'P2' },
    { category: 'Properties', label: '2100 Springport', id: 'P3' },
    { category: 'Home Office', label: 'Acquisitions', id: 'H1' },
  ];
  
  export default function AssetDropDown() {
    const [value, setValue] = useState([]);
  
    // Custom sort function to ensure Properties are at the top and Home Office at the bottom
    const sortedAssetItems = assetItems.sort((a, b) => {
      if (a.category === 'Properties' && b.category !== 'Properties') {
        return -1;
      }
      if (a.category !== 'Properties' && b.category === 'Properties') {
        return 1;
      }
      return a.id.localeCompare(b.id); // Sort by id or label within the same category if needed
    });
  
    return (
        <Autocomplete
          disableCloseOnSelect={true}
          multiple
          id="asset-dropdown"
          options={sortedAssetItems}
          groupBy={(option) => option.category}
          getOptionLabel={(option) => option.label}
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox checked={selected} />
              <ListItemText primary={option.label} />
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Assets"
              // Removed the placeholder
            />
          )}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => (
              <Chip
                label={option.label}
                {...getTagProps({ index })}
                // You can style the Chip as needed
              />
            ))
          }
          // Additional styles can be applied here if needed
        />
      );
    }