'use client';

import React, { useState } from 'react';
import Papa from 'papaparse';
import UploadSingleFile from 'src/components/upload-files/UploadSingleFile';
import { Button, Card, Stack, IconButton, Typography } from '@mui/material';
import { useSnackbar } from 'src/utils/providers/SnackbarProvider';
import { alpha } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import LinearProgress from '@mui/material/LinearProgress';
import Iconify from 'src/components/iconify';
import { fileThumb } from 'src/components/file-thumbnail/utils';
import snackbarCatchErrorResponse from 'src/components/response-snackbar/utility/snackbarCatchErrorResponse';
import Big from 'big.js';
import { getEntrataWithdrawalPayload } from './utils/trakpay/getEntrataWithdrawalPayload';
import { getWaveOperatingPayload } from './utils/trakpay/getWaveOperatingPayload';
import { postEntrataInvoice } from 'src/utils/services/entrata/postEntrataInvoice';
import { postWaveTransaction } from 'src/utils/services/wave/postWaveTransaction';

const TrakpayFileUpload = ({
  assets,
  setTrakpayFile,
  trakpayFile,
  view,
  setView,
  propertiesByEmployee,
  setTrakpayDistribution,
  trakpayDistribution,
  normalDate,
  weirdDate,
}) => {
  const { showResponseSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleReviewFile = (uploadedFile) => {
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        Papa.parse(event.target.result, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            // Debug: Log all rows
            console.log('All CSV rows:', results.data);

            // Find the Total Cost by checking each row's properties
            const totalCostRow = results.data.find((row) => {
              // Check all properties in the row for "Total Cost"
              return Object.values(row).includes("Total Cost");
            });
            
            console.log('totalCostRow', totalCostRow);
            
            // Find which property contains "Total Cost"
            const totalCostKey = Object.keys(totalCostRow).find(key => totalCostRow[key] === "Total Cost");
            
            // The total cost value should be in the next column (typically "_11" based on the example)
            const valueKeys = Object.keys(totalCostRow);
            const totalCostKeyIndex = valueKeys.indexOf(totalCostKey);
            const totalCostValueKey = valueKeys[totalCostKeyIndex + 1];
            const totalCostValue = totalCostRow[totalCostValueKey] || '0';
            
            const totalCost = new Big(totalCostValue);
            console.log('totalCost', totalCost.toString());

            // Find the headers row (the row with "Employee ID" and "Premium Paid")
            const headersRow = results.data.find(row => {
              return Object.values(row).includes("Employee ID") && Object.values(row).includes("Premium Paid");
            });

            // Get employee details with Big amounts - start looking after the headers row
            const headerIndex = results.data.indexOf(headersRow);
            console.log('headerIndex', headerIndex);
            const employeeDetails = results.data
              .slice(headerIndex + 1)
              .filter((row) => {
                // Find which properties contain "Employee ID" and "Premium Paid"
                const employeeIdKey = Object.keys(headersRow).find(key => headersRow[key] === "Employee ID");
                const premiumPaidKey = Object.keys(headersRow).find(key => headersRow[key] === "Premium Paid");
                
                // Check if this row has valid values for Employee ID and Premium Paid
                const hasEmployeeId = row[employeeIdKey] && !Number.isNaN(Number(row[employeeIdKey]));
                const hasPremiumPaid = row[premiumPaidKey] && !Number.isNaN(Number(row[premiumPaidKey]));
                
                return hasEmployeeId && hasPremiumPaid;
              })
              .map((row) => {
                // Find which properties contain the values we need
                const employeeIdKey = Object.keys(headersRow).find(key => headersRow[key] === "Employee ID");
                const premiumPaidKey = Object.keys(headersRow).find(key => headersRow[key] === "Premium Paid");
                
                return {
                  employeeId: row[employeeIdKey],
                  premiumPaid: new Big(row[premiumPaidKey]),
                };
              });

            console.log('employeeDetails', employeeDetails);

            // Calculate total from employees
            const employeeTotal = employeeDetails.reduce((sum, emp) => sum.plus(emp.premiumPaid), new Big(0));

            // Calculate the difference
            const employeeDifference = totalCost.minus(employeeTotal);

            // Adjust employee amounts proportionally for all employees
            const adjustedEmployeeDetails = employeeDetails.map((emp) => {
              const proportion = emp.premiumPaid.div(employeeTotal);
              const adjustment = employeeDifference.times(proportion);

              return {
                employeeId: emp.employeeId,
                premiumPaid: emp.premiumPaid.plus(adjustment).toFixed(2),
              };
            });
            console.log('adjustedEmployeeDetails', adjustedEmployeeDetails);

            // Create property breakdown
            const propertyBreakdown = {};

            adjustedEmployeeDetails.forEach((emp) => {
              const employeeProperties = propertiesByEmployee[emp.employeeId];
              if (!employeeProperties) return;

              // Calculate total amount for this employee's properties
              const totalPropertyAmount = Object.values(employeeProperties.properties).reduce(
                (sum, amount) => new Big(sum).plus(amount),
                new Big(0)
              );

              // For each property in the employee's data
              Object.entries(employeeProperties.properties).forEach(([propertyId, propertyAmount]) => {
                if (!propertyBreakdown[propertyId]) {
                  propertyBreakdown[propertyId] = {
                    amount: new Big(0),
                    breakout: {},
                  };
                }

                // Calculate proportion for this property
                const proportion = new Big(propertyAmount).div(totalPropertyAmount);
                const amountForProperty = new Big(emp.premiumPaid).times(proportion);

                // Add to property's account breakout
                const account = employeeProperties.handlingGl;
                propertyBreakdown[propertyId].breakout[account] = new Big(propertyBreakdown[propertyId].breakout[account] || 0).plus(
                  amountForProperty
                );

                // Update total for this property
                propertyBreakdown[propertyId].amount = propertyBreakdown[propertyId].amount.plus(amountForProperty);
              });
            });

            // Convert Big numbers to strings with 2 decimal places
            const finalPropertyBreakdown = Object.entries(propertyBreakdown).reduce((acc, [propertyId, data]) => {
              acc[propertyId] = {
                amount: data.amount,
                breakout: Object.entries(data.breakout).reduce((breakoutAcc, [account, amount]) => {
                  breakoutAcc[account] = amount;
                  return breakoutAcc;
                }, {}),
              };
              return acc;
            }, {});

            // get the total of all breakout values
            const breakoutTotal = Object.values(finalPropertyBreakdown).reduce((sum, property) => {
              return Object.values(property.breakout).reduce((breakoutSum, amount) => breakoutSum.plus(amount), sum);
            }, new Big(0));

            // Adjust for any rounding differences
            const roundingDifference = totalCost.minus(breakoutTotal);
            if (!roundingDifference.eq(0)) {
              const lastPropertyId = Object.keys(finalPropertyBreakdown).pop();
              if (lastPropertyId) {
                const lastProperty = finalPropertyBreakdown[lastPropertyId];
                const lastAccountId = Object.keys(lastProperty.breakout).pop();
                if (lastAccountId) {
                  lastProperty.breakout[lastAccountId] = lastProperty.breakout[lastAccountId].plus(roundingDifference);
                  lastProperty.amount = lastProperty.amount.plus(roundingDifference);
                }
              }
            }

            setTrakpayDistribution(finalPropertyBreakdown);
            setView('trakpayAmounts');
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
          },
        });
      };
      reader.readAsText(uploadedFile);
    }
    setTrakpayFile(uploadedFile);
  };

  const handleSubmit = async () => {
    const entrataEntries = [];
    const waveEntries = [];

    Object.entries(trakpayDistribution).forEach(([propertyId, distribution]) => {
      const matchingAsset = assets.find((asset) => asset.accountId === propertyId);

      if (matchingAsset) {
        const entry = {
          propertyId,
          amount: distribution.amount.toString(), // Convert to string
          breakout: Object.entries(distribution.breakout).reduce((acc, [account, amount]) => {
            acc[account] = amount.toString(); // Convert to string
            return acc;
          }, {}),
          asset: matchingAsset,
        };

        if (matchingAsset.accountingSoftware === 'entrata') {
          entrataEntries.push(entry);
        } else if (matchingAsset.accountingSoftware === 'wave') {
          waveEntries.push(entry);
        }
      }
    });

    const fileName = trakpayFile?.name;

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
          successTitle: 'Entrata Trakpay Posted',
          errorTitle: 'Error Posting Entrata Trakpay',
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
  };

  const handleRemoveFile = () => {
    setTrakpayFile(null);
    setView('payrollAmounts');
  };

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Stack spacing={2} alignItems="center">
        <Typography variant="h6" sx={{ mb: 2 }}>
          Upload Trakpay File
        </Typography>

        {!trakpayFile ? (
          <UploadSingleFile
            accept={{ 'text/csv': ['.csv'] }}
            uploadedFile={trakpayFile}
            onFileChange={handleReviewFile}
            sx={{ width: '100%' }}
          />
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
              <img src={fileThumb(trakpayFile.name)} alt="csv" style={{ width: '100%', maxWidth: 200 }} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {trakpayFile.name}
              </Typography>
            </Stack>
          </Card>
        )}

        <Stack spacing={1} width="100%" maxWidth={320}>
          <Button
            variant={view === 'trakpayAmounts' ? 'contained' : 'outlined'}
            color={view === 'trakpayAmounts' ? 'primary' : 'inherit'}
            sx={{ width: '100%', visibility: !trakpayFile && 'hidden' }}
            onClick={() => {
              setView('trakpayAmounts');
            }}
          >
            View
          </Button>

          <LoadingButton
            loading={isSubmitting}
            variant="contained"
            color="inherit"
            onClick={handleSubmit}
            sx={{ width: '100%', visibility: !trakpayFile && 'hidden' }}
          >
            Submit Trakpay Transactions
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
      </Stack>
    </Card>
  );
};

export default TrakpayFileUpload;
