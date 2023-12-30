import React from 'react';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import { v4 as uuidv4 } from 'uuid';

import Iconify from 'src/components/iconify/iconify';

import DropDownGl from './DropDownGl';
import DropDownAssets from './DropDownAssets';
import TextFieldNote from './TextFieldNote';
import TextFieldAmount from './TextFieldAmount';
import TextFieldPercent from './TextFieldPercent';
import TextFieldUnitAmount from './TextFieldUnitAmount';
import TextFieldUnitNumber from './TextFieldUnitNumber';
import { recalculateUnitDistribution } from 'src/utils/expense-calculations/recalculate-unit-distribution';

export default function RowSubItem({
  allocation,
  handleAllocationAmountChange,
  chartOfAccounts,
  item,
  difference,
  message,
  handleAddSplit,
  handleDeleteSplit,
  handleGlAccountChange,
  handleNoteChange,
  handleAssetsChange,
  isSplit,
  calculation,
  setCalculation,
  backgroundColor,
}) {
  const handleDeleteButton = () => {
    handleDeleteSplit(item.id, allocation.id);
    if (calculation === 'Unit' && item.allocations.length !== 2) recalculateUnitDistribution(item, handleAllocationAmountChange);
    if (item.allocations.length === 2) setCalculation('Amount');
  };

  const handleAddButton = () => {
    handleAddSplit(item.id, uuidv4());
    if (calculation === 'Unit') recalculateUnitDistribution(item, handleAllocationAmountChange);
    if (item.allocations.length === 1) setCalculation('Unit');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        backgroundColor,
        pb: 2,
        alignItems: 'center',
        gap: 2,
        pr: 1,
      }}
    >
      <Box sx={{ flex: '0 0 auto', pr: 2, pl: 4 }}>
        <IconButton onClick={() => (allocation.id !== 'default' ? handleDeleteButton() : handleAddButton())}>
          <Iconify icon={allocation.id !== 'default' ? 'fluent:delete-12-regular' : 'material-symbols:arrow-split-rounded'} />
        </IconButton>
      </Box>
      <Box sx={{ flex: 3.2 }}>
        <TextFieldNote id={item.id} allocation={allocation} handleNoteChange={handleNoteChange} />
      </Box>
      <Box sx={{ flex: 3.2 }}>
        <DropDownAssets
          item={item}
          allocation={allocation}
          handleAssetsChange={handleAssetsChange}
          handleAllocationAmountChange={handleAllocationAmountChange}
          calculation={calculation}
        />
      </Box>
      <Box sx={{ flex: 3.2 }}>
        <DropDownGl chartOfAccounts={chartOfAccounts} item={item} allocation={allocation} handleGlAccountChange={handleGlAccountChange} />
      </Box>
      {isSplit && (
        <Box sx={{ flex: isSplit ? 0.92 : 1 }}>
          {calculation === 'Amount' ? (
            <TextFieldPercent
              handleAllocationAmountChange={handleAllocationAmountChange}
              item={item}
              allocation={allocation}
              amountDifference={difference}
              message={message}
            />
          ) : (
            <TextFieldUnitNumber item={item} allocation={allocation} />
          )}
        </Box>
      )}
      <Box sx={{ flex: isSplit ? 0.92 : 2 }}>
        {calculation === 'Amount' ? (
          <TextFieldAmount
            handleAllocationAmountChange={handleAllocationAmountChange}
            item={item}
            allocation={allocation}
            difference={difference}
            message={message}
            isSplit={isSplit}
            isUnitCalculation={calculation === 'Unit'}
          />
        ) : (
          <TextFieldUnitAmount item={item} allocation={allocation} />
        )}
      </Box>
    </Box>
  );
}
