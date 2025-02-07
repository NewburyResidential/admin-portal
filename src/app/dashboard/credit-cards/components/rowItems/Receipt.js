'use client';

import { useWatch } from 'react-hook-form';

import Box from '@mui/material/Box';
import AddReceiptUpload from '../ReceiptUpload/AddReceiptUpload';
import CircularProgress from '@mui/material/CircularProgress';

export default function Receipt({ receiptIsLoading, setReceiptIsLoading, transaction, recentReceipts, isDragActive, user }) {
  const receiptUrl = useWatch({
    name: `receipt`,
  });
  const hasReceipt = !!receiptUrl;


  return (
    <Box>
      {receiptIsLoading ? (
        <CircularProgress size={20} color="primary" />
      ) : (
        <AddReceiptUpload
          user={user}
          recentReceipts={recentReceipts}
          transaction={transaction}
          setLoading={setReceiptIsLoading}
          hasReceipt={hasReceipt}
          isDragActive={isDragActive}
        />
      )}
    </Box>
  );
}
