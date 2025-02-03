import React, { useState } from 'react';
import { Card, CardContent, TextField, Button, Box, LinearProgress } from '@mui/material';
import Big from 'big.js';
import { getEntrataWithdrawalPayload } from './utils/amount/getEntrataWithdrawalPayload';
import snackbarCatchErrorResponse from 'src/components/response-snackbar/utility/snackbarCatchErrorResponse';
import { postWaveTransaction } from 'src/utils/services/wave/postWaveTransaction';
import { postEntrataInvoice } from 'src/utils/services/entrata/postEntrataInvoice';
import { getWaveOperatingPayload } from './utils/amount/getWaveOperatingPayload';
import { useSnackbar } from 'src/utils/providers/SnackbarProvider';
import { LoadingButton } from '@mui/lab';

const ManualAmountInput = ({
  propertyPercentages,
  setManualDistribution,
  setView,
  view,
  propertiesByEmployee,
  manualDistribution,
  assets,
  normalDate,
  weirdDate,
}) => {
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const { showResponseSnackbar } = useSnackbar();

  const calculateDistribution = (value) => {
    if (!value) return {};

    const totalAmount = new Big(value);
    const newDistribution = {};

    // First pass: calculate exact amounts
    let remainingAmount = totalAmount;
    const entries = Object.entries(propertyPercentages);

    entries.forEach(([propertyId, data], index) => {
      const isLast = index === entries.length - 1;
      if (isLast) {
        // Last entry gets the remaining amount to prevent rounding errors
        newDistribution[propertyId] = {
          amount: Number(remainingAmount.toFixed(2)),
        };
      } else {
        const propertyAmount = totalAmount.times(data.totalPercent).div(100);
        const roundedAmount = Number(propertyAmount.toFixed(2));
        remainingAmount = remainingAmount.minus(roundedAmount);
        newDistribution[propertyId] = {
          amount: roundedAmount,
        };
      }
    });

    return newDistribution;
  };

  const handleChange = (e) => {
    const newAmount = e.target.value;
    setAmount(newAmount);
    setManualDistribution(calculateDistribution(newAmount));
    setView('manualAmounts');
  };

  const handleSubmit = async () => {
    if (amount) {
      const entrataEntries = [];
      const waveEntries = [];

      // Loop through each property in trakpayDistribution
      Object.entries(manualDistribution).forEach(([propertyId, distribution]) => {
        // Find matching asset
        const matchingAsset = assets.find((asset) => asset.accountId === propertyId);

        if (matchingAsset) {
          // Create entry object with the distribution data
          const entry = {
            propertyId,
            amount: distribution.amount,
            asset: matchingAsset,
          };

          // Sort into appropriate array based on accounting software
          if (matchingAsset.accountingSoftware === 'entrata') {
            entrataEntries.push(entry);
          } else if (matchingAsset.accountingSoftware === 'wave') {
            waveEntries.push(entry);
          }
        }
      });

      const fileName = amount.toString();

      const entrataWithdrawalPayload = getEntrataWithdrawalPayload(entrataEntries, normalDate, fileName);
      const waveOperatingPayload = getWaveOperatingPayload(waveEntries, normalDate, weirdDate, fileName);

      try {
        setIsSubmitting(true);
        setProgress(0);
        let totalSteps = 0;
        if (entrataWithdrawalPayload) totalSteps++;
        if (waveOperatingPayload) totalSteps++;

        let completedSteps = 0;
        const responses = [];

        if (entrataWithdrawalPayload) {
          const entrataWithdrawalResponse = await postEntrataInvoice({
            payload: entrataWithdrawalPayload,
            successTitle: 'Entrata Manual Posted',
            errorTitle: 'Error Posting Entrata Manual',
          });
          responses.push(entrataWithdrawalResponse);
          completedSteps++;
          setProgress((completedSteps / totalSteps) * 100);
        }

        if (waveOperatingPayload) {
          const waveOperatingResponse = await postWaveTransaction({
            payload: waveOperatingPayload,
            successTitle: 'Wave Operating Withdrawal Posted',
            errorTitle: 'Error Posting Wave Operating Withdrawal',
          });
          responses.push(waveOperatingResponse);
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
    }
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" gap={2}>
          <TextField
            fullWidth
            label="Enter Amount"
            type="number"
            value={amount}
            onChange={handleChange}
            InputProps={{
              inputProps: { step: '0.01' },
            }}
          />
          <Button
            variant={view === 'manualAmounts' ? 'contained' : 'outlined'}
            color={view === 'manualAmounts' ? 'primary' : 'inherit'}
            sx={{ minWidth: '120px' }}
            onClick={() => setView('manualAmounts')}
          >
            View
          </Button>
          <LoadingButton loading={isSubmitting} variant="contained" onClick={handleSubmit} sx={{ minWidth: '230px' }}>
            Submit Amount Transactions
          </LoadingButton>
          <LinearProgress
            variant="determinate"
            value={progress}
            aria-label="Processing file"
            sx={{
              visibility: isSubmitting ? 'visible' : 'hidden',
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ManualAmountInput;
