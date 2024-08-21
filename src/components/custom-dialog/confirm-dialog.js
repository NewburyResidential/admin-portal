import PropTypes from 'prop-types';
// @mui
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

// ----------------------------------------------------------------------

export default function ConfirmDialog({
  title = 'Confirmation',
  confirm = 'Confirm',
  cancel = 'Cancel',
  content,
  open,
  handleClose,
  handleConfirm,
  handleCancel,
  ...other
}) {
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={handleClose} {...other}>
      <DialogTitle sx={{ pb: 3 }}>{title}</DialogTitle>

      {content && <DialogContent sx={{ typography: 'body2' }}> {content} </DialogContent>}

      <DialogActions sx={{ mt: 1 }}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => {
            if (handleCancel) {
              handleCancel();
            } else {
              handleClose();
            }
          }}
        >
          {cancel}
        </Button>
        <Button variant="contained" color="inherit" onClick={handleConfirm}>
          {confirm}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmDialog.propTypes = {
  action: PropTypes.node,
  content: PropTypes.node,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
};