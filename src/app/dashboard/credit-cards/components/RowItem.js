import React, { useState } from 'react';
import { TableRow, TableCell, IconButton, TextField, Checkbox } from '@mui/material';
import { m } from 'framer-motion';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import RowSubItem from './RowSubItem';
import AddReceipt from './AddReceipt';

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
  const sumOfAllocations = item.allocations.reduce((sum, allocation) => sum + parseFloat(allocation.amount || 0), 0);
  const difference = item.amount - sumOfAllocations;
  const message =
    difference >= 0
      ? difference % 1 === 0
        ? `+${difference}`
        : `+${difference.toFixed(2)}`
      : difference % 1 === 0
      ? `-${Math.abs(difference)}`
      : `-${Math.abs(difference).toFixed(2)}`;

  function titleCase(str) {
    return str
      .toLowerCase()
      .split(' ')
      .map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  }

  return (
    <>
      <TableRow sx={{ backgroundColor: index % 2 !== 0 ? '#FAFBFC' : '#f0f0f0', border: 'none' }}>
        <TableCell sx={{ paddingLeft: '10px' }}>
          <Checkbox
            checked={item.checked}
            onChange={() => {
              handleCheckboxToggle(item.id);
            }}
          />
        </TableCell>
        <TableCell align="center">{item.postedDate}</TableCell>
        <TableCell align="center">{item.accountName}</TableCell>
        <TableCell align="center">{item.merchant}</TableCell>
        <TableCell align="center">{titleCase(item.name)}</TableCell>
        <TableCell align="center">
          <AddReceipt item={item} handleReceiptChange={handleReceiptChange} />
        </TableCell>
      </TableRow>
      {item.allocations.map((allocation) => {
        return (
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
            />
          </React.Fragment>
        );
      })}
    </>
  );
}

export default React.memo(RowItem);
