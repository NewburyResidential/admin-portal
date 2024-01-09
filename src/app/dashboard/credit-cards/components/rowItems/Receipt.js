'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import AddReceiptUpload from './AddReceiptUpload';
import CircularProgress from '@mui/material/CircularProgress';

export default function Receipt({ id, transactionIndex }) {
  const { getValues } = useFormContext();
  const receiptUrl = getValues(`transactions[${transactionIndex}].receipt`);
  const [loading, setLoading] = useState(false);
  const hasReceipt = !!receiptUrl;

  return (
    <Box>
      {loading ? (
        <CircularProgress size={20} color="primary" />
      ) : (
        <AddReceiptUpload id={id} transactionIndex={transactionIndex} setLoading={setLoading} hasReceipt={hasReceipt} />
      )}
    </Box>
  );
}
