import React, { useEffect } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import ReactHookSelect from 'src/components/form-inputs/ReactHookSelect';
import ReactHookTextField from 'src/components/form-inputs/ReactHookTextField';
import { useNavData } from 'src/layouts/dashboard/config-navigation';
import ListSubheader from '@mui/material/ListSubheader';
import ReactHookSelectRoles from 'src/components/form-inputs/common/ReactHookSelectRoles';
import { Divider } from '@mui/material';
import ReactHookAutocomplete from 'src/components/form-inputs/ReactHookAutocomplete';
import { LoadingButton } from '@mui/lab';
import updateEmployee from 'src/utils/services/employees/update-employee';
import ReactHookSubmitButton from 'src/components/form-inputs/ReactHookSubmitButton';
import { useSnackbar } from 'src/utils/providers/SnackbarProvider';
import { roleOptions } from 'src/layouts/dashboard/roleOptions';
import { yupResolver } from '@hookform/resolvers/yup';
import { settingsSchema } from './settings-schema';

const ApplicationOptions = [
  { value: 'Application 1', label: 'Application 1' },
  { value: 'Application 2', label: 'Application 2' },
  { value: 'Application 3', label: 'Application 3' },
  { value: 'Application 4', label: 'Application 4' },
  { value: 'Application 5', label: 'Application 5' },
];
const portalAccessOptions = [
  { value: '#AUTHORIZED', label: 'Authorized' },
  { value: '#UNAUTHORIZED', label: 'Unauthorized' },
];
const onboardingOptions = [
  { value: true, label: 'Complete' },
  { value: false, label: 'Not Complete' },
];
const yesNoOptions = [
  { value: true, label: 'Yes' },
  { value: false, label: 'No' },
];

export default function Settings({ employee, user }) {
  const { showResponseSnackbar } = useSnackbar();
  const defaultValues = {
    status: employee.status || '',
    roles: employee.roles || [],
    hasAzureAccount: employee.hasAzureAccount ? true : false,
    hasCreditCard: employee.hasCreditCard ? true : false,
    creditCardDigits: employee.creditCardDigits || '',
    isOnboarding: employee.isOnboarding ? true : false,
    workEmail: employee.workEmail || '',
  };

  useEffect(() => {
    reset(defaultValues);
  }, [employee]);

  const methods = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(settingsSchema),
  });
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isDirty, errors },
    formState,
    reset,
  } = methods;

  const onSubmit = async (data) => {
    const response = await updateEmployee({ pk: employee.pk, attributes: data });
    showResponseSnackbar(response);
  };

  const hasAzureAccount = watch('hasAzureAccount');
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
            <Grid xs={6}>
              <ReactHookSelect label="Onboarding Status" name="isOnboarding" options={onboardingOptions} />
            </Grid>
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
              <ReactHookSelect
                label="Microsoft Account"
                name="hasAzureAccount"
                options={yesNoOptions}
                onChange={(event) => {
                  if (event.target.value === false) {
                    setValue('workEmail', '');
                    setValue('roles', ['public']);
                  }
                }}
              />
            </Grid>
            {hasAzureAccount && (
              <>
                <Grid xs={6}>
                  <ReactHookTextField label="Work Email" name="workEmail" />
                </Grid>
                <Grid xs={6}>
                  <ReactHookSelectRoles />
                </Grid>
              </>
            )}
            <Grid xs={12} sx={{ display: 'flex', justifyContent: 'end' }}>
              <ReactHookSubmitButton label="Save Changes" disabled={!isDirty} />
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </Card>
  );
}
