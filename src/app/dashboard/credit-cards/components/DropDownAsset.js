'use client';
import Popper from '@mui/material/Popper';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import ListSubheader from '@mui/material/ListSubheader';

import { isMissingValue } from 'src/utils/expense-calculations/missing-value';
import { assetItems } from 'src/assets/data/assets';


export default function DropDownAsset({ allocation, handleAssetsChange, handleAllocationAmountChange, item, calculation }) {
  const calculateTotalUnits = (newValue) => {
    let newTotalUnits = item.allocations.reduce((total, alloc) => {
      return total + (alloc.id === allocation.id ? newValue?.units || 0 : alloc.asset?.units || 0);
    }, 0);

    let sumAllocatedAmount = 0;
    let allocationsLength = item.allocations.length;

    item.allocations.forEach((alloc, index) => {
      let unitsToUse = alloc.id === allocation.id ? (newValue ? newValue.units : 0) : alloc.asset?.units || 0;

      if (typeof unitsToUse === 'number') {
        let updatedAmount = (unitsToUse / newTotalUnits) * item.amount;
        updatedAmount = parseFloat(updatedAmount.toFixed(2));
        if (index === allocationsLength - 1) {
          let discrepancy = item.amount - sumAllocatedAmount - updatedAmount;
          updatedAmount += discrepancy;
          updatedAmount = parseFloat(updatedAmount.toFixed(2));
        } else {
          sumAllocatedAmount += updatedAmount;
        }
        if (calculation === 'Unit') {
          handleAllocationAmountChange(item.id, alloc.id, updatedAmount);
        }
      }
    });
  };

  const currentValue = allocation.asset ? allocation.asset : null;
  return (
    <Autocomplete
      PopperComponent={({ style, ...props }) => <Popper {...props} sx={{ ...style, height: 0 }} />}
      value={currentValue}
      defaultValue={null}
      onChange={(event, newValue) => {
        handleAssetsChange(item.id, allocation.id, newValue);
        calculateTotalUnits(newValue);
      }}
      id="grouped-asset-accounts"
      options={assetItems.sort((a, b) => b.category.localeCompare(a.category))}
      groupBy={(option) => option.category}
      getOptionLabel={(option) => option.label}
      renderInput={(params) => <TextField {...params} label="Location" error={item?.isSubmitted && isMissingValue(currentValue)} />}
      renderOption={(props, option) => {
        return (
          <li {...props} key={option.id}>
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
