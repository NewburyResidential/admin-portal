'use client';
import Popper from '@mui/material/Popper';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import ListSubheader from '@mui/material/ListSubheader';

import { isMissingValue } from 'src/utils/expense-calculations/missing-value';
import { assetItems } from 'src/assets/data/assets';
import AutocompleteGroup from 'src/components/form-inputs/AutocompleteGroup';

export default function DropDownAssets({ allocation, handleAssetsChange, handleAllocationAmountChange, item, calculation }) {
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
  const handleChange = (newValue) => {
    handleAssetsChange(item.id, allocation.id, newValue);
    calculateTotalUnits(newValue);
  };

  return (
    <AutocompleteGroup
      value={allocation.asset}
      options={assetItems}
      handleChange={handleChange}
      label="Location"
      id="grouped-asset-accounts"
      error={item?.isSubmitted && isMissingValue(allocation.asset)}
    />
  );
}
