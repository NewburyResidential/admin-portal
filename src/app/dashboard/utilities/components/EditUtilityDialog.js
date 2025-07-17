import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import * as Yup from 'yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { FormControlLabel, Checkbox } from '@mui/material';

const isZeroOrEmpty = (value) => {
  if (!value) return true;
  const numValue = parseFloat(value);
  return numValue === 0 || numValue === 0.0;
};

const validationSchema = Yup.object().shape({
  paymentId: Yup.string().required('Payment ID is required'),
  apartment: Yup.string().required('Apartment is required'),
  accountNumber: Yup.string().required('Account Number is required'),
  completeAddress: Yup.string().required('Complete Address is required'),
  startService: Yup.string()
    .nullable()
    .test(
      'is-valid-or-empty',
      'Must be in MM/DD/YYYY format',
      (value) => !value || /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/.test(value)
    ),
  endService: Yup.string()
    .nullable()
    .test(
      'is-valid-or-empty',
      'Must be in MM/DD/YYYY format',
      (value) => !value || /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/.test(value)
    ),
  electricAmount: Yup.string()
    .nullable()
    .transform((value) => (isZeroOrEmpty(value) ? null : value))
    .matches(/^\d*\.?\d{0,2}$/, 'Amount must have up to 2 decimal places')
    .test('is-number', 'Must be a valid number', (value) => value === null || !Number.isNaN(Number(value))),
  waterSewerAmount: Yup.string()
    .nullable()
    .transform((value) => (isZeroOrEmpty(value) ? null : value))
    .matches(/^\d*\.?\d{0,2}$/, 'Amount must have up to 2 decimal places')
    .test('is-number', 'Must be a valid number', (value) => value === null || !Number.isNaN(Number(value))),
  gasAmount: Yup.string()
    .nullable()
    .transform((value) => (isZeroOrEmpty(value) ? null : value))
    .matches(/^\d*\.?\d{0,2}$/, 'Amount must have up to 2 decimal places')
    .test('is-number', 'Must be a valid number', (value) => value === null || !Number.isNaN(Number(value))),
  miscAmount: Yup.string()
    .nullable()
    .transform((value) => (isZeroOrEmpty(value) ? null : value))
    .matches(/^\d*\.?\d{0,2}$/, 'Amount must have up to 2 decimal places')
    .test('is-number', 'Must be a valid number', (value) => value === null || !Number.isNaN(Number(value))),
  taxAmount: Yup.string()
    .nullable()
    .transform((value) => (isZeroOrEmpty(value) ? null : value))
    .matches(/^\d*\.?\d{0,2}$/, 'Amount must have up to 2 decimal places')
    .test('is-number', 'Must be a valid number', (value) => value === null || !Number.isNaN(Number(value))),
  totalAmount: Yup.string()
    .required('Total amount is required')
    .matches(/^\d*\.?\d{0,2}$/, 'Amount must have up to 2 decimal places')
    .test('is-number', 'Must be a valid number', (value) => !Number.isNaN(Number(value))),
  ignoreScraped: Yup.boolean(),
});

export default function EditUtilityDialog({ open, onClose, bill, onSave }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      paymentId: '',
      apartment: '',
      accountNumber: '',
      completeAddress: '',
      startService: '',
      endService: '',
      electricAmount: null,
      waterSewerAmount: null,
      gasAmount: null,
      miscAmount: null,
      taxAmount: null,
      totalAmount: '0.00',
      ignoreScraped: false,
    },
  });

  useEffect(() => {
    if (bill) {
      reset({
        paymentId: bill.paymentId || '',
        apartment: bill.apartment || '',
        accountNumber: bill.accountNumber || '',
        completeAddress: bill.completeAddress || '',
        startService: bill.startService || '',
        endService: bill.endService || '',
        electricAmount: bill.electricAmount || null,
        waterSewerAmount: bill.waterSewerAmount || null,
        gasAmount: bill.gasAmount || null,
        miscAmount: bill.miscAmount || null,
        taxAmount: bill.taxAmount || null,
        totalAmount: bill.totalAmount || '0.00',
        ignoreScraped: bill.ignoreScraped || false,
      });
    } else {
      reset({
        paymentId: '',
        apartment: '',
        accountNumber: '',
        completeAddress: '',
        startService: '',
        endService: '',
        electricAmount: null,
        waterSewerAmount: null,
        gasAmount: null,
        miscAmount: null,
        taxAmount: null,
        totalAmount: '0.00',
        ignoreScraped: false,
      });
    }
  }, [bill, reset]);

  const onSubmit = async (data) => {
    try {
      // Convert empty strings and zeros to null for amount fields
      const formattedData = {
        ...data,
        electricAmount: isZeroOrEmpty(data.electricAmount) ? null : data.electricAmount,
        waterSewerAmount: isZeroOrEmpty(data.waterSewerAmount) ? null : data.waterSewerAmount,
        gasAmount: isZeroOrEmpty(data.gasAmount) ? null : data.gasAmount,
        miscAmount: isZeroOrEmpty(data.miscAmount) ? null : data.miscAmount,
        taxAmount: isZeroOrEmpty(data.taxAmount) ? null : data.taxAmount,
      };
      await onSave(formattedData);
      onClose();
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Utility Bill</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 0.5 }}>
          {/* Payment and Account Info */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Payment ID"
              {...register('paymentId')}
              error={Boolean(errors.paymentId)}
              helperText={errors.paymentId?.message}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Account Number"
              {...register('accountNumber')}
              error={Boolean(errors.accountNumber)}
              helperText={errors.accountNumber?.message}
            />
          </Grid>

          {/* Address Information - Now Equal Size */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Apartment"
              {...register('apartment')}
              error={Boolean(errors.apartment)}
              helperText={errors.apartment?.message}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Complete Address"
              {...register('completeAddress')}
              error={Boolean(errors.completeAddress)}
              helperText={errors.completeAddress?.message}
            />
          </Grid>

          {/* Service Dates */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Start Service (MM/DD/YYYY)"
              placeholder="MM/DD/YYYY"
              {...register('startService')}
              error={Boolean(errors.startService)}
              helperText={errors.startService?.message}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="End Service (MM/DD/YYYY)"
              placeholder="MM/DD/YYYY"
              {...register('endService')}
              error={Boolean(errors.endService)}
              helperText={errors.endService?.message}
            />
          </Grid>

          {/* Amounts */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Electric Amount"
              {...register('electricAmount')}
              error={Boolean(errors.electricAmount)}
              helperText={errors.electricAmount?.message}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Water/Sewer Amount"
              {...register('waterSewerAmount')}
              error={Boolean(errors.waterSewerAmount)}
              helperText={errors.waterSewerAmount?.message}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Gas Amount"
              {...register('gasAmount')}
              error={Boolean(errors.gasAmount)}
              helperText={errors.gasAmount?.message}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Misc Amount"
              {...register('miscAmount')}
              error={Boolean(errors.miscAmount)}
              helperText={errors.miscAmount?.message}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Tax Amount"
              {...register('taxAmount')}
              error={Boolean(errors.taxAmount)}
              helperText={errors.taxAmount?.message}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Total Amount"
              {...register('totalAmount')}
              error={Boolean(errors.totalAmount)}
              helperText={errors.totalAmount?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel control={<Checkbox {...register('ignoreScraped')} />} label="Ignore Scraped Amount Mismatch" />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <LoadingButton loading={isSubmitting} onClick={handleSubmit(onSubmit)} variant="contained">
          Save Changes
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
