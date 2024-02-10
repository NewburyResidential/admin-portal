'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import AddReceiptUpload from '../ReceiptUpload/AddReceiptUpload';
import CircularProgress from '@mui/material/CircularProgress';

export default function Receipt({ transactionIndex, transaction, recentReceipts }) {
  const { getValues } = useFormContext();
  const receiptUrl = getValues(`transactions[${transactionIndex}].receipt`);
  const [loading, setLoading] = useState(false);
  const hasReceipt = !!receiptUrl;

  return (
    <Box>
      {loading ? (
        <CircularProgress size={20} color="primary" />
      ) : (
        <AddReceiptUpload recentReceipts={recentReceipts} transaction={transaction} transactionIndex={transactionIndex} setLoading={setLoading} hasReceipt={hasReceipt} />
      )}
    </Box>
  );
}
