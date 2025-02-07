import React from 'react';

import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box';

import ReceiptCard from './ReceiptCard';
import ReceiptTable from './ReceiptTable';
import TransactionCard from './TransactionCard';

const Transition = React.forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function UploadDialog({ open, setOpen, setLoading, transaction, recentReceipts, suggestedReceipts, user }) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
      <AppBar
        sx={{
          position: 'relative',
          backgroundColor: 'primary.darker',
          color: 'white',
        }}
      >
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Choose a Receipt to upload
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ margin: 3 }}>
        <TransactionCard transaction={transaction} />
        {suggestedReceipts?.length > 0 && (
          <>
            <Typography variant="h5" component="p" sx={{ fontStyle: 'italic', marginBottom: '20px', fontWeight: 200, mt: 4 }}>
              Suggested Receipts
            </Typography>
            <ReceiptCard setOpen={setOpen} setLoading={setLoading} id={transaction.sk} suggestedReceipts={suggestedReceipts} />
          </>
        )}
        <Typography variant="h5" component="p" sx={{ fontStyle: 'italic', marginTop: '50px', fontWeight: 200, mt: 4 }}>
          Recent Files
        </Typography>
        <ReceiptTable
          setOpen={setOpen}
          setLoading={setLoading}
          id={transaction.sk}
          recentReceipts={recentReceipts}
          user={user}
          // TODO just adjust this to accountname
          currentCardUsed={transaction.accountName?.replace(/\d+/g, '').trim()}
        />
      </Box>
    </Dialog>
  );
}
