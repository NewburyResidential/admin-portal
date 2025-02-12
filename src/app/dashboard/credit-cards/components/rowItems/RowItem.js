import { useTheme } from '@mui/material/styles';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
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
import incrementSuggestedReceipt from 'src/utils/services/cc-expenses/incrementSuggestedReceipt';

const RowItem = React.memo(
  ({ transaction, vendors, setVendors, chartOfAccounts, recentReceipts, user, handleRemoveTransaction, transactionIndex }) => {
    // Add a unique ID for this component instance
    // console.log('transaction', transaction);
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

    const isOdd = transactionIndex % 2 === 0;
    const backgroundColor = isOdd ? (isLight ? '#f0f0f0' : '#212B36') : isLight ? '#FAFBFC' : '#2F3944';

    const containerStyle = useMemo(
      () => ({
        display: 'flex',
        pt: 2,
        pb: 3,
        pl: 2,
        alignItems: 'center',
        gap: 2,
        transition: 'all 0.2s ease',
      }),
      []
    );

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
              setValue('suggestedReceiptReference', null);
            }
          } catch (error) {
            console.error('Error uploading file:', error);
            showResponseSnackbar({ severity: 'error', message: 'Error uploading file: too large' });
          } finally {
            setReceiptIsLoading(false);
          }
        }
      },
      [transaction.sk, setValue, showResponseSnackbar]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: {
        'image/png': ['.png'],
        'image/jpeg': ['.jpg', '.jpeg'],
        'application/pdf': ['.pdf'],
      },
      noDrag: false,
      noClick: false,
    });

    const onSubmit = useCallback(
      async (data) => {
        console.log('data', data);

        setIsSubmitting(true);
        const attributesToUpdate = {
          allocations: data.allocations,
          vendor: data.vendor,
          receipt: data.receipt,
          tempPdfReceipt: data.tempPdfReceipt,
          calculationMethod: data.calculationMethod,
          status: user.roles?.includes('admin') ? 'reviewed' : 'categorized',
          // status: 'unapproved',
          ...(data.status === 'unapproved' && { categorizedBy: user.fullName }),
          ...(user.roles?.includes('admin') && { approvedBy: user.fullName }),
        };
        try {
          const updateResponse = await updateTransaction(data.pk, data.sk, attributesToUpdate);
          if (updateResponse.severity === 'success') {
            if (data.suggestedReceiptReference) {
              console.log('data.suggestedReceiptReference', data.suggestedReceiptReference);
              await incrementSuggestedReceipt({ pk: data.suggestedReceiptReference });
            }
            handleRemoveTransaction(data.sk);
          }
          showResponseSnackbar(updateResponse);
        } catch (error) {
          console.error('Error updating transactions:', error);
        }
        setIsSubmitting(false);
      },
      [user, handleRemoveTransaction, showResponseSnackbar]
    );

    return (
      <FormProvider {...methods}>
        <Box
          component="tr"
          sx={{ backgroundColor }}
          {...getRootProps({
            onClick: (e) => e.stopPropagation(),
          })}
        >
          <td colSpan="6" style={{ padding: 0 }}>
            <Box sx={containerStyle}>
              <input {...getInputProps()} />
              <Box sx={{ flex: '0 0 auto', pr: 0, pl: 0, width: '70px', textAlign: 'center' }}>
                <Receipt
                  user={user}
                  receiptIsLoading={receiptIsLoading}
                  setReceiptIsLoading={setReceiptIsLoading}
                  recentReceipts={recentReceipts}
                  transaction={transaction}
                  onClick={(e) => e.stopPropagation()}
                  isDragActive={isDragActive}
                  chartOfAccounts={chartOfAccounts}
                />
              </Box>
              <Box sx={{ flex: 1.5, textAlign: 'center' }}>
                <DropDownVendor vendors={vendors} setVendors={setVendors} merchant={transaction.merchant} />
              </Box>
              <Box sx={{ flex: 1, textAlign: 'center' }}>{titleCase(transaction.name)}</Box>
              <Box sx={{ flex: 1, textAlign: 'center' }}>{transaction.accountName}</Box>
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
          </td>
        </Box>

        {allocationFields.map((allocation, allocationIndex) => (
          <Box component="tr" key={allocation.id} sx={{ backgroundColor }}>
            <td colSpan="6" style={{ padding: 0 }}>
              <RowSubItem
                allocationFields={allocationFields}
                allocationIndex={allocationIndex}
                chartOfAccounts={chartOfAccounts}
                isSplit={isSplit}
                append={append}
                remove={remove}
                totalAmount={transaction.amount}
              />
            </td>
          </Box>
        ))}

        {isSplit && (
          <Box component="tr" sx={{ backgroundColor }}>
            <td colSpan="6" style={{ padding: 0 }}>
              <Box>
                <SplitButtons totalAmount={transaction.amount} control={control} transaction={transaction} />
              </Box>
            </td>
          </Box>
        )}
      </FormProvider>
    );
  }
);

// Use useMemo for the titleCase function
const titleCase = (str) => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default RowItem;
