import React from 'react';

import { TableRow, TableCell, IconButton, TextField, Checkbox } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import Iconify from 'src/components/iconify/iconify';
import AssetDropDown from './AssetDropDown';
import VendorDropDown from './VendorDropDown';
import GLDropDown from './GLDropDown';

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
}) {
    console.log(allocation.amount)
  return (
    <TableRow style={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#FAFBFC' }}>
      <TableCell padding="checkbox" style={{ paddingLeft: '32px' }}>
        <IconButton
          onClick={() => (allocation.id !== 'default' ? handleDeleteSplit(item.id, allocation.id) : handleAddSplit(item.id, uuidv4()))}
        >
          <Iconify icon={allocation.id !== 'default' ? 'fluent:delete-12-regular' : 'material-symbols:arrow-split-rounded'} />
        </IconButton>
      </TableCell>
      <TableCell sx={{ width: '22%' }}>
        <TextField fullWidth id="notes-input" label="Notes" variant="outlined" />
      </TableCell>
      <TableCell sx={{ width: '22%' }}>
        <AssetDropDown />
      </TableCell>
      <TableCell sx={{ width: '22%' }}>
        <VendorDropDown vendors={vendors} />
      </TableCell>
      <TableCell sx={{ width: '22%' }}>
        <GLDropDown chartOfAccounts={chartOfAccounts} />
      </TableCell>
      <TableCell sx={{ width: '10%', position: 'relative' }}>
        <TextField
          label={difference === 0 ? 'Total' : `${message}`}
          value={allocation.amount || ''}
          onChange={(e) => handleAllocationAmountChange(item.id, allocation.id, e.target.value)}
          variant="outlined"
          autoComplete="off"
          InputProps={{
            readOnly: false,
          }}
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
