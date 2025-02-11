'use client';

import React, { useState } from 'react';
import { analyzeReceipt } from 'src/utils/services/cc-expenses/analyze-receipts';
import useDialog from 'src/components/custom-dialog/use-dialog';
import UploadSingleFile from 'src/components/upload-files/UploadSingleFile';
import ReceiptFormDigalog from './ReceiptFormDigalog';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import { receiptSchema } from './utils/receipt-schema';
import { v4 as uuidv4 } from 'uuid';
import { getTodaysDate } from 'src/utils/format-time';
import uploadReceipt from 'src/utils/services/cc-expenses/uploadReceipt';
import { useSnackbar } from 'src/utils/providers/SnackbarProvider';
import { Card, Typography } from '@mui/material';

export default function FileInput({ employees, user, chartOfAccounts }) {
  const { open, handleOpen, handleClose } = useDialog();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const pk = `web-${uuidv4()}`;

  const { showResponseSnackbar } = useSnackbar();

  const onClose = () => {
    handleClose();
    reset();
  };

  // Add form initialization

  const employeeOptions = employees.map((employee) => ({
    label: employee.fullName,
    value: employee.pk,
  }));

  const defaultCardOwner = employeeOptions.find((employee) => employee.label === user.name) || null;

  const transaction = {
    amount: '',
    calculationMethod: 'amount',
    merchantName: '',
    transactionDate: '',
    receiptAiSummary: '',
    allocations: [
      {
        sk: 1,
        amount: '',
        helper: '100',
        note: '',
        account: '',
        asset: null,
        glAccount: null,
      },
    ],
  };

  const methods = useForm({
    defaultValues: {
      ...transaction,
      creditCardHolder: defaultCardOwner,
    },
    resolver: yupResolver(receiptSchema),
  });

  const {
    control,
    reset,
    setValue,
    handleSubmit,
    formState: { errors },
  } = methods;
  console.log(errors);

  const {
    fields: allocationFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `allocations`,
  });

  const onSubmit = async (data) => {
    console.log(data);
    setIsUploading(true);
    const s3Key = `${pk}.${selectedFile.type.split('/')[1]}`;

    const transformedAllocations = data.allocations.map((allocation) => ({
      ...allocation,
      asset: {
        accountId: allocation.asset.accountId,
      },
      glAccount: {
        accountId: allocation.glAccount.accountId,
      },
    }));

    const receiptData = {
      ...data,
      pk,
      s3Key,
      chargedAmount: data.amount,
      allocations: transformedAllocations,
      expire: Math.floor(Date.now() / 1000) + 45 * 24 * 60 * 60,
      uploadedOn: getTodaysDate(),
      fileExtension: selectedFile.type.split('/')[1],
      creditCardHolder: data.creditCardHolder.label,
    };

    // Create FormData and append both the file and receipt data
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('receiptData', JSON.stringify(receiptData));

    const responses = await uploadReceipt(formData);
    showResponseSnackbar(responses);
    setIsUploading(false);
    onClose();
  };

  const onFileChange = async (file) => {
    if (!file) return;
    setSelectedFile(file);
    reset();
    handleOpen();

    setIsWaiting(true);
    try {
      const MAX_SIZE_MB = 1;
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        throw new Error(`File size exceeds ${MAX_SIZE_MB}MB limit for AI analysis. The receipt will be uploaded without AI analysis.`);
      }

      const fileBuffer = await file.arrayBuffer();
      const base64String = Buffer.from(fileBuffer).toString('base64');

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Receipt analysis timed out after 10 seconds')), 10000)
      );

      const results = await Promise.race([analyzeReceipt(base64String), timeoutPromise]);

      const { data } = results;
      setValue('merchantName', data.merchant);
      setValue('amount', data.total);
      setValue('transactionDate', data.date);
      setValue('receiptAiSummary', data.summary);
      setValue('allocations[0].amount', data.total);
    } catch (error) {
      console.error('Error analyzing receipt:', error);
      showResponseSnackbar([
        {
          severity: 'warning',
          message: 'Error occured with Ai analysis' || 'Failed to analyze receipt. Please fill in the details manually.',
        },
      ]);
    } finally {
      setIsWaiting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
        }}
      >
        <Card sx={{ width: '95%', maxWidth: '1200px', p: 4 }}>
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontWeight: 'bold',
              mb: 3,
            }}
          >
            Upload Receipt
          </Typography>
          <UploadSingleFile
            accept={{
              'image/jpeg': ['.jpg', '.jpeg'],
              'image/png': ['.png'],
              'image/webp': ['.webp'],
              'application/pdf': ['.pdf'],
              'image/heic': ['.heic'],
              'image/heif': ['.heif'],
            }}
            onFileChange={onFileChange}
          />
        </Card>
      </div>
      <ReceiptFormDigalog
        employees={employees}
        user={user}
        open={open}
        onClose={onClose}
        isWaiting={isWaiting}
        allocationFields={allocationFields}
        append={append}
        remove={remove}
        employeeOptions={employeeOptions}
        chartOfAccounts={chartOfAccounts}
        onSubmit={onSubmit}
        isUploading={isUploading}
      />
    </FormProvider>
  );
}
