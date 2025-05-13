'use client';

import React, { useState, useMemo } from 'react';
import { Box, Typography, Divider, IconButton, Stack, Checkbox, Button, CircularProgress } from '@mui/material';
import { amber } from '@mui/material/colors';
import Iconify from 'src/components/iconify';
import { useForm, FormProvider, useFieldArray, useWatch } from 'react-hook-form';
import Big from 'big.js';
import AutocompleteGroup from 'src/components/form-inputs/AutocompleteGroup';
import ReactHookTextField from 'src/components/form-inputs/ReactHookTextField';
import ReactHookAutocomplete from 'src/components/form-inputs/ReactHookAutocomplete';
import getEntrataPayload from './get-entrata-payload';
import { useSnackbar } from 'src/utils/providers/SnackbarProvider';
import { enterUtilityPayload } from 'src/utils/services/utilities/enter-utility-payload';
import { deleteSherwinWilliamsInvoice } from 'src/utils/services/sherwin-williams/delete-utility-item';
import getSherwinWilliamsInvoices from 'src/utils/services/sherwin-williams/get-sherwin-williams-invoices';

// Helper to get S3 URL for the invoice PDF - Moved to top level
const getInvoiceUrl = (sourceFile) => {
  if (!sourceFile?.bucket || !sourceFile?.key) return '#';
  return `https://s3.amazonaws.com/${sourceFile.bucket}/${sourceFile.key}`;
};

// Move this OUTSIDE of InvoiceTable
const InvoiceRow = React.memo(({ field, index, loc, selected, handleCheck, filteredAssets, chartOfAccounts }) => {
  return (
    <Stack
      spacing={2}
      sx={{
        backgroundColor: '#f5f5f5',
        borderRadius: 1,
        p: 2,
        my: 2,
        boxShadow: 1,
      }}
    >
      {/* First row with invoice details and summary */}
      <Stack direction="row" alignItems="center" spacing={2}>
        {loc !== 'Uncategorized' && (
          <Checkbox checked={!!selected[field.invoiceNumber]} onChange={() => handleCheck(field.invoiceNumber)} />
        )}
        <Box minWidth={80}>
          <Typography variant="caption" color="text.secondary">
            Invoice #
          </Typography>
          <Typography variant="body2" noWrap>
            {field.invoiceNumber}
          </Typography>
        </Box>
        <Box minWidth={100}>
          <Typography variant="caption" color="text.secondary">
            Date
          </Typography>
          <Typography variant="body2" noWrap>
            {field.date}
          </Typography>
        </Box>
        <Box minWidth={150}>
          <Typography variant="caption" color="text.secondary">
            Job
          </Typography>
          <Typography variant="body2" noWrap>
            {field.job}
          </Typography>
        </Box>
        <Box minWidth={200}>
          <Typography variant="caption" color="text.secondary">
            Summary
          </Typography>
          <Typography variant="body2" noWrap>
            {field.aiSummary || 'No summary available'}
          </Typography>
        </Box>
        <Box flexGrow={1} />
        <IconButton onClick={() => window.open(getInvoiceUrl(field.sourceFile), '_blank')} color="primary">
          <Iconify icon="mdi:eye" />
        </IconButton>
      </Stack>

      {/* Second row with inputs */}
      <Stack direction="row" alignItems="center" spacing={3} sx={{ width: '100%' }}>
        <Box sx={{ flex: 1 }}>
          <ReactHookTextField label="Charge" type="number" name={`invoices.${index}.charge`} />
        </Box>
        <Box sx={{ flex: 2 }}>
          <ReactHookAutocomplete
            label="Location"
            options={filteredAssets}
            name={`invoices.${index}.location`}
            defaultValue={field.location}
          />
        </Box>
        <Box sx={{ flex: 2 }}>
          <AutocompleteGroup
            options={chartOfAccounts}
            fieldName={`invoices.${index}.gl`}
            label="GL Account"
            id={`grouped-gl-accounts-${index}`}
            optionLabel="accountName"
            optionId="accountNumber"
          />
        </Box>
      </Stack>
    </Stack>
  );
});

