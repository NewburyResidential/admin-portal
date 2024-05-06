import { useState } from 'react';
import { useFormStatus } from 'react-dom';

import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActionsMui from '@mui/material/DialogActions';

export default function Buttons({ handleClose, handleDelete, loadingDelete, addCategory }) {
  const { pending } = useFormStatus();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const handleOpenConfirmDialog = () => {
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleConfirmDelete = () => {
    handleDelete();
    setOpenConfirmDialog(false);
  };

  return (
    <>
      <DialogActions>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-start' }}>
          {!addCategory && (
            <LoadingButton
              sx={{ width: '120px' }}
              variant="outlined"
              color="error"
              onClick={handleOpenConfirmDialog}
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
          {addCategory ? 'Add' : 'Update'}
        </LoadingButton>
      </DialogActions>

      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ maxWidth: '460px' }}>
            Are you sure you want to delete this category? All items under this category will be deleted
          </DialogContentText>
        </DialogContent>
        <DialogActionsMui>
          <LoadingButton onClick={handleCloseConfirmDialog} color="inherit">
            Cancel
          </LoadingButton>
          <LoadingButton onClick={handleConfirmDelete} color="error" loading={loadingDelete}>
            Delete
          </LoadingButton>
        </DialogActionsMui>
      </Dialog>
    </>
  );
}
