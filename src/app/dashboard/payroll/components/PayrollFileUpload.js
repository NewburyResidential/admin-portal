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
import { getWaveWithdrawalPayload, getWaveWithdrawalPayloads } from './utils/payroll/getWaveWithdrawalPayloads';

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
  setSummaryData,
}) => {
  const { showResponseSnackbar } = useSnackbar();

  const healthBenefitAccounts = ['222401', '222402', '222403'];

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
            const employerBenefitByEmployee = {};

            const dataByEmployee = {};
            const employeeHandlingGl = {};

            // First pass: Group data by employee
            results.data.forEach((row) => {
              const employeeId = row['Employee ID']?.trim() || '';
              if (!dataByEmployee[employeeId]) {
                dataByEmployee[employeeId] = [];
              }
              dataByEmployee[employeeId].push(row);
            });

            // Process rows once to get employee labels
            results.data.forEach((row) => {
              const employeeId = row['Employee ID']?.trim() || '';
              const account = (row.Account || row.account)?.trim();

              // Only process if we haven't found a label for this employee yet
              if (!employeeHandlingGl[employeeId] && account in wageAccountOptions) {
                employeeHandlingGl[employeeId] = wageAccountOptions[account].handlingGl;
              }
            });

            console.log('Employee Handling GL:', employeeHandlingGl);
            console.log('dataByEmployee', dataByEmployee);

            // Now create duplicate entries for health benefits with corresponding handling GL entries
            const newEntries = [];
            results.data.forEach((row) => {
              const employeeId = row['Employee ID']?.trim() || '';
              const account = (row.Account || row.account)?.trim();

              if (healthBenefitAccounts.includes(account)) {
                const rawAmount = row['Debit Amount'] || row['Credit Amount'] || '0';
                try {
                  const amount = new Big(rawAmount);
                  if (!amount.eq(0)) {
                    // Create a duplicate row with 1.5x amount for the health benefit
                    const currentAccountDescription = row['Account Descripton']?.trim() || '';
                    const duplicateRow = { ...row };
                    const employerAmount = amount.times(1.5).round(2);
                    duplicateRow['Credit Amount'] = employerAmount.toString();
                    duplicateRow['Debit Amount'] = ''; // Clear debit amount if it exists
                    duplicateRow['Account Descripton'] = `${currentAccountDescription} Employer Cost`;
                    newEntries.push(duplicateRow);

                    // Create a corresponding entry with the employee's handling GL
                    const handlingGlRow = { ...row };
                    handlingGlRow.Account = employeeHandlingGl[employeeId].toString();
                    handlingGlRow['Credit Amount'] = ''; // Clear credit amount if it exists
                    handlingGlRow['Debit Amount'] = employerAmount.toString();
                    handlingGlRow['Account Descripton'] = 'Handling For Benefits';
                    newEntries.push(handlingGlRow);
                  }
                } catch (e) {
                  // Skip invalid amounts
                }
              }
            });

            // Add all new entries to results.data
            results.data.push(...newEntries);

            // Next pass: combine amounts by propertyId and glAccountId
            results.data.forEach((row) => {
              const locationId = row['Location ID']?.trim() || '';
              const asset = assetObject[locationId];
              const glAccountId = (row.Account || row.account)?.trim() || '';
              const employeeId = row['Employee ID']?.trim() || '';

              if (!asset) return;

              // Convert amount to Big.js and validate
              const rawAmount = row['Debit Amount'] || row['Credit Amount'] || '0';
              let amount;
              let employerAmount;
              try {
                amount = new Big(rawAmount);
                if (amount.eq(0)) return; // Skip zero amounts

                // Multiply by 1.5 if account is a health benefit account
                // if (false) {
                //   // if (false) {
                //   employerAmount = amount.times(1.5).round(2); // round to 2 decimal places
                //   amount = employerAmount.plus(amount);

                //   // Track employer benefits by employee
                //   if (employeeId) {
                //     if (!employerBenefitByEmployee[employeeId]) {
                //       employerBenefitByEmployee[employeeId] = {
                //         employerAmount: new Big(0),
                //         assetId: asset.id,
                //       };
                //     }
                //     employerBenefitByEmployee[employeeId].employerAmount =
                //       employerBenefitByEmployee[employeeId].employerAmount.plus(employerAmount);
                //   }
                //     }
              } catch (e) {
                return; // Skip invalid amounts
              }

              const key = `${asset.id}-${glAccountId}`;
              //  console.log(row);

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

            // After processing all rows, match employer benefits with aggregated amounts
            Object.entries(employerBenefitByEmployee).forEach(([employeeId, employerData]) => {
              // Find matching employee in propertiesByEmployeeObject
              const employeeData = propertiesByEmployeeObject[employeeId];
              if (employeeData) {
                // Create key using assetId and handlingGl
                const key = `${employerData.assetId}-${employeeData.handlingGl}`;

                // Find matching entry in aggregatedAmounts
                const matchingEntry = aggregatedAmounts.get(key);
                if (matchingEntry) {
                  // Add employer amount to the existing amount
                  matchingEntry.amount = matchingEntry.amount.plus(employerData.employerAmount);
                } else {
                  throw new Error('No matching entry found for employer benefit');
                }
              } else {
                throw new Error('No matching employee found for employer benefit');
              }
            });

            // Convert Big.js numbers to strings for console logging

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
              const { propertyId } = entry;
              if (!acc[propertyId]) {
                acc[propertyId] = { amount: new Big(0) };
              }
              acc[propertyId].amount = acc[propertyId].amount.plus(entry.amount);
              return acc;
            }, {});

            const transferAmounts = withdrawalEntries.reduce((acc, entry) => {
              const { propertyId } = entry;
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

            console.log('depositEntriesByAsset', depositEntriesByAsset);
            console.log(
              'waveDepositPayloads',
              getWaveDepositPayloads(depositEntriesByAsset, normalDate, weirdDate, propertyAmounts, fileName)
            );

            const waveDepositPayloads = getWaveDepositPayloads(depositEntriesByAsset, normalDate, weirdDate, propertyAmounts, fileName);

            setPayloads({
              waveTax: getWaveTaxPayload(results.data, normalDate, weirdDate, fileName),
              waveOperating: getWaveOperatingPayload(operatingEntries, normalDate, weirdDate, fileName),
              waveDeposits: waveDepositPayloads,
              entrataWithdrawal: getEntrataWithdrawalPayload(withdrawalEntries, normalDate, fileName),
              waveWithdrawals: getWaveWithdrawalPayloads(waveDepositPayloads, normalDate, weirdDate, fileName),
            });

            // Calculate direct deposits by property
            const directDepositsByProperty = {};
            Object.entries(propertiesByEmployeeObject).forEach(([employeeId, employeeData]) => {
              Object.entries(employeeData.properties).forEach(([propertyId, amount]) => {
                if (!directDepositsByProperty[propertyId]) {
                  directDepositsByProperty[propertyId] = {
                    propertyId,
                    amount: new Big(0),
                  };
                }
                directDepositsByProperty[propertyId].amount = directDepositsByProperty[propertyId].amount.plus(amount);
              });
            });

            // Store summary data for the new summary view
            setSummaryData({
              entrataWithdrawal: withdrawalEntries,
              waveOperating: operatingEntries,
              waveDeposits: depositEntriesByAsset,
              directDeposits: directDepositsByProperty,
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
      if (payloads.waveWithdrawals) totalSteps += payloads.waveWithdrawals.length;
      if (payloads.entrataWithdrawal) totalSteps++;

      console.log('payloads', payloads);

      let completedSteps = 0;
      const responses = [];

      if (payloads.waveWithdrawals && payloads.waveWithdrawals.length > 0) {
        for (const payload of payloads.waveWithdrawals) {
          const waveWithdrawalResponse = await postWaveTransaction({
            payload,
            successTitle: 'Wave Withdrawals Posted',
            errorTitle: 'Error Posting Wave Withdrawal',
          });
          responses.push(waveWithdrawalResponse);
          completedSteps++;
          setProgress((completedSteps / totalSteps) * 100);
        }
      }

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
      waveWithdrawals: null,
      entrataWithdrawal: null,
    });
    setSummaryData(null);
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
              View Totals by Property
            </Button>

            <Button
              variant={view === 'payrollSummary' ? 'contained' : 'outlined'}
              color={view === 'payrollSummary' ? 'primary' : 'inherit'}
              sx={{ width: '100%' }}
              onClick={() => {
                setView('payrollSummary');
              }}
            >
              View Detailed Summary
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
