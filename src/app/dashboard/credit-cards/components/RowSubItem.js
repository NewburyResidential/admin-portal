import React from 'react';

import { TableRow, TableCell, IconButton, TextField } from '@mui/material';
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
}) {
  const handleDeleteButton = () => {
    handleDeleteSplit(item.id, allocation.id);
    if (calculation === 'Unit' && item.allocations.length !== 2) recalculateUnitDistribution(item, handleAllocationAmountChange);
  };

  const handleAddButton = () => {
    handleAddSplit(item.id, uuidv4())
    if (calculation === 'Unit') recalculateUnitDistribution(item, handleAllocationAmountChange);
  };

  return (
    <TableRow style={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#FAFBFC' }}>
      <TableCell padding="checkbox" style={{ paddingLeft: '32px' }} >
        <IconButton onClick={() => (allocation.id !== 'default' ? handleDeleteButton() : handleAddButton())}>
          <Iconify icon={allocation.id !== 'default' ? 'fluent:delete-12-regular' : 'material-symbols:arrow-split-rounded'} />
        </IconButton>
      </TableCell>
      <TableCell sx={{ width: '29%' }}  >
        <TextFieldNote id={item.id} allocation={allocation} handleNoteChange={handleNoteChange} />
      </TableCell>
      <TableCell sx={{ width: '29%' }} >
        <DropDownAsset
          item={item}
          allocation={allocation}
          handleAssetsChange={handleAssetsChange}
          handleAllocationAmountChange={handleAllocationAmountChange}
          calculation={calculation}
        />
      </TableCell>

      <TableCell sx={{ width: '29%' }} >
        <DropDownGl chartOfAccounts={chartOfAccounts} item={item} allocation={allocation} handleGlAccountChange={handleGlAccountChange} />
      </TableCell>
      {isSplit && (
        <TableCell  >
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
        </TableCell>
      )}

      <TableCell  colSpan={isSplit ? 1 : 2} sx={{width: '20%'}}>
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
      </TableCell>
    </TableRow>
  );
}
