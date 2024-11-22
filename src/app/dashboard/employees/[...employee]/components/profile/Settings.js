import React, { useEffect, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Chip from '@mui/material/Chip';
import ReactHookSelect from 'src/components/form-inputs/ReactHookSelect';
import ReactHookTextField from 'src/components/form-inputs/ReactHookTextField';

import ReactHookSelectRoles from 'src/components/form-inputs/common/ReactHookSelectRoles';
import updateEmployee from 'src/utils/services/employees/update-employee';
import ReactHookSubmitButton from 'src/components/form-inputs/ReactHookSubmitButton';
import { useSnackbar } from 'src/utils/providers/SnackbarProvider';
import { yupResolver } from '@hookform/resolvers/yup';
import { settingsSchema } from './settings-schema';

const portalAccessOptions = [
  { value: '#AUTHORIZED', label: 'Authorized' },
  { value: '#UNAUTHORIZED', label: 'Unauthorized' },
];
// const onboardingOptions = [
//   { value: true, label: 'Complete' },
//   { value: false, label: 'Not Complete' },
// ];
const yesNoOptions = [
  { value: true, label: 'Yes' },
  { value: false, label: 'No' },
];

export default function Settings({ employee, user }) {
  const { showResponseSnackbar } = useSnackbar();

  const defaultValues = useMemo(() => ({
    status: employee.status || '',
    roles: employee.roles || [],
    hasAzureAccount: !!employee.hasAzureAccount,
    hasCreditCard: !!employee.hasCreditCard,
    creditCardDigits: employee.creditCardDigits || '',
    isOnboarding: !!employee.isOnboarding,
    workEmail: employee.workEmail || '',
  }), [employee]);


  const methods = useForm({
    defaultValues,
    resolver: yupResolver(settingsSchema),
  });
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isDirty },
    reset,
  } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);


  const onSubmit = async (data) => {
    const response = await updateEmployee({ pk: employee.pk, attributes: data });
    showResponseSnackbar(response);
  };

  // const hasAzureAccount = watch('hasAzureAccount');
  const hasCreditCard = watch('hasCreditCard');

  return (
    <Card sx={{ p: 3 }}>
      <FormProvider {...methods}>
        <form action={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid xs={6}>
              <ReactHookSelect
                label="Portal Access"
                name="status"
                options={portalAccessOptions}
                renderValue={(selected) => (
                  <Chip
                    label={portalAccessOptions.find((option) => option.value === selected)?.label}
                    color={selected === '#AUTHORIZED' ? 'success' : 'error'}
                  />
                )}
              />
            </Grid>
            {/* <Grid xs={6}>
              <ReactHookSelect label="Onboarding Status" name="isOnboarding" options={onboardingOptions} />
            </Grid> */}
            {/* <Grid xs={6}>
              <ReactHookAutocomplete label="Assigned Credit Card" name="creditCardId" options={ApplicationOptions} />
            </Grid> */}
            <Grid xs={6}>
              <ReactHookSelect
                label="Has Credit Card"
                name="hasCreditCard"
                options={yesNoOptions}
                onChange={(event) => {
                  if (event.target.value === false) {
                    setValue('creditCardDigits', '');
                  }
                }}
              />
            </Grid>
            {hasCreditCard && (
              <Grid xs={6}>
                <ReactHookTextField label="Last 4 of Credit Card" name="creditCardDigits" />
              </Grid>
            )}

       
           
                <Grid xs={6}>
                  <ReactHookSelectRoles />
                </Grid>
            <Grid xs={12} sx={{ display: 'flex', justifyContent: 'end' }}>
              <ReactHookSubmitButton label="Save Changes" disabled={!isDirty} />
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </Card>
  );
}
