'use client';

import { useState, useRef } from 'react';
import { useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Iconify from 'src/components/iconify';
import IconButton from '@mui/material/IconButton';

import AddReceiptUpload from './AddReceiptUpload';
import AddReceiptStorage from './AddReceiptStorage';
import CircularProgress from '@mui/material/CircularProgress';

export default function Receipt({ id, transactionIndex }) {
  const { getValues } = useFormContext();
  const receiptUrl = getValues(`transactions[${transactionIndex}].receipt`);
  const [loading, setLoading] = useState(false);
  const hasReceipt = !!receiptUrl

  const splitButtonsRef = useRef(null);
  const addPhotoRef = useRef(null);

  const showHoverIcons = () => {
    if (splitButtonsRef.current && addPhotoRef.current) {
      splitButtonsRef.current.style.opacity = '1';
      addPhotoRef.current.style.opacity = '0';
    }
  };

  const hideHoverIcons = () => {
    if (splitButtonsRef.current && addPhotoRef.current) {
      splitButtonsRef.current.style.opacity = '0';
      addPhotoRef.current.style.opacity = '1';
    }
  };
  return (
    <Box onMouseEnter={() => showHoverIcons()} onMouseLeave={() => hideHoverIcons()}>
      <Box
        ref={splitButtonsRef}
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
        <AddReceiptUpload transactionIndex={transactionIndex} id={id} setLoading={setLoading} hideHover={() => hideHoverIcons()} />
      </Box>
      {loading ? (
        <CircularProgress size={20} color="primary" />
      ) : (
        <IconButton ref={addPhotoRef} disabled>
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
