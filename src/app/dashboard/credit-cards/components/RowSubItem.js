import React from 'react';

import { TableRow, TableCell, IconButton, Box } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

import Iconify from 'src/components/iconify/iconify';

import PercentTextField from './TextFieldPercent';
import TextFieldAmount from './TextFieldAmount';
import TextFieldUnitNumber from './TextFieldUnitNumber';
import DropDownGl from './DropDownGl';
import DropDownAsset from './DropDownAsset';
import TextFieldNote from './TextFieldNote';
import TextFieldPercent from './TextFieldPercent';
import TextFieldUnitAmount from './TextFieldUnitAmount';
import { recalculateUnitDistribution } from 'src/utils/expense-calculations/recalculate-unit-distribution';

export default function RowSubItem({
  allocation,
  index,
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
  backgroundColor,
}) {
  const handleDeleteButton = () => {
    handleDeleteSplit(item.id, allocation.id);
    if (calculation === 'Unit' && item.allocations.length !== 2) recalculateUnitDistribution(item, handleAllocationAmountChange);
  };

  const handleAddButton = () => {
    handleAddSplit(item.id, uuidv4());
    if (calculation === 'Unit') recalculateUnitDistribution(item, handleAllocationAmountChange);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        backgroundColor: backgroundColor,
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
        <DropDownAsset
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
