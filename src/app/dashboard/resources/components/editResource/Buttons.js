import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';

import { useFormStatus } from 'react-dom';
import { useResponsive } from 'src/hooks/use-responsive';

export default function Buttons({ handleClose, handleDelete, loadingDelete, addResource }) {
  const { pending } = useFormStatus();
  const isLaptop = useResponsive('up', 'lg');

  return (
    <DialogActions>
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-start' }}>
        {!addResource && (
          <LoadingButton
            sx={{ width: isLaptop ? '120px' : '75px' }}
            variant="outlined"
            color="error"
            onClick={handleDelete}
            disabled={pending}
            loading={loadingDelete}
          >
            Delete
          </LoadingButton>
        )}
      </Box>
      <LoadingButton variant="outlined" color="inherit" onClick={handleClose} disabled={pending || loadingDelete}>
        Cancel
      </LoadingButton>
      <LoadingButton type="submit" variant="contained" loading={pending} disabled={loadingDelete}>
        {addResource ? 'Add' : 'Update'}
      </LoadingButton>
    </DialogActions>
  );
}
