import React, { useState } from 'react';

import { Box, TextField, Autocomplete } from '@mui/material';
import { assetItems } from 'src/assets/data/assets';

import getUtilityBills from 'src/utils/services/utility-bills/getUtilityBills';
import UtilitySearchButton from './UtilitySearchButton';

export default function UtilitySeach({
  setUtilityBills,
  setSelectedProperty,
  setSelectedUtility,
  setSelectedMonth,
  selectedProperty,
  selectedUtility,
  selectedMonth,
}) {
  const utilityProperties = assetItems.filter((item) => item.utilities !== undefined);

  const handleSubmit = async () => {
    if (!selectedProperty || !selectedUtility) return;
    const pk = selectedMonth;
    const sk = `${selectedProperty?.id}#${selectedUtility?.id}#`;
    const data = await getUtilityBills(pk, sk);
    setUtilityBills(data);
  };

  return (
    <Box sx={{ my: 4, display: 'flex', justifyContent: 'center' }}>
      <form action={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: 20, maxWidth: '800px' }}>
        <TextField
          value={selectedMonth}
          onChange={(e) => {
            setSelectedMonth(e.target.value);
          }}
          name="postMonth"
          id="outlined-basic"
          label="Post Month"
          variant="outlined"
          style={{ width: '150px' }}
        />
        <Autocomplete
          id="asset-autocomplete"
          options={utilityProperties}
          getOptionLabel={(option) => option.label || ''}
          onChange={(event, newValue) => {
            console.log(newValue);
            setSelectedProperty(newValue);
          }}
          renderInput={(params) => <TextField name="asset" {...params} label="Select Property" variant="outlined" />}
          style={{ width: '250px' }}
        />
        <Autocomplete
          id="utility-autocomplete"
          options={selectedProperty ? selectedProperty.utilities : []}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => <TextField name="utility" {...params} label="Select Utility" variant="outlined" />}
          onChange={(event, newValue) => {
            setSelectedUtility(newValue);
          }}
          disabled={!selectedProperty}
          style={{ width: '250px' }}
        />
        <UtilitySearchButton />
      </form>
    </Box>
  );
}
