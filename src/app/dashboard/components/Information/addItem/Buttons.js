import React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';
import { useFormStatus } from 'react-dom';
import { Box } from '@mui/material';

export default function Buttons({ handleClose, handleDelete }) {
  const { pending } = useFormStatus();

  return (
    <DialogActions>
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-start' }}>
        <LoadingButton 
          variant="outlined" 
          color="error"  // Makes the delete button visually distinctive
          onClick={handleDelete}  // Assume handleDelete is a function passed via props
          disabled={pending}>
          Delete
        </LoadingButton>
      </Box>
      <LoadingButton 
        variant="outlined" 
        color="inherit" 
        onClick={handleClose} 
        disabled={pending}>
        Cancel
      </LoadingButton>
      <LoadingButton 
        type="submit" 
        variant="contained" 
        loading={pending}>
        Update
      </LoadingButton>
    </DialogActions>
  );
}
