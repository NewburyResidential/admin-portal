import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Iconify from 'src/components/iconify';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

export default function AddReceiptStorage() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box
        onClick={handleClickOpen}
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

      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Coming Soon!</DialogTitle>
      </Dialog>
    </>
  );
}
