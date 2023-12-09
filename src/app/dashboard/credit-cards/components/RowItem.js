import React from 'react';
import { TableRow, TableCell, IconButton, TextField, Checkbox } from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import RowSubItem from './RowSubItem';

function RowItem({ item, index, vendors, chartOfAccounts, handleAllocationAmountChange, handleAddSplit, handleDeleteSplit }) {
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

  console.log(item.id);
  return (
    <>
      <TableRow style={{ backgroundColor: index % 2 !== 0 ? '#FAFBFC' : '#f0f0f0' }}>
        <TableCell padding="checkbox">
          <Checkbox />
        </TableCell>
        <TableCell align="center">{item.postedDate}</TableCell>
        <TableCell align="center">{item.accountName}</TableCell>
        <TableCell align="center">{item.name}</TableCell>
        <TableCell align="center"></TableCell>
        <TableCell align="center">
          <IconButton>
            <AddAPhotoIcon />
          </IconButton>
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
            />
          </React.Fragment>
        );
      })}
    </>
  );
}

export default React.memo(RowItem);


