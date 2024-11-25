'use client';

import { useWatch } from 'react-hook-form';

import Box from '@mui/material/Box';
import AddReceiptUpload from '../ReceiptUpload/AddReceiptUpload';
import CircularProgress from '@mui/material/CircularProgress';

export default function Receipt({ receiptIsLoading, setReceiptIsLoading, transaction, recentReceipts, isDragActive }) {
  const receiptUrl = useWatch({
    name: `receipt`,
  });
  const hasReceipt = !!receiptUrl;

  console.log('receiptUrl:', receiptUrl);

  return (
    <Box>
      {receiptIsLoading ? (
        <CircularProgress size={20} color="primary" />
      ) : (
        <AddReceiptUpload
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
