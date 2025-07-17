import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';
import { useFormStatus } from 'react-dom';

export default function Buttons({ handleClose }) {
  const { pending } = useFormStatus();

  return (
    <DialogActions>
      <LoadingButton variant="outlined" color="inherit" onClick={handleClose} disabled={pending}>
        Cancel
      </LoadingButton>
      <LoadingButton type="submit" variant="contained" loading={pending}>
        Upload Bills
      </LoadingButton>
    </DialogActions>
  );
}
