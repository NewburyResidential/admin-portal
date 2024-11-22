import React, { useState } from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, Card, Typography, Box, Button, DialogActions } from '@mui/material';
import ReactHookSelectEmployees from 'src/components/form-inputs/common/ReactHookAutocompleteSelectEmployees';
import { LoadingButton } from '@mui/lab';
import updateEmployee from 'src/utils/services/employees/update-employee';
import { useSettingsContext } from 'src/components/display-settings';

export default function CreditCardSettingsDialog({ employees, creditCardAccounts, open }) {
  const [loading, setLoading] = useState(false);
  const { onToggleEditMode } = useSettingsContext();

  function updateAccountsWithEmployees() {
    creditCardAccounts.forEach((account) => {
      account.owner = null;
      account.reviewers = [];

      employees.forEach((employee) => {
        if (employee.creditCardAccountOwner === account.pk) {
          account.owner = employee.pk;
        }

        if (employee.creditCardAccountsToReview && employee.creditCardAccountsToReview.includes(account.pk)) {
          account.reviewers.push(employee.pk);
        }
      });
    });
  }

  updateAccountsWithEmployees();

  const methods = useForm({
    defaultValues: {
      creditCardAccounts,
    },
  });

  const { control, handleSubmit } = methods;

  const { fields } = useFieldArray({
    control,
    name: 'creditCardAccounts',
  });

  const unnamedCards = fields.filter((field) => !field.owner || field.reviewers.length === 0);
  const namedCards = fields.filter((field) => field.owner && field.reviewers.length > 0);

  const handleClose = () => {
    onToggleEditMode();
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const affectedEmployees = new Set();

      // Create a lookup map for creditCardAccounts
      const initialAccountMap = {};
      creditCardAccounts.forEach((acc) => {
        initialAccountMap[acc.pk] = acc;
      });

      data.creditCardAccounts.forEach((account) => {
        const initialAccount = initialAccountMap[account.pk];

        if (account.owner !== initialAccount.owner) {
          if (account.owner) affectedEmployees.add(account.owner);
          if (initialAccount.owner) affectedEmployees.add(initialAccount.owner);
        }

        const currentReviewersSet = new Set(account.reviewers);
        const initialReviewersSet = new Set(initialAccount.reviewers);

        account.reviewers.forEach((reviewer) => {
          if (!initialReviewersSet.has(reviewer)) {
            affectedEmployees.add(reviewer);
          }
        });

        initialAccount.reviewers.forEach((reviewer) => {
          if (!currentReviewersSet.has(reviewer)) {
            affectedEmployees.add(reviewer);
          }
        });
      });

      // Loop through affected employees and determine how to update their data
      for (const employeePk of affectedEmployees) {
        const creditCardAccountOwner = data.creditCardAccounts.find((account) => account.owner === employeePk)?.pk || '';
        const creditCardAccountsToReview = data.creditCardAccounts
          .filter((account) => account.reviewers.includes(employeePk))
          .map((account) => account.pk);

        // Update employee in database
        await updateEmployee({ pk: employeePk, attributes: { creditCardAccountOwner, creditCardAccountsToReview } });
      }

      // After successful submission, close the dialog
      handleClose();
    } catch (error) {
      console.error('Error updating credit card assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const cardStyles = {
    unnamed: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      width: '100%',
      background: 'rgba(255, 235, 238, 0.5)',
      border: '1px dotted #f44336',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '16px',
      marginBottom: '16px',
      borderRadius: '8px',
    },
    named: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      background: '#f7f8fa',
      border: '1px solid #ddd',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '16px',
      marginBottom: '16px',
      borderRadius: '8px',
      gap: '16px',
    },
  };

  return (
    <Dialog open={open} maxWidth="lg" fullWidth onClose={!loading ? handleClose : undefined}>
      <DialogTitle sx={{ pb: 3 }}>Credit Card Assignments</DialogTitle>
      <DialogContent dividers>
        <FormProvider {...methods}>
          {unnamedCards.map((field, index) => {
            const originalIndex = fields.findIndex((f) => f.id === field.id);
            return (
              <Card key={field.id} sx={cardStyles.unnamed}>
                <Typography variant="h6" fontWeight={600} sx={{ marginBottom: '16px' }}>
                  {field.pk}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  <Box sx={{ width: '30%' }}>
                    <ReactHookSelectEmployees
                      name={`creditCardAccounts[${originalIndex}].owner`}
                      employees={employees}
                      multiple={false}
                      label="Assign Card Owner"
                      placeholder={field.pk}
                      disabled={loading}
                    />
                  </Box>
                  <Box sx={{ width: '70%' }}>
                    <ReactHookSelectEmployees
                      name={`creditCardAccounts[${originalIndex}].reviewers`}
                      employees={employees}
                      multiple
                      label="Assign Transaction Reviewers"
                      disabled={loading}
                    />
                  </Box>
                </Box>
              </Card>
            );
          })}
          {namedCards.map((field, index) => {
            const originalIndex = fields.findIndex((f) => f.id === field.id);
            return (
              <Card key={field.id} sx={cardStyles.named}>
                <Box
                  sx={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  <Box sx={{ width: '30%' }}>
                    <ReactHookSelectEmployees
                      name={`creditCardAccounts[${originalIndex}].owner`}
                      employees={employees}
                      multiple={false}
                      label="Assign Card Owner"
                      placeholder={field.pk}
                      disabled={loading}
                    />
                  </Box>
                  <Box sx={{ width: '70%' }}>
                    <ReactHookSelectEmployees
                      name={`creditCardAccounts[${originalIndex}].reviewers`}
                      employees={employees}
                      multiple
                      label="Assign Transaction Reviewers"
                      disabled={loading}
                    />
                  </Box>
                </Box>
              </Card>
            );
          })}
        </FormProvider>
      </DialogContent>
      <DialogActions sx={{ mt: 1 }}>
        <Button variant="outlined" color="inherit" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <LoadingButton onClick={handleSubmit(onSubmit)} loading={loading} variant="contained" color="inherit">
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
