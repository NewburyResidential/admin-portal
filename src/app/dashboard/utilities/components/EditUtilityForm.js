import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';

import { useFormContext } from 'react-hook-form';
import { useFormStatus } from 'react-dom';

export default function EditUtilityForm({ showAlert, handleClose }) {
  const { pending } = useFormStatus();

  const {
    register,
    formState: { errors },
  } = useFormContext();
  console.log(errors);
  return (
    <>
      <DialogTitle>Edit Utility Bill</DialogTitle>
      <DialogContent>
        <DialogContentText>Update the utility bill by editing the information below and clicking save</DialogContentText>

        <Grid container spacing={2} mt={2}>
          <Grid sx={{ display: 'flex' }} item xs={6} sm={6}>
            <TextField
              {...register('accountNumber')}
              label="Account Number"
              fullWidth
              variant="outlined"
              error={!!errors?.accountNumber}
              helperText={errors.accountNumber ? errors.accountNumber.message : null}
            />
          </Grid>
          <Grid sx={{ display: 'flex' }} item xs={3} sm={3}>
            <TextField
              {...register('building')}
              label="Building"
              fullWidth
              variant="outlined"
              error={!!errors?.building}
              helperText={errors.building ? errors.building.message : null}
            />
          </Grid>
          <Grid sx={{ display: 'flex' }} item xs={3} sm={3}>
            <TextField
              {...register('unit')}
              label="Unit"
              fullWidth
              variant="outlined"
              error={!!errors?.unit}
              helperText={errors.unit ? errors.unit.message : null}
            />
          </Grid>
          <Grid sx={{ display: 'flex' }} item xs={3} sm={6}>
            <TextField
              {...register('startService')}
              label="Start Service"
              fullWidth
              variant="outlined"
              error={!!errors?.startService}
              helperText={errors.startService ? errors.startService.message : null}
            />
          </Grid>
          <Grid sx={{ display: 'flex' }} item xs={3} sm={6}>
            <TextField
              {...register('endService')}
              label="End Service"
              fullWidth
              variant="outlined"
              error={!!errors?.endService}
              helperText={errors.endService ? errors.endService.message : null}
            />
          </Grid>
          <Grid sx={{ display: 'flex' }} item xs={3} sm={3}>
            <TextField
              {...register('electricAmount')}
              label="Electric"
              fullWidth
              variant="outlined"
              error={!!errors?.electricAmount}
              helperText={errors.electricAmount ? errors.electricAmount.message : null}
            />
          </Grid>
          <Grid sx={{ display: 'flex' }} item xs={3} sm={3}>
            <TextField
              {...register('gasAmount')}
              label="Gas"
              fullWidth
              variant="outlined"
              error={!!errors?.gasAmount}
              helperText={errors.gasAmount ? errors.gasAmount.message : null}
            />
          </Grid>
          <Grid sx={{ display: 'flex' }} item xs={3} sm={3}>
            <TextField
              {...register('waterAmount')}
              label="Water"
              fullWidth
              variant="outlined"
              error={!!errors?.waterAmount}
              helperText={errors.waterAmount ? errors.waterAmount.message : null}
            />
          </Grid>
          <Grid sx={{ display: 'flex' }} item xs={3} sm={3}>
            <TextField
              {...register('miscellaneousAmount')}
              label="Misc"
              fullWidth
              variant="outlined"
              error={!!errors?.miscellaneousAmount}
              helperText={errors.miscellaneousAmount ? errors.miscellaneousAmount.message : null}
            />
          </Grid>
          <Grid sx={{ display: 'flex' }} item xs={3} sm={6}>
            <TextField {...register('taxAmount')} label="Tax" fullWidth variant="outlined"
                error={!!errors?.taxAmount}
                helperText={errors.taxAmount ? errors.taxAmount.message : null}
             />
          </Grid>
          <Grid sx={{ display: 'flex' }} item xs={3} sm={6}>
            <TextField {...register('totalAmount')} label="Total" fullWidth variant="outlined"
                error={!!errors?.totalAmount}
                helperText={errors.totalAmount ? errors.totalAmount.message : null}
             />
          </Grid>
          <Grid item xs={12}>
            {showAlert && <Alert severity="error">Issue Updating Utility Bill</Alert>}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <LoadingButton variant="contained" loading={pending} type="submit">
          Update
        </LoadingButton>
      </DialogActions>
    </>
  );
}
