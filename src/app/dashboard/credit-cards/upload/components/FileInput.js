'use client';

import React, { useState, useEffect } from 'react';
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
import { Card, Typography, List, ListItem, ListItemText, Divider, Box, IconButton } from '@mui/material';
import Iconify from 'src/components/iconify';
import getSuggestedReceiptsByUploader from 'src/utils/services/cc-expenses/getSuggestedReceiptsByUploader';

export default function FileInput({ employees, user, chartOfAccounts, newburyAssets }) {
  const { open, handleOpen, handleClose } = useDialog();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [suggestedReceipts, setSuggestedReceipts] = useState([]);
  const [isLoadingReceipts, setIsLoadingReceipts] = useState(true);

  // Helper function to format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    const now = new Date();

    // Helper to zero out time for date-only comparison
    const toDateOnly = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

    const dateOnly = toDateOnly(date);
    const nowOnly = toDateOnly(now);

    // Calculate yesterday
    const yesterdayOnly = new Date(nowOnly);
    yesterdayOnly.setDate(nowOnly.getDate() - 1);

    if (dateOnly.getTime() === nowOnly.getTime()) {
      return `Today at ${date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })}`;
    }

    if (dateOnly.getTime() === yesterdayOnly.getTime()) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })}`;
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Helper function to filter and cap recent receipts to 30
  const filterRecentReceipts = (receipts) => {
    if (!receipts || !Array.isArray(receipts)) return [];

    // Sort by timestamp, latest first
    const sortedReceipts = receipts.sort((a, b) => {
      const dateA = new Date(a.timestamp || a.uploadedOn || a.createdAt);
      const dateB = new Date(b.timestamp || b.uploadedOn || b.createdAt);
      return dateB - dateA; // Descending order (latest first)
    });

    // Cap at 30 receipts
    return sortedReceipts.slice(0, 30);
  };

  useEffect(() => {
    const fetchSuggestedReceipts = async () => {
      setIsLoadingReceipts(true);
      try {
        const receipts = await getSuggestedReceiptsByUploader(user.name);
        const recentReceipts = filterRecentReceipts(receipts);
        setSuggestedReceipts(recentReceipts || []);
      } catch (error) {
        console.error('Error fetching suggested receipts:', error);
        setSuggestedReceipts([]);
      } finally {
        setIsLoadingReceipts(false);
      }
    };
    fetchSuggestedReceipts();
  }, [user.name]);

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
      expire: Math.floor(Date.now() / 1000) + 60 * 24 * 60 * 60,
      uploadedOn: getTodaysDate(),
      fileExtension: selectedFile.type.split('/')[1],
      creditCardHolder: data.creditCardHolder.label,
      timestamp: new Date().toISOString(),
      uploadedBy: user.name,
    };

    // Create FormData and append both the file and receipt data
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('receiptData', JSON.stringify(receiptData));

    const responses = await uploadReceipt(formData);
    showResponseSnackbar(responses);
    const receipts = await getSuggestedReceiptsByUploader(user.name);
    const recentReceipts = filterRecentReceipts(receipts);
    setSuggestedReceipts(recentReceipts || []);
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
          message: 'Failed to analyze receipt. Please fill in the details manually.',
        },
      ]);
    } finally {
      setIsWaiting(false);
    }
  };

  const handleViewReceipt = (receipt) => {
    if (receipt.s3Key) {
      // Assuming you have a function to get the S3 URL
      const url = `https://admin-portal-cc-suggested-receipts.s3.us-east-1.amazonaws.com/${receipt.s3Key}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // Helper function to get upload source from pk
  const getUploadSource = (receiptPk) => {
    if (!receiptPk) return '';
    const source = receiptPk.split('-')[0];
    return source.charAt(0).toUpperCase() + source.slice(1); // Capitalize first letter
  };

  return (
    <FormProvider {...methods}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
          gap: '24px',
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

        <Card sx={{ width: '95%', maxWidth: '1200px', p: 4 }}>
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontWeight: 'bold',
              mb: 3,
            }}
          >
            Recently Uploaded
          </Typography>

          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 2,
              py: 1.5,
              backgroundColor: 'grey.50',
              borderRadius: 1,
              mb: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', width: '30%', color: 'text.secondary' }}>
                Merchant
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', width: '15%', textAlign: 'center', color: 'text.secondary' }}>
                Paid by
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', width: '12%', textAlign: 'center', color: 'text.secondary' }}>
                Uploaded On
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', width: '20%', textAlign: 'center', color: 'text.secondary' }}>
                Date
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', width: '15%', textAlign: 'center', color: 'text.secondary' }}>
                Amount
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', width: '8%', textAlign: 'center', color: 'text.secondary' }}>
                View
              </Typography>
            </Box>
          </Box>

          {isLoadingReceipts ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Loading recent receipts...
              </Typography>
            </Box>
          ) : suggestedReceipts.length > 0 ? (
            <List sx={{ p: 0 }}>
              {suggestedReceipts.map((receipt, index) => (
                <React.Fragment key={receipt.pk || index}>
                  <ListItem
                    sx={{
                      px: 2,
                      py: 2,
                      '&:hover': {
                        backgroundColor: 'grey.50',
                        borderRadius: 1,
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <Typography variant="body1" sx={{ fontWeight: 'medium', width: '30%' }}>
                            {receipt.merchantName || 'Unknown Merchant'}
                          </Typography>
                          <Typography variant="body1" sx={{ width: '15%', textAlign: 'center' }}>
                            {receipt.creditCardHolder || ''}
                          </Typography>
                          <Typography variant="body1" sx={{ width: '12%', textAlign: 'center' }}>
                            {getUploadSource(receipt.pk)}
                          </Typography>
                          <Typography variant="body1" sx={{ width: '20%', textAlign: 'center' }}>
                            {formatTimestamp(receipt.timestamp || receipt.uploadedOn || receipt.createdAt)}
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 'bold', width: '15%', textAlign: 'center' }}>
                            ${receipt.chargedAmount || receipt.amount || '0.00'}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '8%' }}>
                            <IconButton
                              onClick={() => handleViewReceipt(receipt)}
                              size="small"
                              sx={{
                                color: 'primary.main',
                                '&:hover': {
                                  backgroundColor: 'primary.light',
                                  color: 'white',
                                },
                              }}
                            >
                              <Iconify icon="mdi:eye" />
                            </IconButton>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < suggestedReceipts.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                No recent receipts found
              </Typography>
            </Box>
          )}
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
        newburyAssets={newburyAssets}
      />
    </FormProvider>
  );
}
