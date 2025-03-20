'use client';

import React, { useState } from 'react';
import Papa from 'papaparse';
import UploadSingleFile from 'src/components/upload-files/UploadSingleFile';
import { getWaveTaxPayload } from './utils/payroll/getWaveTaxPayload';
import { getWaveOperatingPayload } from './utils/payroll/getWaveOperatingPayload';
import { getWaveDepositPayloads } from './utils/payroll/getWaveDepositPayload';
import { getEntrataWithdrawalPayload } from './utils/payroll/getEntrataWithdrawalPayload';
import { entrataGlConversion, wageAccountOptions } from './utils/account-options';
import { Button, Card, Stack, IconButton, Typography, LinearProgress } from '@mui/material';
import { useSnackbar } from 'src/utils/providers/SnackbarProvider';
import { postWaveTransaction } from 'src/utils/services/wave/postWaveTransaction';
import Big from 'big.js';
import { postEntrataInvoice } from 'src/utils/services/entrata/postEntrataInvoice';
import snackbarCatchErrorResponse from 'src/components/response-snackbar/utility/snackbarCatchErrorResponse';
import { fileThumb } from 'src/components/file-thumbnail/utils';
import Iconify from 'src/components/iconify';
import { alpha } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';

import { calculatePropertyPercentages } from './utils/calculatePropertyPercentages';

