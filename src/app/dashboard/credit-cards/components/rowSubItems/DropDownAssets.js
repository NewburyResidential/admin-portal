'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  FormLabel,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import AutocompleteGroup from 'src/components/form-inputs/AutocompleteGroup';
import StandaloneAutocompleteGroup from 'src/components/form-inputs/StandaloneAutocompleteGroup';

import { useFormContext } from 'react-hook-form';
import { useRecalculateByUnit } from '../utils/useRecalculateByUnit';
import { useRecalculateByPercentage } from '../utils/useRecalculateByPercentage';

export default function DropDownAssets({ baseFieldName, allocationIndex, newburyAssets, chartOfAccounts }) {
  const { setValue, getValues } = useFormContext();
  const recalculateByUnit = useRecalculateByUnit();
  const recalculateByPercentage = useRecalculateByPercentage();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedGlAccount, setSelectedGlAccount] = useState(null);
  const [note, setNote] = useState('');
  const [splitMethod, setSplitMethod] = useState('unit');
  const [isApplying, setIsApplying] = useState(false);
  const [currentGrouping, setCurrentGrouping] = useState(null); // Track which grouping was selected

  const handleDialogSubmit = async () => {
    setIsApplying(true);

    try {
      let filteredAssets = [];
      let calculationMethod = 'unit';

      // Handle different groupings
      if (currentGrouping?.id === '12345678') {
        // Newbury Managed - filter by managedBy
        filteredAssets = newburyAssets.filter((asset) => asset.managedBy === 'Newbury Residential, Inc');
        calculationMethod = splitMethod;
      } else if (currentGrouping?.id === '123456789') {
        // All Properties - filter by category === "Properties"
        filteredAssets = newburyAssets.filter((asset) => asset.category === 'Properties');
        calculationMethod = splitMethod; // User can choose
      } else if (currentGrouping?.id === '12345678910') {
        // Properties & Office - filter by category === "Properties" or pk === "1"
        filteredAssets = newburyAssets.filter((asset) => asset.category === 'Properties' || asset.pk === '1');
        calculationMethod = 'amount'; // Always percentage
      }

      // Create allocations for filtered assets
      const allocations = filteredAssets.map((asset) => ({
        note: note,
        asset: asset,
        glAccount: selectedGlAccount ? selectedGlAccount : null,
      }));

      setValue(`allocations`, allocations);
      setValue('calculationMethod', calculationMethod);
      const transaction = getValues();

      // Apply the selected calculation method
      if (calculationMethod === 'unit') {
        recalculateByUnit(allocations, transaction.amount);
      } else {
        recalculateByPercentage(allocations, transaction.amount);
      }

      // Close dialog and reset form
      setDialogOpen(false);
      setSelectedGlAccount(null);
      setNote('');
      setSplitMethod('unit');
      setCurrentGrouping(null);
    } finally {
      setIsApplying(false);
    }
  };

  const handleDialogCancel = () => {
    // Reset the asset value to null
    setValue(`${baseFieldName}.asset`, null);

    // Close dialog and reset form
    setDialogOpen(false);
    setSelectedGlAccount(null);
    setNote('');
    setSplitMethod('unit');
    setIsApplying(false);
    setCurrentGrouping(null);
  };

  const handleChange = (newValue) => {
    // Handle all groupings
    if (newValue?.id === '12345678' || newValue?.id === '123456789' || newValue?.id === '12345678910') {
      setCurrentGrouping(newValue);
      setDialogOpen(true);
      return;
    }

    const glValue = getValues(`${baseFieldName}.glAccount`);

    if (newValue?.id === '4') {
      setValue(`${baseFieldName}.glAccount`, {
        accountId: '231353244',
        accountName: 'Reimbursement',
        accountNumber: '231353244',
      });
    } else if (glValue?.accountId === '231353244') {
      setValue(`${baseFieldName}.glAccount`, null);
    }
    const calculationMethod = getValues(`calculationMethod`);

    if (calculationMethod === 'unit') {
      const { units = 0 } = newValue || {};

      const transaction = getValues();
      const updatedAllocations = transaction.allocations.map((allocation, index) =>
        index === allocationIndex ? { ...allocation, asset: newValue } : allocation
      );
      recalculateByUnit(updatedAllocations, transaction.amount);
      setValue(`${baseFieldName}.helper`, units);
    }
  };

  const groupings = [
    {
      category: 'Groupings',
      id: '12345678',
      label: 'Newbury Managed',
    },
    {
      category: 'Groupings',
      id: '123456789',
      label: 'All Properties',
    },
    {
      category: 'Groupings',
      id: '12345678910',
      label: 'Properties & Office',
    },
  ];

  const fieldName = `${baseFieldName}.asset`;

  // Determine if split method selection should be shown
  const showSplitMethodSelection = currentGrouping?.id === '12345678' || currentGrouping?.id === '123456789';

  return (
    <>
      <AutocompleteGroup
        fieldName={fieldName}
        options={[...newburyAssets, ...groupings]}
        handleChange={handleChange}
        label="Location"
        id="grouped-asset-accounts"
      />

      <Dialog open={dialogOpen} onClose={handleDialogCancel} maxWidth="sm" fullWidth>
        <DialogTitle>Configure Split - {currentGrouping?.label}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <StandaloneAutocompleteGroup
              value={selectedGlAccount}
              onChange={setSelectedGlAccount}
              options={chartOfAccounts || []}
              label="GL Account (Optional)"
              optionLabel="accountName"
              optionId="accountNumber"
              id="gl-account-select"
            />

            <TextField
              fullWidth
              label="Note (Optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter a note for this allocation"
              multiline
              rows={3}
            />

            {showSplitMethodSelection && (
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend" sx={{ mb: 1 }}>
                  Split Method
                </FormLabel>
                <ToggleButtonGroup
                  value={splitMethod}
                  exclusive
                  onChange={(e, value) => value && setSplitMethod(value)}
                  fullWidth
                  sx={{
                    '& .MuiToggleButton-root': {
                      textTransform: 'none',
                      fontWeight: 500,
                    },
                  }}
                >
                  <ToggleButton value="unit">Split by Unit</ToggleButton>
                  <ToggleButton value="amount">Split by Percentage</ToggleButton>
                </ToggleButtonGroup>
              </FormControl>
            )}

            {!showSplitMethodSelection && (
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend" sx={{ mb: 1 }}>
                  Split Method
                </FormLabel>
                <TextField
                  value="Split by Percentage"
                  disabled
                  fullWidth
                  variant="outlined"
                  sx={{
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: 'rgba(0, 0, 0, 0.6)',
                    },
                  }}
                />
              </FormControl>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogCancel} disabled={isApplying}>
            Cancel
          </Button>
          <LoadingButton onClick={handleDialogSubmit} variant="contained" loading={isApplying}>
            Apply
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
