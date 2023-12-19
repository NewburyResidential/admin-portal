import React from 'react';

import { TableRow, TableCell, IconButton } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

import Iconify from 'src/components/iconify/iconify';

import PercentTextField from './TextFieldPercent';
import TextFieldAmount from './TextFieldAmount';
import TextFieldUnitNumber from './TextFieldUnitNumber';
import DropDownGl from './DropDownGl';
import DropDownAsset from './DropDownAsset';
import TextFieldNote from './TextFieldNote';

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
  return (
    <TableRow style={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#FAFBFC' }}>
      <TableCell padding="checkbox" style={{ paddingLeft: '32px' }}>
        <IconButton
          onClick={() => (allocation.id !== 'default' ? handleDeleteSplit(item.id, allocation.id) : handleAddSplit(item.id, uuidv4()))}
        >
          <Iconify icon={allocation.id !== 'default' ? 'fluent:delete-12-regular' : 'material-symbols:arrow-split-rounded'} />
        </IconButton>
      </TableCell>
      <TableCell sx={{ width: '30%' }} colSpan={isSplit ? 1 : 2}>
        <TextFieldNote id={item.id} allocation={allocation} handleNoteChange={handleNoteChange} />
      </TableCell>
      <TableCell sx={{ width: '30%' }}>
        <DropDownAsset item={item} allocation={allocation} handleAssetsChange={handleAssetsChange} />
      </TableCell>

      <TableCell sx={{ width: '30%' }}>
        <DropDownGl chartOfAccounts={chartOfAccounts} item={item} allocation={allocation} handleGlAccountChange={handleGlAccountChange} />
      </TableCell>
      {isSplit && (
        <TableCell sx={{ width: '5%' }}>
          {calculation === 'Amount' ? (
            <PercentTextField
              handleAllocationAmountChange={handleAllocationAmountChange}
              item={item}
              allocation={allocation}
              amountDifference={difference}
              message={message}
            />
          ) : (
            <TextFieldUnitNumber
              item={item}
              allocation={allocation}
            />
          )}
        </TableCell>
      )}

      <TableCell sx={{ width: '10%' }}>
        <TextFieldAmount
          handleAllocationAmountChange={handleAllocationAmountChange}
          item={item}
          allocation={allocation}
          difference={difference}
          message={message}
          isSplit={isSplit}
        />
      </TableCell>
    </TableRow>
  );
}