const PayrollFileUpload = ({
  normalDate,
  weirdDate,
  view,
  setView,
  handleReset,
  assetObject,
  onPropertyPercentages,
  payrollFile,
  setPayrollFile,
  setPayrollDistribution,
  setPropertiesByEmployee,
}) => {
  const { showResponseSnackbar } = useSnackbar();

  const [payloads, setPayloads] = useState({
    waveTax: null,
    waveOperating: null,
    waveDeposits: null,
    entrataWithdrawal: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const updatePropertyAmount = (propertyAmounts, propertyId, amount) => {
    if (!propertyAmounts[propertyId]) {
      propertyAmounts[propertyId] = new Big(0);
    }
    propertyAmounts[propertyId] = propertyAmounts[propertyId].plus(amount);
  };

  const handleReviewFile = (uploadedFile) => {
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        Papa.parse(event.target.result, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const aggregatedAmounts = new Map();
            const propertiesByEmployeeObject = {};

            // First pass: combine amounts by propertyId and glAccountId
            results.data.forEach((row) => {
              const locationId = row['Location ID']?.trim() || '';
              const asset = assetObject[locationId];
              const glAccountId = (row.Account || row.account)?.trim() || '';
              const employeeId = row['Employee ID']?.trim() || '';

              if (!asset) return;

              // Convert amount to Big.js and validate
              const rawAmount = row['Debit Amount'] || row['Credit Amount'] || '0';
              let amount;
              try {
                amount = new Big(rawAmount);
                if (amount.eq(0)) return; // Skip zero amounts
              } catch (e) {
                return; // Skip invalid amounts
              }

              const key = `${asset.id}-${glAccountId}`;

              // Set up Data aggregation
              if (!aggregatedAmounts.has(key)) {
                aggregatedAmounts.set(key, {
                  propertyId: asset.id,
                  originalGlId: glAccountId,
                  entrataGl: entrataGlConversion[glAccountId],
                  label: asset.label,
                  accountingSoftware: asset.accountingSoftware,
                  description: row['Account Descripton']?.trim() || '',
                  amount: new Big(0),
                });
              }
              aggregatedAmounts.get(key).amount = aggregatedAmounts.get(key).amount.plus(amount);

              // Add employee wage tracking
              if (employeeId && glAccountId in wageAccountOptions) {
                if (!propertiesByEmployeeObject[employeeId]) {
                  propertiesByEmployeeObject[employeeId] = {
                    label: wageAccountOptions[glAccountId].label,
                    handlingGl: wageAccountOptions[glAccountId].handlingGl,
                    account: glAccountId,
                    properties: {},
                  };
                }

                if (!propertiesByEmployeeObject[employeeId].properties[asset.id]) {
                  propertiesByEmployeeObject[employeeId].properties[asset.id] = new Big(0);
                }

                propertiesByEmployeeObject[employeeId].properties[asset.id] =
                  propertiesByEmployeeObject[employeeId].properties[asset.id].plus(amount);
              }
            });
            setPropertiesByEmployee(propertiesByEmployeeObject);
            const propertyPercentages = calculatePropertyPercentages(propertiesByEmployeeObject);
            onPropertyPercentages(propertyPercentages);

            const withdrawalEntries = [];
            const operatingEntries = [];
            const depositEntriesByAsset = {};
            const propertyAmounts = {};

            // Second pass: Create apDetails for valid entries

            aggregatedAmounts.forEach((entry) => {
              if (entry.accountingSoftware === 'entrata' && entry.entrataGl) {
                // Prepare Entrata Withdrawal data
                withdrawalEntries.push({
                  propertyId: entry.propertyId,
                  glAccountId: entry.entrataGl,
                  description: `${entry.label}`,
                  rate: entry.amount.toString(),
                });
                updatePropertyAmount(propertyAmounts, entry.propertyId, entry.amount);
              } else if (entry.entrataGl) {
                // Prepare Wave Operating Data data
                operatingEntries.push(entry);
                updatePropertyAmount(propertyAmounts, entry.propertyId, entry.amount);
              } else {
                //  Prepare Wave Deposit Data
                if (!depositEntriesByAsset[entry.propertyId]) {
                  depositEntriesByAsset[entry.propertyId] = [];
                }
                depositEntriesByAsset[entry.propertyId].push(entry);
              }
            });
            const operatingTransferAmount = operatingEntries.reduce((acc, entry) => {
              const {propertyId} = entry;
              if (!acc[propertyId]) {
                acc[propertyId] = { amount: new Big(0) };
              }
              acc[propertyId].amount = acc[propertyId].amount.plus(entry.amount);
              return acc;
            }, {});

            const transferAmounts = withdrawalEntries.reduce((acc, entry) => {
              const {propertyId} = entry;
              const amount = new Big(entry.rate);

              if (!acc[propertyId]) {
                acc[propertyId] = { amount: new Big(0) };
              }

              acc[propertyId].amount = acc[propertyId].amount.plus(amount);

              return acc;
            }, {});

            // Add operatingTransferAmount to transferAmounts
            Object.entries(operatingTransferAmount).forEach(([propertyId, { amount }]) => {
              if (!transferAmounts[propertyId]) {
                transferAmounts[propertyId] = { amount: new Big(0) };
              }
              transferAmounts[propertyId].amount = transferAmounts[propertyId].amount.plus(amount);
            });

            setPayrollDistribution(transferAmounts);
            setView('payrollAmounts');
            const fileName = uploadedFile.name;

            console.log(getWaveDepositPayloads(depositEntriesByAsset, normalDate, weirdDate, propertyAmounts, fileName));
            setPayloads({
              waveTax: getWaveTaxPayload(results.data, normalDate, weirdDate, fileName),
              waveOperating: getWaveOperatingPayload(operatingEntries, normalDate, weirdDate, fileName),
              waveDeposits: getWaveDepositPayloads(depositEntriesByAsset, normalDate, weirdDate, propertyAmounts, fileName),
              entrataWithdrawal: getEntrataWithdrawalPayload(withdrawalEntries, normalDate, fileName),
            });
          },
        });
      };
      reader.readAsText(uploadedFile);
    }
    setPayrollFile(uploadedFile);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setProgress(0);
    try {
      let totalSteps = 0;
      if (payloads.waveTax) totalSteps++;
      if (payloads.waveOperating) totalSteps++;
      if (payloads.waveDeposits) totalSteps += payloads.waveDeposits.length;
      if (payloads.entrataWithdrawal) totalSteps++;

      let completedSteps = 0;
      const responses = [];

      if (payloads.waveTax) {
        const waveTaxResponse = await postWaveTransaction({
          payload: payloads.waveTax,
          successTitle: 'Wave Tax Withdrawal Posted',
          errorTitle: 'Error Posting Wave Tax Withdrawal',
        });
        responses.push(waveTaxResponse);
        completedSteps++;
        setProgress((completedSteps / totalSteps) * 100);
      }

      if (payloads.waveOperating) {
        const waveOperatingResponse = await postWaveTransaction({
          payload: payloads.waveOperating,
          successTitle: 'Wave Operating Withdrawal Posted',
          errorTitle: 'Error Posting Wave Operating Withdrawal',
        });
        responses.push(waveOperatingResponse);
        completedSteps++;
        setProgress((completedSteps / totalSteps) * 100);
      }

      if (payloads.waveDeposits && payloads.waveDeposits.length > 0) {
        for (const payload of payloads.waveDeposits) {
          const waveDepositResponse = await postWaveTransaction({
            payload,
            successTitle: 'Wave Deposit Posted',
            errorTitle: 'Error Posting Wave Deposit',
          });
          responses.push(waveDepositResponse);
          completedSteps++;
          setProgress((completedSteps / totalSteps) * 100);
        }
      }

      if (payloads.entrataWithdrawal) {
        const entrataWithdrawalResponse = await postEntrataInvoice({
          payload: payloads.entrataWithdrawal,
          successTitle: 'Entrata Payroll Posted',
          errorTitle: 'Error Posting Entrata Payroll',
        });
        responses.push(entrataWithdrawalResponse);
        completedSteps++;
        setProgress((completedSteps / totalSteps) * 100);
      }

      showResponseSnackbar(responses);
    } catch (error) {
      const errorResponse = snackbarCatchErrorResponse(error, 'Error Posting Transactions');
      showResponseSnackbar(errorResponse);
    } finally {
      setIsSubmitting(false);
      setProgress(0);
    }
  };

  const handleRemoveFile = () => {
    handleReset();
    setPayloads({
      waveTax: null,
      waveOperating: null,
      waveDeposits: null,
      entrataWithdrawal: null,
    });
  };

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Stack spacing={2} alignItems="center">
        <Typography variant="h6" sx={{ mb: 2 }}>
          Upload Payroll File
        </Typography>

        {!payrollFile ? (
          <UploadSingleFile accept={{ 'text/csv': ['.csv'] }} file={payrollFile} onFileChange={handleReviewFile} sx={{ width: '100%' }} />
        ) : (
          <Card
            sx={{
              p: 5,
              width: 1,
              maxWidth: 320,
              borderRadius: 1,
              overflow: 'hidden',
              position: 'relative',
              bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
              border: (theme) => `1px dashed ${alpha(theme.palette.grey[500], 0.2)}`,
            }}
          >
            <IconButton
              size="small"
              onClick={handleRemoveFile}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                color: 'error.main',
                '&:hover': {
                  bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
                },
              }}
            >
              <Iconify icon="solar:trash-bin-trash-bold" width={32} />
            </IconButton>

            <Stack spacing={3} alignItems="center">
              <img src={fileThumb(payrollFile.name)} alt="csv" style={{ width: '100%', maxWidth: 200 }} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {payrollFile.name}
              </Typography>
            </Stack>
          </Card>
        )}

        {payrollFile && Object.values(payloads).some((payload) => payload !== null) && (
          <Stack spacing={1} width="100%" maxWidth={320}>
            <Button
              variant={view === 'payrollAmounts' ? 'contained' : 'outlined'}
              color={view === 'payrollAmounts' ? 'primary' : 'inherit'}
              sx={{ width: '100%' }}
              onClick={() => {
                setView('payrollAmounts');
              }}
            >
              View
            </Button>

            <LoadingButton loading={isSubmitting} variant="contained" color="inherit" onClick={handleSubmit} sx={{ width: '100%' }}>
              Submit Payroll Transactions
            </LoadingButton>
            <LinearProgress
              variant="determinate"
              value={progress}
              aria-label="Processing file"
              sx={{
                visibility: isSubmitting ? 'visible' : 'hidden',
              }}
            />
          </Stack>
        )}
      </Stack>
    </Card>
  );
};

export default PayrollFileUpload;
