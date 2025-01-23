import { useTheme } from '@mui/material/styles';
import React, { useEffect, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import Box from '@mui/material/Box';

import Receipt from './Receipt';
import DropDownVendor from './DropDownVendor';
import RowSubItem from '../rowSubItems/RowSubItem';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import SplitButtons from './SplitButtons';
import { LoadingButton } from '@mui/lab';
import { fConvertFromEuropeDate } from 'src/utils/format-time';
import { yupResolver } from '@hookform/resolvers/yup';
import { transactionsSchema } from '../utils/transactions-schema';
import updateTransaction from 'src/utils/services/cc-expenses/updateTransaction';
import { useSnackbar } from 'src/utils/providers/SnackbarProvider';
import { uploadS3Image } from 'src/utils/services/cc-expenses/uploadS3Image';

export default function RowItem({
  transaction,
  transactionIndex,
  vendors,
  setVendors,
  chartOfAccounts,
  recentReceipts,
  user,
  handleRemoveTransaction,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiptIsLoading, setReceiptIsLoading] = useState(false);
  const { showResponseSnackbar } = useSnackbar();

  const methods = useForm({
    defaultValues: transaction,
    resolver: yupResolver(transactionsSchema),
  });

  const { control, handleSubmit, reset, setValue } = methods;

  useEffect(() => {
    reset(transaction);
  }, [transaction, reset]);

  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const {
    fields: allocationFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `allocations`,
  });

  const isSplit = allocationFields.length > 1;

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setReceiptIsLoading(true);

        const file = acceptedFiles[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', transaction.sk);
        formData.append('bucket', 'admin-portal-receipts');

        try {
          const response = await uploadS3Image(formData);
          if (response) {
            setValue('receipt', response.fileUrl);
            setValue('tempPdfReceipt', response.tempPdfUrl);
          }
        } catch (error) {
          console.error('Error uploading file:', error);
        } finally {
          setReceiptIsLoading(false);
        }
      }
    },
    [transaction.sk, setValue, setReceiptIsLoading]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/png, image/jpeg, application/pdf',
    noDrag: false,
    noClick: false,
  });

  const backgroundColor = transactionIndex % 2 !== 0 ? (isLight ? '#FAFBFC' : '#2F3944') : isLight ? '#f0f0f0' : '#212B36';

  const containerStyle = {
    display: 'flex',
    backgroundColor,
    pt: 2,
    pb: 3,
    pl: 2,
    alignItems: 'center',
    gap: 2,
    transition: 'all 0.2s ease',
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const attributesToUpdate = {
      allocations: data.allocations,
      vendor: data.vendor,
      receipt: data.receipt,
      tempPdfReceipt: data.tempPdfReceipt,
      calculationMethod: data.calculationMethod,
      status: user.roles?.includes('admin') ? 'reviewed' : 'categorized',
      ...(data.status === 'unapproved' && { categorizedBy: user.fullName }),
      ...(user.roles?.includes('admin') && { approvedBy: user.fullName }),
    };
    try {
      const response = await updateTransaction(data.pk, data.sk, attributesToUpdate);
      showResponseSnackbar(response);
      if (response.severity === 'success') {
        handleRemoveTransaction(data.sk);
      }
    } catch (error) {
      console.error('Error updating transactions:', error);
    }
    setIsSubmitting(false);
  };

  return (
    <FormProvider {...methods}>
      <Box
        {...getRootProps({
          onClick: (e) => e.stopPropagation(),
        })}
        sx={containerStyle}
      >
        <input {...getInputProps()} />
        <Box sx={{ flex: '0 0 auto', pr: 0, pl: 0, width: '70px', textAlign: 'center' }}>
          <Receipt
            receiptIsLoading={receiptIsLoading}
            setReceiptIsLoading={setReceiptIsLoading}
            recentReceipts={recentReceipts}
            transaction={transaction}
            onClick={(e) => e.stopPropagation()}
            isDragActive={isDragActive}
          />
        </Box>
        <Box sx={{ flex: 1.5, textAlign: 'center' }}>
          <DropDownVendor vendors={vendors} setVendors={setVendors} merchant={transaction.merchant} />
        </Box>
        <Box sx={{ flex: 1, textAlign: 'center' }}>{titleCase(transaction.name)}</Box>
        <Box sx={{ flex: 1, textAlign: 'center' }}>{transaction.accountName}</Box>{' '}
        <Box sx={{ flex: 1, textAlign: 'center', minWidth: '10%' }}>{fConvertFromEuropeDate(transaction.transactionDate)}</Box>
        <Box sx={{ flex: 0.88, textAlign: 'center', pr: 1 }}>
          <LoadingButton
            sx={{ width: '100px' }}
            variant={transaction.status === 'categorized' ? 'contained' : 'outlined'}
            onClick={handleSubmit(onSubmit)}
            loading={isSubmitting}
            color={transaction.status === 'categorized' ? 'success' : 'inherit'}
          >
            {transaction.status === 'categorized' ? 'Approve' : 'Submit'}
          </LoadingButton>
        </Box>
      </Box>

      {allocationFields.map((allocation, allocationIndex) => (
        <Box key={allocation.id}>
          <RowSubItem
            allocationFields={allocationFields}
            allocationIndex={allocationIndex}
            chartOfAccounts={chartOfAccounts}
            backgroundColor={backgroundColor}
            totalAmount={transaction.amount}
            isSplit={isSplit}
            append={append}
            remove={remove}
          />
        </Box>
      ))}
      {isSplit && (
        <SplitButtons totalAmount={transaction.amount} control={control} transaction={transaction} backgroundColor={backgroundColor} />
      )}
    </FormProvider>
  );
}

function titleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
