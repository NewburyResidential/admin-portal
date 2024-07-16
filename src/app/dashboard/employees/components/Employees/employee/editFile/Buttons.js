import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';

import { useFormStatus } from 'react-dom';

export default function Buttons({ newDocument, handleClose, handleDelete, loadingDelete }) {
  const { pending } = useFormStatus();

  return (
    <DialogActions>
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-start' }}>
        {false && (
          <LoadingButton
            sx={{ width: '120px' }}
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
        {newDocument ? 'Add' : 'Update' }
      </LoadingButton>
    </DialogActions>
  );
}
