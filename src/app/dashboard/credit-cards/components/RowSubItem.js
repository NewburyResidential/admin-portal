import React from 'react';

import { TableRow, TableCell, IconButton, TextField, Checkbox, Box } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import Iconify from 'src/components/iconify/iconify';
import AssetDropDown from './AssetDropDown';
import VendorDropDown from './VendorDropDown';
import GlDropDown from './GlDropDown';
import NoteTextField from './NoteTextField';

export default function RowSubItem({
  allocation,
  index,
  handleAllocationAmountChange,
  vendors,
  chartOfAccounts,
  item,
  difference,
  message,
  handleAddSplit,
  handleDeleteSplit,
  handleGlAccountChange,
  handleNoteChange,
  handleVendorChange,
  handleAssetsChange,
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
      <TableCell sx={{ width: '20%' }}>
        <NoteTextField id={item.id} allocation={allocation} handleNoteChange={handleNoteChange} />
      </TableCell>
      <TableCell sx={{ width: '20%' }}>
          <AssetDropDown id={item.id} allocation={allocation} handleAssetsChange={handleAssetsChange} />
      </TableCell>
      <TableCell sx={{ width: '20%' }}>
        <VendorDropDown vendors={vendors} id={item.id} allocation={allocation} handleVendorChange={handleVendorChange} />
      </TableCell>
      <TableCell sx={{ width: '20%' }}>
        <GlDropDown chartOfAccounts={chartOfAccounts} id={item.id} allocation={allocation} handleGlAccountChange={handleGlAccountChange} />
      </TableCell>
      <TableCell sx={{ width: '10%', position: 'relative' }}>
        <TextField
          label={difference === 0 ? 'Total' : `${message}`}
          value={allocation.amount || ''}
          onChange={(e) => handleAllocationAmountChange(item.id, allocation.id, e.target.value)}
          disabled={item.allocations.length === 1}
          variant="outlined"
          autoComplete="off"
        />
        {allocation.amount === 0 || allocation.amount === '' ? (
          <IconButton
            sx={{
              position: 'absolute',
              right: '2px',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
            onClick={(e) => handleAllocationAmountChange(item.id, allocation.id, difference)}
          >
            <AddCircleIcon />
          </IconButton>
        ) : null}
      </TableCell>
    </TableRow>
  );
}
