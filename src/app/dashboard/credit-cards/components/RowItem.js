import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';

import RowSubItem from './RowSubItem';
import AddReceipt from './AddReceipt';
import DropDownVendor from './DropDownVendor';
import CalculationButtonGroup from './CalculationButtonGroup';

import { useTheme } from '@mui/material/styles';

function RowItem({
  item,
  index,
  vendors,
  chartOfAccounts,
  handleAllocationAmountChange,
  handleAddSplit,
  handleDeleteSplit,
  handleGlAccountChange,
  handleReceiptChange,
  handleNoteChange,
  handleVendorChange,
  handleAssetsChange,
  handleCheckboxToggle,
}) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const [calculation, setCalculation] = useState('Amount');
  const sumOfAllocations = item.allocations.reduce((sum, allocation) => sum + parseFloat(allocation.amount || 0), 0);
  const difference = parseFloat((parseFloat(item.amount) - sumOfAllocations).toFixed(2)) || 0;
  const message =
    difference >= 0
      ? difference % 1 === 0
        ? `+$${difference}`
        : `+$${difference.toFixed(2)}`
      : difference % 1 === 0
      ? `-$${Math.abs(difference)}`
      : `-$${Math.abs(difference).toFixed(2)}`;

  const hexToRgba = (hex, opacity) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const backgroundColor = item.checked
    ? isLight
      ? 'primary.lighter'
      : hexToRgba(theme.palette.primary.dark, 0.4)
    : index % 2 !== 0
    ? isLight
      ? '#FAFBFC'
      : '#2F3944'
    : isLight
    ? '#f0f0f0'
    : '#212B36';

  const isSplit = item.allocations.length > 1;
  const isVendorRequired = item.allocations.some((allocation) => allocation.asset && allocation.asset.accountingSoftware === 'entrata');

  function titleCase(str) {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }  

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          backgroundColor,
          pt: 2,
          pb: 3,
          pl: 2,
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Box sx={{ flex: '0 0 auto', pr: 2 }}>
          <Checkbox checked={item.checked} onChange={() => handleCheckboxToggle(item.id)} />
        </Box>
        <Box sx={{ flex: 1.349, textAlign: 'center', pl: 2 }}>
          <DropDownVendor vendors={vendors} item={item} handleVendorChange={handleVendorChange} isVendorRequired={isVendorRequired} />
        </Box>
        <Box sx={{ flex: 1, textAlign: 'center' }}>{titleCase(item.name)}</Box>
        <Box sx={{ flex: 1, textAlign: 'center' }}>{item.accountName}</Box>
        <Box sx={{ flex: 1, textAlign: 'center', minWidth: '10%' }}>{item.billingCycle}</Box>
        <Box sx={{ flex: 0.5, textAlign: 'center' }}>
          <AddReceipt item={item} handleReceiptChange={handleReceiptChange} />
        </Box>
      </Box>

      {item.allocations.map((allocation) => (
        <Box key={allocation.id}>
          <React.Fragment key={allocation.id}>
            <RowSubItem
              allocation={allocation}
              index={index}
              handleAllocationAmountChange={handleAllocationAmountChange}
              item={item}
              difference={difference}
              message={message}
              vendors={vendors}
              chartOfAccounts={chartOfAccounts}
              handleAddSplit={handleAddSplit}
              handleDeleteSplit={handleDeleteSplit}
              handleGlAccountChange={handleGlAccountChange}
              handleNoteChange={handleNoteChange}
              handleVendorChange={handleVendorChange}
              handleAssetsChange={handleAssetsChange}
              isSplit={isSplit}
              calculation={calculation}
              setCalculation={setCalculation}
              backgroundColor={backgroundColor}
            />
          </React.Fragment>
        </Box>
      ))}

      {isSplit && (
        <Box sx={{ display: 'flex', backgroundColor, pb: 2, pr: 1, gap: 2 }}>
          <Box sx={{ flex: 16 }} />
          <Box sx={{ flex: 3.4, textAlign: 'center' }}>
            <CalculationButtonGroup
              calculation={calculation}
              setCalculation={setCalculation}
              item={item}
              handleAllocationAmountChange={handleAllocationAmountChange}
            />
          </Box>
          <Box sx={{ flex: 1.52, textAlign: 'left' }}>
            <TextField
              value={Number((item.amount - difference).toFixed(2))}
              disabled
              label='Total'
              InputProps={{ style: { maxHeight: '40px' } }}
            />
          </Box>
        </Box>
      )}
    </>
  );
}

export default React.memo(RowItem);
