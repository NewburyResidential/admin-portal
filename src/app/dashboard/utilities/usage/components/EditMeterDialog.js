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

const validationSchema = Yup.object().shape({
  meterLabel: Yup.string().required('Meter Label is required'),
  units: Yup.number()
    .typeError('Units must be a number')
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
  bedrooms: Yup.number()
    .typeError('Bedrooms must be a number')
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
  squareFeet: Yup.number()
    .typeError('Square Feet must be a number')
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
  bathrooms: Yup.number()
    .typeError('bathrooms must be a number')
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
});

export default function EditMeterDialog({ open, onClose, onSave, initialValues }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      meterLabel: '',
      units: '',
      bedrooms: '',
      squareFeet: '',
      bathrooms: '',
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        meterLabel: initialValues.meterLabel || '',
        units: initialValues.units || '',
        bedrooms: initialValues.bedrooms || '',
        squareFeet: initialValues.squareFeet || '',
        bathrooms: initialValues.bathrooms || '',
      });
    }
  }, [initialValues, reset]);

  const onSubmit = async (data) => {
    try {
      await onSave(data);
      onClose();
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Meter Details</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid size={6}>
            <TextField label="Account Number" value={initialValues?.accountNumber || ''} fullWidth disabled />
          </Grid>
          <Grid size={6}>
            <TextField
              label="Meter Label"
              {...register('meterLabel')}
              error={Boolean(errors.meterLabel)}
              helperText={errors.meterLabel?.message}
              fullWidth
              required
            />
          </Grid>
          <Grid size={6}>
            <TextField
              label="Units"
              type="number"
              {...register('units')}
              error={Boolean(errors.units)}
              helperText={errors.units?.message}
              fullWidth
            />
          </Grid>
          <Grid size={6}>
            <TextField
              label="Square Feet"
              type="number"
              {...register('squareFeet')}
              error={Boolean(errors.squareFeet)}
              helperText={errors.squareFeet?.message}
              fullWidth
            />
          </Grid>
          <Grid size={6}>
            <TextField
              label="Bedrooms"
              type="number"
              {...register('bedrooms')}
              error={Boolean(errors.bedrooms)}
              helperText={errors.bedrooms?.message}
              fullWidth
            />
          </Grid>
          <Grid size={6}>
            <TextField
              label="Bathrooms"
              type="number"
              {...register('bathrooms')}
              error={Boolean(errors.bathrooms)}
              helperText={errors.bathrooms?.message}
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained" disabled={isSubmitting}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
