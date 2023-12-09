import React, { useState } from 'react';
import { TableRow, TableCell, IconButton, TextField, Checkbox } from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import RowSubItem from './RowSubItem';
import Box from '@mui/material/Box';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import Iconify from 'src/components/iconify';

function RowItem({
  item,
  index,
  vendors,
  chartOfAccounts,
  handleAllocationAmountChange,
  handleAddSplit,
  handleDeleteSplit,
  handleGlAccountChange,
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

  console.log(item.id);

  const showHoverIcons = (itemId) => {
    const splitButtons = document.getElementById(`split-buttons-${itemId}`);
    const addPhoto = document.getElementById(`add-photo-${itemId}`);

    if (splitButtons && addPhoto) {
      splitButtons.style.opacity = '1';
      addPhoto.style.opacity = '0';
    }
  };

  const hideHoverIcons = (itemId) => {
    const splitButtons = document.getElementById(`split-buttons-${itemId}`);
    const addPhoto = document.getElementById(`add-photo-${itemId}`);

    if (splitButtons && addPhoto) {
      splitButtons.style.opacity = '0';
      addPhoto.style.opacity = '1';
    }
  };

  return (
    <>
      <TableRow sx={{ backgroundColor: index % 2 !== 0 ? '#FAFBFC' : '#f0f0f0' }}>
        <TableCell padding="checkbox">
          <Checkbox />
        </TableCell>
        <TableCell align="center">{item.postedDate}</TableCell>
        <TableCell align="center">{item.accountName}</TableCell>
        <TableCell align="center">{item.name}</TableCell>
        <TableCell align="center"></TableCell>
        <TableCell onMouseEnter={() => showHoverIcons(item.id)} onMouseLeave={() => hideHoverIcons(item.id)} align="center">
          <Box
            id={`split-buttons-${item.id}`}
            sx={{
              maxHeight: '0px',
              display: 'flex',
              justifyContent: 'center',
              opacity: '0',
              transition: 'opacity 0.3s',
            }}
          >
            <Box
              onClick={() => console.log('1 clicked')}
              sx={{
                padding: '20px',
                textAlign: 'center',
                borderRadius: '10px 0 0 10px',
                backgroundColor: '#808080',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 1,
              }}
            >
              <Iconify icon="ph:folder-light" width={17} />
            </Box>
            <Box
              sx={{
                width: '2px',
              }}
            ></Box>
            <Box
              onClick={() => console.log('2 clicked')}
              sx={{
                padding: '20px',
                textAlign: 'center',
                borderRadius: '0 10px 10px 0',
                backgroundColor: '#808080',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 1,
              }}
            >
              <Iconify icon="material-symbols:upload" width={17} />
            </Box>
          </Box>
          <IconButton
            onClick={() => {
              console.log('eh');
            }}
            sx={{ zIndex: 0, pointerEvents: 'none' }}
            id={`add-photo-${item.id}`}
            disabled={true}
          >
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
              handleGlAccountChange={handleGlAccountChange}
            />
          </React.Fragment>
        );
      })}
    </>
  );
}

export default React.memo(RowItem);
