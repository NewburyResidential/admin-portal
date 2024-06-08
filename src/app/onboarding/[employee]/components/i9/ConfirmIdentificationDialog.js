import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';

import { useForm, Controller } from 'react-hook-form';

export default function ConfirmIdentificationDialog({ open, handleClose, handleConfirm, identificationSelection }) {
  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      check1: false,
      check2: false,
      check3: false,
    },
  });

  const allChecked = watch('check1') && watch('check2') && watch('check3');

  const onSubmit = () => {
    reset();
    handleConfirm();
  };

  const handleInternalClose = () => {
    reset();
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleInternalClose}>
      <DialogTitle>Confirm Uploaded Document</DialogTitle>

      <DialogContent>
        <Typography sx={{ mb: 2, color: 'grey.600', fontWeight: 'light' }}>Please confirm the following before proceeding:</Typography>

        <Controller
          name="check1"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} />}
              label={
                <Typography>
                  I have uploaded: <strong>{identificationSelection}</strong>
                </Typography>
              }
            />
          )}
        />
        <Controller
          name="check2"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} />}
              label={<Typography>The uploaded document is clear and easy to read</Typography>}
            />
          )}
        />
        <Controller
          name="check3"
          control={control}
          render={({ field }) => (
            <FormControlLabel control={<Checkbox {...field} />} label={<Typography>The document has not expired</Typography>} />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleInternalClose} variant="outlined">
          Go Back And Fix
        </Button>
        <Button sx={{ minWidth: '110px' }} onClick={handleSubmit(onSubmit)} variant="contained" disabled={!allChecked}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