export default function InvoiceTable({ assets, sherwinWilliamsInvoices: initialInvoices, chartOfAccounts }) {
  const { showResponseSnackbar } = useSnackbar();

  const [sherwinWilliamsInvoices, setSherwinWilliamsInvoices] = useState(initialInvoices);

  const filteredAssets = assets
    ? assets.filter((asset) => asset.accountingSoftware === 'entrata').map((asset) => ({ ...asset, value: asset.pk }))
    : [];
  const assetPkToLabel = Object.fromEntries(filteredAssets.map((asset) => [asset.pk, asset.label]));
  const assetPkToAccountId = Object.fromEntries(filteredAssets.map((asset) => [asset.pk, asset.accountId]));

  const paintGlAccount = chartOfAccounts.find((account) => account.accountId === '222274');

  // Map invoices to include the default location
  const mappedInvoices = useMemo(
    () =>
      sherwinWilliamsInvoices.map((inv) => ({
        ...inv,
        invoiceNumber: inv.pk,
        propertyId: inv.propertyId,
        accountId: assetPkToAccountId[inv.propertyId] || null,
      })),
    [sherwinWilliamsInvoices, assetPkToAccountId]
  );

  const [selected, setSelected] = useState({});
  const [loadingStates, setLoadingStates] = useState({});

  // Initialize form methods
  const methods = useForm({
    defaultValues: {
      invoices: mappedInvoices.map((inv) => ({
        invoiceNumber: inv.invoiceNumber,
        charge: inv.charge,
        location: filteredAssets.find((a) => a.label === (assetPkToLabel[inv.propertyId] || 'Uncategorized')) || null,
        gl: paintGlAccount || null,
        propertyId: inv.propertyId,
        date: inv.date,
        job: inv.job,
        aiSummary: inv.aiSummary,
        sourceFile: inv.sourceFile,
      })),
    },
    mode: 'onChange',
  });

  const { fields } = useFieldArray({
    control: methods.control,
    name: 'invoices',
  });

  // Watch the entire invoices array
  const watchedInvoices =
    useWatch({
      control: methods.control,
      name: 'invoices',
    }) || [];

  const watchedLocations = watchedInvoices.map((invoice) => invoice?.location?.label || 'Uncategorized');

  // Group invoices by location
  const grouped = {};
  (fields || []).forEach((field, index) => {
    const location = watchedLocations[index];
    if (!grouped[location]) {
      grouped[location] = [];
    }
    grouped[location].push({ ...field, index });
  });

  const { getValues } = methods;

  const handleCheck = (id) => {
    setSelected((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getSelectedTotal = (loc) => {
    const selectedInvoices = grouped[loc].filter((inv) => selected[inv.invoiceNumber]);
    const formValues = getValues('invoices');

    const total = selectedInvoices.reduce((sum, inv) => {
      const currentValues = formValues[inv.index];
      return sum.plus(currentValues.charge ? new Big(currentValues.charge) : 0);
    }, new Big(0));

    return total;
  };

  const isAnySelected = (loc) => grouped[loc].some((inv) => selected[inv.invoiceNumber]);
  const isAllSelected = (loc) => grouped[loc].length > 0 && grouped[loc].every((inv) => selected[inv.invoiceNumber]);

  const handleSelectAll = (loc) => {
    const allSelected = isAllSelected(loc);
    setSelected((prev) => {
      const updated = { ...prev };
      grouped[loc].forEach((inv) => {
        updated[inv.invoiceNumber] = !allSelected;
      });
      return updated;
    });
  };

  const refreshInvoices = async () => {
    try {
      const updatedInvoices = await getSherwinWilliamsInvoices();
      setSherwinWilliamsInvoices(updatedInvoices);

      // Update form values with new invoices
      const newFormValues = updatedInvoices.map((inv) => ({
        invoiceNumber: inv.pk,
        charge: inv.charge,
        location: filteredAssets.find((a) => a.label === (assetPkToLabel[inv.propertyId] || 'Uncategorized')) || null,
        gl: paintGlAccount || null,
        propertyId: inv.propertyId,
        date: inv.date,
        job: inv.job,
        aiSummary: inv.aiSummary,
        sourceFile: inv.sourceFile,
      }));

      // Reset the form with new values
      methods.reset({
        invoices: newFormValues,
      });

      // Clear selected state
      setSelected({});
    } catch (error) {
      console.error('Error refreshing invoices:', error);
    }
  };

  const handleSubmit = async (loc) => {
    setLoadingStates((prev) => ({ ...prev, [loc]: true }));
    try {
      const selectedInvoices = grouped[loc].filter((inv) => selected[inv.invoiceNumber]);
      const formValues = getValues('invoices');

      // Validate all required fields for selected invoices
      const incomplete = selectedInvoices.some((inv) => {
        const currentValues = formValues[inv.index];
        return !currentValues.charge || !currentValues.location || !currentValues.gl;
      });

      if (incomplete) {
        alert('All selected invoices must have Charge, Location, and GL filled out.');
        return;
      }

      const total = selectedInvoices.reduce((sum, inv) => {
        const currentValues = formValues[inv.index];
        return sum.plus(currentValues.charge ? new Big(currentValues.charge) : 0);
      }, new Big(0));

      const notes = selectedInvoices.map((invoice) => invoice.invoiceNumber).join(', ');

      const apDetails = selectedInvoices.map((inv) => {
        const currentValues = formValues[inv.index];
        return {
          propertyId: currentValues.location?.accountId || inv.propertyId,
          glAccountId: currentValues.gl?.accountId,
          description: inv.job,
          rate: currentValues.charge.toString(),
        };
      });

      const sourceFiles = selectedInvoices
        .filter((invoice) => invoice?.sourceFile)
        .map((invoice) => ({
          bucket: invoice.sourceFile.bucket,
          key: invoice.sourceFile.key,
        }));

      const entrataPayload = getEntrataPayload(apDetails, notes, total.toFixed(2));
      const allResponses = [];

      const entrataResponse = await enterUtilityPayload({
        payload: { payload: entrataPayload, sourceFiles },
        successTitle: 'Entrata Invoice Posted',
        errorTitle: 'Error Posting Entrata Invoice',
      });
      allResponses.push(entrataResponse);

      if (entrataResponse.severity === 'success') {
        // Wait for all deletions to complete
        await Promise.all(
          selectedInvoices.map(async (inv) => {
            const deleteResponse = await deleteSherwinWilliamsInvoice(inv.invoiceNumber);
            allResponses.push(deleteResponse);
          })
        );

        // Refresh the invoices data
        await refreshInvoices();
      }

      showResponseSnackbar(allResponses);
      console.log('entrataPayload:', entrataPayload);
    } catch (error) {
      console.error('Error submitting invoices:', error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [loc]: false }));
    }
  };

  return (
    <FormProvider {...methods}>
      <Box>
        {Object.keys(grouped).length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No invoices to submit
            </Typography>
          </Box>
        ) : (
          Object.entries(grouped).map(([loc, groupFields]) => (
            <Box
              key={loc}
              mb={4}
              sx={
                loc === 'Uncategorized'
                  ? {
                      backgroundColor: amber[50],
                      border: `1px solid ${amber[100]}`,
                      borderRadius: 2,
                      p: 2,
                    }
                  : {}
              }
            >
              {/* Header with select all, group name, and submit button */}
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                <Box display="flex" alignItems="center">
                  {loc !== 'Uncategorized' && (
                    <Checkbox
                      checked={isAllSelected(loc)}
                      indeterminate={isAnySelected(loc) && !isAllSelected(loc)}
                      onChange={() => handleSelectAll(loc)}
                      sx={{ mr: 1 }}
                    />
                  )}
                  <Typography variant="h6">{loc}</Typography>
                </Box>
                {loc !== 'Uncategorized' && (
                  <Button
                    variant="contained"
                    disabled={!isAnySelected(loc) || loadingStates[loc]}
                    onClick={() => handleSubmit(loc)}
                    startIcon={loadingStates[loc] ? <CircularProgress size={20} color="inherit" /> : null}
                  >
                    {loadingStates[loc] ? 'Processing...' : `Enter Selected (${getSelectedTotal(loc).toFixed(2)})`}
                  </Button>
                )}
              </Box>
              <Divider />
              {groupFields.map((field) => (
                <InvoiceRow
                  key={field.invoiceNumber}
                  field={field}
                  index={field.index}
                  loc={loc}
                  selected={selected}
                  handleCheck={handleCheck}
                  filteredAssets={filteredAssets}
                  chartOfAccounts={chartOfAccounts}
                />
              ))}
            </Box>
          ))
        )}
      </Box>
    </FormProvider>
  );
}
