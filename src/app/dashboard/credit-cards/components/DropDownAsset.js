'use client';
import Popper from '@mui/material/Popper';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import ListSubheader from '@mui/material/ListSubheader';

import { isMissingValue } from 'src/utils/expense-calculations/missing-value';

const assetItems = [
  {
    category: 'Properties',
    id: '2401',
    label: 'The Landing',
    accountId: 'P1',
    units: 172,
    accountingSoftware: 'n/a',
    waveARId: 'QWNjb3VudDoxOTAwNDgwNjM5NzI4MTM2NDkzO0J1c2luZXNzOmZmYjc3ZjkwLWMxMTUtNDFhOS04ZDEyLTZiZTdlMTgzOTNlNg==',
  },
  {
    category: 'Properties',
    id: '2301',
    label: 'Edge At 1010',
    accountId: '1318972',
    units: 122,
    accountingSoftware: 'entrata',
    waveARId: 'QWNjb3VudDoxODk3OTY0NzMzNTkyNTQ3NTc5O0J1c2luZXNzOmZmYjc3ZjkwLWMxMTUtNDFhOS04ZDEyLTZiZTdlMTgzOTNlNg==',
  },
  {
    category: 'Properties',
    id: '2302',
    label: '2100 Springport',
    accountId: '1318973',
    units: 25,
    accountingSoftware: 'entrata',
    waveARId: 'QWNjb3VudDoxODk3OTY0NjY2Mzk5Nzk3NDk3O0J1c2luZXNzOmZmYjc3ZjkwLWMxMTUtNDFhOS04ZDEyLTZiZTdlMTgzOTNlNg==',
  },
  {
    category: 'Properties',
    id: '2001',
    label: 'Sycamore Place',
    accountId: 'P4',
    units: 50,
    accountingSoftware: 'n/a',
    waveARId: 'QWNjb3VudDoxOTAwNDg1NTc4MDAxMDAzMjU5O0J1c2luZXNzOmZmYjc3ZjkwLWMxMTUtNDFhOS04ZDEyLTZiZTdlMTgzOTNlNg==',
  },
  {
    category: 'Home Office',
    id: '1',
    label: 'Newbury Residential',
    accountId: 'QnVzaW5lc3M6ZmZiNzdmOTAtYzExNS00MWE5LThkMTItNmJlN2UxODM5M2U2',
    units: 0,
    accountingSoftware: 'n/a',
    waveARId: 'QWNjb3VudDoxOTAwNDg1Njk1OTYxNjA4OTU3O0J1c2luZXNzOmZmYjc3ZjkwLWMxMTUtNDFhOS04ZDEyLTZiZTdlMTgzOTNlNg==',
    waveCreditCard: 'QWNjb3VudDoxODk4NzI2OTE1MDY2MzQzNjAyO0J1c2luZXNzOmZmYjc3ZjkwLWMxMTUtNDFhOS04ZDEyLTZiZTdlMTgzOTNlNg=='
  },
  {
    category: 'Home Office',
    id: '2',
    label: 'Evolve Acquisitions',
    accountId: 'QnVzaW5lc3M6ZmZiNzdmOTAtYzExNS00MWE5LThkMTItNmJlN2UxODM5M2U2',
    units: 0,
    accountingSoftware: 'wave',
    waveARId: 'QWNjb3VudDoxOTAwNDg1NTc4MDAxMDAzMjU5O0J1c2luZXNzOmZmYjc3ZjkwLWMxMTUtNDFhOS04ZDEyLTZiZTdlMTgzOTNlNg==',
    waveCreditCard: 'QWNjb3VudDoxODk4NzI2OTE1MDY2MzQzNjAyO0J1c2luZXNzOmZmYjc3ZjkwLWMxMTUtNDFhOS04ZDEyLTZiZTdlMTgzOTNlNg=='
  },
];

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
