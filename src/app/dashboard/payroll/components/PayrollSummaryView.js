'use client';

import React from 'react';
import { Card, Stack, Typography, Box, Divider, Chip } from '@mui/material';
import Big from 'big.js';

const PayrollSummaryView = ({ summaryData, assetObject }) => {
  if (!summaryData) return null;

  // Group all transactions by property
  const propertySummary = {};

  // Process Entrata Withdrawals
  summaryData.entrataWithdrawal?.forEach((entry) => {
    if (!propertySummary[entry.propertyId]) {
      propertySummary[entry.propertyId] = {
        label: assetObject[entry.propertyId]?.label || entry.propertyId,
        accountingSoftware: assetObject[entry.propertyId]?.accountingSoftware,
        entrataWithdrawals: [],
        waveOperating: [],
        waveDeposits: [],
        waveTax: [],
      };
    }
    propertySummary[entry.propertyId].entrataWithdrawals.push({
      description: entry.description,
      glAccountId: entry.glAccountId,
      amount: new Big(entry.rate),
    });
  });

  // Process Wave Operating
  summaryData.waveOperating?.forEach((entry) => {
    if (!propertySummary[entry.propertyId]) {
      propertySummary[entry.propertyId] = {
        label: entry.label,
        accountingSoftware: entry.accountingSoftware,
        entrataWithdrawals: [],
        waveOperating: [],
        waveDeposits: [],
        waveTax: [],
      };
    }
    propertySummary[entry.propertyId].waveOperating.push({
      description: entry.description,
      glAccountId: entry.originalGlId,
      amount: entry.amount,
    });
  });

  // Process Wave Deposits - Aggregate by GL account across all properties
  const waveDepositsByGl = {};
  Object.entries(summaryData.waveDeposits || {}).forEach(([propertyId, entries]) => {
    entries.forEach((entry) => {
      const glKey = entry.originalGlId;
      if (!waveDepositsByGl[glKey]) {
        waveDepositsByGl[glKey] = {
          description: entry.description,
          glAccountId: entry.originalGlId,
          amount: new Big(0),
        };
      }
      waveDepositsByGl[glKey].amount = waveDepositsByGl[glKey].amount.plus(entry.amount);
    });
  });

  // Convert to array and sort by GL account
  const allWaveDeposits = Object.values(waveDepositsByGl).sort((a, b) => a.glAccountId.localeCompare(b.glAccountId));

  // Process Direct Deposits by property
  const directDepositsArray = Object.entries(summaryData.directDeposits || {}).map(([propertyId, data]) => ({
    propertyId,
    propertyLabel: assetObject[propertyId]?.label || propertyId,
    amount: data.amount,
  }));

  // Calculate totals for each property (excluding wave deposits for now)
  Object.keys(propertySummary).forEach((propertyId) => {
    const property = propertySummary[propertyId];

    property.totals = {
      entrataWithdrawals: property.entrataWithdrawals.reduce((sum, item) => sum.plus(item.amount), new Big(0)),
      waveOperating: property.waveOperating.reduce((sum, item) => sum.plus(item.amount), new Big(0)),
    };

    property.grandTotal = property.totals.entrataWithdrawals.plus(property.totals.waveOperating);
  });

  // Calculate total for all wave deposits
  const totalWaveDeposits = allWaveDeposits.reduce((sum, item) => sum.plus(item.amount), new Big(0));

  // Calculate total for all direct deposits
  const totalDirectDeposits = directDepositsArray.reduce((sum, item) => sum.plus(item.amount), new Big(0));

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Payroll Summary
      </Typography>

      <Stack spacing={3}>
        {/* Consolidated Wave Deposits Section */}
        {allWaveDeposits.length > 0 && (
          <Card sx={{ p: 2, bgcolor: 'success.lighter' }}>
            <Stack spacing={2}>
              <Typography variant="h6" color="success.dark">
                Wave Deposits (All Properties)
              </Typography>
              <Divider />
              <Stack spacing={0.5}>
                {allWaveDeposits.map((item, idx) => (
                  <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', pl: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {item.description} (GL: {item.glAccountId})
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      ${item.amount.toFixed(2)}
                    </Typography>
                  </Box>
                ))}
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', bgcolor: 'action.hover', p: 1, borderRadius: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Total Wave Deposits:
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold" color="success.dark">
                    ${totalWaveDeposits.toFixed(2)}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Card>
        )}

        {/* Direct Deposits Section */}
        {directDepositsArray.length > 0 && (
          <Card sx={{ p: 2, bgcolor: 'info.lighter' }}>
            <Stack spacing={2}>
              <Typography variant="h6" color="info.dark">
                Direct Deposits (Employee Wages)
              </Typography>
              <Divider />
              <Stack spacing={0.5}>
                {directDepositsArray.map((item, idx) => (
                  <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', pl: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {item.propertyLabel}
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      ${item.amount.toFixed(2)}
                    </Typography>
                  </Box>
                ))}
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', bgcolor: 'action.hover', p: 1, borderRadius: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Total Direct Deposits:
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold" color="info.dark">
                    ${totalDirectDeposits.toFixed(2)}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Card>
        )}

        {/* Overall Summary */}
        <Card sx={{ p: 2, bgcolor: 'primary.lighter' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Overall Summary
          </Typography>
          <Stack spacing={1}>
            {allWaveDeposits.length > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Wave Deposits</Typography>
                <Typography variant="body2" fontWeight="bold">
                  ${totalWaveDeposits.toFixed(2)}
                </Typography>
              </Box>
            )}
            {directDepositsArray.length > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Direct Deposits</Typography>
                <Typography variant="body2" fontWeight="bold">
                  ${totalDirectDeposits.toFixed(2)}
                </Typography>
              </Box>
            )}
            {Object.values(propertySummary)
              .reduce((sum, property) => sum.plus(property.grandTotal), new Big(0))
              .gt(0) && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Property Withdrawals</Typography>
                <Typography variant="body2" fontWeight="bold">
                  $
                  {Object.values(propertySummary)
                    .reduce((sum, property) => sum.plus(property.grandTotal), new Big(0))
                    .toFixed(2)}
                </Typography>
              </Box>
            )}
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Grand Total:
              </Typography>
              <Typography variant="subtitle1" fontWeight="bold" color="primary">
                $
                {Object.values(propertySummary)
                  .reduce((sum, property) => sum.plus(property.grandTotal), new Big(0))
                  .plus(totalWaveDeposits)
                  .plus(totalDirectDeposits)
                  .toFixed(2)}
              </Typography>
            </Box>
          </Stack>
        </Card>
      </Stack>
    </Card>
  );
};

export default PayrollSummaryView;
