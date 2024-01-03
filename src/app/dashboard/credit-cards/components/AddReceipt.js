'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Iconify from 'src/components/iconify';
import IconButton from '@mui/material/IconButton';

import AddReceiptUpload from './AddReceiptUpload';
import AddReceiptStorage from './AddReceiptStorage';
import CircularProgress  from '@mui/material/CircularProgress';

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

export default function AddReceipt({ item, handleReceiptChange }) {
  const [loading, setLoading] = useState(false);
  const hasReceipt = item.receipt !== null && item.receipt !== undefined && item.receiptUrl !== '';

  return (
    <Box onMouseEnter={() => showHoverIcons(item.id)} onMouseLeave={() => hideHoverIcons(item.id)}>
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
        <AddReceiptStorage />
        <Box
          sx={{
            width: '2px',
          }}
        />
        <AddReceiptUpload
          id={item.id}
          handleReceiptChange={handleReceiptChange}
          setLoading={setLoading}
          hideHover={() => hideHoverIcons(item.id)}
        />
      </Box>
      {loading ? (
        <CircularProgress size={20} color='primary' />
      ) : (
        <IconButton id={`add-photo-${item.id}`} disabled>
          {hasReceipt ? (
            <Iconify icon="carbon:receipt" color="#169B62" width={25} />
          ) : (
            <Iconify icon="material-symbols-light:attach-file-add-rounded" color="#CD5C5C" width={25} />
          )}
        </IconButton>
      )}
    </Box>
  );
}
