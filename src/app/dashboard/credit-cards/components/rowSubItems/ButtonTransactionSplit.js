import React from 'react';
import IconButton from '@mui/material/IconButton';
import Iconify from 'src/components/iconify/iconify';

export default function ButtonTransactionSplit({ isDefault, handleTransactionSplit }) {
  return (
    <IconButton onClick={handleTransactionSplit} >
      <Iconify icon={isDefault ? 'material-symbols:arrow-split-rounded' : 'fluent:delete-12-regular'} />
    </IconButton>
  );
}
